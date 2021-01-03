//每次调用$.get（）或$.post（）或$.ajax（）请求之前都会调用ajaxPrefilter这个函数，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //发起真正的ajax请求前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    //统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局挂载complete回调函数
    options.complete= function (res) {
        console.log(res);
        //在complete回调函数中，可以通过res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token');
            //跳转到登录页
            location.href='/login.html'
        }
    }
})