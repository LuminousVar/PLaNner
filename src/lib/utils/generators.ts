export class Generator {
	static generateKWHNumber(): string {
		const timestamp = Date.now().toString().slice(-8); // 8 digit dari timestamp
		const random = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');

		const result = `${timestamp}${random}`;

		if (result.length > 15) {
			return result.slice(0, 15);
		}
		if (result.length < 10) {
			return result.padStart(10, '0');
		}

		return result;
	}

	static generateRandomId(length = 8): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}
}
