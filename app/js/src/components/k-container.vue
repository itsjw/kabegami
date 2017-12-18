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
                    @rename-playlist="renamePlaylist"
                    @add-dragged-image-to-playlist="addDraggedImageToPlaylist"
                    @search="search">
                </k-menu>
            </div>

            <div class="column is-9" id="router-view">
                <div class="container">
                    <router-view
                        :list-type="listType"
                        :images="images"
                        @image-drag="setDraggedImage"
                        @remove-image-from-playlist="removeImageFromPlaylist">
                    </router-view>
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
                    draggedImage: null,
                    listType: "folder",
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

                    // set list type (which helps for context menus)
                    self.listType = "folder";
                },

                removeFolder: function(folder){
                    var self = this;

                    // remove from folders list
                    self.folders.splice(self.folders.indexOf(folder), 1);

                    // store to disk
                    settings.set("folders", self.folders);
                },

                addPlaylist: function(){
                    var self = this;

                    // make playlist object
                    var playlist = {
                        name: "New Playlist",
                        images: [],
                        index: self.playlists.length,
                    };

                    // append to playlists list
                    self.playlists.push(playlist);

                    // store to disk
                    settings.set("playlists", self.playlists);

                    // view playlist
                    self.viewPlaylist(playlist);
                },

                viewPlaylist: function(playlist){
                    var self = this;
                    self.images = playlist.images;
                    self.$router.push("/list");

                    // set list type (which helps for context menus)
                    self.listType = "playlist";
                },

                removePlaylist: function(playlist){
                    var self = this;

                    // remove from list
                    self.playlists.splice(self.playlists.indexOf(playlist), 1);

                    // store to disk
                    settings.set("playlists", self.playlists);
                },

                renamePlaylist: function(data){
                    var self = this;

                    // store to disk
                    settings.set("playlists", self.playlists);
                },

                setDraggedImage: function(fullsize){
                    var self = this;
                    self.draggedImage = fullsize;
                },

                addDraggedImageToPlaylist: function(playlist){
                    var self = this;

                    // append to playlist
                    playlist.images.push(self.draggedImage);

                    // store to disk
                    settings.set("playlists", self.playlists);
                },

                removeImageFromPlaylist: function(){
                    var self = this;

                    // image should already have been removed from list
                    // in the child (k-thumbnail-list) component;
                    // now, simply store to disk
                    settings.set("playlists", self.playlists);
                },

                search: function(val){
                    var self = this;

                    // clear images list
                    self.images = [];

                    // if the value is empty, return
                    if (val.length === 0) return;

                    // get tags and thumbnails out of storage
                    var tags = settings.get("tags") || {};
                    var thumbnails = settings.get("thumbnails") || {};

                    // check to see if the search value matches any
                    // of the stored tags or file names
                    Object.keys(thumbnails).forEach(function(fullsize){
                        if ((tags[fullsize] && tags[fullsize].includes(val.toLowerCase())) || fullsize.toLowerCase().includes(val.toLowerCase())){
                            // if it does, push it to the images list
                            self.images.push(fullsize);
                        }
                    });

                    // view the list of images
                    self.$router.push("/list");
                },
            },

            mounted: function(){
                var self = this;

                // get the folders and playlists out of storage
                self.folders = settings.get("folders") || [];
                self.playlists = settings.get("playlists") || [];
            },
        });
    })();
</script>
