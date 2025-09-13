import { getApiUrl } from './api-config';

export interface UserCategory {
	_id: string;
	name: string;
	slug: string;
}

export interface CategoriesResponse {
	success: boolean;
	count: number;
	data: UserCategory[];
}

export async function fetchCategories(): Promise<UserCategory[]> {
	try {
		const res = await fetch(getApiUrl('/categories'), { cache: 'no-store' });
		if (!res.ok) {
			let msg = `Failed to load categories (${res.status})`;
			try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
			throw new Error(msg);
		}
		const json: CategoriesResponse = await res.json();
		if (!json.success) throw new Error('Categories response not successful');
		return Array.isArray(json.data) ? json.data : [];
	} catch (e) {
		console.error('[categories-api] fetchCategories error', e);
		return [];
	}
}

