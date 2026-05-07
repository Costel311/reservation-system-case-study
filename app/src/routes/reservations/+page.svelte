<script lang="ts">
	import { onMount } from 'svelte';
	import type { Reservation, Resource, TimeSlot, User } from '$lib/domain/types';

	let users = $state<User[]>([]);
	let resources = $state<Resource[]>([]);
	let reservations = $state<Reservation[]>([]);

	let selectedUserId = $state('');
	let selectedResourceId = $state('');
	let selectedTimeSlotId = $state('');

	let message = $state('');
	let loading = $state(false);

	function getSelectedResource(): Resource | undefined {
		return resources.find((resource) => resource.id === selectedResourceId);
	}

	function getAvailableTimeSlots(): TimeSlot[] {
		const resource = getSelectedResource();

		if (!resource) {
			return [];
		}

		return resource.timeSlots.filter((slot) => slot.isAvailable);
	}

	function selectResource(resourceId: string) {
		selectedResourceId = resourceId;
		selectedTimeSlotId = '';
		message = '';
	}

	function selectTimeSlot(slotId: string) {
		selectedTimeSlotId = slotId;
		message = '';
	}

	function formatDate(value: string): string {
		return new Date(value).toLocaleDateString('en-GB', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTime(value: string): string {
		return new Date(value).toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getSlotDuration(slot: TimeSlot): string {
		const start = new Date(slot.start).getTime();
		const end = new Date(slot.end).getTime();
		const minutes = Math.round((end - start) / 60000);

		if (minutes < 60) {
			return `${minutes} min`;
		}

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (remainingMinutes === 0) {
			return `${hours} h`;
		}

		return `${hours} h ${remainingMinutes} min`;
	}

	async function loadData() {
		const [usersResponse, resourcesResponse, reservationsResponse] = await Promise.all([
			fetch('/api/users'),
			fetch('/api/resources'),
			fetch('/api/reservations')
		]);

		const usersData = await usersResponse.json();
		const resourcesData = await resourcesResponse.json();
		const reservationsData = await reservationsResponse.json();

		users = usersData.users;
		resources = resourcesData.resources;
		reservations = reservationsData.reservations;
	}

	async function createNewReservation() {
		message = '';

		if (!selectedUserId || !selectedResourceId || !selectedTimeSlotId) {
			message = 'Please select a user, a resource and an available time slot.';
			return;
		}

		loading = true;

		const response = await fetch('/api/reservations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: selectedUserId,
				resourceId: selectedResourceId,
				timeSlotId: selectedTimeSlotId
			})
		});

		const data = await response.json();

		if (!response.ok) {
			message = data.errors?.join(' ') ?? 'Reservation could not be created.';
			loading = false;
			return;
		}

		message = 'Reservation created successfully. The selected time slot is now unavailable.';

		selectedTimeSlotId = '';

		await loadData();

		loading = false;
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Reservations</title>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">SvelteKit + MongoDB Case Study</p>
		<h1>Reservation Management System</h1>
		<p>
			Select a user, choose a resource and book one of the available predefined time slots.
			The time slots are stored as embedded documents inside MongoDB resource documents.
		</p>
	</section>

	<section class="card">
		<div class="section-header">
			<div>
				<p class="eyebrow">Step 1</p>
				<h2>Select User</h2>
			</div>
		</div>

		<label class="field">
			User
			<select bind:value={selectedUserId}>
				<option value="">Select user</option>
				{#each users as user}
					<option value={user.id}>{user.name} — {user.role}</option>
				{/each}
			</select>
		</label>
	</section>

	<section class="card">
		<div class="section-header">
			<div>
				<p class="eyebrow">Step 2</p>
				<h2>Select Resource</h2>
			</div>
			<p class="hint">Choose a room, laboratory or equipment item.</p>
		</div>

		{#if resources.length === 0}
			<p>No resources found. Run the database seed endpoint first.</p>
		{:else}
			<div class="resource-grid">
				{#each resources as resource}
					<button
						type="button"
						class:selected={selectedResourceId === resource.id}
						class="resource-card"
						onclick={() => selectResource(resource.id)}
					>
						<div class="resource-title-row">
							<h3>{resource.name}</h3>
							<span>{resource.type}</span>
						</div>

						<p><strong>Location:</strong> {resource.location}</p>
						<p><strong>Capacity:</strong> {resource.capacity}</p>

						<p class="slot-count">
							{resource.timeSlots.filter((slot) => slot.isAvailable).length} available slots
						</p>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card">
		<div class="section-header">
			<div>
				<p class="eyebrow">Step 3</p>
				<h2>Select Available Time Slot</h2>
			</div>
			<p class="hint">The user chooses from predefined available intervals.</p>
		</div>

		{#if !selectedResourceId}
			<p class="empty-state">Please select a resource first.</p>
		{:else if getAvailableTimeSlots().length === 0}
			<p class="empty-state">There are no available slots for the selected resource.</p>
		{:else}
			<div class="slot-grid">
				{#each getAvailableTimeSlots() as slot}
					<button
						type="button"
						class:selected={selectedTimeSlotId === slot.id}
						class="slot-card"
						onclick={() => selectTimeSlot(slot.id)}
					>
						<span class="slot-date">{formatDate(slot.start)}</span>
						<span class="slot-time">{formatTime(slot.start)} - {formatTime(slot.end)}</span>
						<span class="slot-duration">{getSlotDuration(slot)}</span>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card summary-card">
		<div>
			<p class="eyebrow">Step 4</p>
			<h2>Confirm Reservation</h2>
			<p>
				After confirmation, the reservation is saved in MongoDB and the selected embedded
				time slot becomes unavailable.
			</p>
		</div>

		<button class="confirm-button" onclick={createNewReservation} disabled={loading}>
			{loading ? 'Saving...' : 'Create reservation'}
		</button>

		{#if message}
			<p class="message">{message}</p>
		{/if}
	</section>

	<section class="card">
		<h2>Existing Reservations</h2>

		{#if reservations.length === 0}
			<p>No reservations yet.</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>User</th>
							<th>Resource</th>
							<th>Start</th>
							<th>End</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each reservations as reservation}
							<tr>
								<td>{reservation.id}</td>
								<td>{reservation.userId}</td>
								<td>{reservation.resourceId}</td>
								<td>{formatDate(reservation.start)} {formatTime(reservation.start)}</td>
								<td>{formatDate(reservation.end)} {formatTime(reservation.end)}</td>
								<td>{reservation.status}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>

<style>
	.page {
		max-width: 1180px;
		margin: 0 auto;
		padding: 32px;
		font-family:
			Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		color: #111827;
		background: #f7f7f8;
	}

	.hero {
		margin-bottom: 24px;
		padding: 28px;
		border-radius: 18px;
		background: linear-gradient(135deg, #ffffff, #f1f5f9);
		border: 1px solid #e5e7eb;
	}

	.hero h1 {
		margin: 0 0 10px;
		font-size: 40px;
		line-height: 1.1;
	}

	.hero p {
		max-width: 820px;
		margin: 0;
		color: #4b5563;
		font-size: 17px;
	}

	.eyebrow {
		margin: 0 0 6px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #2563eb;
	}

	.card {
		margin-bottom: 22px;
		padding: 24px;
		border: 1px solid #e5e7eb;
		border-radius: 18px;
		background: #ffffff;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
	}

	.section-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}

	.card h2 {
		margin: 0;
		font-size: 25px;
	}

	.hint {
		margin: 0;
		color: #6b7280;
	}

	.field {
		display: flex;
		max-width: 460px;
		flex-direction: column;
		gap: 8px;
		font-weight: 700;
	}

	select {
		padding: 12px;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		background: white;
		font-size: 15px;
	}

	.resource-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
	}

	.resource-card {
		padding: 18px;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		background: #ffffff;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.2s,
			transform 0.2s,
			box-shadow 0.2s;
	}

	.resource-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
	}

	.resource-card.selected {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
	}

	.resource-title-row {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: flex-start;
	}

	.resource-title-row h3 {
		margin: 0 0 10px;
		font-size: 20px;
	}

	.resource-title-row span {
		padding: 4px 8px;
		border-radius: 999px;
		background: #eff6ff;
		color: #1d4ed8;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
	}

	.resource-card p {
		margin: 8px 0;
		color: #374151;
	}

	.slot-count {
		margin-top: 14px !important;
		font-weight: 700;
		color: #047857 !important;
	}

	.empty-state {
		padding: 18px;
		border-radius: 14px;
		background: #f9fafb;
		color: #6b7280;
	}

	.slot-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 14px;
	}

	.slot-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 18px;
		border: 1px solid #d1d5db;
		border-radius: 16px;
		background: #f9fafb;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.2s,
			transform 0.2s,
			box-shadow 0.2s;
	}

	.slot-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
	}

	.slot-card.selected {
		border-color: #16a34a;
		background: #f0fdf4;
		box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
	}

	.slot-date {
		font-weight: 800;
		color: #111827;
	}

	.slot-time {
		font-size: 18px;
		font-weight: 800;
		color: #2563eb;
	}

	.slot-duration {
		width: fit-content;
		padding: 4px 8px;
		border-radius: 999px;
		background: #e5e7eb;
		color: #374151;
		font-size: 13px;
		font-weight: 700;
	}

	.summary-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}

	.summary-card p {
		margin: 8px 0 0;
		color: #4b5563;
	}

	.confirm-button {
		padding: 13px 20px;
		border: none;
		border-radius: 12px;
		background: #111827;
		color: white;
		font-weight: 800;
		cursor: pointer;
	}

	.confirm-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.message {
		width: 100%;
		padding: 12px 14px;
		border-radius: 12px;
		background: #eff6ff;
		color: #1d4ed8 !important;
		font-weight: 700;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 12px;
		border-bottom: 1px solid #e5e7eb;
		text-align: left;
	}

	th {
		background: #f9fafb;
		font-size: 13px;
		text-transform: uppercase;
		color: #4b5563;
	}
</style>