import type { BaseEntity } from './base';
import type { TarifData } from './tarif';
import type { PelangganProfile } from './user';

export type TagihanStatus = 'Lunas' | 'Belum Lunas';

export interface TagihanData extends BaseEntity {
	id_tagihan: number;
	id_pelanggan: number;
	bulan: number;
	tahun: number;
	jumlah_meter: number;
	status: TagihanStatus;
	pelanggan?: PelangganProfile;
	tarif?: TarifData;
	tarif_perkwh?: number;
}

export interface GenerateTagihanData {
	bulan: number;
	tahun: number;
}

export interface UpdateTagihanStatusData {
	status: TagihanStatus;
}

export interface TagihanFilterParams {
	status?: string;
	bulan?: string;
	tahun?: string;
	id_pelanggan?: string;
}
