namespace WPSCIF.Fields {
    export class TextField extends Field {
        inputMask: string;
        timer: any;

        constructor($field: any) {
            super($field);
            this.inputMask = this.$field.data('wpscif-valid-regex');

            this.$field.on('input', () => {
                if (this.timer) {
                    clearTimeout(this.timer)
                }

                this.timer = setTimeout( () => {
                    this.$field.trigger('wpscif:field:update');
                }, 500);
            });
        }

        public isValid() : boolean {
            var valid = super.isValid();

            var pattern = new RegExp(this.inputMask);
            var valid = pattern.test(this.getValue());

            return valid;
        }
    }
}
