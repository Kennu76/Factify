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

function vote(type, fact, success){
	$.ajax({
		type: 'POST',
		url : '/votes',
		data: {type : type, fact: fact},
		success : success,
		dataType : 'json'
	});
}

function showMessage(message){
  var elem = $('#app-message');
  var content = elem.children('.message-content'); 
  content.text(message);

  elem.fadeIn();
  setTimeout(function(){
    elem.fadeOut();
  }, 5000);
}
window.fbAsyncInit = function() {
    FB.init({
          appId      : '202083643612448',
          xfbml      : true,
          version    : 'v2.8'
    });

    $(document).trigger('fbload');  //  <---- THIS RIGHT HERE TRIGGERS A CUSTOM EVENT CALLED 'fbload'
};
$(document).on(
    'fbload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
    function(){
        //some code that requires the FB object
        //such as...
        FB.getLoginStatus(function(res){
            if( res.status == "connected" ){
                FB.api('/me', function(fbUser) {
                    console.log("Open the pod bay doors, " + fbUser.name + ".");
                });
            }
        });

    }
);
FB.login(function(response) {
     if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
      });
     } else {
      console.log('User cancelled login or did not fully authorize.');
     }
 });