namespace WPSCIF.Fields {
    export class CheckboxField extends Field {
        constructor($field: any) {
            super($field);
        }

        public getValue() {
            return this.$field.is(':checked');
        }
    }
}
