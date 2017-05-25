namespace WPSCIF.Fields {
    export class NumberField extends Field {
        constructor($field: any) {
            super($field);
            this.inputMask = this.inputMask || '\\d+\.?\\d+';

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
