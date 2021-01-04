$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //自定义密码验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('input[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('input[name="newPwd"]').val()) {
                return '两次密码输入不一致'
            }
        }
    })
    //发起修改密码请求
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg(res.message)
                //重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})