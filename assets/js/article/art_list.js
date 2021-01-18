$(function () {
    var layer = layui.layer
    var form = layui.form
    //获取laypage对象渲染分页
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())
        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义事件补零的方法
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }
    //定义一个查询的参数对象q，将来请求数据的时候，将q提交到服务器
    var q = {
        pagenum: 1,//页码值，默认第1页
        pagesize: 2,//默认每页显示2条数据
        cate_id: '',//文章分类的 Id
        state: ''//文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();
    //获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                //console.log(res);
                //console.log(htmlStr);
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                //调用模板引擎渲染可选项
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr)
                //通知layui重新渲染页面
                form.render()
            }
        })
    }
    //为筛选表单绑定submit事件
    $('#form-search').submit(function (e) {
        e.preventDefault();
        //获取表单中选项中的值
        var cate_id = $('[name="cate_id"]').val()
        //console.log(cate_id);
        var state = $('[name="state"]').val()
        //为查询参数对象q对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表单的数据
        initTable()

    })
    //定义渲染分页的方法
    function renderPage(total) {
        //console.log(total);
        laypage.render({
            elem: 'pageBox',//分页容器的ID
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，出发jump回调函数
            // 触发jump回调的方式有2种
            //1.切换分页的时候
            //2.调用laypage.render()方法，触发jump回调渲染页面会发生死循环
            jump: function (obj, first) {
                // 可以通过first的值来判断哪种方式触发的jump回调
                // 方式1触发，first=underfined
                // 方式2触发，first=true
                //obj.limit获取最新的条目数
                //console.log(obj.limit);
                //把最新的条目数，赋值到q这个查询参数身上
                q.pagesize = obj.limit
                //obj.curr获取选择分页的页码值
                //console.log(obj.curr);
                //把最新的页码值赋值到q这个查询参数身上
                q.pagenum = obj.curr
                //切换分页的时候，触发jump回调,根据最新的q获取对应的数据列表，渲染页面
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章的ID
        var id = $(this).attr('data-id')
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        //询问用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //根据 Id 删除文章数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后，需要判断当前分页是否还有数据，如果没有剩余的数据了，则让页码值-1后再调用initTable()方法渲染页面
                    if (len == 1) {
                        //如果len的值为1，证明删除完毕之后，当前分页没有剩余数据
                        // 页码值最小值为1
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })

})