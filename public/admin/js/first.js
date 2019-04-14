
$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();
  // 1 已进入页面发送ajax请求 请求一级分类的所有数据进行渲染
  function render() {
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("firstTpl", info)
        $(".lt_content tbody").html( htmlStr )
  
        //分页插件初始化
        $("#paginator").bootstrapPaginator({
          // 指定版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 给页面添加点击事件
          onPageClicked: function(a, b, c, page) {
            //更新当前页 
            currentPage = page
            render();
          }
        })
      }
    })
  }
  
})