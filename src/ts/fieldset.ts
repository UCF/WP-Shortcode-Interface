/// <reference path="./fields/fields.d.ts" />

namespace WPSCIF {
    export class FieldSet {
        private command: string;
        private fields: Array<Fields.Field>;
        public $container: any;
        private $description: any;
        public allowContent: boolean;
        
        constructor(command) {
            this.command = command;
            this.$container = jQuery('.shortcode-editor.shortcode-' + command);
            this.$description = jQuery('.shortcode-desc.shortcode-' + this.command);
            this.allowContent = this.$container.is('[data-scif-allows-content]');
            this.fields = new Array<Fields.Field>();
            var $fields = this.$container.find('.wp-scif-field');

            $fields.each( (idx, obj) => {
                var field = this.createField(obj);
                this.fields.push(field);
            });

            jQuery('.wp-scif-field').on('wpscif:field:update', (e) => {
                this.$container.trigger('wpscif:fieldset:update');
            });

            this.init();
        }

        private init() {
            this.fields.forEach( (field) => {
                field.setDefaultValue();
            });

            this.$container.addClass('active');
            this.$description.addClass('active');
        }

        public destroy() {
            this.$container.removeClass('active');
            this.$description.removeClass('active');
            jQuery('.wp-scif-field').unbind('wpscif:field:update');
        }

        private createField(obj) {
            var $field = jQuery(obj),
                tagName = $field.prop('tagName');

            if (tagName === 'SELECT') {
                return new Fields.SelectField($field);
            } else if (tagName === 'INPUT') {
                var type = $field.attr('type');
                switch(type) {
                    case 'text':
                        return new Fields.TextField($field);
                    case 'date':
                        return new Fields.DateField($field);
                    case 'checkbox':
                        return new Fields.CheckboxField($field);
                    default:
                        return new Fields.TextField($field);
                }
            }
        }

        public getFields() {
            return this.fields;
        }

        public isValid() {
            var errorCount: number = 0;

            this.fields.forEach( (field) => {
                if (!field.isValid) {
                    errorCount++;
                }
            });

            if (errorCount > 0) {
                return false;
            }

            return true;
        }

        public getValues() {
            var retval = Array<string>();

            this.fields.forEach( (field) => {
                if (field.hasValue()) {
                    retval.push(field.getOutput());
                }
            });

            return retval;
        }

        public buildShortcode(text='') {
            var retval = '[' + this.command;
            var outputArr = this.getValues();
            
            if (outputArr.length > 0) {
                retval += ' ' + outputArr.join(' ') + ']';
            }

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
