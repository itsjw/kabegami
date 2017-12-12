<style scoped>
    img {
        width: 100px;
        height: 67px;
    }
</style>

<template>
    <span>
        <img :src="thumbnail">
    </span>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");

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
