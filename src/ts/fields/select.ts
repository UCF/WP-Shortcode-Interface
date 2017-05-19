namespace WPSCIF.Fields {
    export class SelectField extends Field {
        options: Array<string>;

        constructor($field: any) {
            super($field)
            this.options = new Array<string>();
            this.$field.find('option').each( (idx, obj) => {
                this.options.push(jQuery(obj).val());
            });
        }

        public setDefaultValue() {
            if (this.default) {
                this.$field.val(this.default);
            } else if (jQuery.inArray('', this.options) > -1) {
                this.$field.val('');
            } else {
                this.$field.find('option:selected').prop('selected', false);
                this.$field.find('option:first').prop('selected', 'selected');
            }
        }
    }
}
