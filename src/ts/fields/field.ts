namespace WPSCIF.Fields {
    export abstract class Field {
        protected $field: any;
        public required: boolean;
        public param: string;
        public default: string;

        constructor($field: any) {
            this.$field = $field;
            this.required = <boolean>this.$field.data('scif-required');
            if (typeof this.required === "undefined") {
                this.required = false;
            }
            this.param = this.$field.data('scif-param');
            this.default = this.$field.data('scif-default');
        }

        public isValid(): boolean {
            // If required, it must have value
            if (this.required && ! this.getValue()) {
                jQuery('.' + this.param + '-error').addClass('active');
                return false;
            }
            jQuery('.' + this.param + '-error').removeClass('active');
            return true;
        }

        public setDefaultValue() {
            if (this.default) {
                this.$field.val(this.default);
            } else {
                this.$field.val('');
            }
        }

        public getValue() {
            return this.$field.val();
        }

        public getOutput() {
            return this.param + '="' + this.getValue() + '"';
        }
    }
}
