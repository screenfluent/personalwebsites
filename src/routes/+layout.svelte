<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="border-b">
		<div class="container mx-auto px-4 py-4">
			<nav class="flex justify-between items-center">
				<a href="/" class="text-xl font-bold">Personal Websites</a>
				<a 
					href="https://github.com/yourusername/personalwebsites.org" 
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
						href="https://github.com/yourusername/personalwebsites.org" 
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
