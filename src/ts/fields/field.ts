/**
 * Fields namespace
 * @namespace
 */
namespace WPSCIF.Fields {
    /**
     * Abstrat representing a field
     * @class
     */
    export abstract class Field {
        /** 
         * input field
         */
        protected $field: any;

        /**
         * Indicates the field is required
         */
        public required: boolean;

        /**
         * Indicates the shortcode param this field maps to
         */
        public param: string;

        /**
         * The default value of the field
         */
        public default: string;

        /**
         * The id of the field
         */
        private fieldID: string;

        /**
         * Returns a new Field object.
         * @param field {jQuery} 
         */
        constructor($field: any) {
            this.$field = $field;
            this.fieldID = this.$field.attr('id');
            this.required = <boolean>this.$field.data('scif-required');
            if (typeof this.required === "undefined") {
                this.required = false;
            }
            this.param = this.$field.data('scif-param');
            this.default = this.$field.data('scif-default');
        }

        /**
         * Returns true if the field value is valid
         * @return {boolean}
         */
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

        /**
         * Sets the default value of the field
         */
        public setDefaultValue() {
            if (this.default) {
                this.$field.val(this.default);
            } else {
                this.$field.val('');
            }
        }

        /**
         * Returns true of the field has value.
         * @return {boolean}
         */
        public hasValue(): boolean {
            if (this.getValue()) {
                return true;
            }

            return false;
        }

        /**
         * Returns the value of the field
         * @return {string}
         */
        public getValue() {
            return this.$field.val();
        }

        /**
         * Returns the output for the shortcode
         * @return {string}
         */
        public getOutput() {
            return this.param + '="' + this.getValue() + '"';
        }
    }
}
