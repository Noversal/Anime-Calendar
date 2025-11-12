const getAllAnimes = async () => {
	const response = await fetch("./animes.json");
	const animes = response.json();
	return animes;
};

function createSection({ animes, limit = 16 }) {
	const sectionAnimeContainer = document.createElement("section");
	sectionAnimeContainer.classList.add("section-anime");

	const containAnimes = document.createElement("div");
	containAnimes.classList.add("content-animes");

	animes.forEach(({ title, img, id }, i) => {
		if (i < limit) {
			const card_anime = `
                          <article class="card_anime">
                              <a href="./pages/description/?id=${id}">
                                  <img width="230" height="370" src="${img}" alt="portada de ${title}">
                                  <div class="shadow"></div>
                                  <h3>${title}</h3>
                              </a>
                          </article>
                      `;
			containAnimes.innerHTML += card_anime;
		}
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
		if (anime.stateID === stateID) {
			return anime.id;
		}
		return null;
	});

	const allAnimes = await getAllAnimes();
	const animesSelected = allAnimes.filter((anime) => {
		return animeSelected.includes(anime.id);
	});
	const sectionEmision = createSection({
		animes: animesSelected,
	});

	template.innerHTML = "";
	template.appendChild(sectionEmision);
}

renderStateSection({ stateID: "2" });
