<style scoped>
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
                        <li v-for="folder in folders">
                            <router-link :to="folder.path">
                                {{ folder.name }}
                            </router-link>
                        </li>
                        <li>
                            <a @click="addFolder">
                                Import folder...
                            </a>
                        </li>
                    </ul>

                    <p class="menu-label">Playlists</p>
                    <ul class="menu-list">
                        <li v-for="playlist in playlists">
                            <router-link :to="playlist.path">
                                {{ playlist.name }}
                            </router-link>
                        </li>
                        <li>
                            <a @click="addPlaylist">
                                Create playlist...
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>

            <div class="column is-9">
                <div class="container">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var settings = require("../util/settings.js");

        module.exports = Vue.component("k-container", {
            data: function(){
                return {
                    menuIsToggled: false,
                    folders: [],
                    playlists: [],
                };
            },

            methods: {
                addFolder: function(){
                    var self = this;
                    self.folders.push({
                        name: "New Folder", path: "/new-folder",
                    });

                    settings.set("folders", self.folders);
                },

                addPlaylist: function(){
                    var self = this;
                    self.playlists.push({
                        name: "New Playlist", path: "/new-playlist",
                    });

                    settings.set("playlists", self.playlists);
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
