(function($){
	'use strict';

	$.fn.setVideoBar = setVideoBar;
		
		
		function setVideoBar(options){
			
			var $video = $(this),
				video = this,

				defaults = {
					autoplay : true,
					$durationBtn : $video.siblings('.progress-bar-wrapper').find('.duration-btn'),
					$bar : $video.next().find('.progress-bar'),
					$durationText : $video.next().find('.progress-bar').siblings('.duration-text'),
					$timeText : $video.next().find('.progress-bar').siblings('.time-text')
				},
				opts = $.extend({}, defaults, options);

			if(opts.autoplay){

				$video[0].play();
			}

			$video.on('loadedmetadata', onLoad);

			function onLoad(){			
				video.barWidth = opts.$bar.width();
				
				video.duration = $video[0].duration;
				opts.$durationText.text(Math.round( video.duration ).toHHMMSS() );

				opts.$bar.on('click', onBarClick);

				function onBarClick(event){
					var cursor_left = event.pageX,
						bar_left = $(this).offset().left;
						$video[0].currentTime = (cursor_left - bar_left) / video.barWidth * video.duration;
				}				
			}
			
			opts.$durationBtn.on('mousedown', onDurationBtnMouseDown);

			function onDurationBtnMouseDown(evnet){
				event.preventDefault();
				var setTime,
					cursor_left_begin = event.pageX,
					mousedown = true;
				$video[0].pause();
				opts.$durationText.addClass('active');
				opts.$timeText.addClass('active');
				
				$(window).bind('mousemove', function(event){
					event.preventDefault();
					var playedWidth,
						cursor_left_end = event.pageX;

					setTime = $video[0].currentTime + (cursor_left_end - cursor_left_begin) / video.barWidth * video.duration;
					setTime = (setTime < 0) ? 0 : setTime;
					setTime = (setTime > video.duration) ? video.duration : setTime;
					opts.$timeText.text( Math.round( setTime ).toHHMMSS() );
					
					calcInnerWidth(setTime);
					opts.$bar.children('.played').width(playedWidth + 'px');
				})
				$(window).on('mouseup', function(event){
					event.preventDefault();
					if(mousedown){
						$(this).unbind('mousemove');
						$video[0].currentTime = setTime;
						opts.$durationText.removeClass('active');
						opts.$timeText.removeClass('active');
						
						$video[0].play();
					}
					mousedown = false;
					return;
				})
			}				


			$video.on('timeupdate',function(){
			
				opts.$timeText.text( Math.round( $video[0].currentTime ).toHHMMSS() );
				calcInnerWidth($video[0].currentTime);
				
			})

			$(window).on('resize', function(){
				calcInnerWidth($video[0].currentTime);			
			})

			function calcInnerWidth(time){
				var playedWidth = time/video.duration * video.barWidth;
				
				opts.$bar.children('.played').width(playedWidth + 'px');
			}

			Number.prototype.toHHMMSS = function () {
			    var sec_num = parseInt(this, 10); // don't forget the second param
			    var hours   = Math.floor(sec_num / 3600);
			    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			    var seconds = sec_num - (hours * 3600) - (minutes * 60);
			    if (hours   < 10) {hours   = "0"+hours;}
			    if (minutes < 10) {minutes = "0"+minutes;}
			    if (seconds < 10) {seconds = "0"+seconds;}
			    var time    = hours+':'+minutes+':'+seconds;
			    return time;
			}
		}	
})(jQuery)