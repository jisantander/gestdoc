<?php /* Template Name: Tramites */ ?>
<?php get_header() ?>

<div id="sections">
      <section class="section--infoboxes section--infoboxes--business">
        <div class="section__wrap">
          <div class="section__header"> 
            <h3 class="section__title">Tu aliado legal: <span>Trámites</span> eficientes y asesoría personalizada.</h3>
            <p class="section__description">Facilisis facilisis viverra blandit quam nibh accumsan tristique etiam pharetra. Accumsan pellentesque eget aliquet class dictumst tellus suspendisse cursus sapien. Gravida convallis odio morbi aenean phasellus tincidunt mi feugiat odio. Mattis quis quisque curae consequat orci fusce dictum laoreet elementum duis tellus sagittis per pulvinar.</p>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--top">
        <div class="section__wrap">
          <div class="section__top">
            <div class="section__image dscroll"> <img src="<?php echo get_field('imagen_1'); ?>"></div>
            <div class="section__body dscroll">
              <h4 class="section__title">Vamos a la notaria por ti.</h4>
              <p class="section__descriptione">Deja en nuestras manos la gestión de tus trámites notariales. Nos ocupamos de todo el proceso, desde la preparación y revisión de documentos hasta la firma y entrega. Confía en nuestro equipo profesional para simplificar tus trámites y brindarte tranquilidad</p><a href="<?php echo site_url( '/Notaria/' ); ?>" class="btn">Ver tramite </a>
            </div>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--middle">
        <div class="section__wrap">						
          <div class="section__middle">
            <div class="section__image dscroll"> <img src="<?php echo get_field('imagen_2'); ?>"></div>
            <div class="section__body dscroll">
              <h4 class="section__title">Agilizamos demandas por mora en arreindos</h4>
              <p class="section__description">Externalización de los servicios masivos y uso del sistema para control. También permite gestionar procesos masivos internos.</p><a href="<?php echo site_url( '/Demandas/' ); ?>" class="btn">Ver tramite </a>
            </div>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--bottom">
        <div class="section__wrap">
          <div class="section__bottom">
            <div class="section__image dscroll"> <img src="<?php echo get_field('imagen_3'); ?>"></div>
            <div class="section__body dscroll">
              <h4 class="section__title">Gestionamos facturas impagas</h4>
              <p class="secction__description">Si tienes algun problema para obtener un documento o simplemente no sabes como rellenar los campos de un formulario, no te preocupes, contarás con la asesoria en tiempo real de abogaodos expertos que te ayudaran con todo lo que tu necesites.</p><a href="<?php echo site_url( '/Facturas/' ); ?>" class="btn">Ver tramite</a>
            </div>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--middle">
        <div class="section__wrap">						
          <div class="section__middle">
            <div class="section__image dscroll"> <img src="<?php echo get_field('imagen_4'); ?>"></div>
            <div class="section__body dscroll">
              <h4 class="section__title">Agrega un adjunto o un anexo a un documento</h4>
              <p class="section__description">Externalización de los servicios masivos y uso del sistema para control. También permite gestionar procesos masivos internos.</p><a href="<?php echo site_url( '/Anexos/' ); ?>" class="btn">Ver tramite </a>
            </div>
          </div>
        </div>
      </section>
      <section class="section--contactus"> 
        <div class="section__wrap"> 
          <div class="section__body">	
            <h5 class="section__toptitle">No esperes mas</h5>
            <h3 class="section__title">Te gustaria conocer todos los beneficios que Gestdoc puede traerle a tu negocio?</h3>
            <p class="section__description">Tempor ornare morbi praesent mi quam dapibus placerat semper sed. Curae varius nunc duis laoreet tempor litora pretium volutpat vehicula fusce ut phasellus leo ante nec phasellus accumsan morbi sollicitudin.
            </p><a href="#" class="btn">Contactanos</a>
          </div>
        </div>
      </section>
      <div class="login">
        <div class="login__back"></div>
        <div class="login__front login__front--login">
          <div class="login__box">
            <div class="login__icon"><img src="img/icons/logo-gestdoc.png"></div>
            <div class="login__form">
              <form class="form">
                <div class="form__element">
                  <div class="form__input">
                    <input type="email" placeholder="Mail">
                  </div>
                </div>
                <div class="form__element">
                  <div class="form__input">
                    <input type="password" placeholder="Clave">
                    <button class="btn">Entrar</button>
                  </div>
                </div>
                <div class="form__element form__element--center">
                  <label>
                    <input type="checkbox" name="#" value="#">Mantener mi sesión
                  </label>
                </div>
              </form>
            </div>
            <div class="login__footer"><a href="#" class="btn btn--link">Olvide mi contraseña</a><a href="#" class="btn btn--link">Registrarme</a></div>
            <p class="login__description">Aliquet consectetur semper dictum vivamus quis nec porta sapien felis. Suscipit duis duis praesent interdum duis curae condimentum potenti sed potenti magna augue suspendisse velit.
            </p>
          </div>
        </div>
        <div class="login__front login__front--register">
          <div class="login__box">
            <div class="login__icon"><img src="img/icons/logo-gestdoc.png"></div>
            <div class="login__form">
              <form class="form">
                <div class="form__element">
                  <div class="form__input">
                    <input type="email" placeholder="Mail">
                  </div>
                </div>
                <div class="form__element">
                  <div class="form__input">
                    <input type="password" placeholder="Clave">
                    <button class="btn">Registrar</button>
                  </div>
                </div>
                <div class="form__element form__element--center">
                  <label>
                    <input type="checkbox" name="#" value="#">Acepto los términos y condiciones
                  </label>
                </div>
              </form>
            </div>
            <div class="login__footer"><a href="#" class="btn btn--link">Olvide mi contraseña</a><a href="#" class="btn btn--link">Ingresar</a></div>
            <p class="login__description">Et molestie non velit arcu orci velit consectetur diam lobortis. Suscipit massa hendrerit fermentum elit semper leo varius ac inceptos scelerisque suspendisse arcu cursus eu.
            </p>
          </div>
        </div>
      </div>
    </div>
</div>


<?php get_footer() ?>

