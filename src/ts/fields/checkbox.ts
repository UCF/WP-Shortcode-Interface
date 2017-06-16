namespace WPSCIF.Fields {
    export class CheckboxField extends Field {
        /**
         * Constructors a new CheckboxField
         * @param $field
         */
        constructor($field: any) {
            super($field);

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }

        /**
         * Returns the value of the field
         * @return {boolean}
         */
        public getValue(): boolean {
            return this.$field.is(':checked');
        }

        /**
         * Sets the default value of the field
         */
        public setDefaultValue() {
            if (this.default) {
                this.$field.prop('checked', true);
            } else {
                this.$field.prop('checked', false);
            }
        }
    }
}
