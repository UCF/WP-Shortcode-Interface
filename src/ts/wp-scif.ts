declare var tinyMCE: any;
declare var send_to_editor: Function;

namespace WPSCIF {
    export class ShortcodeInterface {
        public $toggle: any;
        public $interface: any;
        public $submitBtn: any;
        public $select: any;
        public selectedShortcode: string;
        public $activeShortcodeEditor: any;
        public $activeShortcodeDescription: any;
        public $activeFields: any;
        public editor: any;

        constructor() {
            this.$toggle = jQuery('#add-shortcode');
            this.$interface = jQuery('#wp-scif-form-inner');
            this.$submitBtn = this.$interface.find('#wp-scif-submit');
            this.$select = this.$interface.find('#wp-scif-select');
            this.selectedShortcode = null;
            this.$activeShortcodeEditor = null;
            this.$activeShortcodeDescription = null;
            this.$activeFields = null;

            this.$toggle.click( (e) => { this.resetForm() } );
            this.$submitBtn.click( (e) => { this.onSubmitBtnClick(e) });
            this.$select.change( (e) => { this.onSelectChanged(e) });
        }

        resetForm() {
            this.editor = tinyMCE.activeEditor ? tinyMCE.activeEditor : null;
            this.$select.val('').trigger('change');
            if (this.$activeFields) {
                this.$activeFields.prop('checked', false);
                this.$activeFields.each( (i, field) => {
                    var $field = jQuery(field);
                    if ( $field.prop['type'] !== 'checkbox' ) {
                        $field.val('');
                    }
                });
            }
        }

        validateForm() : boolean {
            var errors = 0;

            if (this.$activeFields) {
                this.$activeFields.each( (i, field) => {
                    var $field = jQuery(field),
                        name = $field.data('scif-param'),
                        required = $field.data('scif-required');

                    if ( required && ( $field.val() === '' ) ) {
                        jQuery( '.' + name + '-error' ).addClass('active');
                        errors++;
                    } else {
                        jQuery( '.' + name + '-error' ).removeClass('active');
                    }
                } );
            }
            else {
                errors++;
            }

            if ( errors ) {
                return false;
            }

            return true;
        }

        getFormValues() {
            var data = {
                command: this.selectedShortcode,
                params: {},
                allowsContent: this.$activeShortcodeEditor.data('scif-allows-content') !== undefined
            };

            this.$activeFields.each( (i, field) => {
                var $field = jQuery(field),
                    param  = $field.data('scif-param'),
                    value  = '';

                switch( $field.prop('tagName') ) {
                    case 'INPUT':
                    case 'TEXTAREA':
                    case 'SELECT':
                        if ($field.prop('type') === 'checkbox') {
                            if ( $field.hasClass( 'checkbox-list-item' ) ) {
                                if ( $field.prop('checked') ) {
                                    value = $field.val();
                                } else {
                                    break;
                                }
                            } else {
                                value = String($field.prop('checked'));
                            }
                        } else {
                            value = $field.val();
                        }
                        break;
                    default:
                        value = $field.val();
                }

                if (value) {
                    if (typeof data.params[param] !== 'undefined') {
                        data.params[param] += ',' + value;
                    } else {
                        data.params[param] = value;
                    }
                }
            });

            this.insertShortcode(data);
        }

        insertShortcode(data) {
            var enclosingText = null;

            if ( this.editor ) {
                enclosingText = this.editor.selection.getContent();
            }

            var text = '[' + data.command;

            if (data.params) {
                for (var key in data.params) {
                    text += ' ' + key + '="' + data.params[key] + '"';
                }
            }

            text += ']';

            if ( enclosingText ) {
                text += enclosingText;
            }
            if ( data.allowsContent ) {
                text += '[/' + data.command + ']';
            }

            send_to_editor( text );
        }

        onSubmitBtnClick(e) {
            e.preventDefault();

            if ( this.validateForm() ) {
                this.getFormValues();
            }
        }

        onSelectChanged(e) {
            this.selectedShortcode = this.$select.val();

            if (this.$activeShortcodeEditor) {
                this.$activeShortcodeEditor.removeClass('active');
            }
            if (this.$activeShortcodeDescription) {
                this.$activeShortcodeDescription.removeClass('active');
            }

            // $activeShortcodeElems references both the shortcode editor and
            // the shortcode description
            var $activeShortcodeElems = this.$interface.find('.shortcode-' + this.selectedShortcode).addClass('active');
            this.$activeShortcodeEditor = $activeShortcodeElems.filter('.shortcode-editor');
            this.$activeShortcodeDescription = $activeShortcodeElems.filter('.shortcode-desc');

            this.$activeFields = this.$activeShortcodeEditor.find('.wp-scif-field');
        }
    }
}

if ( typeof jQuery !== 'undefined' ) {
    jQuery(document).ready( function() {
        new WPSCIF.ShortcodeInterface();
    });
}
