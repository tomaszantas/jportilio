$(function () {
	

	$.fn.jportilio = function(options) {
		// extend defaults:
		var opts = $.extend({}, $.fn.jportilio.defaults, options);
		
		// filter:
		function filterCheck(ei) {
			
			if(opts.filter != null && opts.filter.length > 0) {
				var tags = ei.data('tags');
				
				if(tags != null && tags.length > 0) {
					var found = false;
					tags = tags.replace(/ /g,'');//clear whitespace to match tags better
					tags = tags.toLowerCase();//standardize case to match tags better
					tags = tags.split(',');
					tags.map(function(a) {
						if($.inArray(a,opts.filter) != -1) {
							found = true;
							return true;
						} 						
					});
					if(found === true){
						return true;
					}
				}
			} else {
				return true;
			}
			
			return false;
		}
		
		
		// Draw grid:
		function setGrid(el,filter) {
			
			// check media:
			var mq = checkMedia();
			
			// calculate item's width f(mq):
			var items_in_row = workItemWidth(mq, opts);
			//var witem = el.outerWidth(true)/items_in_row;
			var witem = el.width()/items_in_row;
			// calculate item's height f(ratio, width):
			var h = (opts.ratio*parseFloat(witem))-(opts.item_margin*2);
			
			// set grid items:
			var left_counter = 0; // counts the number of items in row
			var top_counter = 0; // counts the number of row
			var shift_down_temp = 0; // store information about shifting down next row due to appearance of content in new section (lives only in particular row)
			var shift_down = 0; // aggregate the shift down value for next rows (lives in whole container) 
			var shift_left = 0;
			el.children('.jprt-item').each(function(){
				var $t = $(this);
				
				// initialize width of content displaying in new section:
				/*if($t.find('.jprt-contents')) {
					$t.find('.jprt-content-ns').css({
						width: el.width()+'px'
					});
				}*/
				/*if($t.find('.jprt-content').data('content-show','cover')) {
					console.log('content-show cover');
					$t.find('.jprt-content').css({
						height: h+'px'
					});
				}*/
				/*if($t.find('.jprt-content').data('content-show','new_section')) {
					console.log('content-show new section');
					var hns = $t.find('.jprt-content').css('height');
					$t.find('.jprt-content').css({
						height: hns+'px'
					});
				}*/
				/*if($t.data('content-show','cover')) {
					console.log('content-show cover '+$t.data('content-show'));
					$t.find('.jprt-content').css({
						height: h+'px'
					});
				}*/
				/*if($t.data('content-show','new_section')) {
					
					var hns = $t.find('.jprt-content').height(); 
					console.log('content-show new section '+hns);
					$t.find('.jprt-content').css({
						height: hns+'px'
					});
				}*/
				if($t.data('content-show') === 'cover') {
					$t.find('.jprt-content').css({
						height: h+'px'
					});
				}
				if($t.data('content-show') === 'new_section') {
					var $cont = $t.find('.jprt-content')
					$cont.css({ position: "absolute", visibility: "hidden", display: "block", width: el.width()+'px' });
					//var cont_h = $cont.outerHeight();
					$cont.css({ position: "", visibility: "", display: "" });
					/*$t.find('.jprt-content').css({
						height: hns+'px'
					});*/
				}
				
				
				// check if filter conditions (tags) are satisfied: (true - display item, false - collapse item)				
				if(filterCheck($t)) {
					//console.log('top:  '+((top_counter*h)+shift_down)+ '  shift_down: '+shift_down+'  top_counter: '+top_counter+'  h: '+h);
					//console.log('item margin: '+((top_counter*(h+parseFloat(opts.item_margin)))+shift_down));
					$t.css({
						display: 'block',
						height: h+'px',
						width: (witem-(opts.item_margin*2))+'px',
						top: ((top_counter*(h+parseFloat(opts.item_margin*2)))+shift_down)+'px',
						left: (left_counter*witem)+'px',
						'margin-top': opts.item_margin+'px',
						'margin-left': opts.item_margin+'px'
					});
					
					// set item caption:
					$t.find('.jprt-caption').css({
						height: h+'px'
					});
					$t.find('.jprt-hover').css({
						height: h+'px'
					});

					
					// check if new section should appear below with content:
					if($t.find('.jprt-content').hasClass('show_new_section')) {
						// check what height content should has
						var cnt_ns = $t.find('.jprt-content');
						var cnt_h = cnt_ns.outerHeight();
						cnt_ns.css({
							'margin-top': h+'px',
							width: (el.width()-(opts.item_margin*2))+'px',
							'margin-left': -(left_counter*witem)+'px'
						});
						shift_down_temp = cnt_h;
						
						// show arrow down in circle - decoration:
						$t.find('.jprt-arrow-down-border').css({
							display: 'block'
						});
						
					} else {
						// solution to improve:
						// hide arrow down in circle - decoration:
						$t.find('.jprt-arrow-down-border').css({
							display: 'none'
						});
					}		
					left_counter++;
					
				} else {
					// collapse item if shouldn't be displayed
					$t.css({
						height: '0px',
						width: '0px'
					});
					$t.css({display: 'none'});
				}
				
				
				// new row: (reset and increase counters)
				if(left_counter >= items_in_row){
					left_counter = 0;
					top_counter++;
					shift_down = shift_down + shift_down_temp;
					shift_down_temp = 0;
				}
			});
			
			// if in the last line wasn't full, the counter shift_down wouldn't be increased. So we have to do it manually (hazard: the height of new section in last line wouldn't be included)
			if(left_counter > 0 && left_counter < items_in_row){
				shift_down = shift_down + shift_down_temp;
			}
			
			// Set the height of whole grid container. (it's necessary because thew item are 'absolute')
			el.css({
				height: (((top_counter+1)*(h+(opts.item_margin*2)))+shift_down)+'px' 
			});
		}
		
		// Redraw grid on window resize:
		var tid;
		var elems = this;
		$(window).on('resize', function() {
	      clearTimeout(tid);
	      tid = setTimeout(function() {
	        elems.each(function() {
	          setGrid($(this),'');
	        });
	      }, 100);
	    });
		
		
		// final:
		return this.each(function() {
			
			var obj = $(this);
			setGrid(obj);
				
			
			/* =============== FILTER TAG BUTTONS ===================*/
			
			/* tag filter buttons click: */
			$('button[data-jprtgrid='+obj.attr('id')+']').on('click', function(e) {
				var tag = $(this).data('tag');
                if(tag != null) { 
      						tag = tag.replace(/ /g,'');	//clear whitespace to match better
      						tag = tag.toLowerCase(); 		//standardize case to match better
      						tag = tag.split(',');}
				
				// check if button is active and add or remove tags:
				if($(this).hasClass('jprt-btn-active')) {
					$(this).removeClass('jprt-btn-active');
					if(tag != null && opts.filter.length > 0) {
						tag.map(function(a) {
							opts.filter.splice($.inArray(a, opts.filter),1);						
						});
					}
				} else {
					$(this).addClass('jprt-btn-active');
					// assign tags to opts:
					if(opts.filter.length == 0){
						if(tag != null && tag.length > 0) {
							opts.filter = tag;
						}
					} else {
						if(tag != null && tag.length > 0) {
	                		tag.map(function(a) {
								opts.filter.push(a);						
							});
						}
                	}
				}
				
                setGrid(obj);
                            
            });

            
            
            /* =============== CONTENT SHOW METHODS ===================*/
           
            /* work-item or any div click */
           $('div[data-content-show="redirect"]').on('click', function(){
           		var content_show = $(this).data('content-show');
           		if(content_show !=null) {
           			if(content_show === 'redirect') {
           				var content_url = $(this).data('content-url');
           				if(content_url !=null) {
           					window.location.href = content_url;
           				}
           			}
           		}
           });
           
           /* button click */
          $('button[data-content-show="redirect"]').on('click', function(){
           		var content_show = $(this).data('content-show');
           		if(content_show !=null) {
           			if(content_show === 'redirect') {
           				var content_url = $(this).data('content-url');
           				if(content_url !=null) {
           					window.location.href = content_url;
           				}
           			}
           		}
           });
           
           
           /* cover caption by content */
           $('div[data-content-show="cover"][class*="jprt-item"]').on('click', function(){
           		var cnt = $(this).find('.jprt-content');
           		cnt.toggleClass('show');
           });
           
           
           /* new section containing content */
          $('div[data-content-show="new_section"]').on('click', function(){
          		// collapse already opened sections:
          		var n_sects = $('.show_new_section');
          		n_sects.each(function() {
          			$(this).removeClass('show_new_section');
          		});
          		
          		// toggle this:
           		var cnt = $(this).find('.jprt-content');
           		
           		if(cnt.hasClass('new_section_shown')) {
           			cnt.removeClass('new_section_shown');
           		} else {
           			cnt.addClass('show_new_section');
           			cnt.addClass('new_section_shown');
           		}
           		
           		setGrid(obj);

           });
			
		});
		
		
		
	};


	$.fn.jportilio.defaults = {
		filter: [],
	    ratio: "0.75",
	    ws_xs: 1,
	    ws_sm: 2,
	    ws_md: 3,
	    ws_lg: 4,
	    item_margin: 0
	};

});


function checkMedia() {
	var mq = 'none';
	
	if( window.matchMedia( "(min-width: 768px)" ).matches ) {		
		if (window.matchMedia( "(min-width: 992px)" ).matches) {			
			if (window.matchMedia( "(min-width: 1200px)" ).matches) {			
				mq = 'lg';
			} else { mq = 'md'; }			
		} else { mq = 'sm'; }
	} else { mq = 'xs'; }
	
	return mq;
}

function workItemWidth(mq, opts) {
	var w = '2';
	if(mq === 'xs') {
		w = opts.ws_xs;
	} else {
		if(mq === 'sm'){
			w = opts.ws_sm;
		} else {
			if(mq === 'md') {
				w = opts.ws_md;
			} else {
				w = opts.ws_lg;
			}
		}
	}
	return w;
}