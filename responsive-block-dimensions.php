<?php
/**
 * Plugin Name:       Responsive Block Dimensions
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       responsive-block-dimensions
 *
 * @package CreateBlock
 */

namespace RESPONSIVE_BLOCK_DIMENSIONS;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/vendor/autoload.php';

define( 'RBD_VERSION', '0.1.0' );

class RBD {

	/**
	 * Construct.
	 */
	public function __construct() {
	}

	/**
	 * Init.
	 */
	public function init() {
		add_action(
			'enqueue_block_editor_assets',
			function () {
				wp_enqueue_script( 'rbd-filters', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor', 'wp-i18n' ), filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ) );
			}
		);
	}

	// Register block extensions.
	public function add_rbd_attributes( $metadata ) {

		// Blocks to extend.
		$blocks = array( 'core/group' );

		if ( in_array( $metadata['name'], $blocks ) ) {
			// Register the margin and padding settings.
			$metadata['attributes'] = array_merge(
				$metadata['attributes'],
				array(
					'attributes' => array(
						'responsiveMarginTop'     => array(
							'type'    => 'string',
							'default' => '',
						),
						'responsiveMarginBottom'  => array(
							'type'    => 'string',
							'default' => '',
						),
						'responsivePaddingTop'    => array(
							'type'    => 'string',
							'default' => '',
						),
						'responsivePaddingBottom' => array(
							'type'    => 'string',
							'default' => '',
						),
					),
				),
			);
		}

		return $metadata;
	}

	// Add the responsive media controls to the Block Inspector.
	public function rbd_add_controls( $settings, $post ) {
		// Only add controls in the block editor.
		if ( ! is_admin() ) {
			return $settings;
		}

		// Add responsive padding and margin controls for blocks.
		$settings['attributes']['responsiveMarginTop']     = array(
			'type'    => 'string',
			'default' => '',
		);
		$settings['attributes']['responsiveMarginBottom']  = array(
			'type'    => 'string',
			'default' => '',
		);
		$settings['attributes']['responsivePaddingTop']    = array(
			'type'    => 'string',
			'default' => '',
		);
		$settings['attributes']['responsivePaddingBottom'] = array(
			'type'    => 'string',
			'default' => '',
		);

		return $settings;
	}
}

$rbd = new RBD();
$rbd->init();
