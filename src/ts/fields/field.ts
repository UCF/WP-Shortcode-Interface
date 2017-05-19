namespace WPSCIF.Fields {
    export abstract class Field {
        protected $field: any;
        public required: boolean;
        public param: string;

        constructor($field: any) {
            this.$field = $field;
            this.required = <boolean>this.$field.data('scif-required');
            if (typeof this.required === "undefined") {
                this.required = false;
            }
            this.param = this.$field.data('scif-param');
        }

        public is_valid(): boolean {
            // If required, it must have value
            if (this.required && ! this.get_value()) {
                return false;
            }
            return true;
        }

        public get_value() {
            return this.$field.val();
        }

        public get_output() {
            return this.param + '="' + this.get_value() + '"';
        }
    }
}
