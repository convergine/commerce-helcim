<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\commerce\helcim\responses;

use craft\commerce\base\RequestResponseInterface;
use craft\commerce\errors\NotImplementedException;

class ChargeResponse implements RequestResponseInterface {

	/**
	 * @var
	 */
	protected $data = [];

	/**
	 * @var string
	 */
	private $_redirect = '';

	/**
	 * @var bool
	 */
	private $_processing = false;

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
		return $this->_processing;
	}

	public function isRedirect(): bool {
		return !empty($this->_redirect);
	}

	public function getRedirectMethod(): string {
		return 'GET';
	}

	public function getRedirectData(): array {
		return [];
	}

	public function getRedirectUrl(): string {
		return $this->_redirect;
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

		return $this->data['approvalCode'];
	}

	public function getData() {
		return $this->data;
	}

	public function getMessage(): string {
		if (empty($this->data['responseMessage'])) {
			return '';
		}

		return $this->data['responseMessage'];
	}

	public function redirect() {
		throw new NotImplementedException('Redirecting directly is not implemented for this gateway.');
	}
}