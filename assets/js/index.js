$(function () {
    getUserInfo();
    var layer = layui.layer;
    //点击退出实现退出功能
    $('#btnLogout').click(function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //清除token
            localStorage.removeItem('token');
            //跳转登录页
            location.href = '/login.html' 
            //关闭confirm询问框
            layer.close(index);
          });
    })
})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization:localStorage.getItem('token')||''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用renderAvater函数渲染用户头像
            renderAvater(res.data);
        },
        //无论请求成功或失败，都会调用complete回调函数
        // complete: function (res) {
        //     console.log(res);
        //     //在complete回调函数中，可以通过res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         //强制清空token
        //         localStorage.removeItem('token');
        //         //跳转到登录页
        //         location.href='/login.html'
        //     }
        // }
    })
}
//渲染用户的头像
function renderAvater(user) {
    //获取用户的昵称
    var name = user.nickname || user.username
    //摄制欢迎文本
    $('.welcome').html('欢迎 ' + name)
   //渲染图片头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').prop('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}