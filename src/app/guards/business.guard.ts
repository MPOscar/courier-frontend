import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'app/services';

@Injectable({
	providedIn: 'root'
})
export class BusinessGuard implements CanActivate {
	constructor(private authService: AuthenticationService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkLogin();
	}

	checkLogin(): boolean {
		var business = localStorage.getItem('business');
		if (business != null) {
			return true;
		} else {
			var role = localStorage.getItem('role');
			if (role == 'providerAdmin' || role == 'providerUser') {
				this.router.navigate(['/seleccionar-empresa']);
			} else {
				this.router.navigate(['/login']);
			}
			return false;
		}
	}
}
