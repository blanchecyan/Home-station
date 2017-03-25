//定义工具对象
var Util = {
	// 根据id获取模板
	tpl:function (id){
		return document.getElementById(id).innerHTML;
	},
	// 定义拉去数据的异步请求方法
	ajax: function (url, fn) {
		// 异步请求拉去数据
		// 创建xhr对象
		var xhr = new XMLHttpRequest();
		// 监听状态的改变
		xhr.onreadystatechange = function () {
			// 监听readyState改变
			if (xhr.readyState === 4) {
				// 监听状态吗
				if (xhr.status === 200) {
					// 查看结果
					// 转化json对象
					var res = JSON.parse(xhr.responseText);
					// 判断回调函数存在，并执行
					fn && fn(res)
					// console.log(res)
				}
			}
		}
		// 发送请求,打开请求,发送数据
		xhr.open('GET', url, true);
		xhr.send(null)
	}	
}


var Home = Vue.extend({
	template: Util.tpl('tpl_home'),
	data: function () {
		return{
			list:{
				"pic":[
					{id:1,url:'01.png'},
					{id:2,url:'02.png'},
					{id:3,url:'03.png'},
					{id:4,url:'04.png'},
					{id:5,url:'01.png'},
				],
				"tih":[
					{"tinav":"Get Inspired and Design!"},
					{"hdui":"Hot solutions by top brands inspire you to "},
					{"juh":"design, build and furnish!"},
					{"navh":"Recommend"},
				],
				"homfot":[
					{"tpl":"FOLLOW US"},	
					{"hus":"Current user location CHINA. Change location "}
				],
				"hopic":[
					{"img":"atpic1.png"}
				]
			},

			ad: [],
			items: [],
			
		}
	},
	methods:{
				// 定义轮播图事件
			ainimationPic:function(){
				var nowLeft = 0;
				// 定义id
				var imgId = 0;
				// 获取设备宽度
				var deviceW = $(window).width();
				// 获取ul的left值
				var left = parseInt($('.type').css('left'));
				window.timer = setInterval(function(){
					imgId++;
					if(imgId>=5){
						imgId = 1;
						$('.type').css('left',0);
					}
					nowLeft = deviceW *imgId;
					$('.type').animate({left:-nowLeft},500);
				},2000)
			}
		
	},
	// 定义声明周期
	created: function () {
		// 缓存this
		var me = this;
		// 通知父组件显示搜索框
		me.$dispatch('dealSearch', true)
		// 发送请求，获取数据，更新绑定的数据
		Util.ajax('data/home.json', function (res) {
			// 给组件实例化对象保存数据
			// console.log(res, window)
			if (res && res.errno === 0) {
				me.ad = res.data.ad;
				me.items = res.data.list;
				// $set方法设置的是新的数据
				// me.$set('ad', res.data.ad)
				// me.$set('items', res.data.list)
				// console.log(me)
			}
				me.ainimationPic();
		})
	}

})
	//定义轮播图事件
// 	lbt:function(){
// 		var nowLeft = 0;
// 		// 定义id
// 		var imgId = 0;
// 		// 获取设备宽度
// 		var deviceW = $(window).width();
// 		// 获取ul的left值
// 		var left = parseInt($('.nav').css('left'));
// 		window.timer = setInterval(function(){
// 			imgId++;
// 			if(imgId>=8){
// 				imgId = 1;
// 				$('.nav').css('left',0);
// 			}
// 			nowLeft = deviceW *imgId;
// 			$('.nav').animate({left:-nowLeft},500);
// 		},2000)
// 	}

// })




// 列表页组件
var List = Vue.extend({
	// 注册属性数据
	props: ['search'],
	template: Util.tpl('tpl_list'),
	// 定义数据
	data: function () {
		return {
				listnav:[
					{value:1,title:"Dickson:the outdoor rug ",title2:"GANDIABLASCO presents its first collection ",title3:"of outdoor carpets",img:'listh.png'},
				],
				type: [
					{value:1,url:'07.png'},
					{value:1,url:'02.png'},
					{value:1,url:'03.png'},
					{value:1,url:'05.png'},
					{value:1,url:'08.png'},
					{value:1,url:'01.png'},
					{value:1,url:'04.png'},
					{value:1,url:'09.png'},
					{value:1,url:'06.png'},
					{value:1,url:'10.png'},
				],
				img:[
					{value:1,img:'08.png'}
				],
				ing:[
					{value:1,img:'03.png'}
				],
			list: [],
			// 缓存的数据
			other: []
		}
	},
	// 创建完整之后发送请求获取数据，渲染页面
	created: function () {

		var me = this;
		// 获取query数据
		var query = this.$parent.query 
		// 在地址的query中拼凑出传递给后端的数据
		var url = 'data/list.json';
		// 有query，要将query拼接出来
		if (query[0] !== undefined && query[1] !== undefined) {
			url += '?' + query[0] + '=' + query[1]
		}
		// 发送请求
		Util.ajax(url, function (res) {
			if (res && res.errno === 0) {
				// 将数据存储在组件实例化对象中
				// console.log(res.data)
				me.list = res.data;
				// me.list = res.data.slice(0, 3);

			}
		})
	}
})


var Product = Vue.extend({
	template: Util.tpl('tpl_product'),
	data: function () {
		// 返回数据是绑定的数据
		return {
			data: {
				src: '01.png',
			}
		}
	},
	created: function () {
		// 缓存this
		var me = this;
		// 通知父组件显示搜索框
		me.$dispatch('dealSearch', true)
		var query = this.$parent.query;
		// 发送请求，获取数据，更新绑定的数据
		Util.ajax('data/product.json?id=' + query[0], function (res) {
			if (res && res.errno === 0) {
				// 存储数据
				me.data = res.data;
			}
		})
	}	
})


//注册组件
Vue.component('home',Home);
Vue.component('list',List);
Vue.component('product',Product);

// 实例化vue实例化对象
var app = new Vue({
	el: '#app',
	data: {
		// 定义视图变量
		// view: 'home'
		// view: 'list'
		// view: 'product',
		view: '',
		// 定义路由参数变量
		query: [],
	},

})


// 定义路由
function route () {
	// 定义路由就是解析hash，分析他们
	// 获取hash
	var hash = location.hash;
	// 处理hash, 删除 #或者#/
	hash = hash.replace(/^#(\/)?/g, '');
	// 切割hash list/type/1  => ['list', 'type', '1']
	hash = hash.split('/');
	// 要知道哪些hash[0]可以直接使用，哪些hash[0]要设置默认值
	// 定义可以直接使用的
	var map = {
		home: true,
		list: true,
		product: true
	};
	// 将解析的结果赋值app的vue实例化对象的view属性
	// 在map对象中的hash[0]是可以直接使用的
	if (map[hash[0]]) {
		app.view = hash[0];
	} else {
		// 默认路由
		app.view = 'home';
	}
	// 保存路由参数 ['type', '1']
	app.query = hash.slice(1);
}
// 订阅事件,获取新的路由，切换组件
window.addEventListener('hashchange', route)
// 页面加载完成之后第一次执行路由方法
window.addEventListener('load', route)
