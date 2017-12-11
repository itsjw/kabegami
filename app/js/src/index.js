(function(){
	var Vue = require("vue/dist/vue");
	var VueRouter = require("vue-router");
	Vue.use(VueRouter);

	window.onload = function(){
		var app = new Vue({
			el: "#app",
		});
	};
})();
