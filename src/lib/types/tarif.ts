import type { BaseEntity } from './base';

export interface TarifData extends BaseEntity {
	id_tarif: number;
	daya: string;
	tarif_perkwh: number;
}

export interface CreateTarifRequest {
	daya: string;
	tarif_perkwh: number;
}

export interface UpdateTarifRequest {
	daya?: string;
	tarif_perkwh?: number;
}
