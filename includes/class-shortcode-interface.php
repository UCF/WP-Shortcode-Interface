<?php
/**
 * Class for outputting shortcode options
 * and descriptions.
 **/
if ( ! class_exists( 'WP_SCIF_Shortcode' ) ) {
	class WP_SCIF_Shortcode {
		public
			$command,
			$name,
			$description,
			$fields,
			$content,
			$preview=FALSE,
			$group;

		/**
		 * Primary constructor for Shortcode object
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $args Array | Argument array, containing fields, content etc.
		 * @return WP_SCIF_SHORTCODE Object
		 **/
		public function __construct( $args ) {
			$this->command = $args['command'];
			$this->name = isset( $args['name'] ) ? $args['name'] : $args['command'];
			$this->fields = $this->normalize_fields( $args['fields'] );
			$this->content = isset( $args['content'] ) ? $args['content'] : false;
			$this->description = isset( $args['desc'] ) ? $args['desc'] : '';
			$this->preview = isset( $args['preview'] ) ? $args['preview'] : false;
			$this->group = isset( $args['group'] ) ? $args['group'] : apply_filters( 'wp_scif_default_sc_group', 'Uncategorized' );
		}

		/**
		 * Takes an array of fields and ensures all possible field options
		 * are set, with sane defaults as necessary.
		 *
		 * @author Jo Dickson
		 * @since 1.0.0
		 *
		 * @param $args Array | Array of field settings
		 * @return Normalized array of field settings
		 **/
		public function normalize_fields( $fields ) {
			$fields_normalized = array();

			if ( is_array( $fields ) ) {
				foreach ( $fields as $field ) {
					// Invalidate the field if 'param' isn't set
					if ( !isset( $field['param'] ) ) { continue; }

					$field_normalized = array(
						'param'    => $field['param'],
						'name'     => isset( $field['name'] ) ? $field['name'] : $field['param'],
						'type'     => isset( $field['type'] ) ? $field['type'] : 'text',
						'desc'     => isset( $field['desc'] ) ? $field['desc'] : '',
						'default'  => isset( $field['default'] ) ? $field['default'] : '',
						'required' => isset( $field['required'] ) ? $field['required'] : false
					);

					if (
						$field_normalized['type'] === 'select'
						|| $field_normalized['type'] === 'radio'
						|| $field_normalized['type'] === 'checkbox-list'
					) {
						$field_normalized['options'] = isset( $field['options'] ) ? $field['options'] : array( $field_normalized['default'] );
					}

					$fields_normalized[] = $field_normalized;
				}
			}

			return $fields_normalized;
		}

		/**
		 * Returns the markup for the shortcode select option
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @return string | The markup for the select option
		 **/
		public function get_option_markup() {
			return sprintf( '<option value="%s">%s</option>', $this->command, $this->name );
		}

		/**
		 * Returns markup for the description.
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @return string | The markup for the description
		 **/
		public function get_description_markup() {
			return sprintf( '<p class="shortcode-desc shortcode-%s">%s</p>', $this->command, $this->description );
		}

		/**
		 * Returns the form for all options
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @return string | The html markup of the shortcode form.
		 **/
		public function get_form_markup() {
			ob_start();
			?>
			<div class="shortcode-editor shortcode-<?php echo $this->command; ?>" <?php if ( $this->content ) { ?>data-scif-allows-content<?php } if ( $this->preview ) { ?> data-scif-preview<?php }?>>
			<?php
			foreach( $this->fields as $field ) :
			?>
				<div class="wp-scif-field-wrapper">
				<?php echo $this->get_field_markup( $field ); ?>
				</div>
			<?php
			endforeach;
			?>
			</div>
			<?php
			return ob_get_clean();
		}

		/**
		 * Returns the ID attribute value for a field's input.
		 *
		 * @author Jo Dickson
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The ID attribute value
		 **/
		private function get_field_input_id( $field ) {
			return $this->command . '-' . $field['param'];
		}

		/**
		 * Returns the markup for particular field types
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_field_markup( $field ) {
			ob_start();
			echo $this->get_field_label_markup( $field );

			switch( $field['type'] ) {
				case 'text':
				case 'email':
				case 'number':
				case 'date':
					echo $this->get_text_field_markup( $field );
					break;
				case 'select':
					echo $this->get_select_field_markup( $field );
					break;
				case 'radio':
					echo $this->get_radio_field_markup( $field );
					break;
				case 'checkbox':
					echo $this->get_checkbox_field_markup( $field );
					break;
				case 'checkbox-list':
					echo $this->get_checkbox_list_field_markup( $field );
					break;
				default:
					$field['type'] = 'text';
					echo $this->get_text_field_markup( $field );
					break;
			}

			if ( $field['required'] ) {
				echo $this->get_validation_message( $field );
			}

			return ob_get_clean();
		}

		/**
		 * Returns a field's label
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for the label.
		 **/
		private function get_field_label_markup( $field ) {
			ob_start();
			// Checkbox labels are custom.
			if ( $field['type'] === 'checkbox' ) return;
		?>
			<label class="field-label" for="<?php echo $this->get_field_input_id( $field ); ?>">
				<?php echo $field['name']; ?>
				<?php if ( $field['required'] ) : ?>
					<span class="required">*</span>
				<?php endif; ?>
			</label>
			<?php if ( $field['desc'] ) : ?>
				<p class="field-desc"><?php echo $field['desc']; ?></p>
			<?php endif; ?>
		<?php
			return ob_get_clean();
		}

		private function get_validation_message( $field ) {
			ob_start();
		?>
			<p id="<?php echo $this->get_field_input_id( $field );?>-error" class="error-message">
				<span class="required"><?php echo $field['name']; ?> is required.</span>
			</p>
		<?php
			return ob_get_clean();
		}

		/**
		 * Returns an input field with defined type
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_text_field_markup( $field ) {
			ob_start();
		?>
			<input class="wp-scif-field" id="<?php echo $this->get_field_input_id( $field ); ?>" type="<?php echo $field['type']; ?>" data-scif-param="<?php echo $field['param']; ?>" data-scif-required="<?php echo $field['required']; ?>" <?php if ( isset( $field['default'] ) ) { echo 'data-scif-default="' . $field['default'] . '"'; } ?>>
		<?php
			return ob_get_clean();
		}

		/**
		 * Returns a select field
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_select_field_markup( $field ) {
			ob_start();
		?>
			<select class="select wp-scif-field" id="<?php echo $this->get_field_input_id( $field ); ?>" data-scif-param="<?php echo $field['param']; ?>" data-scif-required="<?php echo $field['required']; ?>" <?php if ( isset( $field['default'] ) ) { echo 'data-scif-default="' . $field['default'] . '"'; } ?>>
			<?php foreach( $field['options'] as $key => $val ) : ?>
				<option value="<?php echo $key; ?>"><?php echo $val; ?></option>
			<?php endforeach; ?>
			</select>
		<?php
			return ob_get_clean();
		}

		/**
		 * Returns a radio list field
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_radio_field_markup( $field ) {
			ob_start();
			$param = $field['param'];
			foreach( $field['options'] as $key => $val ) :
		?>
			<label>
				<input class="wp-scif-field" type="radio" name="<?php echo $param; ?>" value="<?php echo $key; ?>">
				<?php echo $val; ?>
			</label>
		<?php
			endforeach;
			return ob_get_clean();
		}

		/**
		 * Returns a checkbox field
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_checkbox_field_markup( $field ) {
			ob_start();
		?>
			<strong class="field-label"><?php echo $field['name']; ?></strong>
			<?php if ( $field['desc'] ) : ?>
				<p class="field-desc"><?php echo $field['desc']; ?></p>
			<?php endif; ?>
			<label class="checkbox-label">
				<input class="wp-scif-field" type="checkbox" name="<?php echo $field['param']; ?>" data-scif-param="<?php echo $field['param']; ?>" <?php if ( isset( $field['default'] ) ) { echo 'data-scif-default="' . ( $field['default'] ? 'true' : 'false' ) . '"'; } ?>>
				<?php echo $field['name']; ?>
			</label>
		<?php
			return ob_get_clean();
		}

		/**
		 * Returns a checkbox list field
		 *
		 * @author Jim Barnes
		 * @since 1.0.0
		 *
		 * @param $field Array | An array of field information
		 * @return string | The markup to output for a particular field.
		 **/
		private function get_checkbox_list_field_markup( $field ) {
			ob_start();
			$param = $field['param'];
			foreach( $field['options'] as $key => $val ) :
		?>
			<strong class="field-label"><?php echo $field['name']; ?></strong>
			<?php if ( $field['desc'] ) : ?>
				<p class="field-desc"><?php echo $field['desc']; ?></p>
			<?php endif; ?>
			<div class="checkbox">
				<label>
					<input class="wp-scif-field checkbox-list-item" type="checkbox" name="<?php echo $param; ?>" value="<?php echo $key; ?>" data-scif-param="<?php echo $field['param']; ?>">
					<?php echo $val; ?>
				</label>
			</div>
		<?php
			endforeach;
			return ob_get_clean();
		}
	}
}
