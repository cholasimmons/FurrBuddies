import type { Pet } from '$lib/_models/pet-model';
import { petstate } from '$lib/store.js';


export function load({ params }) {
	const Id = params.slug;
	// await petstate.fetch();

	return { Id }
}