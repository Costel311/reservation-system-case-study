<script lang="ts">
	import { onMount } from 'svelte';
	import type { Reservation, Resource, TimeSlot, User } from '$lib/domain/types';

	const API_BASE_URL = 'http://localhost:3000';

	let users = $state<User[]>([]);
	let resources = $state<Resource[]>([]);
	let reservations = $state<Reservation[]>([]);

	let selectedUserId = $state('');
	let selectedResourceId = $state('');
	let start = $state('');
	let end = $state('');

	let message = $state('');
	let loading = $state(false);

	function getSelectedResource(): Resource | undefined {
		return resources.find((resource) => resource.id === selectedResourceId);
	}

	function selectResource(resourceId: string) {
		selectedResourceId = resourceId;
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

	function formatWindow(window: TimeSlot): string {
		return `${formatDate(window.start)}, ${formatTime(window.start)} - ${formatTime(window.end)}`;
	}

	async function loadData() {
		const [usersResponse, resourcesResponse, reservationsResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/users`),
			fetch(`${API_BASE_URL}/resources`),
			fetch(`${API_BASE_URL}/reservations`)
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

		if (!selectedUserId || !selectedResourceId || !start || !end) {
			message = 'Please select a user, a resource, a start date and an end date.';
			return;
		}

		loading = true;

		const response = await fetch(`${API_BASE_URL}/reservations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: selectedUserId,
				resourceId: selectedResourceId,
				slot: {
					start: new Date(start).toISOString(),
					end: new Date(end).toISOString()
				}
			})
		});

		const data = await response.json();

		if (!response.ok) {
			message = data.errors?.join(' ') ?? data.error ?? 'Reservation could not be created.';
			loading = false;
			return;
		}

		message = 'Reservation created successfully.';

		start = '';
		end = '';

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
		<p class="eyebrow">SvelteKit Frontend + Express Backend + MongoDB</p>
		<h1>Reservation Management System</h1>
		<p>
			This page is the SvelteKit frontend. It sends reservation requests to a separate Express
			backend running on <strong>http://localhost:3000</strong>.
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
			<p class="hint">Choose a room, laboratory, equipment item or guided tour.</p>
		</div>

		{#if resources.length === 0}
			<p>No resources found. Start the backend and run the seed endpoint first.</p>
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

						<p class="slot-count">{resource.availabilityWindows.length} availability windows</p>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card">
		<div class="section-header">
			<div>
				<p class="eyebrow">Step 3</p>
				<h2>Choose Start and End</h2>
			</div>
			<p class="hint">
				The selected interval must be inside one of the availability windows and must not overlap
				an existing reservation.
			</p>
		</div>

		{#if !selectedResourceId}
			<p class="empty-state">Please select a resource first.</p>
		{:else}
			<div class="availability-box">
				<h3>Available windows for {getSelectedResource()?.name}</h3>

				<ul>
					{#each getSelectedResource()?.availabilityWindows ?? [] as window}
						<li>{formatWindow(window)}</li>
					{/each}
				</ul>
			</div>

			<div class="form-grid">
				<label class="field">
					Start
					<input type="datetime-local" bind:value={start} />
				</label>

				<label class="field">
					End
					<input type="datetime-local" bind:value={end} />
				</label>
			</div>
		{/if}
	</section>

	<section class="card summary-card">
		<div>
			<p class="eyebrow">Step 4</p>
			<h2>Confirm Reservation</h2>
			<p>
				The frontend sends userId, resourceId and slot start/end to the separate Express backend.
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
								<td>{formatDate(reservation.slot.start)} {formatTime(reservation.slot.start)}</td>
								<td>{formatDate(reservation.slot.end)} {formatTime(reservation.slot.end)}</td>
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
		max-width: 850px;
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

	select,
	input {
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

	.availability-box {
		margin-bottom: 18px;
		padding: 18px;
		border-radius: 14px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
	}

	.availability-box h3 {
		margin-top: 0;
	}

	.availability-box li {
		margin-bottom: 6px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
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