export const ValidationRules = {
	username: {
		minLength: 3,
		maxLength: 50,
		pattern: /^[a-zA-Z0-9_]+$/,
		message: {
			required: 'Username wajib diisi',
			minLength: 'Username minimal 3 karakter',
			maxLength: 'Username maksimal 50 karakter',
			pattern: 'Username hanya boleh mengandung huruf, angka, dan underscore'
		}
	},

	password: {
		minLength: 8,
		pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
		message: {
			required: 'Password wajib diisi',
			minLength: 'Password minimal 8 karakter',
			pattern: 'Password harus mengandung huruf besar, huruf kecil, dan angka'
		}
	},

	email: {
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		message: {
			required: 'Email wajib diisi',
			pattern: 'Format email tidak valid'
		}
	},

	phone: {
		pattern: /^08[0-9]{8,11}$/,
		maxLength: 13,
		message: {
			required: 'Nomor telepon wajib diisi',
			pattern: 'Format nomor telepon tidak valid (08xxxxxxxxx)'
		}
	},

	namaPelanggan: {
		minLength: 2,
		maxLength: 100,
		message: {
			required: 'Nama pelanggan wajib diisi',
			minLength: 'Nama minimal 2 karakter',
			maxLength: 'Nama pelanggan maksimal 100 karakter'
		}
	},

	alamat: {
		maxLength: 255,
		message: {
			required: 'Alamat wajib diisi',
			maxLength: 'Alamat maksimal 255 karakter'
		}
	},

	nomorKwh: {
		pattern: /^[0-9]{10,15}$/,
		message: {
			required: 'Nomor KWH wajib diisi',
			pattern: 'Nomor KWH harus berupa angka 10-15 digit'
		}
	}
};
