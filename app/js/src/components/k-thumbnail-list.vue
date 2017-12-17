<style scoped>
    #thumbnail-list {
        line-height: 0;
    }

    .label {
        margin-bottom: 1rem;
    }
</style>

<template>
    <div id="thumbnail-list">
        <k-thumbnail
            v-for="img in images_"
            :thumbnail="img.thumbnail"
            @set-as-wallpaper="setAsWallpaper(img)"
            @show-context="showContext(img)"
            :is-active="selected === img">
        </k-thumbnail>

        <div class="modal" :class="{'is-active': isShowingEditModal}" v-if="oneToBeEdited">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Image Properties</p>
                    <button class="delete" aria-label="close" @click="isShowingEditModal = false"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Tags</label>
                        <div class="control">
                            <textarea class="textarea" placeholder="" v-model="oneToBeEdited.tags"></textarea>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="saveEdits()">Save</button>
                    <button class="button" @click="isShowingEditModal = false">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var KThumbnail = require("./k-thumbnail.vue");
        var settings = require("../util/settings.js");
        var fs = window.require("fs");
        var exec = window.require("child_process").exec;
        var remote = window.require("electron").remote;
        var Menu = remote.Menu;
        var MenuItem = remote.MenuItem;
        var menu;
        var trash = window.require("trash");

        var threadCount = 0;
        var escapeKeyListener;

        module.exports = Vue.component("k-thumbnail-list", {
            props: {
                images: {
                    type: Array,
                    required: true,
                },
            },

            data: function(){
                return {
                    images_: [],
                    selected: null,
                    oneToBeEdited: null,
                    isShowingEditModal: false,
                };
            },

            watch: {
                images: {
                    deep: true,
                    handler: function(){
                        var self = this;
                        self.images_ = [];
                        self.loadimages();
                    },
                },
            },

            methods: {
                loadimages: function(){
                    var self = this;
                    var storedThumbs = settings.get("thumbnails");
                    if (!storedThumbs) storedThumbs = {};

                    var current = settings.get("current-wallpaper");
                    var tags = settings.get("tags") || {};

                    self.images.forEach(function(thumbnail){
                        var path = DIR + "/thumbs/" + thumbnail.split("/").join("-");

                        if (!storedThumbs[thumbnail] || !fs.existsSync(path)){
                            var t = setInterval(function(){
                                if (threadCount > 1) return;

                                threadCount++;

                                var worker = new Worker("js/src/util/resizer.js");

                                worker.onmessage = function(message){
                                    self.images_.push({
                                        fullsize: thumbnail,
                                        thumbnail: message.data,
                                        tags: "",
                                    });
                                    storedThumbs[thumbnail] = message.data;
                                    settings.set("thumbnails", storedThumbs);
                                    threadCount--;
                                    worker.terminate();
                                };

                                worker.postMessage(thumbnail);
                                clearInterval(t);
                            }, 100);
                        } else {
                            self.images_.push({
                                fullsize: thumbnail,
                                thumbnail: storedThumbs[thumbnail],
                                tags: tags[thumbnail] ? tags[thumbnail] : "",
                            });
                        }

                        if (current && current.fullsize === thumbnail){
                            self.selected = self.images_[self.images_.length-1];
                        }
                    });
                },

                setAsWallpaper: function(img){
                    var self = this;
                    self.selected = img;

                    var command = settings.get("command");

                    if (!command){
                        alert("You haven't yet set the 'set wallpaper' command in the settings. Please do that first.");
                        self.$router.push("/settings");
                    } else {
                        command = command.replace("$wallpaper", '"' + img.fullsize + '"');
                        exec(command);
                        settings.set("current-wallpaper", img);
                    }
                },

                showContext: function(img){
                    var self = this;

                    menu = new Menu();

                    // edit menu item
                    menu.append(new MenuItem({
                        label: "Edit...",
                        click: function(){
                            self.oneToBeEdited = img;
                            self.isShowingEditModal = true;
                        },
                    }));

                    // move to trash menu item
                    menu.append(new MenuItem({
                        label: "Move to trash...",
                        click: function(){
                            var wasConfirmed = confirm("Are you sure that you want to move this file to the trash?");

                            if (!wasConfirmed) return;

                            // remove full-size image
                            trash([img.fullsize, img.thumbnail]).then(function(){
                                // remove from list of images_
                                self.images_.splice(self.images_.indexOf(img), 1);

                                // remove from database
                                var thumbs = settings.get("images");
                                delete thumbs[img.fullsize];
                                settings.set("thumbnails", thumbs);
                            });
                        },
                    }));

                    menu.popup(remote.getCurrentWindow());
                },

                saveEdits: function(){
                    var self = this;
                    self.isShowingEditModal = false;
                    var tags = settings.get("tags") || {};
                    tags[self.oneToBeEdited.fullsize] = self.oneToBeEdited.tags;
                    settings.set("tags", tags);
                },
            },

            mounted: function(){
                var self = this;
                self.loadimages();

                escapeKeyListener = window.addEventListener("keydown", function(e){
                    if (e.key === "Escape") self.isShowingEditModal = false;
                });
            },

            beforeDestroy: function(){
                window.removeEventListener("keydown", escapeKeyListener);
            },
        });
    })();
</script>
