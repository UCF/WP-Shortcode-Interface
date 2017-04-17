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
			$content;

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
			return sprintf( '<li class="shortcode-%s">%s</li>', $this->command, $this->description );
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
			foreach( $this->fields as $field ) :
			?>
				<div class="wp-scif-field">
			<?php echo $this->get_field_markup( $field ); ?>
				</div>
			<?php
			endforeach;
			return ob_get_clean();
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
		?>
			<label for="<?php echo sanitize_title( $field['name'] ); ?>">
				<?php echo $field['name']; ?>
			</label>
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
			<input type="<?php echo $field['type']; ?>" data-scif-param="<?php echo $field['param']; ?>" data-scif-required="<?php echo $field['required'] ?>">
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
			<select class="select" data-scif-param="<?php echo $field['param']; ?>" data-scif-required="<?php echo $field['required']; ?>">
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
			<input type="radio" name="<?php echo $param; ?>" value="<?php echo $key; ?>"><label for="<?php echo $key; ?>"><?php echo $val; ?></label>
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
			<input type="checkbox" name="<?php echo $field['param']; ?>"><label for="<?php echo $field['param']; ?>"><?php $field['name']; ?></label>
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
			<div class="checkbox">
				<input type="checkbox" name="<?php echo $param; ?>" value="<?php echo $key; ?>">
				<label for="<?php echo $param; ?>"><?php echo $val; ?></label>
			</div>
		<?php
			endforeach;
			return ob_get_clean();
		}
	}
}
