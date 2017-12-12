<style scoped>
    #thumbnail-list {
        line-height: 0;
    }
</style>

<template>
    <div id="thumbnail-list">
        <k-thumbnail v-for="thumbnail in realThumbs" :thumbnail="thumbnail"></k-thumbnail>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var KThumbnail = require("./k-thumbnail.vue");
        var settings = require("../util/settings.js");
        var fs = window.require("fs");
        var threadCount = 0;

        module.exports = Vue.component("k-thumbnail-list", {
            props: {
                thumbnails: {
                    type: Array,
                    required: true,
                },
            },

            data: function(){
                return {
                    realThumbs: [],
                };
            },

            mounted: function(){
                var self = this;
                var storedThumbs = settings.get("thumbnails");
                if (!storedThumbs) storedThumbs = {};

                self.thumbnails.forEach(function(thumbnail){
                    var path = DIR + "/thumbs/" + thumbnail.split("/").join("-");

                    if (!storedThumbs[thumbnail] || !fs.existsSync(path)){
                        var t = setInterval(function(){
                            if (threadCount > 1) return;

                            threadCount++;

                            var worker = new Worker("js/src/util/resizer.js");

                            worker.onmessage = function(message){
                                self.realThumbs.push(message.data);
                                storedThumbs[thumbnail] = message.data;
                                settings.set("thumbnails", storedThumbs);
                                threadCount--;
                                worker.terminate();
                            };

                            worker.postMessage(thumbnail);

                            clearInterval(t);
                        }, 100);
                    } else {
                        self.realThumbs.push(storedThumbs[thumbnail]);
                    }
                });
            },
        });
    })();
</script>
