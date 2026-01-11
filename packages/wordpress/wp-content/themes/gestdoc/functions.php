<?php

//funcion para crear los menus del sitio

function register_menus() {


    $locations = array(
		'top-menu'	 => 'Main top menu',
        'footer_uno' => 'Footer menu uno',
        'footer_dos' => 'Footer menu dos',
		'footer_tres' => 'Footer menu tres',
    );
    register_nav_menus( $locations );
}
add_action( 'init', 'register_menus' );


/*
* Plugin Name: Registro de taxonomías para documentos
* Version: 1.0
*/


add_action( 'init', 'custom_post_type_func' );
function custom_post_type_func() {
    //posttypename = services
	$labels = array(
		'name' => _x( 'Documentos', 'documentos' ),
		'singular_name' => _x( 'documentos', 'documentos' ),
		'add_new' => _x( 'Crear Documento', 'services' ),
		'add_new_item' => _x( 'Crear Nuevo Documento', 'documentos' ),
		'edit_item' => _x( 'Editar docuemento', 'documentos' ),
		'new_item' => _x( 'Nuevo documentos', 'documentos' ),
		'view_item' => _x( 'Ver Documento', 'documentos' ),
		'search_items' => _x( 'Buscar Documento', 'documentos' ),
		'not_found' => _x( 'Documento no encontrado', 'documentos' ),
		'not_found_in_trash' => _x( 'Documentos no encontrados ', 'documentos' ),
		'parent_item_colon' => _x( 'Parent services:', 'documentos' ),
		'menu_name' => _x( 'Documentos', 'documentos' ),
	);
	$args = array(
		'labels' => $labels,
		'hierarchical' => true,
		'description' => 'Hi, this is my custom post type.',
		'supports' => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'trackbacks', 'custom-fields', 'comments', 'revisions', 'page-attributes' ),
		'taxonomies' => array( 'category', 'post_tag', 'page-category' ),
		'public' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => true,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'has_archive' => true,
		'query_var' => true,
		'can_export' => true,
		'rewrite' => true,
		'capability_type' => 'post'
	);
	register_post_type( 'documentos', $args );
}

define('ALLOW_UNFILTERED_UPLOADS', true);

// Allow SVG uploads (PERMITE AÑADIR ARCHIVOS SVG, POR DEFECTO SE RECHAZAN POR SEGURIDAD)
function allow_svgimg_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'allow_svgimg_types');


wp_enqueue_script('jquery');

function buscar_documentos_ajax() {
    $search_term = $_POST['search_term']; // Obtener el término de búsqueda del formulario

    // Consulta de búsqueda
    $args = array(
        'post_type' => 'documentos', // Tipo de contenido "documentos"
        's' => $search_term, // Término de búsqueda
        'posts_per_page' => -1 // Mostrar todos los resultados
    );

    $query = new WP_Query($args);

    // Salida de resultados
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			
			// Obtener campos personalizados de ACF
			$details = get_field('details');
			$price = get_field('price');
			$que_es_y_para_que_sirve = get_field('que_es_y_para_que_sirve');
			$requisitos = get_field('requisitos');

			echo '<div class="section__buscador">';
			echo '<a href="' . get_permalink() . '">';
			echo get_the_title();
			echo '</a>';
			echo '<div class="article__info">';
			echo 	'<div class="section__faq">';
			echo 		'<div class="faq">';
			echo 			'<div class="faq__item">';
			echo 				'<h3 class="faq__question1"><span class="fa fa-angle-down"></span> ¿Qué es y para qué sirve?</h3>';
			echo 				'<div class="faq__answer1" style="display: none;">';
			echo					'<div class="section__content">';
			echo 						'<p class="section__description">' . $que_es_y_para_que_sirve . '</p>';
			echo 					'</div>';
			echo 				'</div>';
			echo 			'</div>';
			echo		'</div>';
			echo	'</div>';
			echo'</div>';
			echo '</div><br>';
		}
	} else {
		echo 'No se encontraron resultados.';
	}

	echo '<script>';
	echo 'jQuery(document).ready(function($) {';
	echo '    $(".faq__question1").click(function() {';
	echo '        var answer = $(this).next(".faq__answer1");';
	echo '        answer.slideToggle();';
	echo '        $(this).toggleClass("active");';
	echo '    });';
	echo '});';
	echo '</script>';

    wp_reset_postdata();
    wp_die(); // Terminar la ejecución
}
add_action('wp_ajax_buscar_documentos', 'buscar_documentos_ajax');
add_action('wp_ajax_nopriv_buscar_documentos', 'buscar_documentos_ajax');
