import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ErrorHandlingHttpService } from '@c/error-handling';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	public config: any;
	public apiUrl: string = environment.apiUrl;

	constructor(private http: HttpClient) {}

	public getConfig(): Observable<any> {
		console.log('you call me?');
		return this.http.get<any>('assets/data/config.json').pipe(
			map(response => {
				this.config = response;
			})
		);
	}
}
