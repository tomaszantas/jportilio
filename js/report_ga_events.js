$(function () {
		
	$('.download_link').on('click', function() {
		console.log('GA');
	  	ga('send', 'event', 'link', 'download', $(this).attr('id'));
	});
  
});

	
