import { URL_API_BASE_PROD, URL_API_BASE_TEST } from "./const.js";

export class AnimeService {
	constructor(test = true) {
		this.url = URL_API_BASE_PROD;

		if (!test) {
			this.url = URL_API_BASE_TEST;
		}
	}

	async getAllAnimes() {
		const response = await fetch(`${this.url}/animes`);
		const data = await response.json();
		return data;
	}

	async getAnimeById({ id }) {
		const response = await fetch(`${this.url}/animes/by_ids`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids: id }),
		});

		const data = await response.json();
		return data;
	}

	async createAnime(anime) {
		const response = await fetch(`${this.url}/animes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(anime),
		});
		const data = await response.json();
		return data;
	}

	async updateAnime({ id, anime = {} }) {
		const response = await fetch(`${this.url}/animes/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(anime),
		});
		const data = await response.json();
		return data;
	}

	async deleteAnime(id) {
		const response = await fetch(`${this.url}/animes/${id}`, {
			method: "DELETE",
		});
		const data = await response.json();
		return data;
	}
}
