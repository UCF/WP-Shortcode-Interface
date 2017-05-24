namespace WPSCIF.Fields {
    export class DateField extends Field {
        constructor($field: any) {
            super($field);

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }
    }
}
