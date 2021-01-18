$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    //为添加类别绑定点击事件
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });

    })
    //通过事件委托的形式，为id="form-add"的表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功！')
                //根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })
    //通过事件委托的形式，为编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEidt = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        //console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                //调用layui提供form.val()方法快速为表单赋值
                form.val('form-edit', res.data)
            }
        })
    })
    //通过事件委托的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                //根据索引，关闭对应的弹出层
                layer.close(indexEidt);
                initArtCateList();
            }
        })
    })
    //通过事件委托的形式，为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    //关闭confirm询问框
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})