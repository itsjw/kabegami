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
                <a :class="{'current-folder': folder === currentFolder}">
                    {{ folder.name }}
                </a>
            </li>
            <li>
                <a @click="$emit('add-folder')">
                    Import folder...
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
            },
        });
    })();
</script>
