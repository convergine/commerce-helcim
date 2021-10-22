<?php
namespace craft\commerce\helcim\gateways;

use Craft;
use craft\commerce\base\Plan;
use craft\commerce\base\RequestResponseInterface;
use craft\commerce\base\Gateway as BaseGateway;
use craft\commerce\base\SubscriptionResponseInterface;
use craft\commerce\elements\Subscription;
use craft\commerce\errors\SubscriptionException;
use craft\commerce\helcim\models\PaymentForm;
use craft\commerce\models\payments\BasePaymentForm;
use craft\commerce\models\PaymentSource;
use craft\commerce\models\subscriptions\CancelSubscriptionForm;
use craft\commerce\models\subscriptions\SubscriptionForm;
use craft\commerce\models\subscriptions\SubscriptionPayment;
use craft\commerce\models\subscriptions\SwitchPlansForm;
use craft\commerce\models\Transaction;
use craft\commerce\Plugin as Commerce;
use craft\commerce\helcim\assets\ChargeFormAsset;
use craft\commerce\helcim\responses\ChargeResponse;
use craft\elements\User;
use craft\web\Response as WebResponse;
use craft\web\View;
use GuzzleHttp\Client;
use Throwable;

/**
 * Gateway represents Helcim JS gateway
 *
 * @author    Convergine <support@convergine.com>
 * @since     1.0
 */
class Gateway extends BaseGateway {
	// Properties
	// =========================================================================

	/**
	 * @var string
	 */
	public $testMode;

	public $hashAmount;

	public $reCaptchaSite;

	/**
	 * @var string
	 */
	public $apiSecret;

	public $apiToken;

	public $apiAccountId;

	public $enableServersideProtection;

	/**
	 * @var string
	 */
	public $jsToken;


	// Public Methods
	// =========================================================================

	/**
	 * @inheritdoc
	 */
	public static function displayName(): string {
		return Craft::t( 'commerce', 'Helcim' );
	}

	/**
	 * @inheritdoc
	 */
	public function getSettingsHtml()
	{

		return Craft::$app->getView()->renderTemplate('commerce-helcim/helcimSettings', ['gateway' => $this]);
	}

	public function getPaymentFormHtml( array $params ) {

		$defaults = [
			'gateway' => $this,
			'paymentForm' => $this->getPaymentFormModel(),
		];

		$params = array_merge($defaults, $params);

		// If there's no order passed, add the current cart if we're not messing around in backend.
		if (!isset($params['order']) && !Craft::$app->getRequest()->getIsCpRequest()) {
			$billingAddress = Commerce::getInstance()->getCarts()->getCart()->getBillingAddress();

			if (!$billingAddress) {
				$billingAddress = Commerce::getInstance()->getCustomers()->getCustomer()->getPrimaryBillingAddress();
			}
		} else {
			$billingAddress = $params['order']->getBillingAddress();
		}

		if ($billingAddress) {
			$params['billingAddress'] = $billingAddress;
		}

		$amount = Commerce::getInstance()->getCarts()->getCart()->getItemTotal();
		$params['amount'] = number_format($amount,2,'.','');

		$params['currency'] = Commerce::getInstance()->getPaymentCurrencies()->getPrimaryPaymentCurrency()->iso;

		$params['test'] = $this->testMode;

		$params['hashAmount'] = $this->hashAmount;
		if($this->hashAmount){

			$params['amountHash'] = hash('sha256',$this->apiSecret.number_format($amount,2,'.',''));
		}

		if($this->reCaptchaSite){
			$params['reCaptchaSite'] = $this->reCaptchaSite;
		}

		$view = Craft::$app->getView();

		$previousMode = $view->getTemplateMode();
		$view->setTemplateMode(View::TEMPLATE_MODE_CP);

		//$view->registerJsFile('https://js.stripe.com/v3/');
		$view->registerAssetBundle(ChargeFormAsset::class);

		$html = $view->renderTemplate('commerce-helcim/chargeForm', $params);
		$view->setTemplateMode($previousMode);

		return $html;

	}

