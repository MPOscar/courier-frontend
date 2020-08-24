import { Mensaje } from './MensajeEDI';
import { OC1 } from './OC1EDI';
import { OC2 } from './OC2EDI';

export class OC extends Mensaje {
	private _oc1: OC1;
	get oc1(): OC1 {
		return this._oc1;
	}
	set oc1(value: OC1) {
		this._oc1 = value;
	}
	private _oc2list: Array<OC2> = [];
	get oc2list(): Array<OC2> {
		return this._oc2list;
	}
	set oc2list(value: Array<OC2>) {
		this._oc2list = value;
	}
}
