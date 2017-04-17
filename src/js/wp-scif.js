class ShortcodeInterface {
  constructor() {
    this.submitBtn = jQuery('#wp-scif-submit');
    this.select = jQuery('#wp-scif-select');
  }
}

if ( 'undefined' !== typeof jQuery ) {
  jQuery(document).ready(function() {
    new ShortcodeInterface();
  });
}
