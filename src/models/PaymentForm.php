<?php
namespace craft\commerce\helcim\models;

use craft\commerce\models\payments\CreditCardPaymentForm;
use craft\commerce\models\PaymentSource;
use craft\commerce\helcim\Plugin;
use craft\commerce\Plugin as Commerce;
use yii\base\BaseObject;

class PaymentForm extends CreditCardPaymentForm
{
	/**
	 * @var string $response from helcim JS.
	 */
	public $response;

	public $approvalCode;

	public $transactionId;

	public $responseMessage;

	public $cardToken;

	public $cardNumber;

	public $cardType;

	public $customerCode;

	public $customer;

	// Public methods
	// =========================================================================
	/**
	 * @inheritdoc
	 */
	public function setAttributes($values, $safeOnly = true): void
	{
		parent::setAttributes($values, $safeOnly);

		if (isset($values['cardToken'])) {
			$this->token = $values['cardToken'];
		}
	}

	/**
	 * @inheritdoc
	 */
	public function rules(): array
	{
		return [];
	}

	/**
	 * @inheritdoc
	 */
	public function populateFromPaymentSource(PaymentSource $paymentSource):void
	{
		$this->cardToken = $paymentSource->token;

		$this->customer = 'CUST'.\Craft::$app->getUser()->getId();
	}
}