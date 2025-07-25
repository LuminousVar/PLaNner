export interface LaporanPenggunaan {
	id_pelanggan: number;
	nama_pelanggan: string;
	nomor_kwh: string;
	bulan: number;
	tahun: number;
	jumlah_kwh: number;
	tarif_perkwh: number;
	total_bayar: number;
}

export interface LaporanTagihan {
	id_tagihan: number;
	nama_pelanggan: string;
	nomor_kwh: string;
	bulan: number;
	tahun: number;
	jumlah_meter: number;
	status: string;
	created_at: string;
}

export interface LaporanPembayaran {
	id_pembayaran: number;
	nama_pelanggan: string;
	nomor_kwh: string;
	tanggal_pembayaran: string;
	bulan_bayar: string;
	total_bayar: number;
	nama_user: string;
}

export interface LaporanPenggunaanParams {
	bulan?: string;
	tahun?: string;
	id_pelanggan?: string;
	limit?: number;
}

export interface LaporanTagihanParams {
	bulan?: string;
	tahun?: string;
	status?: string;
	id_pelanggan?: string;
}

export interface LaporanPembayaranParams {
	tanggal_mulai?: string;
	tanggal_selesai?: string;
	id_pelanggan?: string;
	id_user?: string;
	limit?: number;
	offset?: number;
}
