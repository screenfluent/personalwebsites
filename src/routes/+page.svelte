<script lang="ts">
	import type { WebsitesData, WipResponse } from '$lib/types';
	
	let websitesData = $state<WebsitesData | null>(null);
	let selectedImage: string | null = $state(null);
	let selectedCountry: string | null = $state(null);
	let { data } = $props();
	
	async function loadWebsites() {
		const response = await fetch('/data/websites.json');
		websitesData = await response.json();
	}
	
	$effect(() => {
		loadWebsites();
	});

	function getFilteredWebsites() {
		if (!websitesData || !selectedCountry) return websitesData?.websites ?? [];
		return websitesData.websites.filter(website => website.country.name === selectedCountry);
	}

	function getAllCountries(): Array<{ name: string; flag: string }> {
		if (!websitesData) return [];
		const countries = websitesData.websites.map(website => ({
			name: website.country.name,
			flag: website.country.flag
		}));
		return Array.from(new Map(countries.map(item => [item.name, item])).values());
	}

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

	function cleanUrl(url: string) {
		return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
	}

	function getRelativeTimeString(date: Date | string) {
		const now = new Date();
		const then = new Date(date);
		const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
		
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
		
		if (diffInSeconds < 60) {
			return rtf.format(-diffInSeconds, 'second');
		}
		
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return rtf.format(-diffInMinutes, 'minute');
		}
		
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return rtf.format(-diffInHours, 'hour');
		}
		
		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) {
			return rtf.format(-diffInDays, 'day');
		}
		
		const diffInMonths = Math.floor(diffInDays / 30);
		if (diffInMonths < 12) {
			return rtf.format(-diffInMonths, 'month');
		}
		
		const diffInYears = Math.floor(diffInMonths / 12);
		return rtf.format(-diffInYears, 'year');
	}
</script>

<div class="container mx-auto px-4">
	<section class="py-20 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">
			Personal Websites
		</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			A curated gallery of personal websites around the world
		</p>

		<div class="mt-8">
			<select
				class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				bind:value={selectedCountry}
			>
				<option value={null}>All countries</option>
				{#each getAllCountries() as country}
					<option value={country.name}>{country.flag} {country.name}</option>
				{/each}
			</select>
		</div>
	</section>

	<!-- Grid Section -->
	<section class="py-12">
		{#if websitesData}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each getFilteredWebsites() as website}
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
								<p class="text-xs text-gray-400 truncate">
									{cleanUrl(website.url)}
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
			<div class="text-center">
				<p class="mb-4">
					This project started as a personal challenge to overcome perfectionism and train the "ship fast" muscle. 
					Instead of getting caught up in endless refinements, I decided to launch the simplest possible version quickly.
				</p>
				<p class="mb-8">
					Now, it's an open-source directory where anyone can add their personal website through a GitHub pull request. 
					It's a celebration of personal websites and the individuals who create them.
				</p>
				<a href="https://x.com/screenfluent" target="_blank" rel="noopener noreferrer" class="inline-block">
					<div class="relative">
						<img 
							src="/szymon.png" 
							alt="Szymon Rączka" 
							class="w-20 h-20 rounded-full border-2 border-gray-200 mx-auto"
						/>
						<span class="block text-sm text-gray-600 mt-1">Szymon Rączka</span>
					</div>
				</a>
			</div>
		</div>
	</section>

	<!-- Todos Section -->
	<section class="py-16 max-w-3xl mx-auto">
		<h2 class="text-3xl font-bold mb-6 text-center">#buildinpublic</h2>
		<div class="prose prose-lg mx-auto">
			{#if data.error}
				<p class="text-red-600 text-center">{data.error}</p>
			{:else if data.todos}
				<ul class="space-y-4">
					{#each data.todos.data as todo}
						<li class="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
							<div class="min-w-0 flex-1">
								<p class="text-gray-900">{todo.body}</p>
								<p class="text-sm text-gray-500 mt-1">
									{getRelativeTimeString(todo.created_at)}
								</p>
							</div>
						</li>
					{/each}
				</ul>
				<div class="text-center mt-8">
					<a 
						href="https://wip.co/projects/personalwebsites" 
						target="_blank" 
						rel="noopener noreferrer"
						class="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
					>
						Follow progress on WIP
						<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
							<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
							<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
						</svg>
					</a>
				</div>
			{:else}
				<p class="text-center text-gray-600">Loading updates...</p>
			{/if}
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
