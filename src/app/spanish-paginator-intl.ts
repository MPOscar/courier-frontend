import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
	if (length == 0 || pageSize == 0) {
		return `0 de ${length}`;
	}

	length = Math.max(length, 0);

	const startIndex = page * pageSize;

	// If the start index exceeds the list length, do not try and fix the end index to the end.
	const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

	return `${startIndex + 1} - ${endIndex} of ${length}`;
};

export function getSpanishPaginatorIntl() {
	const paginatorIntl = new MatPaginatorIntl();

	paginatorIntl.itemsPerPageLabel = 'Items por Página:';
	paginatorIntl.nextPageLabel = 'Próxima Página';
	paginatorIntl.previousPageLabel = 'Página Previa';
	paginatorIntl.getRangeLabel = spanishRangeLabel;

	return paginatorIntl;
}
