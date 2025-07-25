import { ValidationRules } from './rules';
import type { CreatePelangganRequest } from '$lib/types/api';

export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

export interface ValidatedField {
	field: string;
	value: unknown;
	isValid: boolean;
	error?: string;
}

export class Validator {
	private errors: Record<string, string> = {};

	validateUsername(value: string): ValidatedField {
		const rule = ValidationRules.username;

		if (!value.trim()) {
			return {
				field: 'username',
				value,
				isValid: false,
				error: rule.message.required
			};
		}

		if (value.length < rule.minLength) {
			return {
				field: 'username',
				value,
				isValid: false,
				error: rule.message.minLength
			};
		}

		if (value.length > rule.maxLength) {
			return {
				field: 'username',
				value,
				isValid: false,
				error: rule.message.maxLength
			};
		}

		if (!rule.pattern.test(value)) {
			return {
				field: 'username',
				value,
				isValid: false,
				error: rule.message.pattern
			};
		}

		return {
			field: 'username',
			value,
			isValid: true
		};
	}

	validatePelangganData(data: CreatePelangganRequest): ValidationResult {
		this.errors = {};

		const usernameResult = this.validateUsername(data.username);
		if (!usernameResult.isValid && usernameResult.error) {
			this.errors.username = usernameResult.error;
		}

		return {
			isValid: Object.keys(this.errors).length === 0,
			errors: { ...this.errors }
		};
	}

	// Generic validator for any object
	validate<T extends Record<string, unknown>>(data: T): ValidationResult {
		this.errors = {};

		// Type-safe validation based on the data structure
		for (const [key, value] of Object.entries(data)) {
			switch (key) {
				case 'username':
					if (typeof value === 'string') {
						const result = this.validateUsername(value);
						if (!result.isValid && result.error) {
							this.errors[key] = result.error;
						}
					}
					break;
			}
		}

		return {
			isValid: Object.keys(this.errors).length === 0,
			errors: { ...this.errors }
		};
	}

	getErrors(): Record<string, string> {
		return { ...this.errors };
	}

	clearErrors(): void {
		this.errors = {};
	}
}
