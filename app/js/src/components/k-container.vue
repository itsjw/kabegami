<style scoped>
    #menu-column {
        background-color: rgb(235, 235, 235);
        padding: 2rem;
        min-height: 100%;
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
                    </ul>

                    <p class="menu-label">Playlists</p>
                    <ul class="menu-list">
                        <li v-for="playlist in playlists">
                            <router-link :to="playlist.path">
                                {{ playlist.name }}
                            </router-link>
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

        module.exports = Vue.component("k-container", {
            data: function(){
                return {
                    menuIsToggled: false,

                    folders: [
                        {name: "Folder A", path: "/a"},
                        {name: "Folder B", path: "/b"},
                        {name: "Folder C", path: "/c"},
                    ],

                    playlists: [
                        {name: "Playlist 1", path: "/1"},
                        {name: "Playlist 2", path: "/2"},
                        {name: "Playlist 3", path: "/3"},
                        {name: "Playlist 4", path: "/4"},
                    ],
                };
            },
        });
    })();
</script>
