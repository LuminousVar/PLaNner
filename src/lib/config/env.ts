import { browser } from '$app/environment';

interface Environment {
	API_BASE_URL: string;
	APP_NAME: string;
	APP_VERSION: string;
	DEBUG: boolean;
	IS_DEVELOPMENT: boolean;
}

function getEnv(): Environment {
	if (browser) {
		return {
			API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5100/api',
			APP_NAME: import.meta.env.VITE_APP_NAME || 'PLaNner',
			APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
			DEBUG: import.meta.env.VITE_DEBUG === 'true',
			IS_DEVELOPMENT: import.meta.env.DEV
		};
	}

	return {
		API_BASE_URL: 'http://localhost:5100/api',
		APP_NAME: 'PLaNner',
		APP_VERSION: '1.0.0',
		DEBUG: true,
		IS_DEVELOPMENT: true
	};
}

export const env = getEnv();
