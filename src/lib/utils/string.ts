export function toTitleCase(str: string): string {
	return str.replace(/\w\S*/g, function (txt: string) {
		return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
	});
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
