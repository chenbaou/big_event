$(function () {
    var form = layui.form;
    var layer=layui.layer
    //自定义用户昵称输入规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称在1~6个字符之间'
            }
        }
    })
    initUserInfo();
    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                  return leyer.msg('获取用户信息失败')
                }
                //console.log(res);
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    //重置表单的数据
    $('#btnReset').click(function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //监听表单的提交行为
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //调用父页面的方法，重新渲染用户昵称和头像
                window.parent.getUserInfo();
            }
        })
    })
})