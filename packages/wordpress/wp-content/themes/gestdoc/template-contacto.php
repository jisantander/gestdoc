<?php /* Template Name: Contacto */ ?>
<?php get_header() ?>
<div id="sections">
      <section class="section--contact">
        <div class="section__wrap section__wrap--sm">
          <div class="section__header">
            <h3 class="section__title"><?php the_field('titulo_principal')?></h3>
            <p class="section__description"><?php the_field('subtitulo_principal')?></p>
          </div>
          <div class="section__body">
            <div class="cols">
              <div class="section__flex">
                <div class="col-md-5">
                  <div class="section__dates">
                    <h4 class="section__title"><?php the_field('titulo_secundario')?></h4>
                    <p class="section__description"><?php the_field('parrafo_secundario')?></p>
                  </div>
                </div>
                <div class="col-md-7">
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
          </div>
        </div>
      </section>
  </div>

<?php get_footer() ?>