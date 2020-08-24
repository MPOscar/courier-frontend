import { Injectable } from '@angular/core';

@Injectable()
export class EmpaquesService {
	// private empaquesSubject: BehaviorSubject<Categoria[]> = new BehaviorSubject([]);
	// private empaques: Categoria[] = [];
	// constructor(private http: HttpClient, private config: AppConfig) {
	//     this.http.get<CatalogoResponse>(this.config.apiUrl + '/categorias').subscribe(response => {
	//         if (response.code == 200) {
	//             this.categorias = response.data;
	//             this.categoriasSubject.next(this.categorias);
	//         }
	//     });
	// }
	// public getCategorias(): Observable<Categoria[]> {
	//     return this.categoriasSubject.asObservable();
	// }
	// public loadCategorias() {
	//     this.http.get<CatalogoResponse>(this.config.apiUrl + '/categorias', this.jwt()).subscribe(response => {
	//         if (response.code == 200) {
	//             this.categorias = response.data;
	//             this.categoriasSubject.next(this.categorias);
	//         }
	//     });
	// }
	// private jwt() {
	//     let token = localStorage.getItem('token');
	//     if (token) {
	//         let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
	//         return { headers };
	//     }
	// }
}
