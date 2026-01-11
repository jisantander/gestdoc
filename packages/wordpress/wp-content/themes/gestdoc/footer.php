</div><!-- #main .wrapper -->
<footer>
      <div class="footer__wrap">
        <div class="cols"> 
          <div class="footer__body">
            <div class="col-md-6">
              <div class="col-md-6 col-xs-12">
                <div class="footer__logo"><img src="<?php echo get_template_directory_uri(); ?>/img/icons/logo-gestdoc.svg"></div>
                <div class="footer__links footer__links--info">
                  <ul>
                    <li><span class="fa fa-envelope"></span><a href="#">contacto@resit.cl</a></li>
                    <li><span class="fa fa-phone"> </span><a href="#">+56 9 9579 3324</a></li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6"></div>
            </div>
            <div class="col-md-6">
              <div class="col-md-4 col-xs-12">
                <div class="footer__links">
                 <?php wp_nav_menu(array('theme_location'=>'top-menu', 'container' =>'ul')); ?>
                </div>
              </div>
              <div class="col-md-4 col-xs-12">
                <div class="footer__links">
                  <ul>
                    <li><a href="faq.html">Preguntas frecuentes</a></li>
                    <li><a href="<?php echo site_url( '/Contacto/' ); ?>">Contacto</a></li>
                  </ul>
                </div>
              </div>
              <div class="col-md-4 col-xs-12">
                <div class="footer__links">
                  <ul>
                    <li><a href="#">Legalidad</a></li>
                    <li><a href="#">Términos y condiciones</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12">
            <div class="footer__button"><a href="<?php echo site_url( '/Contacto/' ); ?>" class="btn">Contactanos </a></div>
          </div>
          <div class="col-md-6 col-xs-12">
            <div class="footer__socials">
            </div>
          </div>
          <!--.col-md-12 
          .footer__copyright   
          .footer__description Todos los derechos reservados Gestdoc S.A 2020. Huerfanos 1120 of 1408, Santiago, CHile
          -->
        </div>
      </div>
    </footer>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
  <?php wp_footer(); ?>
  <script src="<?php echo get_template_directory_uri(); ?>/js/main.js?v=89667" type="text/javascript"  ></script>
  <script src="<?php echo get_template_directory_uri(); ?>/js/selectpower.js?v=89667" type="text/javascript" ></script>
  <link rel="stylesheet" href="https://admin.alcsa.cl/im_livechat/external_lib.css"/>
  <iframe srcdoc="<!DOCTYPE html><html><head><link rel='stylesheet' href='<?php echo get_template_directory_uri(); ?>/css/odoo.css'></head><body><script type='text/javascript' src='https://admin.alcsa.cl/im_livechat/loader/1'></script><script type='text/javascript' src='https://admin.alcsa.cl/im_livechat/external_lib.js'></script></body></html>" width="320px" height="250"></iframe>
</body>
</html>
