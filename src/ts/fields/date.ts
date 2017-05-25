namespace WPSCIF.Fields {
    export class DateField extends Field {
        constructor($field: any) {
            super($field);

            this.$field.datepicker({
                dateFormat: 'yy-mm-dd'
            });

            this.inputMask = this.inputMask || '\\d{4}\-\\d{2}\-\\d{2}';
            this.validationMessage = 'Please, enter a date in the format of YYYY-MM-DD';
            this.$field.attr('type', 'text');

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }
    }
}
