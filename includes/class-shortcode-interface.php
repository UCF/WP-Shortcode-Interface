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
			$validation_mask=null;

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
			$this->fields = $args['fields'];
			$this->content = $args['content'];
			$this->description = $args['desc'];
			$this->preview = $args['preview'];
			$this->validation_mask = $args['validation_mask'];
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
			$data = array();
			if ( $this->content ) {
				$data[] = 'data-scif-allows-content';
			}

			if ( $this->preview ) {
				$data[] = 'data-scif-preview';
			}

			ob_start();
			?>
			<div class="shortcode-editor shortcode-<?php echo $this->command; ?>" <?php echo implode( ' ', $data ); ?>>
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
				case 'color':
				case 'date':
					echo $this->get_text_field_markup( $field );
					break;
				case 'select':
					echo $this->get_select_field_markup( $field );
					break;
				case 'checkbox':
					echo $this->get_checkbox_field_markup( $field );
					break;
				default:
					$field['type'] = 'text';
					echo $this->get_text_field_markup( $field );
					break;
			}
			
			echo $this->get_validation_message( $field );

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
				<span class="error-message required"></span>
			</p>
		<?php
			return ob_get_clean();
		}

		/**
		 * Returns a string of data attributes for the field.
		 * 
		 * @author Jim Barnes
		 * @since 1.0.0
		 * 
		 * @param $field Array | An array of field information
		 * @return  string | The data attributes for the field
		 **/
		private function get_data_attributes( $field ) {
			$retval = array();
			$retval[] = 'data-scif-param="' . $field['param'] . '"';

			if ( $field['required'] ) {
				$retval[] = 'data-scif-required';
			}

			if ( $field['default'] ) {
				$retval[] = 'data-scif-default="' . $field['default'] . '"';
			}

			if ( $field['validation_mask'] ) {
				$retval[] = 'data-scif-validation-mask="' . $field['validation_mask'] . '"';
			}

			return implode( ' ', $retval );
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
			<input class="wp-scif-field" id="<?php echo $this->get_field_input_id( $field ); ?>" type="<?php echo $field['type']; ?>" <?php echo $this->get_data_attributes( $field ); ?>>
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
			<select class="select wp-scif-field" id="<?php echo $this->get_field_input_id( $field ); ?>" <?php echo $this->get_data_attributes( $field ); ?>>
			<?php foreach( $field['options'] as $key => $val ) : ?>
				<option value="<?php echo $key; ?>"><?php echo $val; ?></option>
			<?php endforeach; ?>
			</select>
		<?php
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
				<input class="wp-scif-field" type="checkbox" name="<?php echo $field['param']; ?>" <?php echo $this->get_data_attributes( $field ); ?>>
				<?php echo $field['name']; ?>
			</label>
		<?php
			return ob_get_clean();
		}
	}
}
