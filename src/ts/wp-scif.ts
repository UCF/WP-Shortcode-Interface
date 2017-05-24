/// <reference path="./wp-scif.d.ts" />

declare var tinyMCE: any; // The WP tinymce editor
declare var tinymce: any; // The tinymce object
declare var send_to_editor: Function; // wp function for sending to primary tinymce editor

namespace WPSCIF {
    /**
     * Generates a new ShortcodeInterface
     */
    export class ShortcodeInterface {
        /**
         * The anchor button used to open the interface
         */
        public $toggle: any;
        
        /**
         * The interface container div
         */
        public $interface: any;

        /**
         * The button that writes the shortcode to the editor
         */
        public $submitBtn: any;

        /**
         * The select element with the list of shortcodes.
         */
        public $select: any;

        /**
         * The Fieldset of the active shortcode
         */
        public activeFieldSet: FieldSet;

        /**
         * The preview window
         */
        public preview: PreviewWindow;

        /**
         * The active tinymce editor
         */
        public editor: any;

        constructor() {
            this.$toggle = jQuery('#add-shortcode');
            this.$interface = jQuery('#wp-scif-form-inner');
            this.$submitBtn = this.$interface.find('#wp-scif-submit');
            this.$select = this.$interface.find('#wp-scif-select');
            this.activeFieldSet = null;
            this.editor = tinyMCE.activeEditor;
            this.preview = new PreviewWindow();
            this.preview.hide();

            this.$submitBtn.click( (e) => { this.onSubmitBtnClick(e) });
            this.$select.change( (e) => { this.onSelectChanged(e) });
        }

        /**
         * Gets selected content (if any) and generates the shortcode
         * @return {string} The shortcode string
         */
        buildShortcode() {
            var enclosingText = null;

            if (this.editor) {
                enclosingText = this.editor.selection.getContent();
            }

            return this.activeFieldSet.buildShortcode(enclosingText);
        }

        /**
         * Inserts the generated shortcode into the tinymce editor
         */
        insertShortcode() {
            var text = this.buildShortcode();
            send_to_editor( text );
        }

        /**
         * Event handler for when then $submitBtn is clicked
         * @param e {EventArgs}
         */
        onSubmitBtnClick(e) {
            e.preventDefault();

            if ( this.activeFieldSet.isValid() ) {
                this.insertShortcode();
            }
        }

        /**
         * Event hanlder for when the shortcode select changes value.
         * @param e {EventArgs}
         */
        onSelectChanged(e) {
            if (this.activeFieldSet) {
                this.activeFieldSet.destroy();
                this.activeFieldSet.$container.unbind('wpscif:fieldset:update');
            }

            var sc = this.$select.val();

            this.activeFieldSet = new FieldSet(sc);

            if (this.activeFieldSet.supportsPreview) {
                this.activeFieldSet.$container.on('wpscif:fieldset:update', () => {
                    this.updatePreview();
                });

                this.updatePreview();

                this.preview.show();
            } else {
                this.preview.hide();
            }
        }

        /**
         * Updates the preview window
         */
        updatePreview() {
            var shortcode = this.buildShortcode();
            this.preview.write(shortcode);
        }
    }
}

if ( typeof jQuery !== 'undefined' ) {
    jQuery(document).ready( () => {
        var shortcodeInterface: WPSCIF.ShortcodeInterface;

        tinymce.on('addeditor', (e) => {
            if ( ! shortcodeInterface) {
                shortcodeInterface = new WPSCIF.ShortcodeInterface();   
            }
        });
    });
}
