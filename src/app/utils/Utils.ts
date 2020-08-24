export class Utils {
	static normalizarStr = (str: string): string =>
		str
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();

	static groupBy = (arr: any[], key1: string, key2: string = null) => {
		return arr.reduce((previous, current) => {
			const idx = key2 ? current[key1][key2] : current[key1];
			(previous[idx] = previous[idx] || []).push(current);
			return previous;
		}, {});
	};

	static deserializarUrl = (url: string) => {
		const [root, paramsStr] = url.split('?');

		const params = paramsStr
			? paramsStr.split('&').map(val => {
					const param = val.split('=');
					return { key: param[0], value: param[1] };
			  })
			: undefined;

		return {
			root: root,
			params: params
		};
	};
}
