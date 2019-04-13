/**
 * Created by Jepson on 2018/4/7.
 */
$(function() {
  // 当前页
  var currentPage = 1;
  // 一页多少条
  var pageSize = 5;
  // 1. 一进入页面, 进行渲染
  render();
  function render() {
    // 发送请求, 获取表格渲染的数据
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function( info ) {
        console.log( info );
        // 参数2 必须是一个对象
        // 在模板中可以任意使用对象中的属性
        // isDelete 表示用户的启用状态, 1就是启用, 0就是禁用
        var htmlStr = template( "tpl", info );
        $('.lt_content tbody').html( htmlStr );

        // 配置分页
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),

          // 当页面被点击时触发
          onPageClicked: function( a, b, c, page ) {
            // page 当前点击的页码
            currentPage = page;
            // 调用 render 重新渲染页面
            render();
          }
        });

      }
    });
  }

  // 定义当前id
  var currentId;
  var isDelete;  // 标记用户状态
  // 2. 通过事件委托给 按钮注册点击事件
  $('.lt_content tbody').on("click", ".btn", function() {
    console.log("被点击了");
    $("#userModal").modal("show");
    currentId = $(this).parent().attr("data-id");
    // console.log(id);
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  })

  // 点击模态框的确定按钮 启用 禁用按钮
  $("#submit_btn").click(function(){
    console.log("切换启用禁用状态");
    $.ajax({
      url: "/user/updateUser",
      type: "post",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          // 修改状态

          $("#userModal").modal("hide");

          render();
        }
      }
    })
  })


})
