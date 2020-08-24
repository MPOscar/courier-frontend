import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
//
import { CategoriaGPCService } from '../../services/categoriaGPC.service';
import { CategoriaGPC } from '../../models/CategoriaGPC/CategoriaGPC';

@Component({
	selector: 'app-producto-categoria-gpc',
	templateUrl: './producto-categoria-gpc.component.html',
	styleUrls: ['./producto-categoria-gpc.component.scss']
})
export class ProductoCategoriaGpcComponent implements OnInit {

	@Input() categoriaGPC: CategoriaGPC;

	@Input() isEmpty: boolean;

  @Input() disabled = true;

	@Output() categoriaGPCEventEmitter: EventEmitter<any> = new EventEmitter();

	segmentos: any[] = [];

	familias: any[] = [];

	clases: any[] = [];

	bricks: any[] = [];

  segmentCode = "";

  familiaCode = "";

  claseCode = "";

  brickCode = "";

	constructor(public categoriaGPCService: CategoriaGPCService) {}

	ngOnInit() {
	  if (this.categoriaGPC !== null && this.categoriaGPC !== undefined){
      this.categoriaGPCService.getSegmentos().subscribe(response => {
        this.segmentos = response.data;
        this.segmentCode = this.categoriaGPC.segmentCode;
        this.categoriaGPCService.getFamilias(this.categoriaGPC.segmentCode).subscribe(familiasResponse => {
          this.familias = familiasResponse.data;
          this.familiaCode = this.categoriaGPC.familiaCode;
          this.categoriaGPCService.getClases(this.categoriaGPC.familiaCode).subscribe(clasesResponse => {
            this.clases = clasesResponse.data;
            this.claseCode = this.categoriaGPC.claseCode;
            this.categoriaGPCService.getBriks(this.categoriaGPC.claseCode).subscribe(brikcsResponse => {
              this.bricks = brikcsResponse.data;
              this.brickCode = this.categoriaGPC.brickCode;
              this.sendSelection();
            })
          })
        })
      })
    }else{
      this.categoriaGPCService.getSegmentos().subscribe(response => {
        this.segmentos = response.data;
      })
    }

  }

  selectFamilia(segmentCode: string){
    this.categoriaGPCService.getFamilias(segmentCode).subscribe(response => {
      this.familias = response.data;
    })
  }

  selectClase(familiaCode: string){
    this.categoriaGPCService.getClases(familiaCode).subscribe(response => {
      this.clases = response.data;
    })
  }

  selectBrick(claseCode: string){
    this.categoriaGPCService.getBriks(claseCode).subscribe(response => {
      this.bricks = response.data;
    })
  }

  sendSelection(){
    const categoriaGPC: CategoriaGPC = {
      segmentCode: this.segmentCode,
      familiaCode: this.familiaCode,
      claseCode: this.claseCode,
      brickCode: this.brickCode
    }
    this.categoriaGPCEventEmitter.emit(categoriaGPC)
  }
}
