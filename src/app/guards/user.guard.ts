import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'app/services';

@Injectable({
	providedIn: 'root'
})
export class UserGuard implements CanActivate {
	constructor(private authService: AuthenticationService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		let url: string = state.url;
		return this.checkLogin(url);
	}

	checkLogin(url: string): boolean {
		var role = localStorage.getItem('role');
		if (role == 'providerAdmin' || role == 'providerUser') {
			return true;
		} else {
			this.authService.redirectUrl = url;

			this.router.navigate(['/login']);
			return false;
		}
	}
}
