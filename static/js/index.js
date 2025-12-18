$(document).ready(function() {
    // 核心配置
    var options = {
        slidesToScroll: 1, // 每次滚动1张
        slidesToShow: 1,   // 每次只显示1张 (对应你要求的"同时只显示1个")
        loop: true,        // 无限循环
        infinite: true,
        autoplay: false,   // 关闭自动播放，由用户点击切换
        autoplaySpeed: 3000,
        pagination: false, // 不显示下方小圆点，保持界面整洁
    }

    // 初始化所有带有 .carousel 类的元素
    // 这样我们就可以在 HTML 里写多个 carousel 容器，JS 会自动全部激活
    var carousels = bulmaCarousel.attach('.carousel', options);

    // 这一步是为了解决某些情况下视频加载后布局错位的问题
    for(var i = 0; i < carousels.length; i++) {
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // 兼容部分旧版模板代码
    var element = document.querySelector('#results-carousel');
    if (element && element.bulmaCarousel) {
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }
})