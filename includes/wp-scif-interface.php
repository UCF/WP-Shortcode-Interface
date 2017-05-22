<?php
/**
 * Shortcode Interface
 **/
$shortcodes = WP_SCIF_Config::installed_shortcodes();
?>
<div id="wp-scif-form" style="display:none">
    <div id="wp-scif-form-inner">
        <label for="wp-scif-select">Select a shortcode: </label>
        <p class="help-text">
            This shortcode will be inserted into the editor when you click the "Insert into Post" button.
        </p>
        <div class="cols">
            <div class="col-left">
                <select name="wp-scif-select" id="wp-scif-select">
                    <option value="">--Choose Shortcode--</option>
                    <?php
                    foreach( $shortcodes as $shortcode ) {
                        echo $shortcode->get_option_markup();
                    }
                    ?>
                </select>
            </div>
            <div class="col-right">
                <div id="shortcode-descriptions">
                    <?php
                    foreach( $shortcodes as $shortcode ) {
                        echo $shortcode->get_description_markup();
                    }
                    ?>
                </div>
            </div>
        </div>
        <div id="shortcode-editors">
            <?php
            foreach( $shortcodes as $shortcode ) {
                echo $shortcode->get_form_markup();
            }
            ?>
        </div>
		<div id="scif-preview-window">
			<iframe id="scif-preview-iframe" src="<?php echo admin_url( 'admin-post.php?action=render_preview' ); ?>"></iframe>
		</div>
        <button class="button-primary" id="wp-scif-submit">Insert into Post</button>
    </div>
</div>
