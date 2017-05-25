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
         * The field name
         */
        protected fieldName: string;

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
        protected fieldID: string;

        /**
         * The container of the error message.
         */
        protected $errorContainer: any;

        /**
         * The span containing the error message
         */
        protected $errorMessage: any;

        /**
         * Input mask for validation
         */
        protected inputMask: string;

        /**
         * Message to display when regex validation fails.
         */
        protected validationMessage: string;

        /**
         * Timer for debouncing
         */
        protected timer: any;

        /**
         * Returns a new Field object.
         * @param field {jQuery} 
         */
        constructor($field: any) {
            this.$field = $field;
            this.fieldID = this.$field.attr('id');
            this.fieldName = jQuery('label[for=' + this.fieldID + ']').text();
            this.required = <boolean>this.$field.data('scif-required');
            if (typeof this.required === "undefined") {
                this.required = false;
            }
            this.param = this.$field.data('scif-param');
            this.default = this.$field.data('scif-default');
            this.$errorContainer = jQuery('#' + this.fieldID + '-error');
    
            this.$errorMessage = this.$errorContainer.find('.error-message');

            // Assign input mask if it exists as a data attr
            var mask = this.$field.data('scif-validation-mask');
            if ( mask ) {
                this.inputMask = mask;
            }

            // Be sure to override this message on specific field types.
            this.validationMessage = 'Please enter a valid value.';
        }

        /**
         * Returns true if the field value is valid
         * @return {boolean}
         */
        public isValid(): boolean {
            var value = this.getValue();

            // If required, it must have value
            if (this.required && ! value) {
                this.$errorContainer.addClass('active');
                this.$errorMessage.text(this.fieldName + ' is required.');
                return false;
            }

            if (value && this.inputMask) {
                var re = new RegExp(this.inputMask);

                if (!re.test(value)) {
                    this.$errorContainer.addClass('active');
                    this.$errorMessage.text(this.validationMessage);
                    return false;
                }
            }

            this.$errorContainer.removeClass('active');
            this.$errorMessage = '';
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
