<?php
/**
 * Provides configuration information
 **/
if ( ! class_exists( 'WP_SCIF_Config' ) ) {
	class WP_SCIF_Config {
		/**
		 * Returns the installed shortcodes for output on
		 * the shortcode interface.
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 **/
		public static function installed_shortcodes() {
			$retval = array();

			// Get shortcodes via the `wp_scif_add_shortcode` hook.
			$shortcodes = apply_filters( 'wp_scif_add_shortcode', array() );

			foreach( $shortcodes as $shortcode ) {
				// Add `WP_SCIF_Shortcode` object for each shortcode.
				$retval[] = new WP_SCIF_Shortcode( $shortcode );
			}

			return $retval;
		}
	}
}
