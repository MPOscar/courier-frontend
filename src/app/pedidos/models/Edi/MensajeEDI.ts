export class Mensaje {
	public static TIPO_ORDEN = 'ORDER'; // Tipo documento para orden de compra
	public static TIPO_FACTURA = 'INVOICE'; // Tipo documento para fectua
	public static TIPO_NOTA_CREDITO = 'CREDIT_NOTE'; // Tipo documento para nota de credito

	version = '';
	from_gln = '';
	from_name = '';
	to_gln = '';
	to_name = '';
	creationDateTime = '';
	entityType = '';
	idMensajeEancom = '';
}
