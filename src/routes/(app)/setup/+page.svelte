<script lang="ts">
	import { onDestroy } from 'svelte';
	import { RangeSlider, SlideToggle, getModeOsPrefers, setModeCurrent } from '@skeletonlabs/skeleton';
	import { state } from '$lib/_stores/auth_store.js';

	// Theme watcher
	import { modeOsPrefers, modeUserPrefers, modeCurrent } from '@skeletonlabs/skeleton';

	// Layout Service
	// import { layoutSettings } from '$lib/_services/layout-service.js';

	export let data;

	// Keep track of any changed values
	let dirty: boolean = false;

	// Settings variabes
	let isThemeLight: boolean;
	let textScale: number = 100;
	let audioNotification: boolean = true;
	let pushNotification: boolean = true;

	onDestroy(async ()=>{
		if(!dirty) return;
		try {
			await state.updateUserPrefs({isThemeLight, textScale, audioNotification, pushNotification});
		} catch (error) {
			console.warn('Unable to save changes to User Account');
		}
	});

	// Theme select function
	function changedTheme(event: any):void {
		console.log('Changed theme. ', event.target.value);
		try {
			const osTheme = getModeOsPrefers();
			console.log(osTheme);
			
			if(event.target.value === 'auto'){
				$modeUserPrefers = getModeOsPrefers();
				setModeCurrent(getModeOsPrefers())
			} else {
				setModeCurrent(event.target.value === 'light' ? true : false);
			}
			
			dirty = true;
		} catch (error) {
			console.warn('Error changing theme. ',error);
		}
		
	}
	// Text scale function (UNIMPLEMENTED)
	function changedScale(event: any):void {
		console.log('Changed scale. ', event.target.value);

	}
	// Audio notifications function (UNIMPLEMENTED)
	function changedAudio(event: any):void {
		console.log('Changed audio notifications. ', event.target.value);

	}
</script>

<!-- HTML head -->
<svelte:head>
	<title>{data.appName} | Setup</title>
	<meta name="description" content="Configure your app" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	

	<hr class="mb-6">

	<!-- Configuration section -->
	<section class="flex justify-center">

		<p>N/A</p>

		<!-- Theme (Moved to Appbar) -->
		<!--div>
			<span>Theme:</span>
			<span class="form">
				<select on:change={changedTheme} name="theme" value={isThemeLight ? 'light' : 'dark'} id="theme" placeholder="Choose Mode">
					<option value="auto">Auto</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</span>
		</div-->

		<!-- Text Scale-->
		<!--div class="col-span-2 grid grid-cols-2 mx-auto">
			<span>Text Scale</span>
			<span class="w-[8rem]">
				<RangeSlider on:change={changedScale} name="text-scale-slider" bind:value={textScale} min={75} max={125} step={12.5} ticked/>
			</span>
		</div-->

		<!-- Audio-->
		<!--div- class="col-span-2 grid grid-cols-2 mx-auto">
			<span>Audio Notifications</span>
			<span><SlideToggle name="audio-toggle" bind:checked={audioNotification} active="dark:bg-primary-400 bg-primary-600" size="sm"></SlideToggle></span>
		</div-->
	
	</section>

	
	

</main>

<style>

</style>