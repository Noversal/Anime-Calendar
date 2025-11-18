function createSection({ animes }) {
	const sectionAnimeContainer = document.createElement("section");
	sectionAnimeContainer.classList.add("section-anime");

	const containAnimes = document.createElement("div");
	containAnimes.classList.add("content-animes");

	animes.forEach(({ title, img, id }, i) => {
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
	});

	const response = await fetch("https://api-animecal.vercel.app/api/animes/by_ids", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ids: animeSelected }),
	});

	const { animes } = await response.json();
	console.log({ animes });

	const sectionEmision = createSection({
		animes,
	});

	template.innerHTML = "";
	template.appendChild(sectionEmision);
}

renderStateSection({ stateID: "2" });
