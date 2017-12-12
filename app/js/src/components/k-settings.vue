<template>
    <div>
        <button @click="deleteAllSettings" class="button is-danger">Reset to factory defaults!</button>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var fs = window.require("fs");
        var rimraf = window.require("rimraf");

        module.exports = Vue.component("k-settings", {
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
        });
    })();
</script>
