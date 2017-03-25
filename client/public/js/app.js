$(function(){
	$(".showcomments").click(function(){
		$("#comments").toggle();
	});


	$('#login-form-link').click(function(e) {
        	$("#login-form").delay(100).fadeIn(100);
     		$("#register-form").fadeOut(100);
    		$('#register-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});
    	$('#register-form-link').click(function(e) {
    		$("#register-form").delay(100).fadeIn(100);
     		$("#login-form").fadeOut(100);
    		$('#login-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});
    	$(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

		$("#bestof-interval").change(function(e){
			window.location.search = "time=" + $(this).val();
		});
});

FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
window.fbAsyncInit = function() {
    FB.init({
      appId      : '772092369606462',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}


function vote(type, fact, success){
	$.ajax({
		type: 'POST',
		url : '/votes',
		data: {type : type, fact: fact},
		success : success,
		dataType : 'json'
	});
}
