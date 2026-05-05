export type Maybe<T> = Some<T> | None;

export interface Some<T> {
	type: 'some';
	value: T;
}

export interface None {
	type: 'none';
}

export function some<T>(value: T): Maybe<T> {
	return {
		type: 'some',
		value
	};
}

export function none<T>(): Maybe<T> {
	return {
		type: 'none'
	};
}

export function isSome<T>(maybe: Maybe<T>): maybe is Some<T> {
	return maybe.type === 'some';
}

export function isNone<T>(maybe: Maybe<T>): maybe is None {
	return maybe.type === 'none';
}

export function mapMaybe<T, U>(maybe: Maybe<T>, fn: (value: T) => U): Maybe<U> {
	if (isSome(maybe)) {
		return some(fn(maybe.value));
	}

	return none();
}