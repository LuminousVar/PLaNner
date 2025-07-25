import type { BaseEntity } from './base';
import type { TagihanData } from './tagihan';
import type { PelangganProfile, UserProfile } from './user';

export interface PembayaranData extends BaseEntity {
	id_pembayaran: number;
	id_tagihan: number;
	id_pelanggan: number;
	tanggal_pembayaran: string;
	bulan_bayar: string;
	biaya_admin: number;
	total_bayar: number;
	id_user: number;
	tagihan?: TagihanData;
	pelanggan?: PelangganProfile;
	user?: UserProfile;
}

export interface CreatePembayaranData {
	id_tagihan: number;
	id_pelanggan: number;
	tanggal_pembayaran: string;
	bulan_bayar: string;
	biaya_admin: number;
	total_bayar: number;
}

export interface UpdatePembayaranData {
	tanggal_pembayaran?: string;
	biaya_admin?: number;
	total_bayar?: number;
}

export interface PembayaranFilterParams {
	tanggal_mulai?: string;
	tanggal_selesai?: string;
	bulan_bayar?: string;
	id_pelanggan?: string;
	id_user?: string;
}
