const getAllAnimes = async () => {
	const response = await fetch("./animes.json");
	const animes = response.json();
	return animes;
};

const getAnimesByCategory = async ({ category }) => {
	const response = await fetch(`./animes${category}.json`);
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
const emsionAnimes = await getAllAnimes();
const sectionEmision = createSection({
	animes: emsionAnimes,
});

template.appendChild(sectionEmision);

const stateViewsButton = document.querySelector(".state-views_button");

stateViewsButton.addEventListener("click", (e) => {
	const actualActive = stateViewsButton.querySelector(".active");
	actualActive.classList.remove("active");
	const stateButton = e.target;
	stateButton.classList.add("active");
});
