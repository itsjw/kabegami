<style scoped>
    .current-folder, .current-folder:hover {
        color: red !important;
    }

    #menu-column {
        padding: 2rem;
    }
</style>

<template>
    <div>
        <div class="columns is-mobile">
            <div class="column is-narrow" id="menu-column">
                <aside class="menu">
                    <p class="menu-label">General</p>
                    <ul class="menu-list">
                        <li><router-link to="/settings">Settings</router-link></li>
                    </ul>

                    <p class="menu-label">Folders</p>
                    <ul class="menu-list">
                        <li v-for="folder in folders" @click="setCurrentFolder(folder)">
                            <router-link :to="folder.path" :class="{'current-folder': folder === currentFolder}">
                                {{ folder.name }}
                            </router-link>
                        </li>
                        <li>
                            <a @click="addFolder">
                                Import folder...
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>

            <div class="column is-9">
                <div class="container">
                    <router-view :thumbnails="thumbnails"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var settings = require("../util/settings.js");
        var remote = window.require("electron").remote;
        var KThumbnailList = require("./k-thumbnail-list.vue");

        module.exports = Vue.component("k-container", {
            data: function(){
                return {
                    menuIsToggled: false,
                    folders: [],
                    currentFolder: null,
                    thumbnails: [],
                };
            },

            methods: {
                addFolder: function(){
                    var self = this;
                    var results = remote.dialog.showOpenDialog({properties: ["openDirectory"]});
                    if (!results) return;
                    var path = results[0];
                    var parts = path.split("/");
                    var name = parts[parts.length-1];
                    self.folders.push({name, path});
                    settings.set("folders", self.folders);
                },

                setCurrentFolder: function(folder){
                    var self = this;
                    self.currentFolder = folder;
                    self.loadThumbnails();
                },

                loadThumbnails: function(){
                    self.thumbnails = [];
                },
            },

            mounted: function(){
                var self = this;
                self.folders = settings.get("folders") || [];
                self.currentFolder = settings.get("current-folder") || null;
                if (self.currentFolder) self.loadThumbnails();
            },
        });
    })();
</script>
