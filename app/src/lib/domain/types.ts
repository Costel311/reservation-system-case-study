export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export type ReservationStatus = 'confirmed' | 'cancelled';

export type ResourceType = 'room' | 'laboratory' | 'equipment' | 'other';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface TimeSlot {
	id: string;
	start: string;
	end: string;
	isAvailable: boolean;
}

export interface Resource {
	id: string;
	name: string;
	type: ResourceType;
	location: string;
	capacity: number;
	timeSlots: TimeSlot[];
}

export interface Reservation {
	id: string;
	userId: string;
	resourceId: string;
	timeSlotId: string;
	start: string;
	end: string;
	status: ReservationStatus;
	createdAt: string;
}

export interface SystemState {
	users: User[];
	resources: Resource[];
	reservations: Reservation[];
}