namespace WPSCIF {
    export class PreviewWindow {
        iframe: any;
        document: any;
        $container: any;
        $loadIcon: any;

        constructor() {
            this.iframe = <HTMLIFrameElement>jQuery('#scif-preview-iframe').get(0);
            
            this.document = this.iframe.contentWindow || this.iframe.contentDocument;
            this.$container = jQuery('#scif-preview-window');
            this.$loadIcon = jQuery('#scif-preview-load');

            jQuery(this.iframe).load( () => {
                this.document = this.iframe.contentWindow || this.iframe.contentDocument;

                this.document.onunload = () => {
                    this.$loadIcon.show();
                };
                this.$loadIcon.hide();
            });
        }

        write(content: string) {
            var parser = document.createElement('a');
            parser.href = this.iframe.src;
            
            var params = this.parseSearch(parser.search);
            params['shortcode'] = content;

            this.iframe.src = this.buildUrl(parser, params);
        }

        show() {
            this.$container.show();
        }

        hide() {
            this.$container.hide();
        }

        parseSearch(search: string) {
            var retval = [];
            var paramString = search.substring(1);
            var splitAnd = paramString.split('&');
            
            for(var i in splitAnd) {
                var p = splitAnd[i].split('=');
                retval[p[0]] = p[1];
            }

            return retval;
        }

        buildSearch(params: Array<string>) {
            var retval = '?';
            var paramsJoined = new Array<string>();

            for(var i in params) {
                paramsJoined.push(i + '=' + encodeURIComponent(params[i]));
            }

            return retval + paramsJoined.join('&');
        }

        buildUrl(parser, params) {
            var retval = parser.protocol + '//';
            retval += parser.hostname;
            retval += parser.pathname;
            retval += this.buildSearch(params);

            return retval;
        }
    }
}
