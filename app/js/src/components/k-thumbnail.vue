<template>
    <div>
        {{ thumbnail }}
    </div>
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
