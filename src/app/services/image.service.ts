import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//
import { Observable } from 'rxjs';
//
import { AppConfig } from '../app.config';
import {
	HttpHeadersInterceptorService,
	RequestOptions
} from '../common/error-handling/interceptors/http-headers-interceptor.service';

@Injectable({
	providedIn: 'root'
})
export class ImagesService {
	baseUrl: string;

	constructor(
		private http: HttpClient,
		private httpHeaders: HttpHeadersInterceptorService,
		private config: AppConfig
	) {}

	postImagenProducto(file: File, productoId: number): Observable<any> {
		const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
		requestOptions.headers = requestOptions.headers.delete('Content-Type');
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post<any>(this.config.apiUrl + '/file/producto/' + productoId, formData, requestOptions);
	}

	postImagenEmpresa(file: File): Observable<any> {
		const requestOptions: RequestOptions = { headers: this.httpHeaders.getHeaders() };
		requestOptions.headers = requestOptions.headers.delete('Content-Type');
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post<any>(this.config.apiUrl + '/file/empresa/', formData, requestOptions);
	}
}
