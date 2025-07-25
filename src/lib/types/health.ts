export interface HealthResponse {
	status: string;
	message: string;
	timestamp: string;
	version: string;
}

export interface ServerStatus {
	isOnline: boolean;
	lastChecked: Date;
	version?: string;
}
