(function(){
	var Vue = require("vue/dist/vue");
	var VueRouter = require("vue-router");
	Vue.use(VueRouter);

	var routes = [];
	var router = new VueRouter({routes});

	window.onload = function(){
		var app = new Vue({
			el: "#app",
			router,
		});
	};
})();
