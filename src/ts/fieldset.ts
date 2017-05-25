/// <reference path="./fields/fields.d.ts" />

namespace WPSCIF {
    export class FieldSet {
        /**
         * The shortcode command
         */
        private command: string;

        /**
         * The array of fields
         */
        private fields: Array<Fields.Field>;

        /**
         * The container div of the fieldset
         */
        public $container: any;

        /**
         * The description div of the fieldset
         */
        private $description: any;

        /**
         * Whether this shortcode can wrap around existing content
         */
        public allowContent: boolean;

        /**
         * Whether this shortcode supports automatic preview
         */
        public supportsPreview: boolean;
        
        /**
         * Generates a new fieldset
         * @param command {string}
         */
        constructor(command: string) {
            this.command = command;
            this.$container = jQuery('.shortcode-editor.shortcode-' + command);
            this.$description = jQuery('.shortcode-desc.shortcode-' + this.command);
            this.allowContent = this.$container.is('[data-scif-allows-content]');
            this.supportsPreview = this.$container.is('[data-scif-preview]');
            this.fields = new Array<Fields.Field>();
            var $fields = this.$container.find('.wp-scif-field');

            // Create the fields
            $fields.each( (idx, obj) => {
                var field = this.createField(obj);
                this.fields.push(field);
            });

            // Setup update event on each field
            jQuery('.wp-scif-field').on('wpscif:field:update', (e) => {
                this.$container.trigger('wpscif:fieldset:update');
            });

            this.init();
        }

        /**
         * Sets the default state of the fieldset
         */
        private init() {
            this.fields.forEach( (field) => {
                field.setDefaultValue();
            });

            this.$container.addClass('active');
            this.$description.addClass('active');
        }

        /**
         * Removes active states and unbinds events
         */
        public destroy() {
            this.$container.removeClass('active');
            this.$description.removeClass('active');
            jQuery('.wp-scif-field').unbind('wpscif:field:update');
        }

        /**
         * Creates a Field object based on the provided form element
         * @param obj 
         */
        private createField(obj) {
            var $field = jQuery(obj),
                tagName = $field.prop('tagName');

            if (tagName === 'SELECT') {
                return new Fields.SelectField($field);
            } else if (tagName === 'INPUT') {
                var type = $field.attr('type');
                switch(type) {
                    case 'checkbox':
                        return new Fields.CheckboxField($field);
                    case 'color':
                        return new Fields.ColorField($field);
                    case 'date':
                        return new Fields.DateField($field);
                    case 'email':
                        return new Fields.EmailField($field);
                    case 'text':
                        return new Fields.TextField($field);
                    default:
                        return new Fields.TextField($field);
                }
            }
        }

        /**
         * Determines if the fieldset if valid
         * Also displays errors if any are found
         * @return {boolean}
         */
        public isValid(): boolean {
            var errorCount: number = 0;

            this.fields.forEach( (field) => {
                if (!field.isValid()) {
                    errorCount++;
                }
            });

            if (errorCount > 0) {
                return false;
            }

            return true;
        }

        /**
         * Gets the ourput from each field
         * @return {Array<string>}
         */
        public getValues() {
            var retval = Array<string>();

            this.fields.forEach( (field) => {
                if (field.hasValue()) {
                    retval.push(field.getOutput());
                }
            });

            return retval;
        }

        /**
         * Builds the shortcode string
         * @param text The text to wrap around the shortcode.
         * @return {string}
         */
        public buildShortcode(text='') {
            var retval = '[' + this.command;
            var outputArr = this.getValues();
            
            if (outputArr.length > 0) {
                retval += ' ' + outputArr.join(' ');
            }

            retval += ']';

            if (text) {
                retval += text;
            }

            if (this.allowContent) {
                retval += '[/' + this.command + ']';
            }

            return retval;
        }
    }
}
