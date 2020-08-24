import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-image-upload',
	templateUrl: './image-upload.component.html',
	styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
	@Output() fileChange = new EventEmitter();
	@Input() actualImagePath: BehaviorSubject<string>;
	@Input() showButton: boolean = true;
	@ViewChild('file') imageChild: ElementRef;

	constructor(private imageCompress: NgxImageCompressService) {}

	imgURL: string = './assets/images/no-image-available.png';
	file: any = null;

	ngOnInit() {
		if (this.actualImagePath) {
			this.actualImagePath.subscribe(x => {
				this.imgURL = x;
			});
		}
	}

	selectFile(event: any) {
		if (event.target.files[0]) {
			var fileName: any;
			var fileType: any;
			this.file = event.target.files[0];
			fileName = this.file['name'];
			fileType = this.file['type'];
			if (event.target.files && event.target.files[0]) {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					let localURL = event.target.result;
					this.compressImage(localURL, fileName, fileType);
				};
				reader.readAsDataURL(event.target.files[0]);
			}
		}
		/*Para que se pueda volver a subir una imagen subida 
		 anteriormente pero que haya sido cancelada: */
		this.imageChild.nativeElement.value = null;
	}

	compressImage(image, fileName, fileType) {
		var orientation = -1;
		this.imageCompress.compressFile(image, orientation, 50, 50).then(result => {
			this.imgURL = result;
			const imageName = fileName;
			const imageBlob = this.dataURItoBlob(result.split(',')[1], fileType);
			this.fileChange.emit(new File([imageBlob], imageName, { type: fileType }));
		});
	}

	dataURItoBlob(dataURI, fileType) {
		const byteString = window.atob(dataURI);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const int8Array = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			int8Array[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([int8Array], { type: fileType });
		return blob;
	}
}
