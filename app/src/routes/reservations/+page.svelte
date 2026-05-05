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
			message = 'Please select a user, a resource and a time slot.';
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

		message = 'Reservation created successfully.';
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
		<h1>Reservation Management System</h1>
		<p>
			This page demonstrates a SvelteKit interface connected to MongoDB through server API
			endpoints.
		</p>
	</section>

	<section class="card">
		<h2>Create reservation</h2>

		<div class="form-grid">
			<label>
				User
				<select bind:value={selectedUserId}>
					<option value="">Select user</option>
					{#each users as user}
						<option value={user.id}>{user.name} — {user.role}</option>
					{/each}
				</select>
			</label>

			<label>
				Resource
				<select
					bind:value={selectedResourceId}
					onchange={() => {
						selectedTimeSlotId = '';
					}}
				>
					<option value="">Select resource</option>
					{#each resources as resource}
						<option value={resource.id}>
							{resource.name} — {resource.type} — {resource.location}
						</option>
					{/each}
				</select>
			</label>

			<label>
				Time slot
				<select bind:value={selectedTimeSlotId}>
					<option value="">Select time slot</option>
					{#each getAvailableTimeSlots() as slot}
						<option value={slot.id}>
							{new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleTimeString()}
						</option>
					{/each}
				</select>
			</label>
		</div>

		<button onclick={createNewReservation} disabled={loading}>
			{loading ? 'Saving...' : 'Create reservation'}
		</button>

		{#if message}
			<p class="message">{message}</p>
		{/if}
	</section>

	<section class="card">
		<h2>Available resources</h2>

		{#if resources.length === 0}
			<p>No resources found. Run the database seed endpoint first.</p>
		{:else}
			<div class="resource-list">
				{#each resources as resource}
					<article class="resource">
						<h3>{resource.name}</h3>
						<p><strong>Type:</strong> {resource.type}</p>
						<p><strong>Location:</strong> {resource.location}</p>
						<p><strong>Capacity:</strong> {resource.capacity}</p>

						<ul>
							{#each resource.timeSlots as slot}
								<li>
									{new Date(slot.start).toLocaleString()} —
									{slot.isAvailable ? 'Available' : 'Reserved'}
								</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card">
		<h2>Reservations</h2>

		{#if reservations.length === 0}
			<p>No reservations yet.</p>
		{:else}
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
							<td>{new Date(reservation.start).toLocaleString()}</td>
							<td>{new Date(reservation.end).toLocaleString()}</td>
							<td>{reservation.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</main>

<style>
	.page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 32px;
		font-family:
			Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.hero {
		margin-bottom: 24px;
	}

	.hero h1 {
		margin-bottom: 8px;
		font-size: 36px;
	}

	.hero p {
		color: #555;
	}

	.card {
		margin-bottom: 24px;
		padding: 24px;
		border: 1px solid #ddd;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
	}

	.card h2 {
		margin-top: 0;
		margin-bottom: 16px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 16px;
		margin-bottom: 16px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-weight: 600;
	}

	select {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: white;
	}

	button {
		padding: 10px 18px;
		border: none;
		border-radius: 8px;
		background: #222;
		color: white;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.message {
		margin-top: 12px;
		font-weight: 600;
	}

	.resource-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
	}

	.resource {
		padding: 16px;
		border: 1px solid #e5e5e5;
		border-radius: 10px;
		background: #fafafa;
	}

	.resource h3 {
		margin-top: 0;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 10px;
		border-bottom: 1px solid #ddd;
		text-align: left;
	}

	th {
		background: #f5f5f5;
	}
</style>