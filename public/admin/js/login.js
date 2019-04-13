$(function(){
  $("#form").bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置字段
    fields: {
      username: {
        validators: {
          //非空
          notEmpty: {
            message: "不用名不能为空"
          },
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          //非空
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })

  $("#form").on("success.form.bv",function(e){
    e.preventDefault();

    console.log("校验成功后 表单提交组织了");
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info ) {
        console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1000) {
          $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
        }
        if (info.error === 1001) {
          $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
        }
      }
    })
  })

  // 3 重置功能
  $("[type='reset']").click(function(){
    $("#form").data("bootstrapValidator").resetForm(true);
  })


})