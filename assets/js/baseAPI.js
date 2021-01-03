//每次调用$.get（）或$.post（）或$.ajax（）请求之前都会调用ajaxPrefilter这个函数，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    options.url='http://ajax.frontend.itheima.net'+options.url
})