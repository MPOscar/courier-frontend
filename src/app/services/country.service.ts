import { Injectable } from '@angular/core';
import { codes, byAlpha2 } from 'iso-country-codes';

@Injectable()
export class CountryService {
	constructor() {}

	getCountryList() {
		return codes;
	}

	getCodeByCountry(countryName: string): string {
		for (let i = 0; i < codes.length; i++) {
			if (codes[i].name == countryName) return codes[i].alpha2;
		}
		return countryName;
	}

	getCountryByCode(countryCode: string): string {
		if (byAlpha2[countryCode]) {
			return byAlpha2[countryCode].name;
		} else {
			return countryCode;
		}
	}
}
