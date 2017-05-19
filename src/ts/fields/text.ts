namespace WPSCIF.Fields {
    export class TextField extends Field {
        inputMask: string;

        constructor($field: any) {
            super($field);
            this.inputMask = this.$field.data('wpscif-valid-regex');
        }

        public isValid() : boolean {
            var valid = super.isValid();

            var pattern = new RegExp(this.inputMask);
            var valid = pattern.test(this.getValue());

            return valid;
        }
    }
}
