<!DOCTYPE html>
 <html lang="en">
 <head>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-W8KHZTB');</script>
 	<meta charset="UTF-8">
 	<meta name="viewport" content="width=device-width, initial-scale=1">
 	<link rel="stylesheet" href="">
  <meta name="google-site-verification" content="_x3s8TsICabZ8mDbCVzeP1_YHYz_5qPBaXxQXxpfR7g" />
 	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="expires" content="0">
	<link rel="icon" href="<?php echo get_template_directory_uri(); ?>/img/bogado-favicon.png" type="image/png">
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/main.css">
	<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;0,800;0,900;1,400;1,700&amp;display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <title><?php the_title(); ?> | Gestdoc</title>
  <link href="<?php echo get_template_directory_uri(); ?>/img/favicon.png" rel="shortcut icon">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0">
 	<?php wp_head(); ?>
 </head>
 <body>
 <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W8KHZTB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
 <header>
      <div class="header__primary">
        <div class="header__wrap">
          <div class="header__search">
            <form action="search.html" method="get"><span class="fa fa-search"></span>
              <input type="text" name="s" placeholder="Buscar caso de éxito">
            </form>
          </div>
          <div class="header__inner">
            <div class="header__logo header__logo--color"><a href="#"><img src="<?php echo get_template_directory_uri(); ?>/img/logos/logo-gestdoc.png"></a></div>
            <div class="header__logo header__logo--white"><a href="#"><img src="<?php echo get_template_directory_uri(); ?>/img/logos/logo-gestdoc.png"></a></div>
            <div class="header__nav">
              <div class="header__nav__bg"></div>
              <div class="header__nav__nav">
                <div class="header__nav__close">
                  <div></div>
                  <div></div>
                </div>
                <div class="header__nav__back">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <nav>
                  <?php wp_nav_menu(array('theme_location'=>'top-menu', 'container' =>'ul')); ?>
                </nav>
              </div>
            </div>
            <div class="header__right">
              <div class="header__item header__item--search--mobile">
                <!--span.fa.fa-search-->
              </div>
              <div class="header__item header__item--button"><a href="https://admin.gestdoc.cl/" target="_blank" class="btn">Acceder</a></div>
              <div class="header__item header__item--ham">
                <div class="header__ham"><span></span><span></span><span></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
