/**
 *
 *
 *
 */

// 开启进度条




$(document).ajaxStart(function(){
  NProgress.start();
})


$(document).ajaxStop(function(){
  // 结束进度条
  NProgress.done();
})