/// <reference path="./wp-scif.d.ts" />

declare var tinyMCE: any;
declare var send_to_editor: Function;
declare var ajaxurl: string;

namespace WPSCIF {
    export class ShortcodeInterface {
        public $toggle: any;
        public $submitBtn: any;
        public $select: any;
        public selectedShortcode: string;
        public $fields: any;
        public editor: any;

        constructor() {
            this.$toggle = jQuery('#add-shortcode');
            this.$submitBtn = jQuery('#wp-scif-submit');
            this.$select = jQuery('#wp-scif-select');
            this.selectedShortcode = null;
            this.$fields = jQuery('.wp-scif-field');

            this.$toggle.click( (e) => { this.resetForm() } );
            this.$submitBtn.click( (e) => { this.onSubmitBtnClick(e) });
            this.$select.change( (e) => { this.onSelectChanged(e) });
        }

        resetForm() {
            this.editor = tinyMCE.activeEditor ? tinyMCE.activeEditor : null;
            this.$select.val('').trigger('change');
            this.$fields.prop('checked', false);
            this.$fields.each( (i, field) => {
                var $field = jQuery(field);
                if ( $field.prop['type'] !== 'checkbox' ) {
                    $field.val('');
                }
            });
        }

        validateForm() : boolean {
            var errors = 0;
            this.$fields.each( (i, field) => {
                var $field = jQuery(field),
                    name = $field.data('scif-param'),
                    required = $field.data('scif-required');

                if ( required && ( $field.val() === '' ) ) {
                    jQuery( '.' + name + '-error' ).addClass('active');
                    errors++;
                } else {
                    jQuery( '.' + name + '-error' ).removeClass('active');
                }
            });

            if ( errors ) {
                return false;
            }

            return true;
        }

        parseShortcode() {
            var data = this.getFormValues();
            this.insertShortcode(data);
        }

        getFormValues() {
            var data = {
                command: this.selectedShortcode,
                params: {}
            };

            this.$fields.each( (i, field) => {
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

            return data;
        }

        insertShortcode(data) {
            var text = this.buildShortcode(data);
            send_to_editor( text );
        }

        buildShortcode(data) {
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
                text += enclosingText + '[/' + data.command + ']';
            }

            return text;
        }

        onSubmitBtnClick(e) {
            e.preventDefault();
            var shortcode = this.$select.val();

            var $fields = jQuery('.shortcode-' + shortcode).find('.wp-scif-field');

            if ( this.validateForm() ) {
                this.parseShortcode();
            }
        }

        onSelectChanged(e) {
            this.selectedShortcode = this.$select.val();

            if ( this.selectedShortcode.length === 0 ) {
                jQuery('#wp-scif-form-inner .active').removeClass('active');
            }

            jQuery('.shortcode-' + this.selectedShortcode).addClass('active');
            this.initPreview();
        }

        initPreview() {
            var data = this.getFormValues();

            if (data.command){
                var shortcode = this.buildShortcode(data);
                // var stylesheet = jQuery('#' + this.selectedShortcode + '-preview').data('styles');
                // var link  = jQuery('link').attr('href', stylesheet);
                jQuery('head', window.frames[this.selectedShortcode + '-preview']).append('Hello world');
                jQuery.getJSON(ajaxurl, {
                    action: 'render_shortcode',
                    shortcode: shortcode
                }, (data) => {
                    var ifrm = <any>document.getElementById(this.selectedShortcode + '-preview');
                    
                    ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
                    ifrm.document.open();
                    ifrm.document.write(data.markup);
                    ifrm.document.close();
                });   
            }         
        }
    }
}

if ( typeof jQuery !== 'undefined' ) {
    jQuery(document).ready( function() {
        new WPSCIF.ShortcodeInterface();
    });
}
