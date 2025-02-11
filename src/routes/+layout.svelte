<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	
	let { children } = $props();
	
	const baseUrl = 'https://personalwebsites.org';
	
	const canonicalUrl = $derived(`${baseUrl}${$page.url.pathname}`);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="border-b">
		<div class="container mx-auto px-4 py-4">
			<nav class="flex justify-between items-center">
				<a href="/" class="text-xl font-bold">Personal Websites</a>
				<a 
					href="https://github.com/screenfluent/personalwebsites" 
					target="_blank" 
					rel="noopener noreferrer"
					class="text-gray-600 hover:text-gray-900"
				>
					GitHub
				</a>
			</nav>
		</div>
	</header>

	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="border-t mt-12">
		<div class="container mx-auto px-4 py-8">
			<div class="text-center text-gray-600">
				<p>© {new Date().getFullYear()} Personal Websites Directory</p>
				<p class="mt-2">
					<a 
						href="https://github.com/screenfluent/personalwebsites" 
						target="_blank" 
						rel="noopener noreferrer"
						class="hover:text-gray-900"
					>
						Add your website
					</a>
				</p>
			</div>
		</div>
	</footer>
</div>
