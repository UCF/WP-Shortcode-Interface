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
			$shortcodes = array();
			$shortcodes = apply_filters( 'wp_scif_add_shortcode', $shortcodes );
			foreach( $shortcodes as $shortcode ) {
				// Add `WP_SCIF_Shortcode` object for each shortcode.
				$retval[] = new WP_SCIF_Shortcode( $shortcode );
			}
			return $retval;
		}

		/**
		 * Returns an array of grouped shortcodes for output on the shortcode
		 * interface.
		 *
		 * @author Jo Dickson
		 * @since 1.0.0
		 * @param $shortcodes Mixed | an array of WP_SCIF_Shortcode objects, or null
		 * @return Array | an associative array of grouped WP_SCIF_Shortcode objects, with keys as group names
		 **/
		public static function installed_shortcodes_grouped( $shortcodes=null ) {
			$shortcodes = is_array( $shortcodes ) ? $shortcodes : self::installed_shortcodes();
			$retval = array();

			if ( !empty( $shortcodes ) ) {
				foreach ( $shortcodes as $shortcode ) {
					$retval[$shortcode->group][] = $shortcode;
				}
			}

			ksort( $retval );
			return $retval;
		}
	}
}
