export class Generator {
	static generateKWHNumber(): string {
		const timestamp = Date.now().toString().slice(-10);
		const random = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, '0');
		return `${timestamp}${random}`;
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
