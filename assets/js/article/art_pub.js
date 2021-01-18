$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    //定义加载文章分类列表的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 调用模板引擎渲染文章分类下拉列表
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                //调用form.render()方法重新渲染表单
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面按钮绑定点击事件
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })
    //监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').change(function (e) {
        //获取用户选择的文件列表
        var files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) { return }
        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布'
    //为存为草稿按钮绑定点击事件
    $('#btnSave2').click(function () {
        art_state = '草稿'
    })
    //为id="form-pub"表单绑定submit事件
    $('#form-pub').submit(function (e) {
        e.preventDefault()
        //给予form表单，快速创建FormData对象
        var fd = new FormData($(this)[0])
        //将文章的发布状态，存到fd中
        fd.append('state', art_state)
        // fd.forEach(function (k,v) {
        //     console.log(v,k);
        // })
        //将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，存到fd中
                fd.append('cover_img', blob)
                // 发起ajax数据请求
                publishArticle(fd)
            })
    })
    //定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交FormData格式的数据，必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href='/article/art_list.html'
            }
        })
    }

})