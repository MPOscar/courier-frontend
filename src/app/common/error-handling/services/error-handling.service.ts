import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
//
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
//
import { HandledError } from '../models/handled-error';
import { CustomSnackbarComponent } from '../modules/custom-snackbar/components/custom-snackbar/custom-snackbar.component';

const errorClientKey = 'Bad request';

const errorServerKey = 'Ha pasado algo mal en el servidor.';

const errorServerDownKey = 'El servidor en estos momentos no se encuentra disponible.';

const errorTitle = 'Error';

@Injectable({
	providedIn: 'root'
})
export class ErrorHandlingService {
	public serverOnline: BehaviorSubject<boolean> = new BehaviorSubject(true);
	timeOutServer$: Subscription;
	timeOutClient$: Subscription;
	showExpireNotification: Subject<number> = new Subject();

	showExpireLogin: Subject<any> = new Subject();

	// private timeCount = 10000;
	private toastOfServerDown: any;
	private _logoutCommands: any[];
	private _logoutNavigationExtras?: NavigationExtras;
	private showNotificationObservable: Subject<any> = new Subject();
	private timeBeforeEmmitTheSameError = 1000;
	private lastEmittedNotification: any;

	constructor(public snackBar: MatSnackBar, private translate: TranslateService, private router: Router) {
		//setTranslations(translate, TRANSLATIONS);
		this.onServerUp();
		this.subscriptionToNotification();
	}

	private subscriptionToNotification() {
		this.showNotificationObservable
			.pipe(
				filter((error: any) => {
					// Preventing shows more than one time the token expiration error
					if (
						this.lastEmittedNotification &&
						this.lastEmittedNotification.errorMessage === error.errorMessage
					) {
						const differenceInMilliSeconds =
							error.date.getTime() - this.lastEmittedNotification.date.getTime();
						if (differenceInMilliSeconds <= this.timeBeforeEmmitTheSameError) {
							return false;
						}
					}
					return true;
				})
			)
			.subscribe(value => {
				this.lastEmittedNotification = value;
				this.snackBar.openFromComponent(CustomSnackbarComponent, {
					data: { messageData: value.errorMessage, messageType: 'Error' },
					duration: 2000,
					horizontalPosition: 'right',
					panelClass: ['background-color-accent']
				});
				//  });
			});
	}

	get logoutCommands(): any[] {
		return this._logoutCommands;
	}

	set logoutCommands(value: any[]) {
		this._logoutCommands = value;
	}

	get logoutNavigationExtras(): NavigationExtras {
		return this._logoutNavigationExtras;
	}

	set logoutNavigationExtras(value: NavigationExtras) {
		this._logoutNavigationExtras = value;
	}

	private onServerUp() {
		this.serverOnline.pipe(distinctUntilChanged()).subscribe(value => {
			if (value === true) {
				// Removing timeOutClient threat if it was provided
				if (this.timeOutClient$) {
					this.timeOutClient$.unsubscribe();
					this.timeOutClient$ = null;
				}
				// Removing timeOutServer threat if it was provided
				if (this.timeOutServer$) {
					this.timeOutServer$.unsubscribe();
					this.timeOutServer$ = null;
				}
				if (this.toastOfServerDown !== undefined && this.toastOfServerDown !== null) {
					this.toastOfServerDown.dismiss();
				}
			}
		});
	}

	public handleServiceError(err: HttpErrorResponse): HandledError {
		let handledError = new HandledError();
		if (err instanceof HttpErrorResponse) {
			// If the request have status code equal to 0 is that the spa can't reach the api
			if (err.status === 0) {
				// Setting the state of the server to down and emitting the new state
				if (this.serverOnline.getValue() === true) {
					// Returning error code 410 corresponding to "Gone" response that means the the resource you want not exist right now
					handledError.errorCode = 410;
					//this.translate.get([errorServerDownKey, errorTitle]).subscribe(text => {TODO
					this.toastOfServerDown = this.snackBar.openFromComponent(CustomSnackbarComponent, {
						data: { messageData: errorServerDownKey, messageTitle: errorTitle, messageType: 'Error' },
						horizontalPosition: 'right',
						panelClass: ['background-color-accent']
					});
					//});
					this.serverOnline.next(false);
				}
				return handledError;
			}
			// Setting the state of the server to up if the error is not "server down"
			this.serverOnline.next(true);
			try {
				// handledError.message = err.statusText;
				const errObj = err.error;
				// Managing error from client request
				if (err.status >= 400 && err.status < 500) {
					if (err.status === 401 && err.url.indexOf('/auth/login') == -1) {
						this.showExpireLogin.next(true);
					}
					return this.handlingClientErrors(err, errObj, handledError);
				} else {
					// Handling errors in the server side
					return this.handlingServerErrors(err, errObj, handledError);
				}
			} catch (exception) {
				/* If this code is executed is because the response from the api doesn't have a valid json format that means
                 is returning some kind of html or something else*/
				if (err.status >= 400 && err.status < 500) {
					this.translate.get(errorClientKey).subscribe(text => {
						handledError.message = text;
					});
				} else {
					this.translate.get(errorServerKey).subscribe(text => {
						handledError.message = text;
					});
				}
				return handledError;
			}
		} else {
			handledError.error = err;
			return handledError;
		}
	}

