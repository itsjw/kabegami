<style scoped>
    #menu-column {
        padding: 2rem;
    }

    #router-view {
        padding: 2rem;
    }
</style>

<template>
    <div>
        <div class="columns is-mobile">
            <div class="column is-narrow" id="menu-column">
                <k-menu
                    :folders="folders"
                    :playlists="playlists"
                    @add-folder="addFolder"
                    @view-folder="viewFolder"
                    @remove-folder="removeFolder"
                    @add-playlist="addPlaylist"
                    @view-playlist="viewPlaylist"
                    @remove-playlist="removePlaylist"
                    @search="search">
                </k-menu>
            </div>

            <div class="column is-9" id="router-view">
                <div class="container">
                    <router-view :images="images"></router-view>
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
        var fs = window.require("fs");
        var extensions = ["jpg", "jpeg", "png", "bmp"];

        module.exports = Vue.component("k-container", {
            data: function(){
                return {
                    folders: [],
                    playlists: [],
                    images: [],
                };
            },

            methods: {
                addFolder: function(){
                    var self = this;

                    // open dialog to get path
                    var results = remote.dialog.showOpenDialog({properties: ["openDirectory"]});

                    // if nothing was selected, then return
                    if (!results) return;

                    // make folder object
                    var path = results[0];
                    var parts = path.split("/");
                    var name = parts[parts.length-1];

                    var folder = {
                        name,
                        path,
                    };

                    // add to list of folders
                    self.folders.push(folder);

                    // store to disk
                    settings.set("folders", self.folders);

                    // view thumbnails
                    self.viewFolder(folder);
                },

                viewFolder: function(folder){
                    var self = this;

                    // clear images list
                    self.images = [];

                    // get the list of files in the directory
                    fs.readdir(folder.path, function(error, files){
                        if (error) console.error(error);

                        // only add images (especially with particular extensions)
                        files.forEach(function(file){
                            var parts = file.split(".");
                            var ext = parts[parts.length-1];

                            if (extensions.indexOf(ext.toLowerCase()) > -1){
                                var path = folder.path + "/" + file;
                                self.images.push(path);
                            }
                        });

                        // go to list page
                        self.$router.push("/list");
                    });
                },

                removeFolder: function(folder){
                    var self = this;

                    // remove from folders list
                    self.folders.splice(self.folders.indexOf(folder), 1);

                    // store to disk
                    settings.set("folders", self.folders);
                },

                addPlaylist: function(){

                },

                viewPlaylist: function(playlist){

                },

                removePlaylist: function(playlist){

                },

                search: function(val){
                    var self = this;
                    self.images = [];

                    if (val.length === 0) return;

                    var tags = settings.get("tags") || {};

                    Object.keys(tags).forEach(function(fullsize){
                        if ((tags[fullsize] && tags[fullsize].includes(val.toLowerCase())) || fullsize.toLowerCase().includes(val.toLowerCase())){
                            self.images.push(fullsize);
                        }
                    });

                    self.$router.push("/list");
                },
            },

            mounted: function(){
                var self = this;
                self.folders = settings.get("folders") || [];
                self.playlists = settings.get("playlists") || [];
            },
        });
    })();
</script>
