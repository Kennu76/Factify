$(function(){
	$.getJSON('/facts', function(data){
		$("#skoor").html(data.like_count);
		$(".fact-in").html(data.poster);
	},'json');

	$(".showcomments").click(function(){
		$("#comments").toggle();
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




