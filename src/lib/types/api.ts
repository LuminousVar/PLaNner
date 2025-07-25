interface BaseEntity {
	created_at: string;
	updated_at: string;
}

interface PaginationMeta {
	current_page: number;
	total_pages: number;
	total_items: number;
	per_page: number;
	has_next_page: boolean;
	has_previous_page: boolean;
}

interface PaginatedApiResponse<T> {
	success: boolean;
	message: string;
	data: T[];
	pagination: PaginationMeta;
}

interface Pelanggan extends BaseEntity {
	id_pelanggan: number;
	username: string;
	nama_pelanggan: string;
	nomor_kwh: string;
	alamat: string;
	id_tarif: number;
	tarif?: Tarif;
}

interface Tarif extends BaseEntity {
	id_tarif: number;
	daya: string;
	tarif_perkwh: number;
}

interface User extends BaseEntity {
	id_user: number;
	username: string;
	nama_user: string;
	id_level: number;
}

// Form data types (for input)
interface CreatePelangganRequest {
	username: string;
	password: string;
	nama_pelanggan: string;
	alamat: string;
	nomor_kwh: string;
	id_tarif: number;
}

interface UpdatePelangganRequest {
	username?: string;
	nama_pelanggan?: string;
	alamat?: string;
	nomor_kwh?: string;
	id_tarif?: number;
}

interface LoginRequest {
	username: string;
	password: string;
}

interface LoginResponse {
	user: Pelanggan | User;
	token: string;
}

// Error types
interface ValidationError {
	field: string;
	message: string;
}

interface ApiErrorResponse {
	success: false;
	message: string;
	error?: string;
	validation_errors?: ValidationError[];
	code?: string | number;
}

export type {
	BaseEntity,
	PaginationMeta,
	PaginatedApiResponse,
	Pelanggan,
	Tarif,
	User,
	CreatePelangganRequest,
	UpdatePelangganRequest,
	LoginRequest,
	LoginResponse,
	ValidationError,
	ApiErrorResponse
};
