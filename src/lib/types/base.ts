export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		current_page: number;
		total_pages: number;
		total_items: number;
		per_page: number;
		has_next_page: boolean;
		has_previous_page: boolean;
	};
}

export interface BaseEntity {
	created_at: string;
	updated_at: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface DateRangeParams {
	tanggal_mulai?: string;
	tanggal_selesai?: string;
}
