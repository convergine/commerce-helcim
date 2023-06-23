<?php
namespace craft\commerce\helcim\gateways;

use Craft;
use craft\commerce\base\RequestResponseInterface;
use craft\commerce\base\Gateway as BaseGateway;
use craft\commerce\behaviors\CustomerBehavior;
use craft\commerce\helcim\errors\PaymentSourceException;
use craft\commerce\helcim\models\PaymentForm;
use craft\commerce\models\payments\BasePaymentForm;
use craft\commerce\models\PaymentSource;
use craft\commerce\records\PaymentSource as PaymentSourceRecord;
use craft\commerce\models\Transaction;
use craft\commerce\Plugin as Commerce;
use craft\commerce\helcim\assets\ChargeFormAsset;
use craft\commerce\helcim\responses\ChargeResponse;
use craft\elements\User;
use craft\web\Response as WebResponse;
use craft\web\View;
use GuzzleHttp\Client;
use yii\base\NotSupportedException;



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
	public $hashAmount;

	/**
	 * @var boolean
	 */
	public $reCaptchaSite;

	/**
	 * @var string
	 */
	public $apiSecret;

	/**
	 * @var string
	 */
	public $apiToken;

	/**
	 * @var string
	 */
	public $apiAccountId;

	/**
	 * @var boolean
	 */
	public $enableServersideProtection;

	/**
	 * @var string
	 */
	public $accountId;

	/**
	 * @var string
	 */
	public $terminalId;

	/**
	 * @var string
	 */
	public $jsToken;

	private const API_URL = 'https://secure.myhelcim.com/api/';


	// Public Methods
	// =========================================================================

	/**
	 * @return string
	 */
	public static function displayName(): string {
		return Craft::t( 'commerce', 'Helcim' );
	}

	/**
	 * @return string|null
	 * @throws \Twig\Error\LoaderError
	 * @throws \Twig\Error\RuntimeError
	 * @throws \Twig\Error\SyntaxError
	 * @throws \yii\base\Exception
	 */
	public function getSettingsHtml(): ?string
	{

		return Craft::$app->getView()->renderTemplate('commerce-helcim/helcimSettings', ['gateway' => $this]);
	}

	/**
	 * @param array $params
	 *
	 * @return string|null
	 * @throws \Throwable
	 * @throws \Twig\Error\LoaderError
	 * @throws \Twig\Error\RuntimeError
	 * @throws \Twig\Error\SyntaxError
	 * @throws \craft\errors\ElementNotFoundException
	 * @throws \yii\base\Exception
	 * @throws \yii\base\InvalidConfigException
	 */
	public function getPaymentFormHtml( array $params ): ?string {

		$defaults = [
			'gateway' => $this,
			'paymentForm' => $this->getPaymentFormModel(),
		];

		$asset_url = Craft::$app->assetManager->getPublishedUrl(
			dirname(__DIR__).'/assets/images',
			true
		);



		$params = array_merge($defaults, $params);
		$params['asset_url']=$asset_url;
		$params['customerID']='';
		$params['orderID']='';
		$billingAddress = $shippingAddress = [];
		// If there's no order passed, add the current cart if we're not messing around in backend.
		if (!isset($params['order']) && !Craft::$app->getRequest()->getIsCpRequest()) {

			if(!Craft::$app->getUser()->getIsGuest()){
				$params['customerID'] = 'CUST'.Craft::$app->getUser()->getId();

			}
			if ($cart = Commerce::getInstance()->getCarts()->getCart()) {
				$billingAddress = $cart->getBillingAddress();
				$shippingAddress = $cart->getShippingAddress();

				/** @var User|CustomerBehavior|null $user */
				$user = $cart->getCustomer();
				if (!$billingAddress && $user) {
					$billingAddress = $user->getPrimaryBillingAddress();
				}
				$params['orderID'] = 'ORD-'.$cart->getShortNumber();
			}


		} else {
			$cart = $params['order'];
			$params['orderID']='ORD-'.$cart->getShortNumber();
			$billingAddress = $cart->getBillingAddress();
			$shippingAddress = $cart->getShippingAddress();
		}

		if ($billingAddress) {
			$params['billingAddress'] = $billingAddress;

		}
		if($shippingAddress){
			$params['shippingAddress'] = $shippingAddress;
		}
		$params['customerEmail'] = $cart->getEmail();

		$amount = $cart->getTotal();
		$tax = $cart->getTotalTax();
		$discount = $cart->getTotalDiscount();
		$shipping = $cart->getTotalShippingCost();
		$items = $cart->getLineItems();

		$items_array=[];
		foreach ($items as $item){

			$line=[];
			$line['title']=$item->getDescription();
			$line['sku']=$item->getSku();
			$line['qty']=$item->qty;
			$line['price']=$item->price;
			$line['total']=$item->getSubtotal();
			$items_array[]=$line;
		}
		$params['items'] = $items_array;
		$params['amount'] = number_format($amount,2,'.','');
		$params['tax'] = number_format($tax,2,'.','');
		$params['discount'] = number_format($discount*-1,2,'.','');
		$params['shipping'] = number_format($shipping,2,'.','');

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


		$view->registerAssetBundle(ChargeFormAsset::class);

		$html = $view->renderTemplate('commerce-helcim/chargeForm', $params);
		$view->setTemplateMode($previousMode);

		return $html;

	}

	/**
	 * @inheritdoc
	 *
	 * @return ChargeResponse
	 * @throws NotSupportedException
	 */
	public function authorize( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {

		return $this->_process($transaction,$form,'card/pre-authorization');
	}

	/**
	 * @inheritdoc
	 *
	 * @return ChargeResponse
	 * @throws NotSupportedException
	 * @throws \GuzzleHttp\Exception\GuzzleException
	 */
	public function capture( Transaction $transaction, string $reference ): RequestResponseInterface {

		$form = [];
		if ( $this->enableServersideProtection ) {
			$sendData = ['transactionId'=>$reference,'amount'=>$transaction->amount];

			$apiResponse = $this->sendApiRequest( $sendData, 'card/capture' );

			if ( $apiResponse ) {
				if(isset($apiResponse->transaction) && $apiResponse->transaction->transactionId) {
					$form['response']      = '1';
					$form['transactionId'] = (string) $apiResponse->transaction->transactionId;
					$form['cardToken'] = (string) $apiResponse->transaction->cardToken;
				}else{
					$form['response']        = 0;
					$form['responseMessage'] = (string) $apiResponse->responseMessage;
				}
			} else {
				$form['response']        = 0;
				$form['responseMessage'] = 'Connection aborted';
			}

		}
		return $this->getResponseModel($form);
	}

	/**
	 * @inheritdoc
	 *
	 * @return ChargeResponse
	 * @throws NotSupportedException
	 */
	public function completeAuthorize( Transaction $transaction ): RequestResponseInterface {

		if (!$this->supportsCompleteAuthorize()) {
			throw new NotSupportedException(Craft::t('commerce', 'Completing authorization is not supported by this gateway'));
		}
		return $this->getResponseModel((array)$transaction);
	}

	/**
	 * @inheritdoc
	 *
	 * @return ChargeResponse
	 * @throws NotSupportedException
	 */
	public function completePurchase( Transaction $transaction ): RequestResponseInterface {

		if (!$this->supportsCompletePurchase()) {
			throw new NotSupportedException(Craft::t('commerce', 'Completing purchase is not supported by this gateway'));
		}
		return $this->getResponseModel((array)$transaction);
	}

	/**
	 * @param BasePaymentForm $sourceData
	 * @param int $userId
	 *
	 * @return PaymentSource
	 * @throws PaymentSourceException
	 */
	public function createPaymentSource( BasePaymentForm $sourceData, int $userId ): PaymentSource {

		try {
			$cardF4L4 = preg_replace('/[^\d]+/',"",$sourceData->cardNumber);
			$token         = $sourceData->cardToken . '_' . $cardF4L4;
			$description   = Craft::t( 'commerce-helcim', '{cardType} card {cardF4L4}', [
				'cardType' => $sourceData->cardType,
				'cardF4L4' => $sourceData->cardNumber
			] );

			$paymentSource = new PaymentSource( [
				'customerId'      => $userId,
				'gatewayId'   => $this->id,
				'token'       => $token,
				'response'    =>  json_encode($sourceData),
				'description' => $description
			] );

			// if customer trying to save existing card, try to get it from db
			if($token_record = PaymentSourceRecord::findOne(['customerId'=>$userId,'token'=>$token])){
				$paymentSource->id = $token_record->id;
			}

			return $paymentSource;
		}catch (\Throwable $exception){

			throw new PaymentSourceException($exception->getMessage());
		}
	}

	/**
	 * @param string $token
	 *
	 * @return bool
	 */
	public function deletePaymentSource( string $token ): bool {
		// Helcim API does not support removing payment source
		return false;
	}

	/**
	 * @return BasePaymentForm
	 */
	public function getPaymentFormModel(): BasePaymentForm {
		return new PaymentForm();
	}

	/**
	 * @param Transaction $transaction
	 * @param BasePaymentForm $form
	 *
	 * @return RequestResponseInterface
	 * @throws \GuzzleHttp\Exception\GuzzleException
	 * @throws \yii\base\Exception
	 */
	public function purchase( Transaction $transaction, BasePaymentForm $form ): RequestResponseInterface {


		return $this->_process($transaction,$form,'card/purchase');


	}

	protected function _process( Transaction $transaction, BasePaymentForm $form, string $type ): RequestResponseInterface {
		$order           = $transaction->getOrder();
		$billing_address = $order->getBillingAddress();
		$order_items     = $order->getLineItems();

		/*
		 * Process purchase via saved payment source
		 */
		if ( $form->response == null && ! empty( $form->cardToken ) ) {

			$_token    = explode( '_', $form->cardToken );
			$cardToken = $_token[0];
			$cardF4L4  = $_token[1];

		} else {

			$cardToken = $form->token;
			$cardF4L4  = preg_replace( '/[^\d]+/', "", $form->cardNumber );

		}
		$customerNumber = 'CUST' . Craft::$app->getUser()->getId();
		$orderNumber    = 'ORD-' . $order->getShortNumber();
		$currency       = Commerce::getInstance()->getCurrencies()->getCurrencyByIso( $transaction->paymentCurrency );
		$taxDetails     = Commerce::getInstance()->getTaxCategories()->getDefaultTaxCategory()->name;
		$sendData       = [

			'customerCode' => $customerNumber,
			'cardToken'    => $cardToken,
			'cardF4L4'     => $cardF4L4,
			'cardF4L4Skip' => 0,
			'amount'       => $transaction->paymentAmount,
			'currency'     => $currency->alphabeticCode,
			'orderNumber'  => $orderNumber
		];

		$shippingMethod = $order->getShippingMethod();
		$sendInvoice    = [
			'dateIssued'      => ( new \DateTime() )->format( 'Y-m-d' ),
			'orderNumber'     => $orderNumber,
			'status'          => 'due',
			'paymentTerms'    => 1,
			'customerCode'    => $customerNumber,
			'currency'        => $currency->alphabeticCode,
			'amountShipping'  => $order->getTotalShippingCost(),
			'shippingMethod'  => $shippingMethod ? $shippingMethod->getName() : "Shipping",
			'amountTax'       => $order->getTotalTax(),
			'taxDetails'      => $taxDetails,
			'amountDiscount'  => abs( $order->getTotalDiscount() ),
			'discountDetails' => '',

			'billing_contactName'  => $billing_address->fullName,
			'billing_businessName' => $billing_address->getOrganization(),
			'billing_street1'      => $billing_address->getAddressLine1(),
			'billing_street2'      => $billing_address->getAddressLine2(),
			'billing_city'         => $billing_address->getLocality(),
			'billing_province'     => $billing_address->getAdministrativeArea(),
			'billing_country'      => $billing_address->getCountryCode(),
			'billing_postalCode'   => $billing_address->getPostalCode(),
			'billing_phone'        => '',
			'billing_fax'          => '',
			'billing_email'        => $order->getEmail(),

		];
		$i              = 1;
		foreach ( $order_items as $item ) {
			$sendInvoice[ 'itemSKU' . $i ]          = $item->getSku();
			$sendInvoice[ 'itemDescription' . $i ]  = $item->getDescription();
			$sendInvoice[ 'itemSerialNumber' . $i ] = '';
			$sendInvoice[ 'itemQuantity' . $i ]     = $item->qty;
			$sendInvoice[ 'itemPrice' . $i ]        = $item->getSalePrice();
			$sendInvoice[ 'itemTotal' . $i ]        = $item->getSubtotal();
			$sendInvoice[ 'itemTaxable' . $i ]      = $item->getIsTaxable();
			$i ++;
		}
		if ( $this->testMode ) {
			$sendData['test']    = 1;
			$sendInvoice['test'] = 1;
		}
		$apiResponse = $this->sendApiRequest( $sendInvoice, 'invoice/modify' );

		// validate,6 if pay by saved card
		if(isset( $_token )) {
			if ( $apiResponse ) {
				if ( $apiResponse->response && (int) $apiResponse->response === 0 ) {
					$form->response        = 0;
					$form->responseMessage = (string) $apiResponse->responseMessage;
				} else {

					$apiResponse = $this->sendApiRequest( $sendData, $type );
					if ( $apiResponse ) {
						if ( $apiResponse->response && (int) $apiResponse->response === 0 ) {
							$form->response        = 0;
							$form->responseMessage = (string) $apiResponse->responseMessage;
						} else {
							$form->response      = '1';
							$form->transactionId = (string) $apiResponse->transaction->transactionId;
							$form->approvalCode  = (string) $apiResponse->transaction->approvalCode;
							$form->cardNumber    = (string) $apiResponse->transaction->cardNumber;
							$form->expiry        = (string) $apiResponse->transaction->expiryDate;
						}
					}
				}
			} else {
				$form->response        = 0;
				$form->responseMessage = 'Connection aborted';
			}
		}

		return $this->getResponseModel( (array) $form );
	}

	/**
	 * @param $data
	 *
	 * @return RequestResponseInterface
	 */
	public function getResponseModel($data): RequestResponseInterface
	{

		return new ChargeResponse($data);
	}

	/**
	 * @param array $sendData - data send to Helcim API
	 *
	 * @return \$1|false|\SimpleXMLElement
	 * @throws \GuzzleHttp\Exception\GuzzleException
	 */
	public function sendApiRequest(array $sendData,$api_dest=''){
		$url      = self::API_URL.$api_dest;
		$client  = new Client();
		$options = [
			'form_params' => $sendData,
			'headers' => [
				'accept' => 'application/xml',
				'account-id' => $this->apiAccountId,
				'api-token' => $this->apiToken,
				'content-type' => 'application/x-www-form-urlencoded',
			]
		];

		$res = $client->request( 'POST', $url, $options );

		if ( $res->getStatusCode() == 200 ) {

			$response = (string) $res->getBody();

			return simplexml_load_string( $response );
		}
		return false;
	}

	/**
	 * @param Transaction $transaction - transaction object
	 *
	 * @return RequestResponseInterface
	 * @throws NotSupportedException
	 */
	public function refund( Transaction $transaction ): RequestResponseInterface {
		$parentTransaction =$transaction->getParent();
		$parentTransactionAmount = (double)$parentTransaction->amount;
		$parentResponseArray = craft\helpers\Json::decodeIfJson( $parentTransaction->response );
		$data                = [];

		if ( is_array( $parentResponseArray ) && isset( $parentResponseArray['cardToken'] ) ) {

			$currency = Commerce::getInstance()->getCurrencies()->getCurrencyByIso($transaction->paymentCurrency);

			if (!$currency) {
				throw new NotSupportedException('The currency “' . $transaction->paymentCurrency . '” is not supported!');
			}
			$data['transactionId'] = $parentResponseArray['transactionId'];
			$cardToken = explode('_',$parentResponseArray['cardToken'])[0];
			$sendData = [
				'transactionId' => $parentResponseArray['transactionId'],
				'cardToken'     => $cardToken,
				'amount'        => $transaction->paymentAmount,
				'cardF4L4Skip'  => '1',
				'currency'      => $currency->alphabeticCode
			];
			if($this->testMode){
				$sendData['test'] = 1;
			}

			$apiResponse = $this->sendApiRequest($sendData,'card/refund');

			if ( $apiResponse ) {

				if ( isset($apiResponse->response) && (string) $apiResponse->response == "0" ) {

					$data['response']        = 0;
					$data['responseMessage'] = (string) $apiResponse->responseMessage;

					// if refund not processed, try to void
					// check refund amount equals transaction amount
					if($parentTransactionAmount == $transaction->paymentAmount){

						//$sendData['transactionType']='void';
						$apiResponse = $this->sendApiRequest($sendData,'card/void');

						if ( isset($apiResponse->response) && (string) $apiResponse->response == "0" ) {
							$data['response']        = 0;
							$data['responseMessage'] = (string) $apiResponse->responseMessage;
						}else{
							$data['responseMessage']='';
							$data['response']        = '1';
						}
					}else{
						$data['responseMessage'] .= " You can try to void full transaction amount";
					}

				}else{
					$data['response']        = '1';
				}
			}
		} else {
			$data['response']        = 0;
			$data['responseMessage'] = 'Invalid parent transaction response';
		}

		return $this->getResponseModel( $data );
	}

	public function processWebHook(): WebResponse {
		// TODO: Implement processWebHook() method.
		return [];
	}

	public function supportsAuthorize(): bool {
		// TODO: Implement supportsAuthorize() method.
		return true;
	}

	public function supportsCapture(): bool {
		// TODO: Implement supportsCapture() method.
		return true;
	}

	public function supportsCompleteAuthorize(): bool {
		// TODO: Implement supportsCompleteAuthorize() method.
		return false;
	}

	public function supportsCompletePurchase(): bool {
		// TODO: Implement supportsCompletePurchase() method.
		return true;
	}

	public function supportsPaymentSources(): bool {
		return $this->enableServersideProtection;
	}

	public function supportsPurchase(): bool {
		// TODO: Implement supportsPurchase() method.
		return true;
	}

	/**
	 * @return bool
	 */
	public function supportsRefund(): bool {
		return  $this->enableServersideProtection;
	}

	/**
	 * @return bool
	 */
	public function supportsPartialRefund(): bool {
		// TODO: Implement supportsPartialRefund() method.
		return  $this->enableServersideProtection;
	}

	public function supportsWebhooks(): bool {
		// TODO: Implement supportsWebhooks() method.
		return false;
	}

}