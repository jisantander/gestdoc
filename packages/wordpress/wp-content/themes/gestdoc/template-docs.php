<?php /* Template Name: Docs */ ?>
<?php get_header() ?>
  <div id="sections">
    <section class="section--header">
      <div class="section__wrap">
        <div class="section__primary">
          <h1 class="section__title">Encuentra el <span>trámite</span> que buscas</h1>
          <p class="section__description">Sobre 100 documentos preformateados para que utilices el que buscas.
          </p>
        </div>
        <div class="cols">
          <div class="col-xs-12 col-md-6 dscroll">
            <article class="article--fast">
              <div class="article__tag">Mas popular</div>
              <div class="article__icon"><img src="<?php echo get_template_directory_uri(); ?>/img/gif/magnifying-glass.gif"></div>
              <div class="article__body">
                <h5 class="article__title"><a href="#caja_busqueda">Documentos disponibles</a></h5>
              </div>
            </article>
          </div>
          <div class="col-xs-12 col-md-6 dscroll">
            <article class="article--fast">
              <!--.article__tag-->
              <div class="article__icon"><img src="<?php echo get_template_directory_uri(); ?>/img/gif/upload.gif"></div>
              <div class="article__body">
                <h5 class="article__title"><a id="62e8882fbca8bc36e07cf997" class="btn btn--white btn--subir">Subir documento</a></h5>
              </div>
            </article>
          </div>
        </div>
        <div class="section__secondary dscroll">
          <div class="section__search">
            <div class="section__search__text">Más de 35 mil documentos emitidos</div>
            <form id="search-form">
            <input type="text" id="search-input" placeholder="Buscar documentos...">
            <div class="section__search__button"><img src="<?php echo get_template_directory_uri(); ?>/img/icons/search.svg"></div>
            <div id="search-results"></div>
        </form>
        <script>
            jQuery(document).ready(function($) {
                var searchTimer;
                var prevSearchTerm = '';
            
                $('#search-input').on('input', function() {
                    clearTimeout(searchTimer);
                    var searchTerm = $(this).val();
                
                    if (searchTerm.length > 0 && searchTerm !== prevSearchTerm) {
                        searchTimer = setTimeout(function() {
                            $.ajax({
                                url: '<?php echo admin_url('admin-ajax.php'); ?>',
                                type: 'POST',
                                data: {
                                    action: 'buscar_documentos',
                                    search_term: searchTerm
                                },
                                success: function(response) {
                                    $('#search-results').html(response);
                                }
                            });
                        }, 500);
                    } else {
                        $('#search-results').empty();
                    }
                  
                    prevSearchTerm = searchTerm;
                });
            });
        </script>
          </div>
        </div>
      </div>
    </section>
    <section class="section--docs" id="caja_busqueda">
      <div class="section__wrap section--md">
        <div class="section__header section__header--center"> 
          <h3 class="section__title">Categorías</h3>
          <div class="section__filters filters dscroll">
          <?php
              $terms = get_terms( array(
                'taxonomy' => 'category',
                'hide_empty' => false, // default: true
              ) );
              
              if ( empty( $terms ) || is_wp_error( $terms ) ) {
                return;
              }
            
              echo '<ul data-filter-group="category" class="menu button-group">';
              echo '<li data-filter="*" class="section__filter current">Todos</li>';
            
              foreach( $terms as $term ) {
                echo '<li data-filter=".' . sanitize_title($term->name) . '" class="section__filter">' . esc_attr( $term->name ) . '</li>';
              }
            
              echo '</ul>';
              ?>
          </div>
        </div>
        <div class="section__body">
          <div class="cols cols-gutter-2 grid">
            
            <?php
                  $args = array(  
                      'post_type' => 'documentos',
                      'post_status' => 'publish',
                      'posts_per_page' => -1, 
                      'orderby' => 'title', 
                      'order' => 'ASC', 
                  );
                
                  $loop = new WP_Query( $args ); 
                
                  while ( $loop->have_posts() ) : $loop->the_post();
                
                      $categories = wp_get_object_terms( get_the_ID(), 'category', array( 'fields' => 'names' ) );
                      $categories_id = wp_get_object_terms( get_the_ID(), 'category', array( 'fields' => 'ids' ) );
                      $categories_slugs = wp_get_object_terms( get_the_ID(), 'category', array( 'fields' => 'slugs' ) );
                
                      $categories_classes = '';
                      foreach($categories_slugs as $category_slug) {
                        $categories_classes .= sanitize_title($category_slug) . ' ';
                      }
                  ?>

                    <div class="col-xs-12 col-md-12 <?php echo $categories_classes ?>">
                      <article id="regimen" class="article--doc">
                          <div class="article__icon"><img src="<?php echo get_field("icono", "category_".$categories_id[0]); ?>"></div>
                          <div class="article__body">
                            <div class="article__left">
                              <h5 class="article__title"><p><?php the_title(); ?></p></h5>
                              <div class="article__info"> 
                                <div class="section__faq"> 
                                  <div class="faq">
                                    <div class="faq__item">
                                      <h3 class="faq__question"><span class="fa fa-angle-down"></span> ¿Qué es y para qué sirve?</h3>
                                      <div class="faq__answer">
                                        <div class="section__content"> 
                                          <p class="section__description"><?php echo get_field("que_es_y_para_que_sirve"); ?>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="article__right">
                              <div class="article__valores">
                                <div>
                                    <h5 class="article__firmasimple">Firma Simple: <?php echo get_field("valor_firma_simple"); ?></h5>
                                    <h5 class="article__firmaavanzada">Firma Avanzada: <?php echo get_field("valor_firma_avanzada"); ?></h5>
                                    <h5 class="article__disclaimer">(El valor considera dos firmantes)</h5>
                              </div>
                            </div>
                            <div class="article__button"><a class="btn" href="<?php the_permalink(); ?>">Ver trámite</a></div>
                             <!--a data-modal-docs class="btn btn--link-xs"><-?php echo implode(', ', $categories) ?></a-->
                          </div>
                      </article>
                    </div>
                    
                  <?php

                  endwhile;
                
                  wp_reset_postdata(); 
          ?>
          </div>
        </div>
      </div>
    </section>

<?php get_footer() ?>