<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7 lt-ie10"> <![endif]-->
<!--[if IE 7]>         <html class="no-js ie7 lt-ie9 lt-ie8 lt-ie10"> <![endif]-->
<!--[if IE 8]>         <html class="no-js ie8 lt-ie9 lt-ie10"> <![endif]-->
<!--[if IE 9]>         <html class="no-js ie9 lt-ie10"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
 
    <title>Hermes - La maison des Carrés</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
       
    <!--[if lt IE 9]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="shortcut icon" type="image/x-icon" sizes="32x32" href="favicon.ico">

    <script src="js/modernizr/modernizr-2.6.2.min.js"></script>
</head>
<body>
    <div class="wrapper">
        <div class="loading"></div> 
        <div class="video-wrap"></div> 
        <section id="welcome">
            <img src='img/welcome-bg.jpg' class="bg" alt='HERMES'/>
            <h1 class="logo"><a href="#"><img src="img/hermes-logo.png"/></a></h1>
            <div class="lang-choice">
              <span class="active-lang">FR</span>
            </div>
        </section>
         <section id="quizz">
              <img src='' class="bg" alt='HERMES'/>
              <div class='floatingcloud'>
                 <img src='img/nuage.gif'/>
              </div>
              <div class='content'>
                 <div class="umbrellaguy">
                    <img src='img/umbrella.gif' />
                 </div>
                 <div class="count-question"></div>
                 <div id="ball"></div>
                 <form action='#' id="quizz-form" method='post'>
                     <ul class="slide-question"></ul>
                 </form>
                 <div id="menu" class="rel">
                     <div class="progress">
                         <span></span>
                     </div>
                     <nav class="quizz-nav">
                          <ul>
                              <li>
                                  <a href="#" class="prev" data-dir='prev'>prev</a>
                              </li>
                              <li>
                                  <a href="#" class='next faded' data-dir='next'>next</a>
                              </li>
                          </ul>
                      </nav>
                  </div>
                  <div id="congratulations"></div>
              </div>
          </section> 
    </div>
   <footer id="footer"></footer>
   <section class="modal" id="save-path"></section>
   <section class="modal" id="cgu-popin">
     <div class="content">
       <h3 class="cgu-title"></h3>
       <article class="cgu-text"></article>
       <div class="action txtcenter">
         <button class="popin-close">OK</button>
       </div>
     </div>
   </section>

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

    <script src="js/libs.js"></script>
    <script src="js/main.js"></script>

</body>
</html>
