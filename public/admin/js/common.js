/**
 *
 *
 *
 */
// 配置禁用小圆环
NProgress.configure({ showSpinner: false });
// 开启进度条
$(document).ajaxStart(function(){
  NProgress.start();
})


$(document).ajaxStop(function(){
  // 结束进度条
  NProgress.done();
})
// 登录拦截功能

// 前后分离了 前端不知道该用户是否登录
// 发送ajax请求 查询用户状态即可
// 1.1 用户已登录 啥都不用做 让用户继续访问
// 1.2 用户未登录 拦截到登录页
if (location.href.indexOf("login.html") === -1 ) {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (info) {
      console.log(info);
      if (info.success) {
        console.log("用户已登录");
      }
  
      if (info.error === 400) {
        // 未登录 拦截到登录页
        location.href = "login.html";
      }
    }
  })
}

$(function(){
  //1 分类管理的切换功能
  $(".category").click(function(){
    $(".child").stop().slideToggle();
  })


  //2 左侧侧边栏切换
  $(".icon_menu").click(function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
  })

  //3 退出功能
  $(".icon-logout").click(function(){
    $("#logoutModal").modal("show");
  })

  //4 点击模态框退出按钮
  $("#logout_btn").click(function(){
    $.ajax({
      url: "/employee/employeeLogout",
      type: "get",
      dataType: "json",
      success: function (info) {
        console.log(info);
        if(info.success) {
          location.href = "login.html";
        }
      }
    })
  })
})