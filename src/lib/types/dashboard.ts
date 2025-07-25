import type { TagihanData } from './tagihan';
import type { PembayaranData } from './pembayaran';
import type { PelangganProfile } from './user';

export interface AdminDashboardStats {
	totalPelanggan: number;
	totalTagihan: number;
	totalPendapatan: number;
	tagihanBelumLunas: number;
	recentTagihan: TagihanData[];
}

export interface CustomerDashboardData {
	profile: PelangganProfile;
	tagihanBelumLunas: TagihanData[];
	riwayatPembayaran: PembayaranData[];
}

export interface RevenueChartData {
	bulan: string;
	pendapatan: number;
}

export interface DashboardStatsParams {
	year?: number;
	limit?: number;
}
