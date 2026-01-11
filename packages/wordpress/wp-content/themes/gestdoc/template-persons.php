<?php /* Template Name: Persons */ ?>
<?php get_header() ?>

<div id="sections">
      <section class="section--infoboxes section--infoboxes--person">
        <div class="section__wrap"> 
          <div class="section__header"> 
            <h3 class="section__title"><?php the_field('titulo_principal')?></h3>
            <p class="section__description"><?php the_field('subtitulo_principal')?></p>
          </div>
          <div class="section__body"> 
            <div class="cols">
                <?php
                    $cajas_descriptivas = get_field('cajas_descriptivas');

                    if($cajas_descriptivas) {
                        foreach($cajas_descriptivas as $caja) {
                ?>
                <div class="col-xs-12 col-md-4 dscroll">
                    <article class="article--feature article--feature--person">
                      <div class="article__image"><img src="<?php echo $caja['icono_caja']; ?>" alt=""></div>
                      <h4 class="article__title"><?php echo $caja['titulo_caja']; ?></h4>
                      <p class="article__description"><?php echo $caja['descripcion_caja']; ?></p>
                    </article>
                </div>
                <?php } ?>
              <?php } ?>
            </div>
          </div>
        </div>
      </section>
      <section class="section--partners">
        <div class="section__wrap"> 
          <article class="article--partners">
            <div class="article__image"><img src="<?php echo get_field('partner_1'); ?>"></div>
            <div class="article__image">		<img src="<?php echo get_field('partner_2'); ?>"></div>
            <div class="article__image"><img src="<?php echo get_field('partner_3'); ?>"></div>
            <div class="article__image article__image--resit"><img src="<?php echo get_field('partner_4_resit'); ?>"></div>
            <div class="article__image"><img src="<?php echo get_field('partner_5'); ?>"></div>
          </article>
        </div>
      </section>
      <section class="section--features section--features--person--top">
        <div class="section__wrap">
          <div class="section__top">
            <div class="section__image dscroll"> <img src="<?php echo get_template_directory_uri(); ?>/img/icons/buscar.gif"></div>
            <div class="section__body dscroll">
              <div class="section__number"> <span>1</span></div>
              <h4 class="section__title"><?php the_field('titulo_primer_paso')?></h4>
              <p class="secction__description"><?php the_field('descripcion_primer_paso')?></p><a href="<?php echo get_bloginfo('url'); ?>/docs" class="btn"><?php the_field('boton_primer_paso')?></a>
            </div>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--middle">
        <div class="section__wrap">						
          <div class="section__middle">
            <div class="section__body dscroll">
              <div class="section__number"> <span>2</span></div>
              <h4 class="section__title"><?php the_field('titulo_segundo_paso')?></h4>
              <p class="section__description"><?php the_field('descripcion_segundo_paso')?></p>
            </div>
            <div class="section__image dscroll"> <img src="<?php echo get_template_directory_uri(); ?>/img/gif/2.gif"></div>
          </div>
        </div>
      </section>
      <section class="section--features section--features--person--bottom">
        <div class="section__wrap">
          <div class="section__bottom">
            <div class="section__image dscroll"> <img src="<?php echo get_template_directory_uri(); ?>/img/gif/3-1.gif"></div>
            <div class="section__body dscroll">
              <div class="section__number"> <span>3</span></div>
              <h4 class="section__title"><?php the_field('titulo_tercer_paso')?></h4>
              <p class="section__description">T<?php the_field('descripcion_tercer_paso')?></p>
            </div>
          </div>
        </div>
      </section>
      <section class="section--contactus"> 
        <div class="section__wrap"> 
          <div class="section__body">	
            <h5 class="section__toptitle"><?php the_field('encabezado_superior')?></h5>
            <h3 class="section__title"><?php the_field('titulo_contacto')?></h3>
            <p class="section__description"><?php the_field('parrafo_contacto')?>
            </p><a href="<?php echo site_url( '/Contacto/' ); ?>" class="btn"><?php the_field('boton_contacto')?></a>
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
            <p class="login__description">Fusce lacinia placerat pellentesque vestibulum proin hendrerit himenaeos quisque curabitur. Fames etiam felis vel dictum turpis aenean a ultricies auctor donec himenaeos ut pretium ut.
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
            <p class="login__description">Donec aenean malesuada aliquam quisque sagittis proin metus vulputate bibendum. Urna fusce scelerisque curae massa commodo tincidunt semper lectus fames nam lacus non scelerisque ac.
            </p>
          </div>
        </div>
      </div>
    </div>

    <?php get_footer() ?>