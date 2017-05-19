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

        public isValid(): boolean {
            // If required, it must have value
            if (this.required && ! this.getValue()) {
                return false;
            }
            return true;
        }

        public getValue() {
            return this.$field.val();
        }

        public getOutput() {
            return this.param + '="' + this.getValue() + '"';
        }
    }
}
