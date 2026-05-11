export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export type ReservationStatus = 'confirmed' | 'cancelled';

export type ResourceType = 'room' | 'laboratory' | 'equipment' | 'tour' | 'other';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface TimeSlot {
	start: string;
	end: string;
}

export interface Resource {
	id: string;
	name: string;
	type: ResourceType;
	location: string;
	capacity: number;
	availabilityWindows: TimeSlot[];
}

export interface Reservation {
	id: string;
	userId: string;
	resourceId: string;
	slot: TimeSlot;
	status: ReservationStatus;
	createdAt: string;
}