	public function authorize( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {
		// TODO: Implement authorize() method.
		Craft::dump('authorize');
		Craft::dump($transaction);
		Craft::dump($form);
		exit();
	}

	public function capture( Transaction $transaction, string $reference ): RequestResponseInterface {
		// TODO: Implement capture() method.
		Craft::dump('capture');
		Craft::dump($transaction);
		Craft::dump($reference);
		exit();

	}

	public function completeAuthorize( Transaction $transaction ): RequestResponseInterface {
		// TODO: Implement completeAuthorize() method.
	}

	public function completePurchase( Transaction $transaction ): RequestResponseInterface {
		// TODO: Implement completePurchase() method.
	}

	public function createPaymentSource( BasePaymentForm $sourceData, int $userId ): PaymentSource {
		// TODO: Implement createPaymentSource() method.
	}

	public function deletePaymentSource( $token ): bool {
		// TODO: Implement deletePaymentSource() method.
	}

	public function getPaymentFormModel(): BasePaymentForm {
		return new PaymentForm();
	}

	public function purchase( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {
		/*Craft::dump('purchase');
		//Craft::dump($transaction);


		$request = Craft::$app->getRequest()->getParams();
		Craft::dump($request);*/

		if($this->enableServersideProtection) {

			$url      = 'https://secure.myhelcim.com/api/';
			$sendData = [
				'action'        => 'transactionView',
				'accountId'     => $this->apiAccountId,
				'apiToken'      => $this->apiToken,
				'transactionId' => $form->transactionId
			];

			$client  = new Client();
			$options = [
				'form_params' => $sendData,
			];

			$res = $client->request( 'POST', $url, $options );
			//Craft::dump( $res->getStatusCode() );
			if ( $res->getStatusCode() == 200 ) {

				$response = (string) $res->getBody();
				//Craft::dump( $response );
				$xmlData = simplexml_load_string( $response );

				if ( $xmlData->response && (string) $xmlData->response == 0 ) {
					//Craft::dump( (string) $xmlData->responseMessage );
					$form->response=0;
					$form->responseMessage = (string) $xmlData->responseMessage;
				} elseif ( (string) $xmlData->transaction->status != 'APPROVED' ) {
					//Craft::dump( (string) $xmlData->transaction->status );
					$form->response=0;
					$form->responseMessage = 'Transaction not approved';
				}
			}
		}

		//Craft::dump($form);

		//exit();
		return $this->getResponseModel((array)$form);


	}

	/**
	 * @inheritdoc
	 */
	public function getResponseModel($data): RequestResponseInterface
	{

		return new ChargeResponse($data);
	}

	public function refund( Transaction $transaction ): RequestResponseInterface {
		// TODO: Implement refund() method.
	}

	public function processWebHook(): WebResponse {
		// TODO: Implement processWebHook() method.
	}

	public function supportsAuthorize(): bool {
		// TODO: Implement supportsAuthorize() method.
		return false;
	}

	public function supportsCapture(): bool {
		// TODO: Implement supportsCapture() method.
		return false;
	}

	public function supportsCompleteAuthorize(): bool {
		// TODO: Implement supportsCompleteAuthorize() method.
		return false;
	}

	public function supportsCompletePurchase(): bool {
		// TODO: Implement supportsCompletePurchase() method.
	}

	public function supportsPaymentSources(): bool {
		return false;
	}

	public function supportsPurchase(): bool {
		// TODO: Implement supportsPurchase() method.
		return true;
	}

	public function supportsRefund(): bool {
		return false;
	}

	public function supportsPartialRefund(): bool {
		// TODO: Implement supportsPartialRefund() method.
		return false;
	}

	public function supportsWebhooks(): bool {
		// TODO: Implement supportsWebhooks() method.
		return false;
	}

	/*public function getCancelSubscriptionFormHtml( Subscription $subscription ): string {
		// TODO: Implement getCancelSubscriptionFormHtml() method.
	}

	public function getCancelSubscriptionFormModel(): CancelSubscriptionForm {
		// TODO: Implement getCancelSubscriptionFormModel() method.
	}

	public function getPlanSettingsHtml( array $params = [] ) {
		// TODO: Implement getPlanSettingsHtml() method.
	}

	public function getPlanModel(): Plan {
		// TODO: Implement getPlanModel() method.
	}

	public function getSubscriptionFormModel(): SubscriptionForm {
		// TODO: Implement getSubscriptionFormModel() method.
	}

	public function getSwitchPlansFormModel(): SwitchPlansForm {
		// TODO: Implement getSwitchPlansFormModel() method.
	}

	public function cancelSubscription( Subscription $subscription, CancelSubscriptionForm $parameters ): SubscriptionResponseInterface {
		// TODO: Implement cancelSubscription() method.
	}

	public function getNextPaymentAmount( Subscription $subscription ): string {
		// TODO: Implement getNextPaymentAmount() method.
	}

	public function getSubscriptionPayments( Subscription $subscription ): array {
		// TODO: Implement getSubscriptionPayments() method.
	}

	public function getSubscriptionPlanByReference( string $reference ): string {
		// TODO: Implement getSubscriptionPlanByReference() method.
		return '';
	}

	public function getSubscriptionPlans(): array {
		// TODO: Implement getSubscriptionPlans() method.
	}

	public function subscribe( User $user, Plan $plan, SubscriptionForm $parameters ): SubscriptionResponseInterface {
		// TODO: Implement subscribe() method.
	}

	public function switchSubscriptionPlan( Subscription $subscription, Plan $plan, SwitchPlansForm $parameters ): SubscriptionResponseInterface {
		// TODO: Implement switchSubscriptionPlan() method.
	}

	public function supportsReactivation(): bool {
		// TODO: Implement supportsReactivation() method.
	}

	public function supportsPlanSwitch(): bool {
		// TODO: Implement supportsPlanSwitch() method.
	}

	public function getHasBillingIssues( Subscription $subscription ): bool {
		// TODO: Implement getHasBillingIssues() method.
	}

	public function getBillingIssueDescription( Subscription $subscription ): string {
		// TODO: Implement getBillingIssueDescription() method.
	}

	public function getBillingIssueResolveFormHtml( Subscription $subscription ): string {
		// TODO: Implement getBillingIssueResolveFormHtml() method.
	}*/
}