import type { BaseEntity } from './base';
import type { PelangganProfile } from './user';

export interface PenggunaanData extends BaseEntity {
	id_penggunaan: number;
	id_pelanggan: number;
	bulan: number;
	tahun: number;
	meter_awal: number;
	meter_akhir: number;
	jumlah_kwh: number;
	pelanggan?: PelangganProfile;
}

export interface CreatePenggunaanData {
	id_pelanggan: number;
	bulan: number;
	tahun: number;
	meter_awal: number;
	meter_akhir: number;
}

export interface UpdatePenggunaanData {
	meter_awal: number;
	meter_akhir: number;
}

export interface PenggunaanFilterParams {
	bulan?: string;
	tahun?: string;
	id_pelanggan?: string;
}
