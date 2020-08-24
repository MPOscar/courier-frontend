export class CategoriaGPC {

  segmentCode?: string;

  familiaCode?: string;

  claseCode?: string;

  brickCode?: string;

  constructor(segmentCode: string, familiaCode: string, claseCode: string, brickCode: string) {
    this.segmentCode = segmentCode;
    this.familiaCode = familiaCode;
    this.claseCode = claseCode;
    this.brickCode = brickCode;
  }
}

