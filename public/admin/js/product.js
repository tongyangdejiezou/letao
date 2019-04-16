$(function(){
  var currentPage = 1; // 当前页

  var pageSize = 2; // 每页条数

  // 定义用来存储已上传图片的数组
  var picArr = [];

  render();
  function render () {
    // 发送请求渲染
    $.ajax({
      url: "/product/queryProductDetailList",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $(".lt_content tbody").html(htmlStr);

        // 分页初始化
        // 进行分页初始化
        $('#paginator').bootstrapPaginator({
          // 配置bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 注册每个页码的点击事件
          onPageClicked: function( a, b, c, page ) {
            // 重新渲染页面
            currentPage = page;
            render();
          },
          // 配置按钮大小 large
          size: "normal",
          // 配置每个按键的文字
          // 每个按钮, 都会调用一次这个方法, 他的返回值, 就是按钮的文本内容
          itemTexts: function( type, page, current ) {
            // first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
            // page 是当前按钮指向第几页
            // current 是指当前是第几页 (相对于整个分页来说的)
            switch( type ) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return page;
            }
          },
          // 配置提示框
          tooltipTitles: function( type, page, current) {
            switch( type ) {
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "page":
                return "前往第" + page + "页";
            }
          },
          // 使用 bootstrap 样式的提示框组件
          useBootstrapTooltip: true
        })
      }
    })

  }
  // 1 进入页面 请求商品数据 进行页面渲染

  // 点击添加商品
  $("#addBtn").click(function(){
    $("#addModal").modal("show")

    // 发送ajax请求 请求所有的二级分类数据 进行渲染
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      type: "get",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTpl", info)
        $(".dropdown-menu").html( htmlStr )
      }
    })
  })

  //3 给dropdown-menu下面的a 添加点击事件 通过事件委托
  $(".dropdown-menu").on("click", "a", function(){
    //设置文本
    var txt = $(this).text();
    $("#dropdownText").text( txt );

    // 设置id给隐藏域
    var id = $(this).data("id")
    $("#brandId").val(id);

    // 重置校验状态为VALID
    $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  })

  // 4. 配置图片上传
  $('#fileupload').fileupload({
    // 指定数据类型为 json
    dataType: "json",
    // done, 当图片上传完成, 响应回来时调用
    done: function( e, data ) {
      // console.log( data.result )
      picArr.unshift(data.result);
      // 获取上传成功的图片地址
      // var picAddr = data.result.picAddr;
      // 设置图片地址
      // $('#imgBox img').attr("src", picAddr);
      // 将图片地址存在隐藏域中
      // $('[name="brandLogo"]').val( picAddr );
      
      $("#imgBox").prepend('<img src="'+data.result.picAddr+'" width="100" />');
      // 重置校验状态
      // 通过判断数组长度 如果数组长度大于3 将数组最有一项移除
      
      // $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
      if (picArr.length > 3) {
        // 移除数组的最有一项
        picArr.pop();

        // 移除imgBox中的最后一个图片
        $("#imgBox img").eq(-1).remove();
      }
      console.log(picArr);
      if (picArr.length === 3) {
        $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });

  // 5. 配置表单校验
  $('#form').bootstrapValidator({

    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      // 品牌名称
      brandId: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      // 一级分类的id
      proName: {
        validators: {
          notEmpty: {
            message: "请输入名称"
          }
        }
      },
      // 图片的地址
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入描述"
          }
        }
      },
      // 产品库存
      // 除了非空之外 要求必须是非零开头的数字
      num: {
        validators: {
          notEmpty: {
            message: "请输入数量"
          },
          // 正则
          // \d 表示数字0-9
          // + 表示出现一次或者多次
          // * 0次到多次
          // ? 0次到1次
          regexp: {
            regexp:/^[1-9]\d*$/ ,
            message: "商品必须是非零开头的数字"
          }
        }
      },
      // 尺码 还要求必须是 xx-xx 的格式
      size: {
        validators: {
          notEmpty: {
            message: "请输入尺寸"
          },
          regexp: {
            regexp:/^\d{2}-\d{2}$/ ,
            message: "尺码必须是xx-xx的格式 列如32-40 并且前面的数字小于后面"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入现价"
          }
        }
      },
      // 图片校验
      picStatus: {
        validators: {
          notEmpty: {
            message: "请选择三张图片"
          }
        }
      }
    }
  });

  // 6. 注册校验成功事件, 通过 ajax 进行添加
  $("#form").on("success.form.bv", function( e ) {
    // 阻止默认的提交
    e.preventDefault();

    var paramsStr = $('#form').serialize();
    paramsStr += "&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr+"";
    paramsStr += "&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr+"";
    paramsStr += "&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr+"";
    $.ajax({
      url: "/product/addProduct",
      type: "post",
      data: paramsStr,
      success: function( info ) {
        console.log( info )

        // 关闭模态框
        $('#addModal').modal("hide");
        // 重置表单里面的内容和校验状态
        $('#form').data("bootstrapValidator").resetForm( true );

        // 重新渲染第一页
        currentPage = 1;
        render();

        // 找到下拉菜单文本重置
        $('#dropdownText').text("请选择二级分类")

        // 找到图片重置
        $('#imgBox img').remove();
      }
    })
  })

})