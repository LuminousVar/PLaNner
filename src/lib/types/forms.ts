export interface RegisterFormData {
	username: string;
	password: string;
	confirmPassword: string;
	nama_pelanggan: string;
	alamat: string;
	nomor_kwh: string;
	id_tarif: number | string;
	agree: boolean;
}

export interface LoginFormData {
	username: string;
	password: string;
	rememberMe: boolean;
}
