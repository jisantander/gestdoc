<?php /* Template Name: Businesses */ ?>
<?php get_header() ?>

    <div id="sections">
      <section class="section--infoboxes section--infoboxes--business">
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
                <div class="col-md-4 col-xs-6 dscroll">
                    <article class="article--feature">
                      <div class="article__image"><img src="<?php echo $caja['icono_caja']; ?>" alt=""></div>
                      <p class="article__description"><?php echo $caja['descripcion_caja']; ?></p>
                    </article>
                </div>
                <?php } ?>
              <?php } ?>
              </div>
            </div>
          </div>
        </div>
      </section>
    <section class="section--faq">
        <div class="section__wrap">
            <div class="section__header">
                <h2 class="section__title">Como funciona nuestro <span>software</span></h2>
                <p class="section__description">Luctus habitasse quisque vestibulum cubilia ut ultrices eros consequat
                    inceptos. Primis luctus accumsan tristique fringilla lacus auctor pulvinar pharetra vulputate metus
                    varius fusce eget etiam dui suscipit bibendum tempus convallis.
                </p>
            </div>
            <div class="section__body">
                <div class="cols">
                    <div class="col-md-6 dscroll">
                        <div class="section__faq">
                            <div class="faq">
                                <?php
                    $cajas_tutorial = get_field('caja_tutorial');
                    if ($cajas_tutorial) {
                        foreach ($cajas_tutorial as $caja) {
                    ?>
                                <div class="faq__item">
                                    <h3 class="faq__question"><span class="fa fa-angle-down"></span><?php echo $caja['titulo_paso']; ?></h3>
                                    <div class="faq__answer">
                                        <div class="section__content">
                                            <p class="section__description"><?php echo $caja['descripcion_paso']; ?></p>
                                        </div>
                                    </div>
                                </div>
                                <?php } ?>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 dscroll">
                        <div class="section__gifs">
                            <?php
                                $i = 0; // Inicializar el contador
                                $cajas_tutorial = get_field('caja_tutorial');
                                if ($cajas_tutorial) { 
                                  foreach ($cajas_tutorial as $caja) {
                            ?>
                            <div class="section__gif <?php if($i == 0){ echo "section__gif--show";}?>">
                              <img src="<?php echo $caja['video_paso']; ?>">
                            </div>

                            <?php
                              $i++; 
                                      }
                                 }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
      <section class="section--plans">
        <div class="section__wrap section--md">
          <div class="section__header">
            <div class="section__title"><?php the_field('titulo_planes')?></div>
          </div>
          <div class="section__body">
            <div class="cols cols--0 cols--scroll">
                <?php
                  $i = 0; // Inicializar el contador
                  $carta_planes = get_field('carta_planes');
                  if ($carta_planes) { 
                    foreach ($carta_planes as $carta) {
                ?>
                <div class="col-md-4 dscroll">
                  <article class="article--plan <?php if($i == 1){ echo "article--plan--grow";}?>">
                  <div class="article__tag">Plan Popular</div>
                  <div class="article__header">
                      <div class="article__icon"><img src="<?php echo $carta['icono_plan']; ?>"></div>
                      <h3 class="article__title"><?php echo $carta['titulo_plan']; ?></h3>
                  </div>  
                    <div class="article__body"><?php echo $carta['lista_plan']; ?></div>
                    <div class="article__footer"> 
                      <div class="article__price"><span class="article__price"><?php echo $carta['precio_plan']; ?></span><span class="article__month">/mes</span></div><a href="<?php echo site_url( '/Contacto/' ); ?>" class="btn btn--plan"><?php echo $carta['boton_plan']; ?></a>
                    </div>
                  </article>
                </div>
                  <?php
                    $i++; 
                      }
                    }
                  ?>
                  
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section--table">
        <div class="section__wrap section--md"> 
          <div class="section__body">
            <div>
              <?php echo do_shortcode(get_field('shortcode_tabla_planes')); ?>
             </div>
          </div>
          <div class="section__footer"><a href="#" class="btn">Solicita tu demo</a></div>
        </div>
      </section>
      <section class="section--partners">
        <div class="section__wrap"> 
          <article class="article--partners">
            <div class="article__image"><img src="<?php echo get_field('partner_1'); ?>"></div>
            <div class="article__image"><img src="<?php echo get_field('partner_2'); ?>"></div>
            <div class="article__image"><img src="<?php echo get_field('partner_3'); ?>"></div>
            <div class="article__image article__image--resit"><img src="<?php echo get_field('partner_4_resit'); ?>"></div>
            <div class="article__image"><img src="<?php echo get_field('partner_5'); ?>"></div>
          </article>
        </div>
      </section>
      <?php
          $i = 0; // Inicialize the counter
          $contenedor = get_field('contenedor_modulos');
          if ($contenedor) { 
            foreach ($contenedor as $modulo) {
        ?>
          <section class="<?php switch($i){case 0: echo "section--features section--features--person--top"; break;
                                               case 1: echo "section--features section--features--person--middle"; break;
                                               case 2: echo "section--features section--features--person--bottom"; break; } ?>">
            <div class="section__wrap">  
              <div class="<?php switch($i){ case 0: echo "section__top"; break;
                                            case 1: echo "section__middle"; break;
                                            case 2: echo "section__bottom"; break; } ?>">
              <div class="section__image dscroll"> 
                <img src="<?php echo $modulo['imagen_modulo']; ?>">
              </div>
              <div class="section__body dscroll">
                <h4 class="section__title"><?php echo $modulo['titulo_modulo']; ?></h4>
                <p class="section__description"><?php echo $modulo['descripcion_modulo']; ?></p>
              </div>
            </div>
          </section>
          <?php
            $i++; 
              }
            }
          ?>
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
            <p class="login__description">Sed aenean commodo varius tortor himenaeos turpis litora velit turpis. Non quisque vel quam donec felis mauris varius elit eget per sagittis aenean per donec.
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
            <p class="login__description">Fringilla felis pellentesque duis sollicitudin nisl sed hac eu molestie. Cras mi inceptos nec placerat rutrum elementum nisi maecenas vehicula molestie pulvinar pulvinar pharetra nunc.
            </p>
          </div>
        </div>
      </div>
    </div>
<?php get_footer() ?>