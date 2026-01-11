<?php get_header() ?>

<div id="sections">
      <section class="section--header">
        <div class="section__wrap">
          <div class="section__header">
            <h1 class="section__title"><?php the_title()?></h1>
          </div>
        </div>
      </section>
      <section class="section--singledoc">
        <div class="section__wrap section--md">
          <div class="section__body">
            <div class="section__boxs">
              <div class="section__box">
                <div class="cols"> 
                  <div class="col-md-12">
                    <div class="section__content section--center">
                      <h3 class="section__title">Descripción del documento</h3>
                      <p class="section__description" style="text-align:left;"><?php the_field('descripcion')?></p>
                    </div>
                  </div>
                  <div class="col-md-12"> 
                    <div class="section__footer">
                      <div class="cols">
                        <div class="col-md-6">
                          <div class="section__faq"> 
                            <div class="faq">
                              <div class="faq__item">
                                <h3 class="faq__question"><span class="fa fa-angle-down"></span>Detalle de Requisitos</h3>
                                <div class="faq__answer">
                                  <div class="section__content"> 
                                    <p class="section__description"><?php the_field('requisitos')?></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="section__laststep">
                            <div class="section__valor">
                              <h4 class="section__title">Valor del trámite:</h4>
                              <p class="section__description">Firma Simple <br><?php the_field('valor_firma_simple')?></p>
                              <p class="section__description"> Firma Avanzada <br><?php the_field('valor_firma_avanzada')?></p>
                            </div>
                            <div class="section__button"><a id="<?php the_field('id_bpmn')?>" class="btn btn--white">Empezar trámite</a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section--related" style="padding:50px 0px;"> 
        <div class="section__wrap section--md">
          <div class="section__body">
            <div class="section__content"> 
              <h3 class="section__title">Documentos Relacionados</h3>
            </div>
            <div class="section__slides"> 
              <div class="cols cols--0 sliderscroll">
                <?php
                  $documentos_destacadas = get_field('documentos_relacionados');
                  if ($documentos_destacadas) {
                    foreach ($documentos_destacadas as $documento) {
                      $titulo = get_field('titulo', $documento);
                      $url = get_permalink($documento);
                      $categories = get_the_category($documento);
                      $category_names = '';
                      if (!empty($categories)) {
                        foreach ($categories as $category) {
                          if (!empty($category_names)) {
                            $category_names .= ', ';
                          }
                          $category_names .= $category->name;
                        }
                      }
                      $category_image = '';
                      if (!empty($categories)) {
                        $category_image_id = get_term_meta($categories[0]->term_id, 'icono', true);
                        if ($category_image_id) {
                          $category_image = wp_get_attachment_image($category_image_id, 'thumbnail');
                        }
                      }
                      echo '<div class="col-xs-12 col-md-4" style="padding:5px;">';
                      echo '<article id="regimen" class="article--doc">';
                      echo '<div class="article__icon">' . $category_image . '</div>';
                      echo '<div class="article__body">';
                      echo '<h5 class="article__title"><a href="'. $url .'">'. $titulo .'</a></h5>';
                      echo '<a data-modal-docs class="btn btn--link-xs">' . $category_names . '</a>';
                      echo '</div>';
                      echo '</article>';
                      echo '</div>';
                    }
                  }
                ?>
              </div>
            </div>
          </div>
        </div>
      </section>

</div>
<?php get_footer() ?>