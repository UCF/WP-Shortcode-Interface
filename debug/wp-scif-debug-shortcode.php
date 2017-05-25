<?php
if ( ! class_exists( 'WP_SCIF_DEBUG_SC' ) ) {
	class WP_SCIF_DEBUG_SC {
		function shortcode( $atts, $content='' ) {
			$atts = shortcode_atts( array(
				'checkbox' => TRUE,
				'color' => '#ffffff',
				'date' => '2017-01-01',
				'email' => 'my.email@email.com',
				'number' => 42,
				'select' => 'option-1',
				'text' => 'This is test text',
				'radio' => 'option-1',
				'checkbox_list' => 'option-1,option-2'
			), $atts );

			ob_start();
		?>
			<dl>
				<dt>Checkbox</dt>
				<dd><?php echo $atts['checkbox']; ?></dd>
				<dt>Color</dt>
				<dd><code><?php echo $atts['color']; ?></code></dd>
				<dt>Date</dt>
				<dd><?php echo $atts['date']; ?></dd>
				<dt>Email</dd>
				<dd><a href="mailto:<?php echo $atts['email']; ?>"><?php echo $atts['email'];?></a></dd>
				<dt>Number</dt>
				<dd><?php echo $atts['number']; ?></dd>
				<dt>Select</dt>
				<dd><?php echo $atts['select'] ;?></dd>
				<dt>Text</dt>
				<dd><?php echo $atts['text']; ?></dd>
				<dt>Radio</dt>
				<dd><?php echo $atts['radio']; ?></dd>
				<dt>Checkbox List</dt>
				<dd><?php echo $atts['checkbox_list']; ?></dd>
			</dl>
			<div class="content">
				<?php echo apply_filters( 'the_content', $content ); ?>
			</div>
		<?php
			return ob_get_clean();
		}

		function register_interface( $shortcodes ) {
			$settings = array(
				'command' => 'debug_sc',
				'name'    => 'Debug Shortcode',
				'desc'    => 'Shortcode for testing SCIF',
				'content' => true,
				'preview' => true,
				'fields'  => array(
					array(
						'param'   => 'checkbox',
						'name'    => 'Checkbox',
						'desc'    => 'Use for debugging checkboxes',
						'type'    => 'checkbox',
						'default' => true
					),
					array(
						'param'   => 'color',
						'name'    => 'Color',
						'desc'    => 'Use for debugging color inputs',
						'type'    => 'color',
						'options' => array(
							'#fc0',
							'#bc9a36',
							'#fff',
							'#000',
							'#767676'
						),
						'default' => '#fff'
					),
					array(
						'param'   => 'date',
						'name'    => 'Date',
						'desc'    => 'Use for debugging date inputs',
						'type'    => 'date',
						'default' => '2017-01-01'
					),
					array(
						'param'   => 'email',
						'name'    => 'Email',
						'desc'    => 'Use for debugging email inputs',
						'type'    => 'email',
						'default' => 'my.email@email.com'
					),
					array(
						'param'   => 'number',
						'name'    => 'Number',
						'desc'    => 'Use for debugging number inputs',
						'type'    => 'number',
						'default' => '42'
					),
					array(
						'param'   => 'select',
						'name'    => 'Select',
						'desc'    => 'Use for debugging select fields',
						'type'    => 'select',
						'options' => array(
							'option-1' => 'Option 1',
							'option-2' => 'Option 2',
							'option-3' => 'Option 3'
						),
						'default' => 'option-1'
					),
					array(
						'param'   => 'text',
						'name'    => 'Text',
						'desc'    => 'Use for debugging text inputs',
						'type'    => 'text',
						'default' => 'This is test text'
					)
				)
			);

			$shortcodes[] = $settings;

			return $shortcodes;
 		}
	}
}
