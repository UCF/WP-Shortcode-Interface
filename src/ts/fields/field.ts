namespace WPSCIF.Fields {
    export abstract class Field {
        protected $field: any;
        public required: boolean;
        public param: string;
        public default: string;
        private fieldID: string;

        constructor($field: any) {
            this.$field = $field;
            this.fieldID = this.$field.attr('id');
            this.required = <boolean>this.$field.data('scif-required');
            if (typeof this.required === "undefined") {
                this.required = false;
            }
            this.param = this.$field.data('scif-param');
            this.default = this.$field.data('scif-default');

            this.$field.on('change', () => {
                this.$field.trigger('wpscif:update');
            });
        }

        public isValid(): boolean {
            var id = '#' + this.fieldID + '-' + this.param + '-error';
            // If required, it must have value
            if (this.required && ! this.getValue()) {
                jQuery(id).addClass('active');
                return false;
            }
            jQuery(id).removeClass('active');
            return true;
        }

        public setDefaultValue() {
            if (this.default) {
                this.$field.val(this.default);
            } else {
                this.$field.val('');
            }
        }

        public hasValue() {
            if (this.getValue()) {
                return true;
            }

            return false;
        }

        public getValue() {
            return this.$field.val();
        }

        public getOutput() {
            return this.param + '="' + this.getValue() + '"';
        }
    }
}
