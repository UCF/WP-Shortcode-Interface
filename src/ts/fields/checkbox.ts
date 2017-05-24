namespace WPSCIF.Fields {
    export class CheckboxField extends Field {
        constructor($field: any) {
            super($field);

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }

        public getValue() {
            return this.$field.is(':checked');
        }

        public setDefaultValue() {
            if (this.default !== null ) {
                this.$field.prop('checked', true);
            } else {
                this.$field.prop('checked', false);
            }
        }
    }
}
