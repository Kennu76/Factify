$(function(){
	$.getJSON('/facts', function(data){
		$("#skoor").html(data.like_count);
		$(".fact-in").html(data.poster);
	},'json');

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

	$("#upvote").click(function(){
		var that = this;
		$(that).attr('disabled',true);
		$(that).addClass('disabled');

		$.post('/upvote', function(){
			$(that).html("ok");
			$("#skoor").html(Number($("#skoor").html())+1);
		});
	})
});




