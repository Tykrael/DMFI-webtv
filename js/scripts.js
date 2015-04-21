(function($){
	var dmfi = {
		rotate : false,
		start : 'newsA', //loading, newsA, newsB, pdf, video, dashboard
		display : {
			newsA : 	150,
			newsB : 	150,
			pdf : 		100,
			dashboard : 150,
			loading : 	70,
			fadeIn : 	800
		},
		kpiActualizer : {
			views : 		0,
			videos : 		0,
			followers : 	0,
			tweets : 		0,
			fb : 			0,
			collabs : 		0,
			caf : 			0,
			sdw : 			0,
			ppt : 			0,
			sms : 			0,
			icone : 		0,
			randomRange : 	3,
			cwVariance : 	25, // coworkers variance
			tempoFactor : 	1000
		},
		fileServ : 'http://dmfi.hubi.org/files/',
		service : [
			{"afp":"http://dmfi.hubi.org/api/afp_news"},
			{"android":"http://dmfi.hubi.org/api/android_news"},
			{"blackberry":"http://dmfi.hubi.org/api/blackberry_news"},
			{"sport":"http://dmfi.hubi.org/api/sport_news"},
			{"windows":"http://dmfi.hubi.org/api/windows_news"},
			{"ios":"http://dmfi.hubi.org/api/ios_news"},
			{"pro":"http://dmfi.hubi.org/api/orange_pro_news"},
			{"cine":"http://dmfi.hubi.org/api/cine_news"},
			{"banner":"http://dmfi.hubi.org/api/horizontal_banner"},
			{"pdf":"http://dmfi.hubi.org/api/pdf_anime"},
			{"videos":"http://dmfi.hubi.org/api/video"},
			{"kpi":"http://dmfi.hubi.org/api/kpis"},
			{"icones":"http://dmfi.hubi.org/api/icone_kpi"}
		],
		$page : $('.page'),
		active : null,
		dashboardInitialized : false,
		templates : {
			astuce : _.template( $('.template-astuce').html() ),
			proNews : _.template( $('.template-proNews').html() ),
			actus : _.template( $('.template-actus').html() ),
			pdf : _.template( $('.template-pdf').html() ),
		},
		data : {},
		init : function(){
			var self = this;
			var loops = self.service.length;
			var loopd = 0
			self.data.astuces = [];

			dmfi.BV = new $.BigVideo({
				container:$('.loading')
			});
			dmfi.BV.init();
			dmfi.player = dmfi.BV.getPlayer();

			$.each(self.service,function(key,item){
				var k = Object.keys(item);
				var u = item[k];
				$.ajax({
					contentType : 'application/x-www-form-urlencoded; charset=UTF-8; contentType=JSON',
					url: u
				}).done(function(datas){
					self.data[k] = datas;
					if(k=='banner') {
						var bg = 'url('+self.fileServ+self.data.banner[0].image+')';
						$('.header').css({"background-image":bg});
					}
					if(k=='android' || k=='ios' || k=='windows' || k=='blackberry' ){
						self.data.astuces = self.data.astuces.concat(datas)
					}
					loopd++;
					if(loopd == loops){
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
						switch(self.start){
							case "loading":
								dmfi.displayLoading();
							break;
							case "newsA":
								dmfi.displayNewsA();
							break;
							case "newsB":
								dmfi.displayNewsB();
							break;
							case "pdf":
								dmfi.displayPdf();
							break;
							case "video":
								dmfi.displayVideo();
							break;
							case "dashboard":
							default :
								dmfi.displayDashboard();
							break;
						}


						if(dmfi.rotate){
							dmfi.rotateDisplay();
						} else {
							$('h1, .video').on('click',function(e){
								e.preventDefault();
								dmfi.selectDisplay();
							})
						}
/*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*/
					}
				})
			})
		},
		rotateDisplay : function(){
			classes = $('.page:visible').attr('class').split(' ');
			page = _.reject(classes,function(item){return item == 'page'})[0];
			var tempo = this.display[page]*100;
			if(tempo){
				setTimeout(function(){
					switch(page){
						case "dashboard":
							dmfi.displayLoading('news');
						break;
						case "loading":
							dmfi.player.pause();
							if($('.loading').hasClass('loadingNewsWrap')){
								dmfi.displayNewsA();
							} else {
								dmfi.displayVideo();
							}
						break;
						case "newsA":
							dmfi.displayNewsB();
						break;
						case "newsB":
							dmfi.displayLoading('videos');
						break;
						case "video":
							dmfi.displayPdf();
						break;
						case "pdf":
							dmfi.displayDashboard();
						break;
					}
					if(page != 'loadingVidsWrap')
						dmfi.rotateDisplay();
				},tempo)
			}
		},
		displayVideo : function(){
			var self = this;
			this.$page.hide();
			$('.video').show();
			video = _.sample(self.data.videos, 1);

			if(!self.fsTube){
				self.fsTube = new $.fsTube({
					target : $('.video')
				});
			}

			//self.fsTube.setVideo('WjhQvv9kexk');
			self.fsTube.setVideo(video[0].link);

			$(document).one('ytPlayerReady',function(){
				self.fsTube.play();
			})
			$(document).off('ytPlayerStateChange');
			$(document).on('ytPlayerStateChange',function(){
				if(self.fsTube.state() == 0){
					//dmfi.displayVideo();
					dmfi.displayPdf();
					dmfi.rotateDisplay();
				}
			})
			self.active = $('.video');
		},
		displayDashboard : function(){
			//console.log('displayDashboard');
			var self = this;
			this.$page.hide();
			if(!dmfi.dashboardInitialized)
				dmfi.initializeDashboard();
			$('.dashboard').fadeIn(self.display.fadeIn);
			self.active = $('.dashboard');
		},
		displayNewsA : function(){
			//console.log('displayNewsA');
			var self = this;
			this.$page.hide();

			var proNewsToDisplay = _.sample(self.data.pro, 3);
			//console.log(proNewsToDisplay)
			$('.proNews').html(self.templates.proNews({news:proNewsToDisplay}));

			var astucesToDisplay = _.sample(self.data.astuces, 3);
			$astuces = $('.astuces');
			$astuces.html('');
			$.each(astucesToDisplay,function(key,item){
				$astuces.append(self.templates.astuce({item:item}))
			})

			$('.newsA').fadeIn(self.display.fadeIn);
			self.active = $('.newsA');
		},
		displayNewsB : function(){
			//console.log('displayNewsB');
			var self = this;
			this.$page.hide();

			var actusCineToDisplay = _.sample(self.data.cine, 1);
			var actusAfpToDisplay = _.sample(self.data.afp, 2);
			var actusSportToDisplay = _.sample(self.data.sport, 2);

			$('.actus').html(self.templates.actus({
				actusCine:actusCineToDisplay,
				actusAfp:actusAfpToDisplay,
				actusSport:actusSportToDisplay
			}))
			$('.newsB').fadeIn(self.display.fadeIn);
			self.active = $('.newsB');
			self.updateActus();
		},
		updateActus : function(){
			var self = this;
			var upd = ['afp','sport'];
			_.each(upd,function(item){
				u = _.find(self.service,function(url){return item in url});
				$.ajax({
					contentType : 'application/x-www-form-urlencoded; charset=UTF-8; contentType=JSON',
					url: u[item]
				}).done(function(datas){
					self.data[item] = datas;
				})
			})
		},
		displayPdf : function(){
			//console.log('displayPdf');
			var self = this;
			this.$page.hide();
			var pdfToDisplay = _.sample(self.data.pdf, 1);
			$('.pdf .contentWrapper').html(self.templates.pdf({
				pdf:pdfToDisplay
			}));
			$('.pdf .figureBg >div').animate({
			  'background-position-y': '75%'
			}, 30000, 'linear');
			$('.pdf').fadeIn(self.display.fadeIn);
			self.active = $('.pdf');
		},
		displayLoading : function(loading){
			//console.log('loadingNews')
			var self = this;
			this.$page.hide();
			$('.loading').fadeIn(self.display.fadeIn);
			if(loading == 'news'){
				$('.loading').removeClass('loadingVidsWrap');
				$('.loading').addClass('loadingNewsWrap');
				dmfi.BV.show('vids/inter2.mp4');
			} else {
				$('.loading').removeClass('loadingNewsWrap');
				$('.loading').addClass('loadingVidsWrap');
				dmfi.BV.show('vids/inter1.mp4');
			}

			dmfi.player.one('ended',function(){
				dmfi.player.pause();
				$('.loading').hide();
			})
			self.active = $('.loading');
		},
		initializeDashboard : function(){
			//console.log('initializeDashboard')
			dmfi.dashboardInitialized = true;
			var self = this;
			var $dashboard = $('.dashboard');

			$dv = {
				views : 	$dashboard.find('.views').find('.values'),
				videos : 	$dashboard.find('.videos').find('.values'),
				followers : $dashboard.find('.social').find('.followers').find('.values'),
				tweets : 	$dashboard.find('.social').find('.tweets').find('.values'),
				fb : 		$dashboard.find('.facebook').find('.values'),
				collabs : 	$dashboard.find('.collabs').find('.values'),
				caf : 		$dashboard.find('.caf').find('.values'),
				sdw : 		$dashboard.find('.sdw').find('.values'),
				ppt : 		$dashboard.find('.ppt').find('.values'),
				sms : 		$dashboard.find('.sms').find('.values'),
				icone : 	$dashboard.find('.feelings').find('.figure')
			};
			_.each(self.data.kpi,function(item){
				switch(item.name){
					case "videos-views":
						if( $dv.views.html() == '' )
							$dv.views.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.views,item.incrementByMin,self.kpiActualizer.views);
					break;
					case "videos-generated":
						if( $dv.videos.html() == '' )
							$dv.videos.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.videos,item.incrementByMin,self.kpiActualizer.videos);
					break;
					case "social-followers":
						if( $dv.followers.html() == '' )
							$dv.followers.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.followers,item.incrementByMin,self.kpiActualizer.followers);
					break;
					case "social-tweets":
						if( $dv.tweets.html() == '' )
							$dv.tweets.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.tweets,item.incrementByMin,self.kpiActualizer.tweets);
					break;
					case "social-facebook":
						if( $dv.fb.html() == '' )
							$dv.fb.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.fb,item.incrementByMin,self.kpiActualizer.fb);
					break;
					case "coWorkers":
						if( $dv.collabs.html() == '' )
							$dv.collabs.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardCollabsActualizer($dv.collabs,item.value,item.value,item.incrementByMin,self.kpiActualizer.collabs);
					break;
					case "conso-coffee":
						if( $dv.caf.html() == '' )
							$dv.caf.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.caf,item.incrementByMin,self.kpiActualizer.caf);
					break;
					case "conso-sandwiches":
						if( $dv.sdw.html() == '' )
							$dv.sdw.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.sdw,item.incrementByMin,self.kpiActualizer.sdw);
					break;
					case "conso-slides":
						if( $dv.ppt.html() == '' )
							$dv.ppt.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.ppt,item.incrementByMin,self.kpiActualizer.ppt);
					break;
					case "conso-sms":
						if( $dv.sms.html() == '' )
							$dv.sms.html(dmfi.numberFormatter(item.value));
						dmfi.dashboardValueActualizer($dv.sms,item.incrementByMin,self.kpiActualizer.sms);
					break;
				}
			});
			var feelings = _.sample(self.data.icones, 1);
			var bg = 'url('+self.fileServ+feelings[0].image+')';
			$dv.icone.css({"background-image":bg});
		},
		dashboardCollabsActualizer : function(target, valueO, valueC, tempoRange, tempoO){
			var self = this;
			if( tempoO!=0 && typeof(tempoO)!='undefined' )
				var tempo = tempoO * self.kpiActualizer.tempoFactor;
			else
				var tempo = (Math.floor(Math.random() * tempoRange) + tempoRange) * self.kpiActualizer.tempoFactor;

			var variance = self.kpiActualizer.cwVariance;

			var calc = Math.round(Math.random());

			if( (calc || (valueC - variance) < 0) && !((valueC + variance) > valueO) ){
				var value = valueC + Math.floor(Math.random() * variance);
			} else {
				var value = valueC - Math.floor(Math.random() * variance);
			}
			var percent = value/valueO * 100;

			setTimeout(function(){
				target.html(dmfi.numberFormatter(value));
				dmfi.dashboardCollabsActualizer(target, valueO, value, tempoRange, tempoO);
				dmfi.updateMagicCW(target,percent);
			},tempo)


		},
		dashboardValueActualizer : function(target, tempoRange, tempoO){
			var self = this;
			if( tempoO!=0 && typeof(tempoO)!='undefined' )
				var tempo = tempoO * self.kpiActualizer.tempoFactor;
			else
				var tempo = (Math.floor(Math.random() * tempoRange) + tempoRange) * self.kpiActualizer.tempoFactor;
			var value = parseInt( dmfi.numberUnFormatter( target.html() ) ) + Math.floor(Math.random() * self.kpiActualizer.randomRange);
			setTimeout(function(){
				target.html(dmfi.numberFormatter(value));
				var plus = Math.floor(Math.random() * self.kpiActualizer.randomRange);
				//if( $('.dashboard').is(':visible') )
				dmfi.dashboardValueActualizer(target, tempoRange, tempoO);
				if(target == $dv.views || target == $dv.videos )
					dmfi.updateMagic(target,plus);
			},tempo)
		},
		updateMagicCW : function(target,value){
			$parent = target.parent().siblings();
			$child = target.parent().siblings().find(':last-child');
			$child.width( value+'%');
		},
		updateMagic : function(target,value){
			$parent = target.parent().siblings();
			$child = target.parent().siblings().find(':last-child');
			$childWidth = parseInt($child.attr('data-width'));
			if($childWidth < 100 ){
				if( ($childWidth+1) > 100 )
					toAdd = 100;
				else
					toAdd = ($childWidth+1);

				$child.attr('data-width',toAdd)
				$child.width( toAdd+'%');
			} else {
				$('<div class="line"></div>').width('1%').attr('data-width','1').appendTo($parent);
			}
		},
		selectDisplay : function(){
			if($('.dashboard').is(':visible'))
				dmfi.displayNewsA();
			else if($('.newsA').is(':visible'))
				dmfi.displayNewsB();
			else if($('.newsB').is(':visible'))
				//dmfi.displayVideo();
				dmfi.displayPdf();
			else if($('.video').is(':visible'))
				dmfi.displayPdf();
			else if($('.pdf').is(':visible'))
				dmfi.displayDashboard();
		},
		numberFormatter : function(toFormat){
			return toFormat.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
		},
		numberUnFormatter : function(unFormat){
			return unFormat.split(' ').join('');
		}
	}
	$(document).ready(function(){
		dmfi.init();
	})

})($)

function onYouTubePlayerAPIReady(){
	$(document).trigger('YTREADY');
}