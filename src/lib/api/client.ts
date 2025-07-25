import { env } from '$lib/config/env';
import type {
	ApiResponse,
	PaginatedResponse,
	HealthResponse,
	LoginResponse,
	UserProfile,
	UserLevel,
	PelangganProfile,
	PelangganData,
	UpdatePelangganData,
	TarifData,
	CreateTarifRequest,
	UpdateTarifRequest,
	PenggunaanData,
	CreatePenggunaanData,
	UpdatePenggunaanData,
	PenggunaanFilterParams,
	TagihanData,
	GenerateTagihanData,
	// TagihanStatus,
	UpdateTagihanStatusData,
	TagihanFilterParams,
	PembayaranData,
	CreatePembayaranData,
	UpdatePembayaranData,
	PembayaranFilterParams,
	AdminDashboardStats,
	CustomerDashboardData,
	RevenueChartData,
	DashboardStatsParams,
	LaporanPenggunaan,
	LaporanTagihan,
	LaporanPembayaran,
	LaporanPenggunaanParams,
	LaporanTagihanParams,
	LaporanPembayaranParams,
	RegisterAdminRequest,
	BootstrapAdminRequest
} from '$lib/types';

export class ApiClient {
	private baseUrl: string;
	private authToken: string | null = null;

	constructor() {
		this.baseUrl = env.API_BASE_URL;
	}

	setAuthToken(token: string | null): void {
		this.authToken = token;

		if (typeof window !== 'undefined') {
			if (token) {
				localStorage.setItem('auth_token', token);
			} else {
				localStorage.removeItem('auth_token');
			}
		}
	}

