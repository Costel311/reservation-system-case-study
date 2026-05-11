import type { Resource, Reservation, SystemState, TimeSlot, User } from './types';
import type { StateFn } from './state';
import type { Validation } from './validation';
import { invalid, valid } from './validation';

export interface CreateReservationInput {
	userId: string;
	resourceId: string;
	timeSlotId: string;
}

interface ReservationContext {
	user: User;
	resource: Resource;
	timeSlot: TimeSlot;
}

function createReservationId(): string {
	return `res_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function validateReservationInput(
	input: CreateReservationInput,
	state: SystemState
): Validation<ReservationContext> {
	const errors: string[] = [];

	const user = state.users.find((item) => item.id === input.userId);
	const resource = state.resources.find((item) => item.id === input.resourceId);
	const timeSlot = resource?.timeSlots.find((item) => item.id === input.timeSlotId);

	if (!user) {
		errors.push('User does not exist.');
	}

	if (!resource) {
		errors.push('Resource does not exist.');
	}

	if (!timeSlot) {
		errors.push('Time slot does not exist.');
	}

	if (timeSlot && !timeSlot.isAvailable) {
		errors.push('Time slot is not available.');
	}

	const existingReservation = state.reservations.find(
		(item) =>
			item.resourceId === input.resourceId &&
			item.timeSlotId === input.timeSlotId &&
			item.status === 'confirmed'
	);

	if (existingReservation) {
		errors.push('This resource is already reserved for the selected time slot.');
	}

	if (errors.length > 0 || !user || !resource || !timeSlot) {
		return invalid(errors);
	}

	return valid({
		user,
		resource,
		timeSlot
	});
}

export function createReservation(
	input: CreateReservationInput
): StateFn<SystemState, Validation<Reservation>> {
	return (state: SystemState): [Validation<Reservation>, SystemState] => {
		const validationResult = validateReservationInput(input, state);

		if (validationResult.type === 'invalid') {
			return [validationResult, state];
		}

		const { timeSlot } = validationResult.value;

		const reservation: Reservation = {
			id: createReservationId(),
			userId: input.userId,
			resourceId: input.resourceId,
			timeSlotId: input.timeSlotId,
			start: timeSlot.start,
			end: timeSlot.end,
			status: 'confirmed',
			createdAt: new Date().toISOString()
		};

		const updatedResources = state.resources.map((resource) => {
			if (resource.id !== input.resourceId) {
				return resource;
			}

			return {
				...resource,
				timeSlots: resource.timeSlots.map((slot) => {
					if (slot.id !== input.timeSlotId) {
						return slot;
					}

					return {
						...slot,
						isAvailable: false
					};
				})
			};
		});

		const updatedState: SystemState = {
			...state,
			resources: updatedResources,
			reservations: [...state.reservations, reservation]
		};

		return [valid(reservation), updatedState];
	};
}