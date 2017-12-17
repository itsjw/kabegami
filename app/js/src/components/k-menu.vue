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
                <a>
                    {{ playlist.name }}
                </a>
            </li>
            <li>
                <a @click="$emit('add-playlist')">
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
                };
            },

            watch: {
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
            },
        });
    })();
</script>
