<style scoped>
    #thumbnail-list {
        line-height: 0;
    }
</style>

<template>
    <div id="thumbnail-list">
        <k-thumbnail v-for="thumbnail in thumbnails" :thumbnail="thumbnail"></k-thumbnail>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var KThumbnail = require("./k-thumbnail.vue");

        module.exports = Vue.component("k-thumbnail-list", {
            props: {
                thumbnails: {
                    type: Array,
                    required: true,
                },
            },
        });
    })();
</script>
