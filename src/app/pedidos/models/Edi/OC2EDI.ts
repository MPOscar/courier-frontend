import { Mensaje } from './MensajeEDI';

export class OC2 extends Mensaje {
	private _number = '';
	get number() {
		return this._number;
	}
	set number(value) {
		this._number = value;
	}
	private _itemIdGtin = '';
	get itemIdGtin() {
		return this._itemIdGtin;
	}
	set itemIdGtin(value) {
		this._itemIdGtin = value;
	}
	private _itemIdBuyerCode = '';
	get itemIdBuyerCode() {
		return this._itemIdBuyerCode;
	}
	set itemIdBuyerCode(value) {
		this._itemIdBuyerCode = value;
	}
	private _itemIdSellerCode = '';
	get itemIdSellerCode() {
		return this._itemIdSellerCode;
	}
	set itemIdSellerCode(value) {
		this._itemIdSellerCode = value;
	}
	private _itemDescription = '';
	get itemDescription() {
		return this._itemDescription;
	}
	set itemDescription(value) {
		this._itemDescription = value;
	}
	private _itemBrandName = '';
	get itemBrandName() {
		return this._itemBrandName;
	}
	set itemBrandName(value) {
		this._itemBrandName = value;
	}
	private _itemRequestedQuantity = '';
	get itemRequestedQuantity() {
		return this._itemRequestedQuantity;
	}
	set itemRequestedQuantity(value) {
		this._itemRequestedQuantity = value;
	}
	private _itemRequestedQuantity_measureUnit = '';
	get itemRequestedQuantity_measureUnit() {
		return this._itemRequestedQuantity_measureUnit;
	}
	set itemRequestedQuantity_measureUnit(value) {
		this._itemRequestedQuantity_measureUnit = value;
	}
	private _packageType = '';
	get packageType() {
		return this._packageType;
	}
	set packageType(value) {
		this._packageType = value;
	}
	private _numberOfPackages = '';
	get numberOfPackages() {
		return this._numberOfPackages;
	}
	set numberOfPackages(value) {
		this._numberOfPackages = value;
	}
	private _itemAllowanceQuantity = '';
	get itemAllowanceQuantity() {
		return this._itemAllowanceQuantity;
	}
	set itemAllowanceQuantity(value) {
		this._itemAllowanceQuantity = value;
	}
	private _itemAllowanceQuantity_measureUnit = '';
	get itemAllowanceQuantity_measureUnit() {
		return this._itemAllowanceQuantity_measureUnit;
	}
	set itemAllowanceQuantity_measureUnit(value) {
		this._itemAllowanceQuantity_measureUnit = value;
	}
	private _lineNetAmount = '';
	get lineNetAmount() {
		return this._lineNetAmount;
	}
	set lineNetAmount(value) {
		this._lineNetAmount = value;
	}
	private _grossUnitPrice = '';
	get grossUnitPrice() {
		return this._grossUnitPrice;
	}
	set grossUnitPrice(value) {
		this._grossUnitPrice = value;
	}
	private _netUnitPrice = '';
	get netUnitPrice() {
		return this._netUnitPrice;
	}
	set netUnitPrice(value) {
		this._netUnitPrice = value;
	}
	private _priceMeasureUnit = '';
	get priceMeasureUnit() {
		return this._priceMeasureUnit;
	}
	set priceMeasureUnit(value) {
		this._priceMeasureUnit = value;
	}
	private _packagingTerms = '';
	get packagingTerms() {
		return this._packagingTerms;
	}
	set packagingTerms(value) {
		this._packagingTerms = value;
	}
	private _returnablePackage = '';
	get returnablePackage() {
		return this._returnablePackage;
	}
	set returnablePackage(value) {
		this._returnablePackage = value;
	}
	private _eancomCantLineas = 0;
	get eancomCantLineas() {
		return this._eancomCantLineas;
	}
	set eancomCantLineas(value) {
		this._eancomCantLineas = value;
	}
}