	// Get token from localStorage on initialization
	initializeToken(): void {
		if (typeof window !== 'undefined') {
			const storedToken = localStorage.getItem('auth_token');
			if (storedToken) {
				this.authToken = storedToken;
			}
		}
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`;

			const headers: Record<string, string> = {
				'Content-Type': 'application/json'
			};

			// Add auth token if available
			if (this.authToken) {
				headers['Authorization'] = `Bearer ${this.authToken}`;
			}

			// Add CSRF token if available
			if (typeof window !== 'undefined') {
				const csrfToken = document
					.querySelector('meta[name="csrf-token"]')
					?.getAttribute('content');
				if (csrfToken) {
					headers['X-CSRF-Token'] = csrfToken;
				}
			}

			if (env.DEBUG) {
				console.log(`API Request: ${options.method || 'GET'} ${url}`);
				if (options.body) {
					console.log('Request Body:', options.body);
				}
			}

			const response = await fetch(url, {
				...options,
				headers: {
					...headers,
					...options.headers
				},
				credentials: 'include' // Include cookies
			});

			let data;
			const contentType = response.headers.get('content-type');

			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else {
				data = { message: await response.text() };
			}

			if (!response.ok) {
				// Handle 401 Unauthorized
				if (response.status === 401) {
					this.setAuthToken(null);
					if (typeof window !== 'undefined') {
						window.location.href = '/login';
					}
				}

				return {
					success: false,
					message: data.message || `HTTP ${response.status}: ${response.statusText}`,
					error: data.error || response.statusText
				};
			}

			if (env.DEBUG) {
				console.log('API Response:', data);
			}

			return {
				success: true,
				message: data.message || 'Berhasil',
				data: data.data || data
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';

			if (env.DEBUG) {
				console.error('API Error:', error);
			}

			// Handle network errors
			if (error instanceof TypeError && error.message.includes('fetch')) {
				return {
					success: false,
					message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
					error: errorMessage
				};
			}

			return {
				success: false,
				message: 'Terjadi kesalahan yang tidak terduga',
				error: errorMessage
			};
		}
	}

	// =================== HEALTH CHECK ===================
	async healthCheck(): Promise<ApiResponse<HealthResponse>> {
		return this.request<HealthResponse>('/health');
	}

	// =================== ADMIN AUTH ===================
	async adminBootstrap(data: BootstrapAdminRequest): Promise<ApiResponse<UserProfile>> {
		return this.request<UserProfile>('/admin/bootstrap', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async adminLogin(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
		const response = await this.request<LoginResponse>('/admin/login', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		});

		// Auto-set token if login successful
		if (response.success && response.data?.token) {
			this.setAuthToken(response.data.token);
		}

		return response;
	}

	async adminRegister(data: RegisterAdminRequest): Promise<ApiResponse<UserProfile>> {
		return this.request<UserProfile>('/admin/register', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async getAdminUsers(
		page = 1,
		limit = 10,
		search = ''
	): Promise<ApiResponse<PaginatedResponse<UserProfile>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search })
		});
		return this.request<PaginatedResponse<UserProfile>>(`/admin/users?${params}`);
	}

	async getAdminLevels(): Promise<ApiResponse<UserLevel[]>> {
		return this.request<UserLevel[]>('/admin/levels');
	}

	async adminLogout(): Promise<ApiResponse<null>> {
		const response = await this.request<null>('/admin/logout', {
			method: 'POST'
		});

		// Clear token on logout
		this.setAuthToken(null);
		return response;
	}

	async adminVerify(): Promise<ApiResponse<UserProfile>> {
		return this.request<UserProfile>('/admin/verify', {
			method: 'POST'
		});
	}

	async deleteAdminUser(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/admin/users/${id}`, {
			method: 'DELETE'
		});
	}

	async resetAdminSequence(): Promise<ApiResponse<null>> {
		return this.request<null>('/admin/reset-sequence', {
			method: 'POST'
		});
	}

	// =================== CUSTOMER AUTH ===================
	async customerRegister(data: PelangganData): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>('/customer/register', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async customerLogin(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
		const response = await this.request<LoginResponse>('/customer/login', {
			method: 'POST',
			body: JSON.stringify({ username, password })
		});

		// Auto-set token if login successful
		if (response.success && response.data?.token) {
			this.setAuthToken(response.data.token);
		}

		return response;
	}

	async getCustomerProfile(): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>('/customer/profile');
	}

	async getCustomerList(
		page = 1,
		limit = 10,
		search = ''
	): Promise<ApiResponse<PaginatedResponse<PelangganProfile>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search })
		});
		return this.request<PaginatedResponse<PelangganProfile>>(`/customer/list?${params}`);
	}

	async getCustomerTagihan(
		status = '',
		bulan = '',
		tahun = ''
	): Promise<ApiResponse<TagihanData[]>> {
		const params = new URLSearchParams({
			...(status && { status }),
			...(bulan && { bulan }),
			...(tahun && { tahun })
		});
		return this.request<TagihanData[]>(`/customer/tagihan?${params}`);
	}

	async customerLogout(): Promise<ApiResponse<null>> {
		const response = await this.request<null>('/customer/logout', {
			method: 'POST'
		});

		// Clear token on logout
		this.setAuthToken(null);
		return response;
	}

	async customerVerify(): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>('/customer/verify', {
			method: 'POST'
		});
	}

	async deleteCustomer(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/customer/customers/${id}`, {
			method: 'DELETE'
		});
	}

	async resetCustomerSequence(): Promise<ApiResponse<null>> {
		return this.request<null>('/customer/reset-sequence', {
			method: 'POST'
		});
	}

	// =================== TARIF ===================
	async getTarif(
		page = 1,
		limit = 50,
		search = ''
	): Promise<ApiResponse<PaginatedResponse<TarifData>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search })
		});
		return this.request<PaginatedResponse<TarifData>>(`/tarif?${params}`);
	}

	async getTarifById(id: number): Promise<ApiResponse<TarifData>> {
		return this.request<TarifData>(`/tarif/${id}`);
	}

	async createTarif(data: CreateTarifRequest): Promise<ApiResponse<TarifData>> {
		return this.request<TarifData>('/admin/tarif', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updateTarif(id: number, data: UpdateTarifRequest): Promise<ApiResponse<TarifData>> {
		return this.request<TarifData>(`/admin/tarif/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deleteTarif(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/admin/tarif/${id}`, {
			method: 'DELETE'
		});
	}

	// =================== PELANGGAN ===================
	async getPelanggan(
		page = 1,
		limit = 10,
		search = ''
	): Promise<ApiResponse<PaginatedResponse<PelangganProfile>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search })
		});
		return this.request<PaginatedResponse<PelangganProfile>>(`/admin/pelanggan?${params}`);
	}

	async getPelangganById(id: number): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>(`/admin/pelanggan/${id}`);
	}

	async createPelanggan(data: PelangganData): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>('/admin/pelanggan', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updatePelanggan(
		id: number,
		data: UpdatePelangganData
	): Promise<ApiResponse<PelangganProfile>> {
		return this.request<PelangganProfile>(`/admin/pelanggan/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deletePelanggan(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/admin/pelanggan/${id}`, {
			method: 'DELETE'
		});
	}

	// =================== PENGGUNAAN ===================
	async getPenggunaan(
		page = 1,
		limit = 10,
		search = '',
		params: PenggunaanFilterParams = {}
	): Promise<ApiResponse<PaginatedResponse<PenggunaanData>>> {
		const urlParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search }),
			...(params.bulan && { bulan: params.bulan }),
			...(params.tahun && { tahun: params.tahun }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan })
		});
		return this.request<PaginatedResponse<PenggunaanData>>(`/admin/penggunaan?${urlParams}`);
	}

	async getPenggunaanById(id: number): Promise<ApiResponse<PenggunaanData>> {
		return this.request<PenggunaanData>(`/admin/penggunaan/${id}`);
	}

	async createPenggunaan(data: CreatePenggunaanData): Promise<ApiResponse<PenggunaanData>> {
		return this.request<PenggunaanData>('/admin/penggunaan', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updatePenggunaan(
		id: number,
		data: UpdatePenggunaanData
	): Promise<ApiResponse<PenggunaanData>> {
		return this.request<PenggunaanData>(`/admin/penggunaan/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deletePenggunaan(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/admin/penggunaan/${id}`, {
			method: 'DELETE'
		});
	}

	// =================== TAGIHAN ===================
	async getTagihan(
		page = 1,
		limit = 10,
		search = '',
		params: TagihanFilterParams = {}
	): Promise<ApiResponse<PaginatedResponse<TagihanData>>> {
		const urlParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search }),
			...(params.status && { status: params.status }),
			...(params.bulan && { bulan: params.bulan }),
			...(params.tahun && { tahun: params.tahun }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan })
		});
		return this.request<PaginatedResponse<TagihanData>>(`/tagihan?${urlParams}`);
	}

	async generateTagihan(data: GenerateTagihanData): Promise<ApiResponse<TagihanData[]>> {
		return this.request<TagihanData[]>('/admin/tagihan/generate', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updateTagihanStatus(
		id: number,
		data: UpdateTagihanStatusData
	): Promise<ApiResponse<TagihanData>> {
		return this.request<TagihanData>(`/admin/tagihan/${id}/status`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async getCustomerTagihanList(
		page = 1,
		limit = 10,
		status = ''
	): Promise<ApiResponse<PaginatedResponse<TagihanData>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(status && { status })
		});
		return this.request<PaginatedResponse<TagihanData>>(`/customer/tagihan?${params}`);
	}

	async getCustomerTagihanById(id: number): Promise<ApiResponse<TagihanData>> {
		return this.request<TagihanData>(`/customer/tagihan/${id}`);
	}

	// =================== PEMBAYARAN ===================
	async getPembayaran(
		page = 1,
		limit = 10,
		search = '',
		params: PembayaranFilterParams = {}
	): Promise<ApiResponse<PaginatedResponse<PembayaranData>>> {
		const urlParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(search && { search }),
			...(params.tanggal_mulai && { tanggal_mulai: params.tanggal_mulai }),
			...(params.tanggal_selesai && { tanggal_selesai: params.tanggal_selesai }),
			...(params.bulan_bayar && { bulan_bayar: params.bulan_bayar }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan }),
			...(params.id_user && { id_user: params.id_user })
		});
		return this.request<PaginatedResponse<PembayaranData>>(`/admin/pembayaran?${urlParams}`);
	}

	async getPembayaranById(id: number): Promise<ApiResponse<PembayaranData>> {
		return this.request<PembayaranData>(`/admin/pembayaran/${id}`);
	}

	async createPembayaran(data: CreatePembayaranData): Promise<ApiResponse<PembayaranData>> {
		return this.request<PembayaranData>('/admin/pembayaran', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updatePembayaran(
		id: number,
		data: UpdatePembayaranData
	): Promise<ApiResponse<PembayaranData>> {
		return this.request<PembayaranData>(`/admin/pembayaran/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deletePembayaran(id: number): Promise<ApiResponse<null>> {
		return this.request<null>(`/admin/pembayaran/${id}`, {
			method: 'DELETE'
		});
	}

	async getCustomerPembayaran(
		page = 1,
		limit = 10,
		bulan_bayar = ''
	): Promise<ApiResponse<PaginatedResponse<PembayaranData>>> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(bulan_bayar && { bulan_bayar })
		});
		return this.request<PaginatedResponse<PembayaranData>>(`/customer/pembayaran?${params}`);
	}

	async getCustomerPembayaranById(id: number): Promise<ApiResponse<PembayaranData>> {
		return this.request<PembayaranData>(`/customer/pembayaran/${id}`);
	}

	// =================== DASHBOARD ===================
	async getAdminDashboard(): Promise<ApiResponse<AdminDashboardStats>> {
		return this.request<AdminDashboardStats>('/admin/dashboard');
	}

	async getAdminDashboardStats(
		params: DashboardStatsParams = {}
	): Promise<ApiResponse<RevenueChartData[]>> {
		const year = params.year || new Date().getFullYear();
		return this.request<RevenueChartData[]>(`/admin/dashboard/stats?year=${year}`);
	}

	async getCustomerDashboard(): Promise<ApiResponse<CustomerDashboardData>> {
		return this.request<CustomerDashboardData>('/customer/dashboard');
	}

	async getCustomerUsageHistory(limit = 6): Promise<ApiResponse<PenggunaanData[]>> {
		return this.request<PenggunaanData[]>(`/customer/dashboard/usage?limit=${limit}`);
	}

	// =================== LAPORAN ===================
	async getLaporanPenggunaan(
		params: LaporanPenggunaanParams = {}
	): Promise<ApiResponse<LaporanPenggunaan[]>> {
		const urlParams = new URLSearchParams({
			...(params.bulan && { bulan: params.bulan }),
			...(params.tahun && { tahun: params.tahun }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan })
		});
		return this.request<LaporanPenggunaan[]>(`/admin/laporan/penggunaan?${urlParams}`);
	}

	async getLaporanTagihan(
		params: LaporanTagihanParams = {}
	): Promise<ApiResponse<LaporanTagihan[]>> {
		const urlParams = new URLSearchParams({
			...(params.bulan && { bulan: params.bulan }),
			...(params.tahun && { tahun: params.tahun }),
			...(params.status && { status: params.status }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan })
		});
		return this.request<LaporanTagihan[]>(`/admin/laporan/tagihan?${urlParams}`);
	}

	async getLaporanPembayaran(
		params: LaporanPembayaranParams = {}
	): Promise<ApiResponse<LaporanPembayaran[]>> {
		const urlParams = new URLSearchParams({
			...(params.tanggal_mulai && { tanggal_mulai: params.tanggal_mulai }),
			...(params.tanggal_selesai && { tanggal_selesai: params.tanggal_selesai }),
			...(params.id_pelanggan && { id_pelanggan: params.id_pelanggan }),
			...(params.id_user && { id_user: params.id_user }),
			limit: (params.limit || 50).toString(),
			offset: (params.offset || 0).toString()
		});
		return this.request<LaporanPembayaran[]>(`/admin/laporan/pembayaran?${urlParams}`);
	}

	async getCustomerLaporanPenggunaan(
		params: LaporanPenggunaanParams = {}
	): Promise<ApiResponse<LaporanPenggunaan[]>> {
		const urlParams = new URLSearchParams({
			...(params.bulan && { bulan: params.bulan }),
			...(params.tahun && { tahun: params.tahun }),
			limit: (params.limit || 12).toString()
		});
		return this.request<LaporanPenggunaan[]>(`/customer/laporan/penggunaan?${urlParams}`);
	}

	// =================== HELPER METHODS ===================
	async checkPelangganExists(
		search: string
	): Promise<ApiResponse<PaginatedResponse<PelangganProfile>>> {
		return this.getPelanggan(1, 1, search);
	}

	// Utility method to check if user is authenticated
	isAuthenticated(): boolean {
		return this.authToken !== null;
	}

	// Get current auth token
	getAuthToken(): string | null {
		return this.authToken;
	}

	// Method to retry failed requests with exponential backoff
	async retryRequest<T>(
		requestFn: () => Promise<ApiResponse<T>>,
		maxRetries = 3,
		baseDelay = 1000
	): Promise<ApiResponse<T>> {
		let lastError: ApiResponse<T> | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const result = await requestFn();

				if (result.success) {
					return result;
				}

				lastError = result;

				// Don't retry on client errors (4xx)
				if (result.error && result.error.includes('4')) {
					break;
				}
			} catch (error) {
				lastError = {
					success: false,
					message: 'Request failed',
					error: error instanceof Error ? error.message : 'Unknown error'
				};
			}

			// Wait before retrying (exponential backoff)
			if (attempt < maxRetries) {
				const delay = baseDelay * Math.pow(2, attempt);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		return (
			lastError || {
				success: false,
				message: 'All retry attempts failed',
				error: 'Maximum retries exceeded'
			}
		);
	}
}

// Create singleton instance and initialize token
export const apiClient = new ApiClient();

// Initialize token from localStorage when the module loads
if (typeof window !== 'undefined') {
	apiClient.initializeToken();
}
