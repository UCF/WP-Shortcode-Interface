namespace WPSCIF.Fields {
    export class ColorField extends Field {
        /**
         * Constructors a new ColorField
         * @param $field
         */
        constructor($field: any) {
            super($field);

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }
    }
}
