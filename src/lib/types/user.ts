import type { BaseEntity } from './base';
import type { TarifData } from './tarif';

export interface UserProfile extends BaseEntity {
	id_user: number;
	username: string;
	nama_user: string;
	id_level: number;
}

export interface UserLevel {
	id_level: number;
	nama_level: string;
}

export interface PelangganProfile extends BaseEntity {
	id_pelanggan: number;
	username: string;
	nama_pelanggan: string;
	nomor_kwh: string;
	alamat: string;
	id_tarif: number;
	tarif?: TarifData;
}

export interface PelangganData {
	username: string;
	password: string;
	nama_pelanggan: string;
	alamat: string;
	nomor_kwh: string;
	id_tarif: number;
}

export interface UpdatePelangganData {
	username?: string;
	nama_pelanggan?: string;
	alamat?: string;
	nomor_kwh?: string;
	id_tarif?: number;
}
