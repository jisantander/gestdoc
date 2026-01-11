<?php /* Template Name: Single-tramite */ ?>
<?php get_header() ?>

<div id="sections">

<div id="sections">
    <div id="particles-js"></div>
      <section class="section--header">
        <div class="section__bg">
          <div class="bg"> <img src="img/uploads/case-3.jpeg"></div>
        </div>
        <div class="section__wrap section__wrap--case">
          <div class="section__body">
            <div class="cols">
              <div class="section__flex">
                <div class="col-md-12">
                  <div class="section__content">
                    <div class="section__content__flex">
                      <h1 class="section__title"><?php the_title(); ?>
                      </h1>
                    </div>
                    <div class="section__content__flex"></div>
                    <p class="section__description"><?php echo the_field('descripcion'); ?></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section--singlecase"> 
        <div class="section__wrap section__wrap--xs">
          <div class="section__body">
            <div sticky class="section__nav">
              <div class="section__nav__sticky">
                <ul>
                  <?php while (have_rows('pestanas')) : the_row(); ?>
                    <li><a href="#" data-goto=".section__content--case:nth-child(<?php echo get_row_index() + 1; ?>)"><span class="fa <?php the_sub_field('icono_de_la_pestana'); ?>"></span> <?php the_sub_field('nombre_de_la_pestana'); ?></a></li>
                  <?php endwhile; ?>
                </ul>
              </div>
            </div>

            <?php $index = 1; ?>
            <?php while (have_rows('pestanas')) : the_row(); ?>
              <div class="section__content section__content--case wp">
                <h3 class="section__title"><?php the_sub_field('nombre_de_la_pestana'); ?></h3>
                <p class="section__description"><?php the_sub_field('descripcion'); ?></p>
              </div>
              <?php $index++; ?>
            <?php endwhile; ?>

          </div>
          <div class="section__footer"> 
            <div class="section__button"><a id="<?php the_field('id_bpmn'); ?>" class="btn btn--white">Empezar trámite</a></div>
          </div>
        </div>
      </section>
    </div>
</div>


<?php get_footer() ?>

