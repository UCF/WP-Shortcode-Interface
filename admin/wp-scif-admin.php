<?php
/**
 * Handles Admin function
 **/
if ( ! class_exists( 'WP_SCIF_Admin' ) ) {
    class WP_SCIF_Admin {
        /**
         * Adds the interface button to the media buttons area.
         *
         * @author Jim Barnes
         * @since 1.0.0
         **/
        public static function add_shortcode_interface() {
            ob_start();
        ?>
            <a href="#TB_inline?width=600&height=700&inlineId=select-shortcode-form" class="thickbox button" id="add-shortcode" title="Add Shortcode"><span class="dashicons dashicons-editor-code"></span> Add Shortcode</a>
        <?php
            echo ob_get_clean();
        }

        /**
         * Adds the interface modal to post edit and add pages
         *
         * @author Jim Barnes
         * @since 1.0.0
         **/
        public static function add_shortcode_interface_modal() {
            $screen = get_current_screen();
			
            if ( $screen->base === 'post' ) {
                include_once( WP_SCIF__INCLUDES_DIR . '/wp-scif-interface.php' );
            }
        }

		/**
		 * Adds the wp-scif javascript to the admin scripts.
		 * 
		 * @author Jim Barnes
		 * @since 1.0.0
		 **/
		public static function enqueue_admin_assets( $hook ) {
			if ( in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
				wp_enqueue_script( 'wp-scif', WP_SCIF__SCRIPT_URL . '/wp-scif.min.js', array( 'jquery' ), null, true );
			}
		}
    }
}
