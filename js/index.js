$(function () {
	
 
  	//var jportilios = $('.jprt-container').jportilio({'ratio': '0.75', 'ws_lg': '4'});
  	var jportilios = $('.jprt-container').jportilio();


              
	/* add active class to button */
	$('.jprt-btn-style').on('click', function(e) {
		if($(this).hasClass('jprt-btn-active')) {
			//$('.jprt-btn-style').removeClass('jprt-btn-active');
			//$(this).removeClass('jprt-btn-active');
			//$('#jprt-1').removeClass('jprt-'+$(this).attr('id'));
			
			$('.jprt-btn-style').each(function () {
				$(this).removeClass('jprt-btn-active');
				$('#jprt-1').removeClass('jprt-'+$(this).attr('id'));
				$('#tag-buttons').removeClass('jprt-'+$(this).attr('id'));
			});
		} else {
			$('.jprt-btn-style').each(function () {
				$(this).removeClass('jprt-btn-active');
				$('#jprt-1').removeClass('jprt-'+$(this).attr('id'));
				$('#tag-buttons').removeClass('jprt-'+$(this).attr('id'));
			});
			$(this).addClass('jprt-btn-active');
			$('#jprt-1').addClass('jprt-'+$(this).attr('id'));
			$('#tag-buttons').addClass('jprt-'+$(this).attr('id'));
		}
		
		
		
		
		
	});
	

});

	
