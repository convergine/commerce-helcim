<?php

namespace craft\commerce\helcim\assets;

use craft\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Asset bundle for the Payment Form
 */
class ChargeFormAsset extends AssetBundle
{
	/**
	 * @inheritdoc
	 */
	public function init()
	{
		$this->sourcePath = __DIR__;

		$this->js = [
			'js/paymentForm.js',
		];

		$this->depends = [
			//JqueryAsset::class,
		];

		$this->css = [
			'css/paymentForm.css',
		];

		parent::init();
	}
}
