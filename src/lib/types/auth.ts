import type { UserProfile, PelangganProfile } from './user';

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: UserProfile | PelangganProfile;
}

export interface RegisterAdminRequest {
	username: string;
	password: string;
	nama_user: string;
	id_level: number;
}

export interface BootstrapAdminRequest {
	username: string;
	password: string;
	nama_user: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: UserProfile | PelangganProfile | null;
	token: string | null;
	userType: 'admin' | 'customer' | null;
}
