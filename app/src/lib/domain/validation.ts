export type Validation<T> = Valid<T> | Invalid;

export interface Valid<T> {
	type: 'valid';
	value: T;
}

export interface Invalid {
	type: 'invalid';
	errors: string[];
}

export function valid<T>(value: T): Validation<T> {
	return {
		type: 'valid',
		value
	};
}

export function invalid<T>(errors: string[]): Validation<T> {
	return {
		type: 'invalid',
		errors
	};
}

export function isValid<T>(validation: Validation<T>): validation is Valid<T> {
	return validation.type === 'valid';
}

export function isInvalid<T>(validation: Validation<T>): validation is Invalid {
	return validation.type === 'invalid';
}