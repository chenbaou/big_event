$(function () {

    $('.login .links').on("click", function () {
        $('.login').hide();
        $('.register').show();
    })
    $('.register .links').on("click", function () {
        $('.register').hide();
        $('.login').show();
    })
    //从layui中获取form元素
    var form = layui.form
    //从layui中获取layer元素
    var layer=layui.layer
    //自定义一个密码校验规则
    form.verify({
        pwd: [ /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //确认两次密码是否一致的规则
        repwd: function (value) {
            //获取注册模块密码框的值
            var pwd = $('.register [name=password]').val();
            //通过value拿到确认密码框的值
            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })
    //监听注册页面的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data= { username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,function (res) {
            if (res.status !== 0) {
                // console.log(res);
               return layer.msg(res.message);
            }
                layer.msg('注册成功!请登录');
                //注册自动点击事件跳转到登录页面
                $('.register .links').click()
        }) 
    })
    //监听登录页面的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                  return  layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // console.log(res.token);
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})