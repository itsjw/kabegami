<style scoped>
    img {
        padding: 4px;
        width: 100px;
        height: 67px;
        /*opacity: 0.5;*/
        cursor: pointer;
        /*border-radius: 0.5rem;*/
        /*filter: contrast(50%);*/
    }

    img:hover {
        /*opacity: 0.75;*/
        /*filter: contrast(100%);*/
    }

    img.is-active, img.is-active:hover {
        border: 2px solid rgb(255, 50, 7);
        padding: 2px;
        /*opacity: 1.0;*/
        /*filter: contrast(100%);*/
    }
</style>

<template>
    <img :src="thumbnail"
        @click="$emit('set-as-wallpaper')"
        :class="{'is-active': isActive}"
        @click.right="$emit('show-context')"
        @dragstart="$emit('is-being-dragged')">
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var settings = require("../util/settings.js");

        module.exports = Vue.component("k-thumbnail", {
            props: {
                thumbnail: {
                    type: String,
                    required: true,
                },

                isActive: false,
            },
        });
    })();
</script>
