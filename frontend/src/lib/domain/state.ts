export type StateFn<State, Result> = (state: State) => [Result, State];

export function runState<State, Result>(
	stateFn: StateFn<State, Result>,
	initialState: State
): [Result, State] {
	return stateFn(initialState);
}