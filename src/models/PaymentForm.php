<?
namespace craft\commerce\helcim\models;

use craft\commerce\models\payments\CreditCardPaymentForm;
use craft\commerce\models\PaymentSource;
use craft\commerce\helcim\Plugin;

class PaymentForm extends CreditCardPaymentForm
{
	/**
	 * @var string $response from helcim JS.
	 */
	public $response;

	public $approvalCode;

	public $transactionId;

	public $responseMessage;



	// Public methods
	// =========================================================================
	/**
	 * @inheritdoc
	 */
	/*public function setAttributes($values, $safeOnly = true)
	{
		parent::setAttributes($values, $safeOnly);

		if (isset($values['stripeToken'])) {
			$this->token = $values['stripeToken'];
		}
	}*/

	/**
	 * @inheritdoc
	 */
	public function rules(): array
	{
		return [
			[['response','approvalCode','transactionId'], 'required']
		];
	}

	/**
	 * @inheritdoc
	 */
	/*public function populateFromPaymentSource(PaymentSource $paymentSource)
	{
		$this->token = $paymentSource->token;

		$customer = Plugin::getInstance()->getCustomers()->getCustomer($paymentSource->gatewayId, $paymentSource->getUser());
		$this->customer = $customer->reference;
	}*/
}