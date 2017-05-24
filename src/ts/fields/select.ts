namespace WPSCIF.Fields {
    export class SelectField extends Field {
        /**
         * An array of option strings
         */
        private options: Array<string>;

        /**
         * Generates a new SelectField
         * @param $field 
         */
        constructor($field: any) {
            super($field)
            this.options = new Array<string>();
            this.$field.find('option').each( (idx, obj) => {
                this.options.push(jQuery(obj).val());
            });

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }

        /**
         * Sets the default value of the select field
         */
        public setDefaultValue() {
            if (this.default) {
                this.$field.val(this.default);
            } else if (jQuery.inArray('', this.options) > -1) {
                this.$field.val('');
            } else {
                this.$field.find('option:selected').prop('selected', false);
                this.$field.find('option:first').prop('selected', 'selected');
            }
        }
    }
}
