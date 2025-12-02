import { URL_API_BASE_PROD } from "../../const.js";

function fetchAnimes() {
	return fetch(`${URL_API_BASE_PROD}/animes`).then((response) =>
		response.json(),
	);
}

function createSection({ animes }) {
	const sectionAnimeContainer = document.createElement("section");
	sectionAnimeContainer.classList.add("section-anime");

	const containAnimes = document.createElement("div");
	containAnimes.classList.add("content-animes");

	animes.forEach(({ title, img, id }, i) => {
		const card_anime = `
                          <article class="card_anime">
                              <a href="../description/?id=${id}">
                                  <img width="230" height="370" src="${img}" alt="portada de ${title}">
                                  <div class="shadow"></div>
                                  <h3>${title}</h3>
                              </a>
                          </article>
                      `;
		containAnimes.innerHTML += card_anime;
	});

	sectionAnimeContainer.appendChild(containAnimes);

	return sectionAnimeContainer;
}

const template = document.querySelector(".anime_container");
fetchAnimes().then(({ animes }) => {
	const animeSection = createSection({ animes });
	template.appendChild(animeSection);
});

// Toggle filter dropdown
const filterBtn = document.getElementById("filterBtn");
const filterDropdown = document.getElementById("filterDropdown");

filterBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	filterDropdown.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
	if (!filterDropdown.contains(e.target) && e.target !== filterBtn) {
		filterDropdown.classList.remove("active");
	}
});

// Genre tags selection
const genreTags = document.querySelectorAll(".genre-tag");
const selectedGenres = new Set();

genreTags.forEach((tag) => {
	tag.addEventListener("click", () => {
		tag.classList.toggle("active");
		const genre = tag.dataset.genre;

		if (selectedGenres.has(genre)) {
			selectedGenres.delete(genre);
		} else {
			selectedGenres.add(genre);
		}
	});
});

// Clear filters
document.getElementById("clearBtn")?.addEventListener("click", async () => {
	document.getElementById("minEpisodes").value = "";
	document.getElementById("maxEpisodes").value = "";
	genreTags.forEach((tag) => {
		tag.classList.remove("active");
	});
	selectedGenres.clear();

	const results = await fetch(`${URL_API_BASE_PROD}/animes`);
	const { animes } = await results.json();

	template.innerHTML = "";
	const animeSection = createSection({ animes });
	template.appendChild(animeSection);

	filterDropdown.classList.remove("active");
});

const search = document.querySelector(".search");

// Form submission (conecta aquí con tu API)
search.addEventListener("submit", async (e) => {
	e.preventDefault();

	const searchText = document.querySelector(".input_search").value;
	const minEpisodes = document.getElementById("minEpisodes").value;
	const maxEpisodes = document.getElementById("maxEpisodes").value;

	const filters = {
		text: searchText,
		minEpisodes: minEpisodes || 1,
		maxEpisodes: maxEpisodes || 50,
		genre: Array.from(selectedGenres).join(",") || undefined,
	};

	// Aquí llamarías a tu API serverless
	const results = await fetch(
		`${URL_API_BASE_PROD}/animes?${new URLSearchParams(filters)}`,
	);
	const { animes } = await results.json();
	console.log(animes);

	template.innerHTML = "";
	const animeSection = createSection({ animes });
	template.appendChild(animeSection);

	filterDropdown.classList.remove("active");
});

const inputSeacrh = document.querySelector(".input_search");

inputSeacrh?.addEventListener("blur", async (event) => {
	const minEpisodes = document.getElementById("minEpisodes").value;
	const maxEpisodes = document.getElementById("maxEpisodes").value;
	const searchText = inputSeacrh.value;

	const filters = {
		text: searchText || "",
		minEpisodes: minEpisodes ?? 1,
		maxEpisodes: maxEpisodes ?? 50,
		genre: Array.from(selectedGenres).join(",") || undefined,
	};

	// Aquí llamarías a tu API serverless
	const results = await fetch(
		`${URL_API_BASE_PROD}/animes?${new URLSearchParams(filters)}`,
	);

	console.log(`${URL_API_BASE_PROD}/animes?${new URLSearchParams(filters)}`);
	const data = await results.json();
	const { animes } = data;
	console.log(animes);

	template.innerHTML = "";
	const animeSection = createSection({ animes });
	template.appendChild(animeSection);
});
