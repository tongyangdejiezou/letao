
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
  
  //2 点击添加分类
  $("#add_btn").click(function(){
    // 显示添加模态框
    $("#addModal").modal("show")
  })


  //3 添加表单校验功能
  $("#form").bootstrapValidator({

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 字段
    fields: {
      categoryName: {
        // 指定校验规则 要求非空
        validators: {
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  })

  //3 添加表单校验成功事件  阻止默认提交
  $("#form").on("success.form.bv", function(e){
    e.preventDefault();
    
    $.ajax({
      url: "/category/addTopCategory",
      type: "post",
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          render();

          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
})