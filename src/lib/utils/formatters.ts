export class Formatter {
	static currency(amount: number, locale = 'id-ID', currency = 'IDR'): string {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency
		}).format(amount);
	}

	static number(value: number, locale = 'id-ID'): string {
		return new Intl.NumberFormat(locale).format(value);
	}

	static phone(phone: string): string {
		// Format: 08xx-xxxx-xxxx
		if (phone.length >= 10) {
			return phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
		}
		return phone;
	}
}
