<style scoped>
    #command-input {
        font-family: monospace;
    }

    .control {
        margin-bottom: 0.5rem;
    }

    p {
        margin-bottom: 1.5rem;
    }

    pre {
        margin-bottom: 1.5rem;
    }

    button.is-red {
        background-color: rgb(255, 50, 7);
        color: white;
    }

    code {
        color: red;
    }
</style>

<template>
    <div>
        <div class="field">
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input id="command-input" class="input" type="text" v-model="command" placeholder="Command to set wallpaper...">
                    </p>
                </div>
            </div>
        </div>

        <p><i>HINT: Use <code>$wallpaper</code> as the variable for the path. For example:</i></p>

        <pre>set-wallpaper $wallpaper</pre>

        <button @click="deleteAllSettings" class="button is-red">Reset to factory defaults!</button>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var fs = window.require("fs");
        var rimraf = window.require("rimraf");
        var settings = require("../util/settings.js");

        module.exports = Vue.component("k-settings", {
            data: function(){
                return {
                    command: "", // xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitor0/workspace0/last-image -s $wallpaper
                };
            },

            watch: {
                command: function(val){
                    settings.set("command", val);
                },
            },

            methods: {
                deleteAllSettings: function(){
                    if (fs.existsSync(DIR)){
                        rimraf(DIR, function(error){
                            if (error) console.error(error);
                            localStorage.clear();
                            window.location.reload();
                        });
                    } else {
                        localStorage.clear();
                        window.location.reload();
                    }
                },
            },

            mounted: function(){
                var self = this;
                self.command = settings.get("command") || "";
            },
        });
    })();
</script>
