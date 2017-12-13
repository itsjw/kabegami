<style scoped>
    #thumbnail-list {
        line-height: 0;
    }
</style>

<template>
    <div id="thumbnail-list">
        <k-thumbnail
            v-for="img in images"
            :thumbnail="img.thumbnail"
            @set-as-wallpaper="setAsWallpaper(img.fullsize)">
        </k-thumbnail>
    </div>
</template>

<script>
    (function(){
        var Vue = require("vue/dist/vue");
        var KThumbnail = require("./k-thumbnail.vue");
        var settings = require("../util/settings.js");
        var fs = window.require("fs");
        var exec = window.require("child_process").exec;

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
                    images: [],
                };
            },

            methods: {
                setAsWallpaper: function(fullsize){
                    var self = this;

                    var command = settings.get("command");

                    if (!command){
                        alert("You haven't yet set the 'set wallpaper' command in the settings. Please do that first.");
                        self.$router.push("/settings");
                    } else {
                        command = command.replace("$wallpaper", fullsize);
                        exec(command);
                    }
                },
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
                                self.images.push({
                                    fullsize: thumbnail,
                                    thumbnail: message.data,
                                });
                                storedThumbs[thumbnail] = message.data;
                                settings.set("thumbnails", storedThumbs);
                                threadCount--;
                                worker.terminate();
                            };

                            worker.postMessage(thumbnail);

                            clearInterval(t);
                        }, 100);
                    } else {
                        self.images.push({
                            fullsize: thumbnail,
                            thumbnail: storedThumbs[thumbnail],
                        });
                    }
                });
            },
        });
    })();
</script>
