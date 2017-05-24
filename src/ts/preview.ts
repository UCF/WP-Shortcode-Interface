namespace WPSCIF {
    export class PreviewWindow {
        /**
         * The Iframe Element
         */
        iframe: any;

        /**
         * The contentWindow||contentDocument of the iFrame
         */
        document: any;

        /**
         * The container div of the iframe
         */
        $container: any;

        /**
         * The loading gif for iframe transitions
         */
        $loadIcon: any;

        /**
         * Generators a new PreviewWindow
         */
        constructor() {
            this.iframe = <HTMLIFrameElement>jQuery('#scif-preview-iframe').get(0);
            
            this.document = this.iframe.contentWindow || this.iframe.contentDocument;
            this.$container = jQuery('#scif-preview-window');
            this.$loadIcon = jQuery('#scif-loading');

            jQuery(this.iframe).load( () => {
                this.document = this.iframe.contentWindow || this.iframe.contentDocument;

                this.document.onunload = () => {
                    this.$loadIcon.show();
                };
                this.$loadIcon.hide();
            });
        }

        /**
         * Updates the iframe with the updated shortcode string
         * @param content {string} The shortcode output
         */
        write(content: string) {
            var parser = document.createElement('a');
            parser.href = this.iframe.src;
            
            var params = this.parseSearch(parser.search);
            params['shortcode'] = content;

            this.iframe.src = this.buildUrl(parser, params);
        }

        /**
         * Shows the preview window
         */
        show() {
            this.$container.show();
        }

        /**
         * Hides the preview window
         */
        hide() {
            this.$container.hide();
        }

        /**
         * Parses a search string into an array
         * @param search A url search string
         * @return {Array<string>}
         */
        parseSearch(search: string): Array<string> {
            var retval = Array<string>();
            var paramString = search.substring(1);
            var splitAnd = paramString.split('&');
            
            for(var i in splitAnd) {
                var p = splitAnd[i].split('=');
                retval[p[0]] = p[1];
            }

            return retval;
        }

        /**
         * Parses a search array into a string
         * @param params {Array<string>}
         * @return {string}
         */
        buildSearch(params: Array<string>): string {
            var retval = '?';
            var paramsJoined = new Array<string>();

            for(var i in params) {
                paramsJoined.push(i + '=' + encodeURIComponent(params[i]));
            }

            return retval + paramsJoined.join('&');
        }

        /**
         * 
         * @param parser {HTMLAnchorElement} An anchor element
         * @param params {Array<string>} The search params
         */
        buildUrl(parser, params) {
            var retval = parser.protocol + '//';
            retval += parser.hostname;
            retval += parser.pathname;
            retval += this.buildSearch(params);

            return retval;
        }
    }
}
