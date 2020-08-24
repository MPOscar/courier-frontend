import { Mensaje } from './MensajeEDI';

export class OC1 extends Mensaje {
	private _orderType = '';
	get orderType() {
		return this._orderType;
	}
	set orderType(value) {
		this._orderType = value;
	}
	private _documentStatus = '';
	get documentStatus() {
		return this._documentStatus;
	}
	set documentStatus(value) {
		this._documentStatus = value;
	}
	private _uniqueCreatorIdentification = '';
	get uniqueCreatorIdentification() {
		return this._uniqueCreatorIdentification;
	}
	set uniqueCreatorIdentification(value) {
		this._uniqueCreatorIdentification = value;
	}
	private _documentDate = '';
	get documentDate() {
		return this._documentDate;
	}
	set documentDate(value) {
		this._documentDate = value;
	}
	private _orderRequestedAction = '';
	get orderRequestedAction() {
		return this._orderRequestedAction;
	}
	set orderRequestedAction(value) {
		this._orderRequestedAction = value;
	}
	private _requestedDeliveryDate = '';
	get requestedDeliveryDate() {
		return this._requestedDeliveryDate;
	}
	set requestedDeliveryDate(value) {
		this._requestedDeliveryDate = value;
	}
	private _latestDeliveryDate = '';
	get latestDeliveryDate() {
		return this._latestDeliveryDate;
	}
	set latestDeliveryDate(value) {
		this._latestDeliveryDate = value;
	}
	private _documentRemarks = '';
	get documentRemarks() {
		return this._documentRemarks;
	}
	set documentRemarks(value) {
		this._documentRemarks = value;
	}
	private _buyer_gln = '';
	get buyer_gln() {
		return this._buyer_gln;
	}
	set buyer_gln(value) {
		this._buyer_gln = value;
	}
	private _buyer_name = '';
	get buyer_name() {
		return this._buyer_name;
	}
	set buyer_name(value) {
		this._buyer_name = value;
	}
	private _seller_gln = '';
	get seller_gln() {
		return this._seller_gln;
	}
	set seller_gln(value) {
		this._seller_gln = value;
	}
	private _seller_name = '';
	get seller_name() {
		return this._seller_name;
	}
	set seller_name(value) {
		this._seller_name = value;
	}
	private _partyIdBuyerNumber = '';
	get partyIdBuyerNumber() {
		return this._partyIdBuyerNumber;
	}
	set partyIdBuyerNumber(value) {
		this._partyIdBuyerNumber = value;
	}
	private _latestModificationDate = '';
	get latestModificationDate() {
		return this._latestModificationDate;
	}
	set latestModificationDate(value) {
		this._latestModificationDate = value;
	}
	private _referencePriceList = '';
	get referencePriceList() {
		return this._referencePriceList;
	}
	set referencePriceList(value) {
		this._referencePriceList = value;
	}
	private _referenceBlanketOrder = '';
	get referenceBlanketOrder() {
		return this._referenceBlanketOrder;
	}
	set referenceBlanketOrder(value) {
		this._referenceBlanketOrder = value;
	}
	private _shipTo_gln = '';
	get shipTo_gln() {
		return this._shipTo_gln;
	}
	set shipTo_gln(value) {
		this._shipTo_gln = value;
	}
	private _shipTo_name = '';
	get shipTo_name() {
		return this._shipTo_name;
	}
	set shipTo_name(value) {
		this._shipTo_name = value;
	}
	private _transactionCurrency = '';
	get transactionCurrency() {
		return this._transactionCurrency;
	}
	set transactionCurrency(value) {
		this._transactionCurrency = value;
	}
	private _invoicingCurrency = '';
	get invoicingCurrency() {
		return this._invoicingCurrency;
	}
	set invoicingCurrency(value) {
		this._invoicingCurrency = value;
	}
	private _exchangeRate = '';
	get exchangeRate() {
		return this._exchangeRate;
	}
	set exchangeRate(value) {
		this._exchangeRate = value;
	}
	private _totalNetAmount = '';
	get totalNetAmount() {
		return this._totalNetAmount;
	}
	set totalNetAmount(value) {
		this._totalNetAmount = value;
	}
	private _eancomCantLineas = 0;
	get eancomCantLineas() {
		return this._eancomCantLineas;
	}
	set eancomCantLineas(value) {
		this._eancomCantLineas = value;
	}
}
