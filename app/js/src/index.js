(function(){
	var Vue = require("vue/dist/vue");
	var VueRouter = require("vue-router");
	Vue.use(VueRouter);
	var settings = require("./util/settings.js");

	var KContainer = require("./components/k-container.vue");
	var KSettings = require("./components/k-settings.vue");
	var KThumbnailList = require("./components/k-thumbnail-list.vue");

	var routes = [
		{path: "/list/:thumbnails", component: KThumbnailList, props: true},
		{path: "/settings", component: KSettings},
	];
	var router = new VueRouter({routes});

	window.onload = function(){
		var app = new Vue({
			el: "#app",
			router,
		});
	};
})();
