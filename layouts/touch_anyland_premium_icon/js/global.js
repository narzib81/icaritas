// JavaScript Document

// Animate DIV
  jQuery(document).ready(function($){
	
	// 엑스트라 영역(ExtraArea) 토글
	$(".mv").toggle(function(){
	  $("#mv_box").show();

	  $(".mv").css({"background-position":"left -40px"});
	  
	  },function(){
	  $("#mv_box").hide();
	  $(".mv").css({"background-position":"left 0px"});
	});
	
	// 로그인 영역 토글
	$(".login").click(function(){
	  $(".loginLayer").show();
	  $(".acc li.signup").hide();
	});
	
	$(".close").click(function(){
	  $(".loginLayer").hide();
	  $(".acc li.signup").show();
	});
	
	// IE66 사이드 바 높이 100%
	$("#sb").css({'height':$(document).height() // 중앙 단의 최소 높이는 우측 단의 컨텐츠 높이
	});

  });