	private handlingClientErrors(err: HttpErrorResponse, errObj: any, handledError: HandledError): HandledError {
		if (err.status === 401) {
			// Checking if the authentication error is caused by token expiration
			if (errObj == 'Unauthorized') {
				// redirecting the user to login page if the error is caused by token expiration
				handledError.errorCode = err.status;
				handledError.logoutCommands = this.logoutCommands;
				handledError.logoutNavigationExtras = this.logoutNavigationExtras;
				handledError.message = errObj;
			} else {
				// Checking if the error is caused by trying to authenticate with a wrong password
				if (errObj.detail && errObj.detail[0] && errObj.detail[0].error_description) {
					//	handledError.message = errObj.detail[0].error_description;
				} else {
					this.buildingErrorMessage(errObj, handledError);
				}
			}
			return handledError;
		} else {
			// If the error comes without a error code then is possible that is a kind of form validation error
			if (err.status) {
				handledError.errorCode = err.error.code;
				handledError.message = err.error.message;
				handledError.error = err.error;
				return handledError;
			} else {
				handledError.errorCode = -1;
				if (errObj.error) {
					this.translate.get(/*errorClientKey*/ errObj.error).subscribe(text => {
						handledError.message = text;
					});
					return handledError;
				}
				return handledError;
			}
		}
	}

	private handlingServerErrors(err: HttpErrorResponse, errObj, handledError: HandledError): HandledError {
		if (errObj) {
			handledError.message = errObj.message;
			handledError.error.message = errObj.message;
			return handledError;
		} else {
			// Managing all the remaining errors as a server side errors
			this.translate.get(errorServerKey).subscribe(text => {
				handledError.message = text;
			});
			return handledError;
		}
	}

	public handleUiError(key: string, err: HandledError, url?: string) {
		const serverState = this.serverOnline.getValue();
		const error = <any>err.error;
		// If server state is online then continues managing the
		if (serverState) {
			// Displaying the error if it really contains a message
			if (error.message) {
				if (error.message === 'Invalid unique constraints') {
					switch (url) {
						case 'user': {
							error.message = 'This user already exists';
							break;
						}
						default: {
							error.message = 'This already exists';
							break;
						}
					}
				}
				this.showNotificationObservable.next({
					key: key,
					errorMessage: error.message,
					errorCode: error.errorCode,
					date: new Date()
				});
			}
			if (error.logoutCommands) {
				this.router.navigate(error.logoutCommands, error.logoutNavigationExtras);
			}
		}
	}

	private errorDaemon(path: string[], error: any, handledError: HandledError): void {
		if (error.constructor === Object) {
			Object.keys(error).forEach(key => {
				path.push(key);
				this.errorDaemon(path, error[key], handledError);
				path.pop();
			});
		} else {
			const pathStr = this.capitalizeWord(path.join('.'));
			const errorStr = this.capitalizeWord(error.constructor === Array ? error.join(' ') : error);
			if (handledError.message === '' || handledError.message === undefined) {
				handledError.message = pathStr + ': ' + errorStr + '\n';
			} else {
				handledError.message = handledError.message + pathStr + ': ' + ' ' + errorStr + '\n';
			}
		}
	}

	private buildingErrorMessage(error: any, handledError: HandledError) {
		// Checking if the error comes with more than one validation error
		if (error.detail[0].constructor === Object) {
			let path = [];
			this.errorDaemon(path, error.detail[0], handledError);
			// sending the form validations errors to the component where are the fields
			handledError.formErrors = error.detail[0];
		} else {
			handledError.message = error.detail[0];
		}
	}

	private capitalizeWord(word: any): string {
		return typeof word === 'string' ? word.charAt(0).toUpperCase() + word.slice(1) : word;
	}
}
