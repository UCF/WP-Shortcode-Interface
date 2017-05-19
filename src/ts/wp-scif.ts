/// <reference path="./wp-scif.d.ts" />

declare var tinyMCE: any;
declare var send_to_editor: Function;
declare var ajaxurl: string;

namespace WPSCIF {
    export class ShortcodeInterface {
        public $toggle: any;
        public $interface: any;
        public $submitBtn: any;
        public $select: any;
        public activeFieldSet: FieldSet;
        public editor: any;

        constructor() {
            this.$toggle = jQuery('#add-shortcode');
            this.$interface = jQuery('#wp-scif-form-inner');
            this.$submitBtn = this.$interface.find('#wp-scif-submit');
            this.$select = this.$interface.find('#wp-scif-select');
            this.activeFieldSet = null;
            this.editor = tinyMCE.activeEditor;

            this.$submitBtn.click( (e) => { this.onSubmitBtnClick(e) });
            this.$select.change( (e) => { this.onSelectChanged(e) });
        }

        buildShortcode() {
            var enclosingText = null;

            if (this.editor) {
                enclosingText = this.editor.selection.getContent();
            }

            return this.activeFieldSet.buildShortcode(enclosingText);
        }

        insertShortcode() {
            var text = this.buildShortcode();
            send_to_editor( text );
        }

        onSubmitBtnClick(e) {
            e.preventDefault();

            if ( this.activeFieldSet.isValid() ) {
                this.insertShortcode();
            }
        }

        onSelectChanged(e) {
            if (this.activeFieldSet) {
                this.activeFieldSet.destroy();
            }

            var sc = this.$select.val();

            this.activeFieldSet = new FieldSet(sc);

            this.initPreview();
        }

        initPreview() {

        }
    }
}

if ( typeof jQuery !== 'undefined' ) {
    jQuery(document).ready( function() {
        new WPSCIF.ShortcodeInterface();
    });
}
