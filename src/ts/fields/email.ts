namespace WPSCIF.Fields {
    export class EmailField extends Field {
        constructor($field: any) {
            super($field);
            this.inputMask = this.inputMask || '.*(\.+)?.*\@.*\..*';
            this.validationMessage = 'Please, enter a valid email address.';

            this.$field.on('input', () => {
                if (this.timer) {
                    clearTimeout(this.timer);
                }

                this.timer = setTimeout( () => {
                    this.$field.trigger('wpscif:field:update');
                }, 500);
            });
        }
    }
}
