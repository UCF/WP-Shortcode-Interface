namespace WPSCIF.Fields {
    export class ColorField extends Field {
        /**
         * Constructors a new ColorField
         * @param $field
         */
        constructor($field: any) {
            super($field);

            var palettes = false;

            if (this.$field.data('scif-palette')) {
                palettes = this.$field.data('scif-palette').replace(' ', '').split(',');
            }

            this.$field.wpColorPicker({
                hide: false,
                palettes: palettes,
                color: this.default
            });

            this.inputMask = this.inputMask || '(\#[0-9a-fA-F]{6}|rgb\(\d{1,3},\ ?\d{1,3},\ ?\d{1,3}\)|rgba\(\d{1,3},\ ?\d{1,3},\ ?\d{1,3},\ ?\d{1,3}\.?\d?\))';
            this.validationMessage = 'Please, enter a valid hex color value, rgb or rgba.';

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }
    }
}
