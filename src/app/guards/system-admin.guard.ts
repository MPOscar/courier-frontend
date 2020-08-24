import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class SystemAdminGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		let allRoles = localStorage.getItem('roles');
		let allRolesArray: String[] = JSON.parse(allRoles);
		if (allRolesArray.indexOf('systemAdmin') != -1) {
			return true;
		} else {
			this.router.navigate(['']);
			return false;
		}
	}
}
