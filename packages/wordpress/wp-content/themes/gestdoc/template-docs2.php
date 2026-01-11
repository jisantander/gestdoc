<?php /* Template Name: Docs2 */ ?>
<?php get_header() ?>
<div id="sections">
      <section class="section--header">
        <div class="section__wrap">
          <div class="section__primary">
            <h1 class="section__title">Encuentra el <span>tramite</span> que buscas</h1>
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

<?php get_footer() ?>