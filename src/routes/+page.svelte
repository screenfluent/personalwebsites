<script lang="ts">
	import type { WebsitesData } from '$lib/types';
	
	let websitesData = $state<WebsitesData | null>(null);
	
	async function loadWebsites() {
		const response = await fetch('/data/websites.json');
		websitesData = await response.json();
	}
	
	$effect(() => {
		loadWebsites();
	});
</script>

<div class="container mx-auto px-4">
	<!-- Hero Section -->
	<section class="py-20 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">
			Personal Websites
		</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			A curated list of personal websites from around the world.
		</p>
	</section>

	<!-- Grid Section -->
	<section class="py-12">
		{#if websitesData}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each websitesData.websites as website}
					<a 
						href={website.url}
						target="_blank"
						rel="noopener noreferrer"
						class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border"
					>
						<div class="aspect-square overflow-hidden bg-gray-100">
							<img 
								src={website.avatar} 
								alt={`${website.name}'s avatar`}
								class="w-full h-full object-cover"
							/>
						</div>
						<div class="p-4">
							<div class="flex items-center justify-between mb-2">
								<h2 class="font-semibold truncate">{website.name}</h2>
								<span class="text-xl">{website.country.flag}</span>
							</div>
							<p class="text-sm text-gray-600 truncate">
								{website.url.replace(/^https?:\/\//, '')}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading websites...</p>
			</div>
		{/if}
	</section>

	<!-- Story Section -->
	<section class="py-16 max-w-3xl mx-auto">
		<h2 class="text-3xl font-bold mb-6 text-center">The Story</h2>
		<div class="prose prose-lg mx-auto">
			<p class="mb-4">
				This project started as a personal challenge to overcome perfectionism and train the "ship fast" muscle. 
				Instead of getting caught up in endless refinements, I decided to launch the simplest possible version quickly.
			</p>
			<p>
				Now, it's an open-source directory where anyone can add their personal website through a GitHub pull request. 
				It's a celebration of personal websites and the individuals who create them.
			</p>
		</div>
	</section>
</div>
