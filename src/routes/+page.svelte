<script lang="ts">
	import type { WebsitesData } from '$lib/types';
	
	let websitesData = $state<WebsitesData | null>(null);
	let selectedImage: string | null = $state(null);
	
	async function loadWebsites() {
		const response = await fetch('/data/websites.json');
		websitesData = await response.json();
	}
	
	$effect(() => {
		loadWebsites();
	});

	function getImagePaths(screenshot: string) {
		// Remove leading slash if present and file extension
		const cleanPath = screenshot.replace(/^\//, '').replace(/\.(jpeg|jpg|png|webp)$/, '');
		
		return {
			webp: `/${cleanPath}.webp`,
			jpeg: `/${cleanPath}.jpeg`,
			thumbWebp: `/${cleanPath.replace('screenshots/', 'screenshots/thumbnails/')}.webp`,
			thumbJpeg: `/${cleanPath.replace('screenshots/', 'screenshots/thumbnails/')}.jpeg`
		};
	}

	function getRefUrl(url: string) {
		const refUrl = new URL(url);
		refUrl.searchParams.set('ref', 'personalwebsites.org');
		return refUrl.toString();
	}

	function handleImageClick(screenshot: string, e?: Event) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		selectedImage = screenshot;
	}

	function handleKeydown(screenshot: string, e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleImageClick(screenshot);
		}
	}

	function handleModalClose(e?: Event) {
		if (e) {
			e.preventDefault();
		}
		selectedImage = null;
	}
</script>

<div class="container mx-auto px-4">
	<!-- Temporarily commented out
	<section class="py-20 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">
			Personal Websites
		</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			A curated list of personal websites from around the world.
		</p>
	</section>
	-->

	<!-- Grid Section -->
	<section class="py-12">
		{#if websitesData}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each websitesData.websites as website}
					{#snippet card()}
						{@const paths = getImagePaths(website.screenshot)}
						<a 
							href={getRefUrl(website.url)}
							target="_blank"
							rel="noopener noreferrer"
							class="block bg-white rounded-lg hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-shadow duration-200 overflow-hidden border-gray-200 border"
						>
							<div class="relative pb-[62.5%] overflow-hidden bg-gray-100">
								<picture 
									class="absolute inset-0 w-full h-full"
									role="button"
									tabindex="0"
									onclick={(e) => handleImageClick(website.screenshot, e)}
									onkeydown={(e) => handleKeydown(website.screenshot, e)}
								>
									<source srcset={paths.thumbWebp} type="image/webp" />
									<img 
										src={paths.thumbJpeg}
										alt={`Screenshot of ${website.name}'s website`}
										class="w-full h-full object-cover"
									/>
								</picture>
							</div>
							<div class="p-4">
								<div class="flex items-center justify-between mb-2">
									<h2 class="font-semibold truncate">{website.name}</h2>
									<span class="text-xl">{website.country.flag}</span>
								</div>
								<p class="text-sm text-gray-600 truncate">
									{website.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
								</p>
							</div>
						</a>
					{/snippet}
					{@render card()}
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

{#if selectedImage}
	{#snippet modal()}
		{@const paths = getImagePaths(selectedImage as string)}
		<div 
			class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Image preview"
		>
			<div
				class="relative w-full h-full flex items-center justify-center"
				role="button"
				tabindex="0"
				onclick={handleModalClose}
				onkeydown={(e) => e.key === 'Escape' && handleModalClose()}
			>
				<picture>
					<source srcset={paths.webp} type="image/webp" />
					<img 
						src={paths.jpeg}
						alt="Full-size screenshot" 
						class="max-w-full max-h-[90vh] object-contain"
					/>
				</picture>
			</div>
		</div>
	{/snippet}
	{@render modal()}
{/if}
