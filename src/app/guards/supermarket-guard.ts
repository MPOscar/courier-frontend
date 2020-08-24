import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class SupermarketGuard implements CanActivate {
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		let allRoles = localStorage.getItem('roles');
		let allRolesArray: String[] = JSON.parse(allRoles);
		if (allRolesArray.indexOf('administradorSupermercado') != -1) return true;
		return false;
	}
}
