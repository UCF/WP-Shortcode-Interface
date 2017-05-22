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
            <a href="#TB_inline?width=600&height=700&inlineId=wp-scif-form" class="thickbox button" id="add-shortcode" title="Add Shortcode"><span class="dashicons dashicons-editor-code"></span> Add Shortcode</a>
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
				wp_enqueue_style( 'wp-scif-css', WP_SCIF__STYLES_URL . '/wp-scif.min.css' );
				wp_enqueue_script( 'jquery-validation', '//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.16.0/jquery.validate.min.js', array( 'jquery' ), null, true );
				wp_enqueue_script( 'wp-scif-js', WP_SCIF__SCRIPT_URL . '/wp-scif.min.js', array( 'jquery' ), null, true );
			}
		}

		/**
		 * Renders the provided shortcode to html
		 * and returns the markup
		 * @author Jim Barnes
		 * @since 1.0.0
		 **/
		public static function render_shortcode() {
			$data = $_GET['shortcode'];
			$shortcode = html_entity_decode( $data );
			$return_content = do_shortcode( $shortcode );
			$retval = array(
				'markup' => $return_content
			);
			wp_send_json( $retval );
		}

		/**
		 * Admin Action for rendering the intial content
		 * for the shortcode preview window.
		 * @author Jim Barnes
		 * @since 1.0.0
		 **/
		public static function render_iframe_content() {
			$shortcode = $_GET['shortcode'] ? $_GET['shortcode'] : null;
			ob_start();
		?>
			<!DOCTYPE html>
			<html lang="en-us">
				<head>
					<title>Shortcode Preview Window</title>
					<?php print self::print_preview_stylesheets(); ?>
				</head>
				<body>
					<div id="scif-preview-content">
					<?php if ( $shortcode ) echo do_shortcode( $shortcode ); ?>
					</div>
				</body>
			</html>
		<?php
			echo ob_get_clean();
		}

		/**
		 * Prints all the registered stylesheets
		 * for the preview window.
		 * @author Jim Barnes
		 * @since 1.0.0
		 **/
		private static function print_preview_stylesheets() {
			$stylesheets = array();
			$stylesheets = apply_filters( 'wp_scif_get_preview_stylesheets', $stylesheets );

			foreach( $stylesheets as $stylesheet ) {
				echo '<link href="' . $stylesheet . '" rel="stylesheet">';
			}
		}
    }
}
