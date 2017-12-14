<style scoped>
    img {
        border: 4px solid white;
        width: 100px;
        height: 67px;
        opacity: 0.5;
        cursor: pointer;
        border-radius: 0.5rem;
    }

    img:hover {
        opacity: 0.75;
    }

    img.is-active, img.is-active:hover {
        border: 4px solid #ff3860;
        opacity: 1.0;
    }
</style>

<template>
    <img :src="thumbnail" @click="$emit('set-as-wallpaper')" :class="{'is-active': isActive}" @click.right="$emit('show-context')">
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

                isActive: false,
            },
        });
    })();
</script>
