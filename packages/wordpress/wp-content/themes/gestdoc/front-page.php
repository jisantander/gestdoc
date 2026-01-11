<?php /* Template Name: Home */ ?>
<?php get_header() ?>

  <div id="sections">
      <section class="section--main">
        <div class="section__primary">
            <div class="section__wrap section__wrap--main">
                <div class="section__body dscroll">
                    <h1 class="section__title"><?php the_field('titulo_principal')?></h1>
                    <p class="section__description"><?php the_field('subtitulo_principal')?></p><a
                        href="<?php echo site_url( '/docs/' ); ?>" class="btn"><?php the_field('boton_principal')?></a>
                    <!--.section__search
              .section__search__results
              	input#search(type="text" placeholder="Buscar documento")
              .section__search__button
              	img(src="./img/icons/search.svg")
              -->
                </div>
                <div class="section__image dscroll"><img src="<?php the_field('icono_principal')?>"></div>
            </div>
        </div>
      </section>

      <section class="section--features">
        <div class="section__wrap">
            <div class="cols">
                <div class="col-md-6">
                    <div class="section__articles dscroll">
                        <div class="section__upper">
                            <?php
                    $i = 0; // Inicializar el contador
                    $cajas = get_field('cajas_informativas');
                    if ($cajas) {
                      foreach ($cajas as $caja) {
                        if ($i < 2) {
                  ?>
                            <article class="article--feature article--feature--index">
                                <div class="article__body">
                                    <div class="article__image"><img src="<?php echo $caja['icono_caja']; ?>"></div>
                                    <h4 class="article__title"><?php echo $caja['titulo_caja']; ?></h4>
                                    <p class="article__description"><?php echo $caja['descripcion_caja']; ?></p>
                                </div>
                            </article>
                            <?php
                        }
                        $i++;
                      }
                    }
                  ?>
                        </div>
                        <div class="section__lower">
                            <?php
                    $i = 0; // Inicializar el contador
                    $cajas = get_field('cajas_informativas');
                    if ($cajas) {
                      foreach ($cajas as $caja) {
                        if ($i >= 2) {
                  ?>
                            <article class="article--feature article--feature--index">
                                <div class="article__body">
                                    <div class="article__image"><img src="<?php echo $caja['icono_caja']; ?>"></div>
                                    <h4 class="article__title"><?php echo $caja['titulo_caja']; ?></h4>
                                    <p class="article__description"><?php echo $caja['descripcion_caja']; ?></p>
                                </div>
                            </article>
                            <?php
                        }
                        $i++;
                      }
                    }
                  ?>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="section__body dscroll">
                        <h5 class="section__uppertitle"><?php the_field('encabezado_superior_info')?></h5>
                        <h2 class="section__title"><?php the_field('titulo_bloque_informativo')?></h2>
                        <p class="section__content"><?php the_field('parrafo_bloque_informativo')?></p>
                        <a href="<?php echo site_url( '/Personas/' ); ?>"
                            class="btn"><?php the_field('boton_bloque_informativo')?><span
                                class="fa fa-external-link"></span></a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section class="section--partners">
        <div class="section__wrap">
            <article class="article--partners">
                <div class="article__image"><img src="<?php echo get_field('partner_1'); ?>"></div>
                <div class="article__image"> <img src="<?php echo get_field('partner_2'); ?>"></div>
                <div class="article__image"><img src="<?php echo get_field('partner_3'); ?>"></div>
                <div class="article__image article__image--resit"><img
                        src="<?php echo get_field('partner_4_resit'); ?>"></div>
                <div class="article__image"><img src="<?php echo get_field('partner_5'); ?>"></div>
            </article>
        </div>
      </section>
      <section class="section--faq">
        <div class="section__wrap">
            <div class="section__header">
                <h2 class="section__title">¿Cómo funciona el proceso de <span>firma</span>?</h2>
                <p class="section__description">Selecciona el documento que necesitas, el cual lo podrás personalizar de forma sencilla  formularios. En tan sólo segundos podrás enviarlo a quién necesites que firme y luego obtener un documento firmado por todas las personas involucradas.</p>
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
                                    <h3 class="faq__question"><span
                                            class="fa fa-angle-down"></span><?php echo $caja['titulo_paso']; ?></h3>
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
      <section class="section--docs section--docs--favorite">
        <div class="section__wrap"> 
          <div class="cols"> 
            <div class="col-md-12">
              <div class="section__favorite">
                <div class="section__header"> 
                  <h2 class="section__title section__title--favorites">Documentos más populares</h2>
                </div>
                <div class="section__body">
                <?php
                  $documentos_populares = get_field('documentos_populares');
                  if ($documentos_populares) {
                    foreach ($documentos_populares as $documento) {
                      $categories = wp_get_post_categories($documento);
                      $categories_id = array();
                      foreach ($categories as $category) {
                        $categories_id[] = $category;
                      }
                    
                      $icono_id = get_field("icono", "category_".$categories_id[0]);
                      $icono_url = wp_get_attachment_url($icono_id);
                    
                      $titulo = get_the_title($documento);
                      $url = get_permalink($documento);
                      ?>
                      <article class="article--doc article--doc--favorite">
                        <div class="article__body">
                          <div class="article__left">
                            <h5 class="article__title">
                              <p><?php echo $titulo; ?></p>
                            </h5>
                          </div>
                          <div class="article__button">
                            <a href="<?php echo $url; ?>" id="docbutton" class="btn">Detalles</a>
                          </div>
                        </div>
                      </article>
                      <?php
                    }
                  }
                  ?>
                </div>
              </div>
            </div>
            <!-- div class="col-md-6">
               <div class="section__articles dscroll"> 
                    <div class="section__header"> 
                      <h2 class="section__title section__title--favorites">Gestionamos todos tus tramites</h2> 
                    </div>
                    <div class="section__upper">
                      <article class="article--feature article--feature--index">
                        <div class="article__body">
                          <div class="article__image"><img src="<?php echo get_field('tramites')['icono_1']; ?>"></div>
                          <h4 class="article__title"><?php echo get_field('tramites')['tramite_1']; ?></h4>
                          <p class="article__description"><?php echo get_field('tramites')['descripcion_tramite_1']; ?></p>
                        </div>
                      </article>
                      <article class="article--feature article--feature--index">
                        <div class="article__body"> 
                          <div class="article__image"><img src="<?php echo get_field('tramites')['icono_2']; ?>"></div>
                          <h4 class="article__title"><?php echo get_field('tramites')['tramite_2']; ?></h4>
                          <p class="article__description"><?php echo get_field('tramites')['descripcion_tramite_2']; ?></p>
                        </div>
                      </article>
                    </div>
                    <div class="section__lower">
                      <article class="article--feature article--feature--index">
                        <div class="article__body">	
                          <div class="article__image"><img src="<?php echo get_field('tramites')['icono_3']; ?>"></div>
                          <h4 class="article__title"><?php echo get_field('tramites')['tramite_3']; ?></h4>
                          <p class="article__description"><?php echo get_field('tramites')['descripcion_tramite_3']; ?></p>
                        </div>
                      </article>
                      <article class="article--feature article--feature--index">
                        <div class="article__body"> 
                          <div class="article__image"><img src="<?php echo get_field('tramites')['icono_4']; ?>"></div>
                          <h4 class="article__title"><?php echo get_field('tramites')['tramite_4']; ?></h4>
                          <p class="article__description"><?php echo get_field('tramites')['descripcion_tramite_4']; ?></p>
                        </div>
                      </article>
                    </div>
                    <div class="section__footer"> <a href="<?php echo site_url( '/Tramites/' ); ?>" class="btn">Ir a tramites </a></div>
                  </div>
              </div>
            </div-->
        </div>
      </section>
      <section class="section--features section--features--2" style= "display:none;">
        <div class="section__wrap">
            <div class="cols">
                <div class="col-md-6 dscroll">
                    <div class="section__body">
                        <h5 class="section__uppertitle"><?php the_field('encabezado_superior_empresas')?></h5>
                        <h2 class="section__title"><?php the_field('titulo_modulo_empresas')?></h2>
                        <p class="section__content"><?php the_field('parrafo_modulo_empresas')?></p><a
                            href="<?php echo site_url( '/Empresas/' ); ?>"
                            class="btn"><?php the_field('botono_modulo_empresas')?></a>
                    </div>
                </div>
                <div class="col-md-6 dscroll">
                    <div class="section__image"> <img src="<?php echo get_field('icono_empresa'); ?>"></div>
                </div>
            </div>
        </div>
      </section>
      <section class="section--faq section--faq--index">
        <div class="section__wrap">
          <div class="section__header">
              <h2 class="section__title">¿Tienes consultas? ¡Escríbenos y te ayudamos!</h2>
            </div>
            <div class="cols">
                <div class="col-md-6">
                    <div class="section__image"><img src="<?php echo get_field('icono_faq'); ?>"></div>
                </div>
                <div class="col-md-6">
                    <!--div class="section__faq">
                        <div class="section__body">
                            <div class="section__faq">
                                <div class="faq">
                                    <?php
                                  $cajas_faq = get_field('modulo_preguntas_frecuentes');
                                  if ($cajas_faq) {
                                      foreach ($cajas_faq as $caja) {
                                ?>
                                    <div class="faq__item">
                                        <h3 class="faq__question"><span
                                                class="fa fa-angle-down"></span><?php echo $caja['pregunta']; ?></h3>
                                        <div class="faq__answer">
                                            <div class="section__content">
                                                <p class="section__description"><?php echo $caja['respuesta']; ?></p>
                                            </div>
                                        </div>
                                    </div>
                                    <?php } ?>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>
                    </div-->
                    <form class="section__form" action="https://app.formester.com/forms/f492418f-132c-4423-b40d-3946c790599a/submissions" method="POST"> 
                      <div class="cols"> 
                        <div class="col-md-6"> 
                          <div class="form__element"> 
                            <div class="form__title">Nombre</div>
                            <div class="form__input"> 
                              <input type="text" name="nombre">
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6"> 
                          <div class="form__element"> 
                            <div class="form__title">Apellido </div>
                            <div class="form__input"> 
                              <input type="text" name="apellido">
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6"> 
                          <div class="form__element"> 
                            <div class="form__title">Teléfono</div>
                            <div class="form__input"> 
                              <input type="text" name="phone">
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6"> 
                          <div class="form__element"> 
                            <div class="form__title">Email</div>
                            <div class="form__input"> 
                              <input type="text" name="mail">
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form__element"> 
                            <div class="form__title">Consulta</div>
                            <div class="form__input"> 
                              <textarea type="text" name="mensaje"></textarea>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form__button"> 
                            <button type="submit" class="btn">Enviar<span class="fa fa-angle-right"></span></button>
                          </div>
                        </div>
                      </div>
                    </form>
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
  </div>

</body>

<?php get_footer() ?>


