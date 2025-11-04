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
		const stateName = stateButton.dataset.state;
		renderStateSection({ stateName });
	}
});

async function renderStateSection({ stateName }) {
	const animesByState = JSON.parse(
		window.localStorage.getItem(stateName) || "[]",
	);
	const allAnimes = await getAllAnimes();
	const animesSelected = allAnimes.filter((anime) => {
		return animesByState.includes(Number(anime.id));
	});
	const sectionEmision = createSection({
		animes: animesSelected,
	});

	template.innerHTML = "";
	template.appendChild(sectionEmision);
}
window.localStorage.setItem("pending", JSON.stringify([1, 5, 8]));
window.localStorage.setItem("watching", JSON.stringify([2, 3, 4]));
window.localStorage.setItem("completed", JSON.stringify([6, 7, 9, 15, 12]));
renderStateSection({ stateName: "pending" });
