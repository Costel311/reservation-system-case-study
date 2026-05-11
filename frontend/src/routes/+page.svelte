<svelte:head>
	<title>Reservation System</title>
</svelte:head>

<main class="home">
	<section class="card">
		<p class="eyebrow">Frontend / Backend Separation</p>
		<h1>Reservation System</h1>
		<p>
			This is the SvelteKit frontend. It communicates with a separate Express and MongoDB backend
			running on <strong>http://localhost:3000</strong>.
		</p>

		<a href="/reservations">Open reservations page</a>
	</section>
</main>

<style>
	.home {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family:
			Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #f5f5f5;
	}

	.card {
		max-width: 680px;
		padding: 32px;
		border-radius: 16px;
		background: white;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
	}

	.eyebrow {
		margin: 0 0 8px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #2563eb;
	}

	h1 {
		margin-bottom: 12px;
		font-size: 42px;
	}

	p {
		margin-bottom: 24px;
		color: #555;
	}

	a {
		display: inline-block;
		padding: 12px 18px;
		border-radius: 8px;
		background: #222;
		color: white;
		text-decoration: none;
	}
</style>