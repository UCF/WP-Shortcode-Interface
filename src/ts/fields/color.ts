namespace WPSCIF.Fields {
    export class ColorField extends Field {
        constructor($field: any) {
            super($field);

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }
    }
}
