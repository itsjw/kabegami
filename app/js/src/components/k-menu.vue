<style scoped>
    .is-drop-target {
        background-color: #209cee;
    }

    .is-drop-target a {
        color: white;
    }
</style>

<template>
    <aside class="menu">
        <p class="menu-label">General</p>
        <ul class="menu-list">
            <li><router-link to="/settings">Settings</router-link></li>
        </ul>

        <p class="menu-label">Search</p>
        <ul class="menu-list">
            <li>
                <div class="field">
                    <div class="control">
                        <input class="input" type="text" placeholder="Search tags..." v-model="search">
                    </div>
                </div>
            </li>
        </ul>

        <p class="menu-label">Folders</p>
        <ul class="menu-list">
            <li v-for="folder in folders" @click="$emit('view-folder', folder)" @click.right="showContextForFolder(folder)">
                <a>
                    {{ folder.name }}
                </a>
            </li>
            <li>
                <a @click="$emit('add-folder')">
                    Import folder...
                </a>
            </li>
        </ul>

        <p class="menu-label">Playlists</p>
        <ul class="menu-list">
            <li v-for="playlist in playlists"
                @click="$emit('view-playlist', playlist)"
                @click.right="showContextForPlaylist(playlist)"
                @dragenter.prevent="dragEnter(playlist)"
                @dragover.prevent="dragOver(playlist)"
                @dragleave.prevent="dragLeave(playlist)"
                @drop.prevent="drop(playlist)"
                :class="{'is-drop-target': dropTarget===playlist}">
                <a :contenteditable="playlistToRename === playlist"
                    @keydown.enter="finishRenaming"
                    @blur="finishRenaming"
                    :ref="'playlist-' + playlist.index">
                    {{ playlist.name }}
                </a>
            </li>
            <li>
                <a @click="createPlaylist">
                    Create playlist...
                </a>
            </li>
        </ul>
    </aside>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var remote = window.require("electron").remote;
        var Menu = remote.Menu;
        var MenuItem = remote.MenuItem;
        var menu;
        var renaming = false;

        module.exports = Vue.component("k-menu", {
            props: {
                folders: {
                    type: Array,
                    required: true,
                },

                playlists: {
                    type: Array,
                    required: true,
                },
            },

            data: function(){
                return {
                    search: "",
                    dropTarget: null,
                    playlistToRename: null,
                };
            },

            watch: {
                playlists: function(){
                    var self = this;

                    if (!renaming) return;

                    setTimeout(function(){
                        renaming = false;
                        self.startRenaming(self.playlists[self.playlists.length-1]);
                    }, 0);
                },

                search: function(val){
                    var self = this;
                    self.$emit("search", val);
                },
            },

            methods: {
                showContextForFolder: function(folder){
                    var self = this;

                    menu = new Menu();

                    menu.append(new MenuItem({
                        label: "Remove",
                        click: function(){
                            self.$emit("remove-folder", folder);
                        },
                    }));

                    menu.popup(remote.getCurrentWindow());
                },

                showContextForPlaylist: function(playlist){
                    var self = this;

                    menu = new Menu();

                    menu.append(new MenuItem({
                        label: "Rename",
                        click: function(){
                            self.startRenaming(playlist);
                        },
                    }));

                    menu.append(new MenuItem({
                        label: "Delete",
                        click: function(){
                            var wasConfirmed = confirm("Are you sure that you want to delete this playlist?");
                            if (!wasConfirmed) return;
                            self.$emit("remove-playlist", playlist);
                        },
                    }));

                    menu.popup(remote.getCurrentWindow());
                },

                dragEnter: function(playlist){
                    var self = this;
                    self.dropTarget = playlist;
                },

                dragOver: function(playlist){

                },

                dragLeave: function(playlist){
                    var self = this;
                    if (self.dropTarget === playlist) self.dropTarget = null;
                },

                drop: function(playlist){
                    var self = this;
                    self.$emit('add-dragged-image-to-playlist', playlist);
                    self.dropTarget = null;
                },

                createPlaylist: function(){
                    var self = this;
                    renaming = true;
                    self.$emit('add-playlist');
                },

                startRenaming: function(playlist){
                    var self = this;

                    self.playlistToRename = playlist;
                    var element = self.$refs["playlist-" + playlist.index][0];
                    var range = document.createRange();
                    range.selectNodeContents(element);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);

                    setTimeout(function(){
                        element.focus();
                    }, 0);
                },

                finishRenaming: function(event){
                    var self = this;

                    // if there's no playlist to rename
                    // (because the event fired more than once)
                    // then return
                    if (!self.playlistToRename) return;

                    // change name
                    self.playlistToRename.name = event.target.innerText;

                    // emit an alert to the parent component
                    // so that changes can be written to disk
                    self.$emit("rename-playlist");

                    // reset playlistToRename variable
                    self.playlistToRename = null;

                    // prevent the enter key from adding extra stuff
                    event.preventDefault();
                },
            },
        });
    })();
</script>
