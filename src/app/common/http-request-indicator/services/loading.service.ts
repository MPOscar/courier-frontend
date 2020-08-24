import { Injectable } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationStart } from '@angular/router';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { LoadingComponent } from '../components/loading/loading.component';

interface LoadingOverlayConfig {
	panelClass?: string;
	hasBackdrop?: boolean;
	backdropClass?: string;
}

const DEFAULT_CONFIG: LoadingOverlayConfig = {
	hasBackdrop: true,
	backdropClass: 'loading-overlay-backdrop',
	panelClass: 'loading-overlay-panel'
};

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	counter = 0;

	loading$ = new Subject<boolean>();

	overlayRef: OverlayRef;

	constructor(private router: Router, private overlay: Overlay) {
		this.loading$.subscribe((loading: boolean) => {
			if (loading) {
				this.counter++;
				if (this.counter > 0 && !this.overlayRef) {
					this.overlayRef = this.createOverlay(DEFAULT_CONFIG);
					const loadingPortal = new ComponentPortal(LoadingComponent);
					this.overlayRef.attach(loadingPortal);
				}
			} else {
				this.counter--;
				this.counter = this.counter < 0 ? 0 : this.counter;
				if (this.counter === 0) {
					if (this.overlayRef) {
						this.overlayRef.dispose();
						this.overlayRef = null;
					}
				}
			}
		});

		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.loading$.next(true);
			} else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				this.loading$.next(false);
			}
		});
	}

	private getOverlayConfig(config: LoadingOverlayConfig): OverlayConfig {
		const positionStrategy = this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();

		const overlayConfig = new OverlayConfig({
			hasBackdrop: config.hasBackdrop,
			backdropClass: config.backdropClass,
			panelClass: config.panelClass,
			scrollStrategy: this.overlay.scrollStrategies.block(),
			positionStrategy
		});

		return overlayConfig;
	}

	private createOverlay(config: LoadingOverlayConfig) {
		// Returns an OverlayConfig
		const overlayConfig = this.getOverlayConfig(config);

		// Returns an OverlayRef
		return this.overlay.create(overlayConfig);
	}
}
