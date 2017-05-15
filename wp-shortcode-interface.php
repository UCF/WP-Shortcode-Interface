<?php
/*
Plugin Name: WP Shortcode Interface
Description: Creates a form that provides the available parameters for defined shortcodes.
Version: 1.0.0
Author: UCF Web Communications
Tags: shortcode, wysiwyg, shortcode interface
License: GPL3
*/
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'WP_SCIF__PLUGIN_FILE', __FILE__ );
define( 'WP_SCIF__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_SCIF__INCLUDES_DIR', WP_SCIF__PLUGIN_DIR . '/includes' );
define( 'WP_SCIF__PLUGIN_URL', plugins_url( basename( dirname( __FILE__ ) ) ) );
define( 'WP_SCIF__STATIC_URL', WP_SCIF__PLUGIN_URL . '/static' );
define( 'WP_SCIF__INCLUDE_URL', WP_SCIF__PLUGIN_URL . '/includes' );
define( 'WP_SCIF__SCRIPT_URL', WP_SCIF__STATIC_URL . '/js' );
define( 'WP_SCIF__STYLES_URL', WP_SCIF__STATIC_URL . '/css' );

include_once 'admin/wp-scif-admin.php';
include_once 'includes/class-shortcode-interface.php';
include_once 'includes/wp-scif-config.php';

if ( ! function_exists( 'wp_scif_plugin_activated' ) ) {
    /**
     * Triggered when the plugin is activated.
     *
     * @author Jim Barnes
     * @since 1.0.0
     **/
    function wp_scif_plugin_activated() {
        return;
    }

    register_activation_hook( WP_SCIF__PLUGIN_FILE, 'wp_scif_plugin_activated' );
}

if ( ! function_exists( 'wp_scif_plugin_deactivated' ) ) {
    /**
     * Triggered when the plugin is deactivated.
     * 
     * @author Jim Barnes
     * @since 1.0.0
     **/
    function wp_scif_plugin_deactivated() {
        return;
    }

    register_deactivation_hook( WP_SCIF__PLUGIN_FILE, 'wp_scif_plugin_deactivated' );
}

if ( ! function_exists( 'wp_scif_init' ) ) {
    /**
     * Triggered when all plugins are loaded.
     * Primary hooks and filters should be called here.
     * 
     * @author Jim Barnes
     * @since 1.0.0
     **/
    function wp_scif_init() {
        // Add the shortcode interface to media buttons of the WYSIWYG.
        add_action( 'media_buttons', array( 'WP_SCIF_Admin', 'add_shortcode_interface' ), 10, 0 );
        // Add the shortcode interface modal to the post edit and add pages.
        add_action( 'admin_footer', array( 'WP_SCIF_Admin', 'add_shortcode_interface_modal' ), 10, 0 );
		// Add the wp-scif javacsript file to admin screens.
		add_action( 'admin_enqueue_scripts', array( 'WP_SCIF_Admin', 'enqueue_admin_assets' ), 10, 1 );
		// Add the render_post admin action for preview fields.
		add_action( 'wp_ajax_render_shortcode', array( 'WP_SCIF_Admin', 'render_shortcode' ), 10, 0 );
    }

    add_action( 'plugins_loaded', 'wp_scif_init', 10, 0 );
}

?>
