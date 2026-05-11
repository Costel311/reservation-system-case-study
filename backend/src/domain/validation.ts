export type Validation<T> = Valid<T> | Invalid;

export interface Valid<T> {
	ok: true;
	value: T;
}

export interface Invalid {
	ok: false;
	errors: string[];
}

export function valid<T>(value: T): Validation<T> {
	return {
		ok: true,
		value
	};
}

export function invalid<T>(errors: string[]): Validation<T> {
	return {
		ok: false,
		errors
	};
}

export function isValid<T>(validation: Validation<T>): validation is Valid<T> {
	return validation.ok;
}

export function isInvalid<T>(validation: Validation<T>): validation is Invalid {
	return !validation.ok;
}