import type { Pet } from '$lib/_models/pet-model';
import { clinicstate } from '$lib/store';

export function load({ params }) {
	const id = params.slug;
	// await clinicstate.fetch();

	return { id }
}