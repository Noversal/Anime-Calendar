import { URL_API_BASE_PROD } from "./const.js";

function createSection({ animes }) {
	const sectionAnimeContainer = document.createElement("section");
	sectionAnimeContainer.classList.add("section-anime");

	const containAnimes = document.createElement("div");
	containAnimes.classList.add("content-animes");
	const imageFallback = "./public/fallback-image.png";

	animes.forEach(({ title, img, id }, i) => {
		const card_anime = `
                          <article class="card_anime">
                              <a href="./pages/description/?id=${id}">
                                  <img width="230" height="370" src="${img || imageFallback}" alt="portada de ${title}">
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

const stateViewsButton = document.querySelector(".state-views_button");

stateViewsButton.addEventListener("click", async (e) => {
	const stateButton = e.target;
	if (stateButton.tagName === "BUTTON") {
		const actualActive = stateViewsButton.querySelector(".active");
		actualActive.classList.remove("active");
		stateButton.classList.add("active");
		const stateID = stateButton.dataset.state;
		renderStateSection({ stateID });
	}
});

async function renderStateSection({ stateID }) {
	const animesByState = JSON.parse(window.localStorage.getItem("list") || "[]");
	const animeSelected = animesByState.map((anime) => {
		if (anime.stateID == stateID) {
			return anime.id;
		}
		return null;
	}).filter(Boolean);

	template.innerHTML = "";
	const statusContainer = document.createElement("div");
	statusContainer.classList.add("container-status");
	const loaderElement = document.createElement("span");
	loaderElement.classList.add("loader");	
	statusContainer.appendChild(loaderElement);
	template.appendChild(statusContainer);

	if (animeSelected.length === 0) {
		statusContainer.innerHTML = `
		<img src="public/empty_state.png" width="300" alt="No hay animes" class="empty_state">
		<p>Como que no estas viendo nada aun</p>
		<a href="pages/catalog" class="add-anime">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M3.3335 8H12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path>
				<path d="M8 3.3335V12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
			<span>Agregar Animes</span>
		</a>`;
		return;
	}

	let response;
	
	try {
		response = await fetch(`${URL_API_BASE_PROD}/animes/by_ids`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ids: animeSelected }),
		});
	}
	catch (error) {
		statusContainer.innerHTML = `
			<img src="public/error_state.png" width="300" alt="Error al cargar" class="error_state">
			<p>Error al cargar los animes</p>
		`;
		return;
	}

	const { animes } = await response.json();
	const sectionEmision = createSection({
		animes,
	});

	template.innerHTML = "";
	template.appendChild(sectionEmision);
}

renderStateSection({ stateID: "2" });
