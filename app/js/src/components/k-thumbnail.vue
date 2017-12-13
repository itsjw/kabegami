<style scoped>
    img {
        width: 100px;
        height: 67px;
    }
</style>

<template>
    <img :src="thumbnail" @click="$emit('set-as-wallpaper')">
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var settings = require("../util/settings.js");

        module.exports = Vue.component("k-thumbnail", {
            props: {
                thumbnail: {
                    type: String, // path to thumbnail
                    required: true,
                },
            },
        });
    })();
</script>
