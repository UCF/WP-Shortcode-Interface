namespace WPSCIF.Fields {
    export class TextField extends Field {
        /**
         * Timer for debouncing.
         */
        private timer: any;

        /**
         * Generates a new TextField
         * @param $field 
         */
        constructor($field: any) {
            super($field);

            this.$field.on('input', () => {
                if (this.timer) {
                    clearTimeout(this.timer)
                }

                this.timer = setTimeout( () => {
                    this.$field.trigger('wpscif:field:update');
                }, 500);
            });
        }
    }
}
