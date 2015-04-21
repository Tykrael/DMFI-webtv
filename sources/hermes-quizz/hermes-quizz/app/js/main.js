// CONSOLE LOG IE8 FIXING
if ( ! window.console ) console = { log: function(){} };

var hermes = {
	/* VAR TROUGH APP */
	user : {},
	BV: {},
	userLang: {},
	played : false,
	vidsPath:'vids/',
	imgPath:'img/',
	selector:{ // Sélecteur manager
		$welcome : $('#welcome'),
		$quizz : $('#quizz'),
		$next : $('.next'),
		$prev : $('.prev'),
		$content: $('.content'),
		$questionCount: $('.count-question'),
		$congratulation: $('#congratulations'),
		$menu: $('#menu'),
		$ball : $('#ball'),
    $cguPopin: $('#cgu-popin'),
    $savePopin: $('#save-path')
	},

	questionLength : function(){ // RETURN LE NB DE QUESTION
		var questionsLength = $('.question').length

		return questionsLength
	},
	
	video: function(){ // INIT DU PLAYER VIDEO DE L'APP
		hermes.BV = new $.BigVideo({
			container:$('.video-wrap')
		});

		hermes.BV.init();

		hermes.player = hermes.BV.getPlayer(); // ref du player
	},
	
	progressBar: function(index){ // GESTION DE LA BARRE DE PROGRESSION
		var step = 100/hermes.questionLength()

		$('.progress').find('span').animate({
			width : step*index+'%'
		}, 500)
	},

	startQuestion : function(){// A QUEL QUESTION LE QUIZZ DEMARRE ?

		if(hermes.user.position >= 1){ // si le user a deja remplit des question

			hermes.selector.$quizz.show()

			$('.question:nth-child('+hermes.user.position+')').addClass('active')

			hermes.progressBar(hermes.user.position)	

			if(hermes.user.position == hermes.questionLength()){ // si derniere question
				hermes.selector.$quizz
					.find('.bg')
					.attr('src', hermes.vidsPath+'final-screen.jpg')
					.show()
			}else{
				
				hermes.BV.show(hermes.vidsPath+hermes.user.position+'.mp4');

				hermes.selector.$quizz
					.find('.bg')
					.attr('src', hermes.imgPath+hermes.user.position+'.png')
					.show();
			}	
		};

		if(hermes.user.position == 0){ // si le user n'a jamais remplis une question
					
			$('.question:first-child').addClass('active');

			hermes.BV.show(hermes.vidsPath +'1.mp4');
			hermes.selector.$quizz
				.find('.bg')
				.attr('src', hermes.imgPath+'1.png')
				.show();
			hermes.player.pause();
			
		}
	},

	slideQuestion: {

		/*on affiche ou pas le next et prev*/

		isTxtareaEmpty: function($el){

		 	if($el.length > 0){

			 	var strLength = $el.val().length;

				if(strLength > 0){
					hermes.selector.$next.removeClass('faded');
				}else{
					hermes.selector.$next.addClass('faded');
				}
		 	}		
		},
		
		isChecked: function($el){

			if($el.length > 0){

				var isChecked = []

				$el.siblings(".custom-checkbox").andSelf().each(function(index, div){
					if($(div).hasClass('on')){
						isChecked.push('checked')
					}
				})

				if(isChecked.length > 0){
					hermes.selector.$next.removeClass('faded')
				}else{
					hermes.selector.$next.addClass('faded')
				} 
			}	
		},

		/*On slide de question en question*/

		questionCount: function(){
			var activeQuestionIndex = $('.question.active').index()+1

				hermes.selector.$questionCount
				.html('<span class="bold">'+activeQuestionIndex+'</span>'+'/<span>'+hermes.questionLength()+'</span>')
		},

		prevSlide : function(currentQuestion){

		 	if(!hermes.played){

				hermes.played = true

				var index = $(currentQuestion).index(),
					videoToLoad = hermes.vidsPath+index+'.mp4';

					hermes.selector.$content.fadeOut(200, function(){
					
					// GESTION CLASS ACTIVE
				 		$(this)
					 		.find('.question.active')
					 		.removeClass('active')
					 		.prev('.question')
					 		.addClass('active');

					// GESTION DE LA VIDEO A AFFICHER

					hermes.slideQuestion.questionCount()
					hermes.slideQuestion.isThereNextOrPrev()
					
					// forcement renseigné si on peut prev donc on enlève faded
					hermes.selector.$next.removeClass('faded')
			
					hermes.selector.$content.fadeIn(500, function(){
							hermes.progressBar(index)
							hermes.BV.show(videoToLoad)
							hermes.selector.$quizz.find('.bg')
								.attr('src', 'img/'+index+'.png')
								.show()

							hermes.played = false	
						
					})
			 	})
			}
		},	

		nextSlide: function(currentQuestion){
			var rightCss = hermes.selector.$quizz.find('.content').css('right'),
		 		animationTime = 800;

		 	if(!hermes.played){

				hermes.played = true
			
				var index = $(currentQuestion).index() + 1,
					//videoDisplayed = hermes.player.currentSrc(),
					videoToLoad = hermes.vidsPath+index+'.mp4'
				
					hermes.selector.$content.animate({
						right:'15%',
						opacity:0

					},animationTime, function(){
					
					// GESTION CLASS ACTIVE

				 		$(this)
					 		.find('.question.active')
					 		.removeClass('active')
					 		.next(".question")
					 		.addClass('active')

					// GESTION DE LA VIDEO A JOUER
	
					hermes.BV.show(videoToLoad)
					hermes.player.play()

					hermes.selector.$quizz.find('.bg').fadeOut(100)
				
					hermes.slideQuestion.questionCount()
					hermes.slideQuestion.isThereNextOrPrev()
		
					hermes.slideQuestion.isTxtareaEmpty($('.question.active').find('textarea'))
					hermes.slideQuestion.isChecked($('.question.active').find('.custom-checkbox'))

					hermes.player.one('ended', function(){	// event fin de vidéo
					
							hermes.selector.$content.animate({
								right: rightCss,
								opacity:1
							},animationTime, function(){
								
								hermes.progressBar(index+1)
								hermes.played = false
							})
						})
			 		})
			}
		},

		isThereNextOrPrev: function(){ // y a t il une question avant ou arpes?

			if($('.question.active').prev('.question').length > 0){
				hermes.selector.$prev.show()
			}else{
				hermes.selector.$prev.hide()
			}

			if($('.question.active').next('.question').length == 0){
				hermes.selector.$next.attr('data-dir','end')
			}else{
				hermes.selector.$next.attr('data-dir','next')
			}
		},

		finalScreen : function(){ // affiche l ecran final
	
			$('.count-question, #menu, #quizz-form').fadeOut(500,function(){
				hermes.selector.$congratulation.show()
			})
		},

		/* SLIDER QUESTION */
		slideDirection : function(el,e){	

			var dir = $(e.currentTarget).attr('data-dir'),	
				currentQuestion = '.question.active'

			 if(el.hasClass('faded')){
				return false
			 }else{
				switch(dir){
 					case 'prev':
 							hermes.slideQuestion.prevSlide(currentQuestion);
 					break;
 					case 'next':
 							hermes.slideQuestion.nextSlide(currentQuestion)
 					break;
 					case 'end':
 						hermes.slideQuestion.finalScreen()
 					break;
 				}
			}

      // hides cloud & umbrella guy on certain slides
      var now = parseInt($('.count-question').text().split('/')[0]);
      var next = now + (dir === 'next' ? 1 : -1);
      var hideCloudSlides = [6, 11, 12];
      var hideUmbrellaGuySlides = [5, 6, 9, 10, 11, 12];
      if (hideCloudSlides.indexOf(next) !== -1) {
        $('.floatingcloud').fadeOut();
      }
      else {
        var time = (dir === 'prev' ? 1000 : 3150);
        setTimeout(function() {
          $('.floatingcloud').fadeIn();
        }, time);
      }
      if (hideUmbrellaGuySlides.indexOf(next) !== -1) {
        $('.umbrellaguy').fadeOut();
      }
      else {
        var time = (dir === 'prev' ? 1000 : 3150);
        setTimeout(function() {
          $('.umbrellaguy').fadeIn();
        }, time);
      }
		}
	},

	checkBox: function($el){ // skin checkBox

		$checkbox = $el.find('input[type="checkbox"]')

		$el.toggleClass("on", function(){
			if($el.hasClass('on')){
				$checkbox.prop('checked', true)
			}else{
				$checkbox.prop('checked', false)
			}
			
		})
	},

	checkform: function(){ // validation du formulaire de depart

		var success = false;

		$("#start-form").validaThor({
			parentInput : 'field',
			errorClass : 'error',
			errorMessageClass : 'error-message',
			requiredClass : 'required',
			errorTag: 'span',
			onErrorSubmit : function(form,event){
				/*AU SUBMIT, si il y a une erreur, on entre dans ce callback*/
				event.preventDefault()
			},
			onSuccessSubmit : function(form,event){
				if(!success){

					success = true
					/*AU SUBMIT, si la validation est bonne, on entre dans ce callback*/
					event.preventDefault()	
					var userStartForm = {}

					$(form).find('input[type="text"]').each(function(){

						var label = $(this).attr('name'),
							value = $(this).val()
							
							userStartForm[label] = value
					})
			
					$.post('hermesquizz-2.json', userStartForm, function(data){
						hermes.selector.$welcome.hide()
						hermes.selector.$quizz.fadeIn()
						hermes.templatingQuizz(data)
					})
				}
				
			},
			onErrorfield : function(input){}
		})
	},

  modal: function($el) { // affiche une popin
    $el.fadeIn(500);
  },

	saveData: function(e){

		var id = $(e.currentTarget).attr('id'),
			answer = [],
			user = {};

			user.userId = hermes.user.id,
			user.hermesid = hermes.user.hermesid,
			user.currentQuestion =  $('.slide-question .active').index()+1,
			user.ended =  hermes.user.end,
			user.answers = []
			
			$('.slide-question .question').each(function(index, item){
					var $this = $(item)
					user.answers.push({
						"id":index+1
					})

				if($this.find('.textarea').length > 0){
					var text =  $this.find('.textarea textarea').val()
					user.answers[index].value = text
					user.answers[index].type = "textarea"
				}

				if($this.find('.check').length > 0){
					var checked = []
					$this.find('input[type="checkbox"]').each(function(){
						checked.push($(this).prop('checked'))
					})

					user.answers[index].value = checked
					user.answers[index].type = "checkbox"
				}	
			})

		if(id == "go"){

			// ANTOINE a envoyer au congratulation
			$.post('index.php', user, function(data){	
				window.location.reload()
			})
		}else{
			$('.modal').fadeOut()
		}
	},

	langChoice : function(){

		/*LANG*/

	 	 if(window.location.search.length > 0){
	 	 	hermes.userLang = window.location.search; 
	 		hermes.userLang = hermes.userLang.split('=')[1]
	 	 }else{
	 	 	hermes.userLang = navigator.language || navigator.userLanguage; 
	 		 hermes.userLang = hermes.userLang.split('-')[0]
	 	 }

	 	$('.active-lang').text(hermes.userLang)
	 },

	templatingWelcome : function(response){

	 	var data = response,
			fields = data.tab[hermes.userLang].fields,
			congratulations = data.tab[hermes.userLang].congratulations,
			modal = data.tab[hermes.userLang].saveModal,
			languages =	data.languages

			$('.lang-choice').append(_.template(hermes.templates.lang, {data: languages}))
			$('#save-path').append(_.template(hermes.templates.modal, {data: modal}))
			$('#footer').append(_.template(hermes.templates.footer, {data: fields.footer}))
			
			hermes.selector.$welcome.prepend(_.template(hermes.templates.field, {data: fields}))
		 	hermes.selector.$congratulation.append(_.template(hermes.templates.congratulations, {data: congratulations}))
			hermes.selector.$menu.append(_.template(hermes.templates.saveButton, {data: fields}))

      // cgu popin text
      hermes.selector.$cguPopin.find('.cgu-title').html(response.tab[hermes.userLang].fields.cgutitle)
      hermes.selector.$cguPopin.find('.cgu-text').html(response.tab[hermes.userLang].fields.cgu)

      $(document).trigger('welcomeLoaded')
	 },

 	templatingQuizz : function(response){

	 	var data = response,
			question = data.tab[hermes.userLang].questions,
			fields = data.tab[hermes.userLang].fields;
			hermes.user = data.user;
			hermes.selector.$quizz.append(_.template(hermes.templates.accessMaisonCarre, {data: fields}))
		
		$.each(question,function(index, value){

			var type = value.type

			switch (type){
				case 'checkbox':
					$('<li id="question_'+index+'" class="question"></li>').appendTo('#quizz .slide-question').append(_.template(hermes.templates.checkbox, {data: value, info : fields}))
				break;
				case 'textarea':
					$('<li id="question_'+index+'" class="question"></li>').appendTo('#quizz .slide-question').append(_.template(hermes.templates.textarea, {data: value}))
				break;
			}	
		})

		$('#footer').hide()

		$(document).trigger('quizzLoaded')

	 },

	ajaxCall: function(){
		
		hermes.langChoice()

		$.ajax({
			url :'hermesquizz.json',
			dataType:'json'
		}).done(function(response){
			/*if lang*/
			if(!response.tab[hermes.userLang]){
				hermes.userLang = 'en'
			}
			hermes.templatingWelcome(response)
		})
	},

	templates: {
		field: '<div class="content">'+
			'<h2 class="tt-1"><%= data.welcome %></h2>'+
			'<p><%= data.description %></p>'+
			 '<form id="start-form" method="post" action="#">'+
			 	'<div class="wd60 vmid iblock">'+
			 		'<div class="field">'+
	                	'<input class="required" name="name" type="text" data-validation="empty" data-placeholder="<%= data.name %>"/>'+
	                '</div>'+
	                '<div class="field">'+
	                	'<input  class="required" name="surname" type="text" data-validation="empty" data-placeholder="<%= data.surname %>"/>'+
	                '</div>'+
	                '<div class="field">'+
	               		 '<input  class="required" name="email" type="text" data-validation="empty,email" data-placeholder="<%= data.email %>"/>'+     
	                 '</div>'+ 
	                 '<div class="field">'+
	               		 '<input  class="required" name="hermesid" type="text" data-validation="empty" data-placeholder="<%= data.hermesid %>"/>'+     
	                 '</div>'+ 
                '</div>'+
                '<div class="wd40 vmid iblock">'+
                	'<input type="submit" class="start-btn" value="<%= data.start %>"/>'+
                '</div>'+
            '</form>'+
			'</div>',
		modal: '<div class="content">'+
					'<p><%= data.description %></p>'+
					' <div class="action txtcenter">'+
					'<button id="go"><%= data.okBtn %></button>'+
					'<button id="cancel"><%= data.cancelBtn %></button>'+
            	'</div>',
				
		lang :'<ul>'+
				'<% _.each(data, function(reponse, index){%>'+
					'<li>'+
						'<a class="uppercase" href="<% window.location.pathname %>?lang=<%= reponse %>"><%= reponse %></a>'+
					'</li>'+
				'<%})%>'+
			'</ul>',	
		footer :'<ul>'+
				'<% _.each(data, function(reponse, index){%>'+
					'<li <% if(index == 2){%>class="last"<%}%>>'+
						'<a <% if (reponse.href) { %>href="<%= reponse.href %>" <% } else { %>href="#"<% } %>><%= reponse.value %></a>'+
					'</li>'+
				'<%})%>'+
			'</ul>',	
		saveButton : '<button id="save"><%= data.saveButton %></button>',
		accessMaisonCarre : '<a href="#" id="access"><span><%= data.access %></span></a>',
		congratulations: '<h2 class="tt-1"><%= data.title %></h2>'+
						 '<p><%= data.description %></p>',
		textarea : '<div class="textarea"><h3 class="tt-3 mb1"><%= data.label %></h3>'+
						'<textarea><%= data.value %></textarea>'+
					'</div>',
		checkbox : '<div class="check">'+
					'<h3 class="tt-3 mb0"><%= data.label %></h3>'+
					'<p class="tt-4"><%= info.info %></p>'+
					'<% _.each(data.reponses, function(reponse, index){%>'+
							'<div class="field custom-checkbox <% if(reponse.value){%> on<%}%>">'+
								'<input type="checkbox"'+
								' name="<%= reponse.id %>" <% if(reponse.value){%> checked="checked"<%}%>/>'+
								'<label><%= reponse.label %></label>'+
							'</div>'+
					'<%})%>'+
				'</div>'
	},

	placeHolder: function(){
		// Faux palceholder
		$('input[data-placeholder]').each(function(){
			
			var defaultValue = $(this).data('placeholder'),
				$this = $(this)
				
			$this.val(defaultValue)
				.on('focus', function(){
					if ($this.val() == defaultValue) {
						$this.val("")
					}
				}).on('blur', function(){
					if (!$this.val()) {
						$this.val(defaultValue)
					}
				})
		})
	},

	toggleLang : function($el){
		
		$el.slideToggle()
	},

	resizeBg : function(){

		var $image = $('img.bg'),
			 image_width = $image.width(), 
			 image_height = $image.height(),     

			 over = image_width / image_height, 
			 under = image_height / image_width, 

			 body_width = $('body').width(), 
			 body_height = $('body').height()


			if (body_width / body_height >= over) { 
				$image.css({ 
					'width': body_width + 'px', 
					'height': Math.ceil(under * body_width) + 'px', 
					'left': '0px', 
					'top': Math.abs((under * body_width) - body_height) / -2 + 'px' 
				}); 

			}else { 
				$image.css({ 
					'width': Math.ceil(over * body_height) + 'px', 
					'height': body_height + 'px', 
					'top': '0px', 
					'left': 0 

				}); 
				// Exception calcul du background welcome
				hermes.selector.$welcome
					.find('.bg')
					.css('left', Math.abs((over * body_height) - body_width) / -2 + 'px')
			} 
	},

	spritely : function(el){
		// Animation du sprite

		var frame = 1,
			step = 21,
			left = 150,
			top = 0

		function animSprite(){
			hermes.selector.$ball.css('backgroundPosition','-'+(frame * left +140)+'px -'+top+'px');	  
	        frame++;
	        if(frame == step-1){
	        	frame = 0
	        } 
		}
		
		var sprite = setInterval(animSprite,70);
	},

	loading : function($el){
		$el.fadeOut(300)
	},

	/* PHASE INIT */

	initDomReady : function(){
		hermes.ajaxCall()
	},

	initQuizzLoaded : function(){
		hermes.questionLength()
		hermes.startQuestion()
		hermes.slideQuestion.questionCount()
		hermes.slideQuestion.isTxtareaEmpty($('.question.active  textarea'))
		hermes.slideQuestion.isChecked($('.question.active .custom-checkbox'))
		hermes.slideQuestion.isThereNextOrPrev()
	},

	initWelcomeLoaded : function(){
		hermes.checkform()	
		hermes.placeHolder()
		hermes.video()
		hermes.resizeBg()
	},

	initWinLoad: function(){
		hermes.loading($('.loading'))
	}
}

