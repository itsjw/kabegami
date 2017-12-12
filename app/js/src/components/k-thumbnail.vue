<style scoped>
    img {
        width: 100px;
        height: 67px;
    }
</style>

<template>
    <span>
        <img :src="realThumbnail">
    </span>
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

            data: function(){
                return {
                    realThumbnail: "",
                };
            },

            mounted: function(){
                var self = this;

                // check first to see if a thumbnail is in storage
                var thumbnails = settings.get("thumbnails");
                if (!thumbnails) thumbnails = {};
                if (thumbnails[self.thumbnail]) self.realThumbnail = thumbnails[self.thumbnail];

                // if it doesn't exist, then...
                if (!self.realThumbnail){
                    var worker = new Worker("js/src/util/resizer.js");

                    worker.onmessage = function(message){
                        self.realThumbnail = message.data;
                        thumbnails[self.thumbnail] = self.realThumbnail;
                        settings.set("thumbnails", thumbnails);
                    };
                    
                    worker.postMessage(self.thumbnail);
                }
            },
        });
    })();
</script>
