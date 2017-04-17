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

		public static function add_example_shortcode( $shortcodes ) {
			$shortcodes[] = array(
				'command' => 'event-list',
				'name' => 'Event List',
				'desc' => 'Outputs a list of events.',
				'content' => False,
				'fields' => array(
					array(
						'param' => 'calendar-id',
						'name' => 'Calendar',
						'type' => 'email'
					),
					array(
						'param' => 'select-option',
						'name'  => 'Select Option',
						'type'  => 'checkbox-list',
						'options' => array(
							'option-1' => 'Option 1',
							'option-2' => 'Option 2',
							'option-3' => 'Option 3'
						)
					),
					array(
						'param' => 'do-something',
						'name'  => 'Do Something',
						'type'  => 'checkbox'
					)
				)
			);

			return $shortcodes;
		}
	}
}