/*EVENTS */

	// DOC READY
	$(document).ready(function(){
		hermes.initDomReady()
	})
	// WINDOW LOAD
	$(window).load(function(){
		hermes.initWinLoad()
	})

	// EVENT AFTER TEMPLATING
	$(document).one('welcomeLoaded', function(){
		hermes.initWelcomeLoaded()
	}).one('quizzLoaded', function(){
		hermes.initQuizzLoaded()
	})

	// CLICK
	$(document).on('click','.custom-checkbox', function(){
		hermes.checkBox($(this))
		hermes.slideQuestion.isChecked($(this))
	}).on('click','.active-lang', function(){
		hermes.toggleLang($(".lang-choice ul"))
	}).on('click','#save', function(){
    hermes.modal(hermes.selector.$savePopin)
	}).on('click','#save-path .action button', function(e){
		hermes.saveData(e)
	}).on('click','.prev, .next',  function(e){
		e.preventDefault()
		hermes.slideQuestion.slideDirection($(this),e)
	}).on('click', '#footer .last', function() {
    // lorsqu'on clique sur le bouton "CGU" dans le footer de la page d'accueil
    hermes.modal(hermes.selector.$cguPopin)
  }).on('click', '.popin-close', function() {
    hermes.selector.$cguPopin.fadeOut()
  })

	// KEYUP EVENT

	$(document).on('keyup','.question.active textarea', function(){
		hermes.slideQuestion.isTxtareaEmpty($(this))
	})

	// RESIZE EVENT

	$(window).resize(function(){ 
		hermes.resizeBg()
	})

/* UTIL FUNCTIONS */
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}

