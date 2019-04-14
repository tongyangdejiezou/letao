$(function() {
  var currentPage = 1;
  var pageSize = 5;

  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $(".lt_content tbody").html(htmlStr);

        //分页插件初始化
        $("#paginator").bootstrapPaginator({
          // 指定版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          itemTexts: function(type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "末页";
              case "page":
                return page;
            }
          },

          // 给页面添加点击事件
          onPageClicked: function(a, b, c, page) {
            //更新当前页
            currentPage = page;
            render();
          }
        });
      }
    });
  }
});
