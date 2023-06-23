<?php
namespace craft\commerce\helcim\responses;

use craft\commerce\base\RequestResponseInterface;
use craft\commerce\errors\NotImplementedException;

class ChargeResponse implements RequestResponseInterface {

	/**
	 * @var
	 */
	protected $data = [];


	/**
	 * Construct the response
	 *
	 * @param $data
	 */
	public function __construct($data) {
		$this->data = $data;
	}

	public function isSuccessful(): bool {
		return array_key_exists('response', $this->data) && $this->data['response'] === '1';
	}

	public function isProcessing(): bool {
		return false;
	}

	public function isRedirect(): bool {
		return false;
	}

	public function getRedirectMethod(): string {
		return 'GET';
	}

	public function getRedirectData(): array {
		return [];
	}

	public function getRedirectUrl(): string {
		return '';
	}

	public function getTransactionReference(): string {

		if (empty($this->data)) {
			return '';
		}

		return (string)$this->data['transactionId'];
	}

	public function getCode(): string {
		if (empty($this->data['approvalCode'])) {
			return '';
		}

		return (string)$this->data['approvalCode'];
	}

	public function getData(): array {
		return $this->data;
	}

	public function getMessage(): string {
		if (empty($this->data['responseMessage'])) {
			return '';
		}

		return (string)$this->data['responseMessage'];
	}

	public function redirect():void {
		throw new NotImplementedException('Redirecting directly is not implemented for this gateway.');
	}
}