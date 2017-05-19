/// <reference path="./fields/fields.d.ts" />

namespace WPSCIF {
    export class FieldSet {
        private command: string;
        private fields: Array<Fields.Field>;
        private $container: any;
        
        constructor(command) {
            this.command = command;
            this.$container = jQuery('.shortcode-editor.shortcode-' + command);
            this.fields = new Array<Fields.Field>();
            var $fields = this.$container.find('.wp-scif-field');

            $fields.each( (idx, obj) => {
                var $field = jQuery(obj);
                this.fields.push(this.createField(obj));
            });

            this.init();
        }

        private init() {
            this.fields.forEach( (field) => {
                field.setDefaultValue();
            });
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

        public getValues() {
            this.fields.forEach( (field) => {
                console.log(field.param + '=' + field.getValue());
            });
        }
    }
}
