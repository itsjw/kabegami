<style scoped>
    #thumbnail-list {
        line-height: 0;
    }
</style>

<template>
    <div id="thumbnail-list">
        <k-thumbnail
            v-for="img in images"
            :thumbnail="img.thumbnail"
            @set-as-wallpaper="setAsWallpaper(img)"
            @show-context="showContext(img)"
            :is-active="selected === img">
        </k-thumbnail>
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
        var trash = window.require("trash");

        var threadCount = 0;

        module.exports = Vue.component("k-thumbnail-list", {
            props: {
                thumbnails: {
                    type: Array,
                    required: true,
                },
            },

            data: function(){
                return {
                    images: [],
                    selected: null,
                };
            },

            watch: {
                thumbnails: {
                    deep: true,
                    handler: function(){
                        var self = this;
                        self.images = [];
                        self.loadThumbnails();
                    },
                },
            },

            methods: {
                loadThumbnails: function(){
                    var self = this;
                    var storedThumbs = settings.get("thumbnails");
                    if (!storedThumbs) storedThumbs = {};

                    self.thumbnails.forEach(function(thumbnail){
                        var path = DIR + "/thumbs/" + thumbnail.split("/").join("-");

                        if (!storedThumbs[thumbnail] || !fs.existsSync(path)){
                            var t = setInterval(function(){
                                if (threadCount > 1) return;

                                threadCount++;

                                var worker = new Worker("js/src/util/resizer.js");

                                worker.onmessage = function(message){
                                    self.images.push({
                                        fullsize: thumbnail,
                                        thumbnail: message.data,
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
                            self.images.push({
                                fullsize: thumbnail,
                                thumbnail: storedThumbs[thumbnail],
                            });
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
                        command = command.replace("$wallpaper", img.fullsize);
                        exec(command);
                    }
                },

                showContext: function(img){
                    var self = this;

                    menu = new Menu();

                    menu.append(new MenuItem({
                        label: "Remove",
                        click: function(){
                            // remove full-size image
                            trash([img.fullsize, img.thumbnail]).then(function(){
                                // remove from list of images
                                self.images.splice(self.images.indexOf(img), 1);

                                // remove from database
                                var thumbs = settings.get("thumbnails");
                                delete thumbs[img.fullsize];
                                settings.set("thumbnails", thumbs);
                            });
                        },
                    }));

                    menu.popup(remote.getCurrentWindow());
                },
            },

            mounted: function(){
                var self = this;
                self.loadThumbnails();
            },
        });
    })();
</script>
