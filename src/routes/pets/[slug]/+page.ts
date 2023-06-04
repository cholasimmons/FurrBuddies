import { state } from '$lib/store.js';
import { redirect } from '@sveltejs/kit';
import { Permission, Role } from 'appwrite';
import { get } from 'svelte/store';

export async function load({ params }) {
	try {
		await state.checkLoggedIn();
		// console.warn(Role.users('verified'));
		// console.warn(Permission.read(get(state).account!.$id));
	} catch (error) {
		throw redirect(307, '/auth/login')
		// console.log('Roles and Permissions in pets. ',error);
	}
	
	const Id = params.slug;
	return { Id }
}