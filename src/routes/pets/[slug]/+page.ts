import { state } from '$lib/store.js';
import { Permission, Role } from 'appwrite';
import { get } from 'svelte/store';

export async function load({ params }) {
	try {
		//await state.checkLoggedIn();
		console.warn(Role.users('verified'));
		console.warn(Permission.read(get(state).account!.$id));
		console.log('Logged in');
		
	} catch (error) {
		//history.back();
	}
	
	const Id = params.slug;
	return { Id }
}