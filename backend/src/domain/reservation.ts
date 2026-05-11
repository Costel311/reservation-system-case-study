import type { Reservation, Resource, SystemState, TimeSlot, User } from './types.js';
import type { StateFn } from './state.js';
import type { Validation } from './validation.js';
import { invalid, valid } from './validation.js';

interface ReservationContext {
	user: User;
	resource: Resource;
	slot: TimeSlot;
}

function createReservationId(): string {
	return `res_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseDate(value: string): Date | null {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}

function isStartBeforeEnd(slot: TimeSlot): boolean {
	const start = parseDate(slot.start);
	const end = parseDate(slot.end);

	if (!start || !end) {
		return false;
	}

	return start.getTime() < end.getTime();
}

function isSlotInsideAvailabilityWindow(slot: TimeSlot, resource: Resource): boolean {
	const requestedStart = parseDate(slot.start);
	const requestedEnd = parseDate(slot.end);

	if (!requestedStart || !requestedEnd) {
		return false;
	}

	return resource.availabilityWindows.some((window) => {
		const windowStart = parseDate(window.start);
		const windowEnd = parseDate(window.end);

		if (!windowStart || !windowEnd) {
			return false;
		}

		return (
			requestedStart.getTime() >= windowStart.getTime() &&
			requestedEnd.getTime() <= windowEnd.getTime()
		);
	});
}

function intervalsOverlap(first: TimeSlot, second: TimeSlot): boolean {
	const firstStart = parseDate(first.start);
	const firstEnd = parseDate(first.end);
	const secondStart = parseDate(second.start);
	const secondEnd = parseDate(second.end);

	if (!firstStart || !firstEnd || !secondStart || !secondEnd) {
		return false;
	}

	return firstStart.getTime() < secondEnd.getTime() && secondStart.getTime() < firstEnd.getTime();
}

function hasOverlappingReservation(
	slot: TimeSlot,
	resourceId: string,
	reservations: Reservation[]
): boolean {
	return reservations.some((reservation) => {
		if (reservation.resourceId !== resourceId) {
			return false;
		}

		if (reservation.status !== 'confirmed') {
			return false;
		}

		return intervalsOverlap(slot, reservation.slot);
	});
}

function normalizeSlot(slot: TimeSlot): TimeSlot {
	return {
		start: new Date(slot.start).toISOString(),
		end: new Date(slot.end).toISOString()
	};
}

function validateReservationInput(
	userId: string,
	resourceId: string,
	slot: TimeSlot,
	state: SystemState
): Validation<ReservationContext> {
	const errors: string[] = [];

	const user = state.users.find((item) => item.id === userId);
	const resource = state.resources.find((item) => item.id === resourceId);

	if (!user) {
		errors.push('User does not exist.');
	}

	if (!resource) {
		errors.push('Resource does not exist.');
	}

	if (!slot?.start || !slot?.end) {
		errors.push('Reservation slot must contain start and end values.');
	}

	if (slot?.start && slot?.end && !isStartBeforeEnd(slot)) {
		errors.push('Reservation start date must be before end date.');
	}

	if (resource && slot?.start && slot?.end && !isSlotInsideAvailabilityWindow(slot, resource)) {
		errors.push('Selected interval is outside the resource availability windows.');
	}

	if (slot?.start && slot?.end && hasOverlappingReservation(slot, resourceId, state.reservations)) {
		errors.push('Selected interval overlaps with an existing reservation.');
	}

	if (errors.length > 0 || !user || !resource) {
		return invalid(errors);
	}

	return valid({
		user,
		resource,
		slot: normalizeSlot(slot)
	});
}

export function createReservation(
	userId: string,
	resourceId: string,
	slot: TimeSlot
): StateFn<SystemState, Validation<Reservation>> {
	return (state: SystemState): [Validation<Reservation>, SystemState] => {
		const validationResult = validateReservationInput(userId, resourceId, slot, state);

		if (!validationResult.ok) {
			return [validationResult, state];
		}

		const normalizedSlot = validationResult.value.slot;

		const reservation: Reservation = {
			id: createReservationId(),
			userId,
			resourceId,
			slot: normalizedSlot,
			status: 'confirmed',
			createdAt: new Date().toISOString()
		};

		const updatedState: SystemState = {
			...state,
			reservations: [...state.reservations, reservation]
		};

		return [valid(reservation), updatedState];
	};
}