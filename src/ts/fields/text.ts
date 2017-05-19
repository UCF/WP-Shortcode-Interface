namespace WPSCIF.Fields {
    export class TextField extends Field {
        inputMask: string;

        constructor($field: any) {
            super($field);
            this.inputMask = this.$field.data('wpscif-valid-regex');
        }

        public is_valid() : boolean {
            var valid = super.is_valid();

            var pattern = new RegExp(this.inputMask);
            var valid = pattern.test(this.get_value());

            return valid;
        }
    }
}
