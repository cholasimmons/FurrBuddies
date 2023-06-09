import { petstate, state } from '$lib/store.js';
import { redirect } from '@sveltejs/kit';
import { Permission, Role } from 'appwrite';
import { get } from 'svelte/store';

export async function load({ params }) {
	try {
		await state.checkLoggedIn();
		
		const isPets = get(petstate).pets.length > 0;
		if(!isPets) {await petstate.fetch()} 
		
		const Id = params.slug;
		return { Id }
	} catch (error) {
		throw redirect(307, '/auth/login')
	}
}