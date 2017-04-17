<?php
/**
 * Shortcode Interface
 **/
$shortcodes = WP_SCIF_Config::installed_shortcodes();
?>
<div id="select-shortcode-form">
    <div id="select-shortcode-form-inner">
        <label for="shortcode-select">Select a shortcode: </label>
        <p class="help-text">
            This shortcode will be inserted into the editor when you click the "Insert into Post" button.
        </p>
        <div class="cols">
            <div class="col-left">
                <select name="shortcode-select" id="shortcode-select">
                    <option value="">--Choose Shortcode--</option>
                    <?php
                    foreach( $shortcodes as $shortcode ) {
                        echo $shortcode->get_option_markup();
                    }
                    ?>
                </select>
            </div>
            <div class="col-right">
                <ul id="shortcode-descriptions">
                    <?php
                    foreach( $shortcodes as $shortcode ) {
                        echo $shortcode->get_description_markup();
                    }
                    ?>
                </ul>
            </div>
        </div>
        <ul id="shortcode-editors">
            <?php
            foreach( $shortcodes as $shortcode ) {
                echo $shortcode->get_form_markup();
            }
            ?>
        </ul>
        <button class="button-primary" id="shortcode-submit">Insert into Post</button>
    </div>
</div>
