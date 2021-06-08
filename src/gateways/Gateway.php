<?php
namespace craft\commerce\helcim\gateways;

use Craft;
use craft\commerce\base\Plan;
use craft\commerce\base\RequestResponseInterface;
use craft\commerce\base\SubscriptionGateway as BaseGateway;
use craft\commerce\base\SubscriptionResponseInterface;
use craft\commerce\elements\Subscription;
use craft\commerce\errors\SubscriptionException;
use craft\commerce\models\payments\BasePaymentForm;
use craft\commerce\models\PaymentSource;
use craft\commerce\models\subscriptions\CancelSubscriptionForm;
use craft\commerce\models\subscriptions\SubscriptionForm;
use craft\commerce\models\subscriptions\SubscriptionPayment;
use craft\commerce\models\subscriptions\SwitchPlansForm;
use craft\commerce\models\Transaction;
use craft\elements\User;
use craft\web\Response as WebResponse;
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

	/**
	 * @var string
	 */
	public $apiToken;

	/**
	 * @var string
	 */
	public $terminalId;

	/**
	 * @var string
	 */
	public $jsToken;

	/**
	 * @var string
	 */
	public $accountId;




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
		//$this->configureStripeClient();
		return Craft::$app->getView()->renderTemplate('commerce-helcim/helcimSettings', ['gateway' => $this]);
	}

	public function getPaymentFormHtml( array $params ) {
		// TODO: Implement getPaymentFormHtml() method.
	}

	public function authorize( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {
		// TODO: Implement authorize() method.
	}

	public function capture( Transaction $transaction, string $reference ): RequestResponseInterface {
		// TODO: Implement capture() method.
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
		// TODO: Implement getPaymentFormModel() method.
	}

	public function purchase( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {
		// TODO: Implement purchase() method.
	}

	public function refund( Transaction $transaction ): RequestResponseInterface {
		// TODO: Implement refund() method.
	}

	public function processWebHook(): WebResponse {
		// TODO: Implement processWebHook() method.
	}

	public function supportsAuthorize(): bool {
		// TODO: Implement supportsAuthorize() method.
	}

	public function supportsCapture(): bool {
		// TODO: Implement supportsCapture() method.
	}

	public function supportsCompleteAuthorize(): bool {
		// TODO: Implement supportsCompleteAuthorize() method.
	}

	public function supportsCompletePurchase(): bool {
		// TODO: Implement supportsCompletePurchase() method.
	}

	public function supportsPaymentSources(): bool {
		// TODO: Implement supportsPaymentSources() method.
	}

	public function supportsPurchase(): bool {
		// TODO: Implement supportsPurchase() method.
	}

	public function supportsRefund(): bool {
		// TODO: Implement supportsRefund() method.
	}

	public function supportsPartialRefund(): bool {
		// TODO: Implement supportsPartialRefund() method.
	}

	public function supportsWebhooks(): bool {
		// TODO: Implement supportsWebhooks() method.
		return false;
	}

	public function getCancelSubscriptionFormHtml( Subscription $subscription ): string {
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
	}
}