const getAllAnimes = async () => {
	const response = await fetch("../../animes.json");
	const animes = response.json();
	return animes;
};

const animeByID = async ({ id }) => {
	const animes = await getAllAnimes();
	return animes.find((anime) => anime.id == id) ?? "";
};

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

animeByID({ id: animeId }).then((anime) => {
	const containerDescription = document.querySelector(".container-description");

	const animeDescription = `<section class="anime-viewer">
                <article class="card-description">
                    <header>
                        <picture class="poster">
                            <img src="${anime.img}" alt="Caratula de el anime ${anime.title}">
                        </picture>
                    </header>
        
                    <div class="info">
                        <h1 class="info-title">${anime.title}</h1>
                        <div class="info-detail">
                            <p class="count-chapters">
                                <span class="count-chapters__label">Episodios Totales</span>
                                <span class="count-chapters__value">${anime.chapters}</span>
                            </p>
                        </div>

                        <div class="info__footer">
                            <p class="info-description">${anime.description}</p>
            
                            <div class="genders">
                                ${anime.category.map((categorie) => `<span class="gender">${categorie}</span>`).join("")}
                            </div>
                        </div>
                        <div class="anime-actions"></div>
                </article> 
            </section>`;

	containerDescription.innerHTML = animeDescription;

	const animeActions = document.querySelector(".anime-actions");
	const animeList = JSON.parse(window.localStorage.getItem("list") || "[]");
	const animeExist = animeList.some((item) => item.id === animeId);

	if (animeExist) {
		animeActions.innerHTML = addProgresAnime({
			id: anime.id,
			chapters: anime.chapters,
		});
	} else {
		animeActions.innerHTML = addAnimeMyList();
	}

	const animeAddButton = document.querySelector(".add-to-list-btn");

	animeAddButton?.addEventListener("click", () => {
		const content = addProgresAnime({ id: anime.id, chapters: anime.chapters });
		animeActions.innerHTML = content;
		const actualList = JSON.parse(window.localStorage.getItem("list") || "[]");
		if (!actualList.includes(anime.id)) {
			window.localStorage.setItem(
				"list",
				JSON.stringify([...actualList, { id: anime.id, stateID: 2, count: 0 }]),
			);
		}
	});

	const inputCount = document.getElementById(`progress-${animeId}`);

	inputCount?.addEventListener("change", () => {
		if (inputCount.value > anime.chapters) {
			inputCount.value = anime.chapters;
		}

		if (inputCount.value < 0) {
			inputCount.value = 0;
		}

		const porcentAnime = Math.round((inputCount.value / anime.chapters) * 100);
		const progress = document.querySelector(".progress-fill");
		progress.style.width = `${porcentAnime}%`;
	});
});

function addAnimeMyList() {
	return `
            <div class="not-in-list">
                <p class="not-in-list-message">Este anime no está en tu lista</p>
                <button class="add-to-list-btn" aria-label="Agregar anime a mi lista">
                    <svg 
                        class="add-icon"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        aria-hidden="true">
                        <path d="M3.3335 8H12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 3.3335V12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="btn-text">Agregar a mi lista</span>
                </button>
            </div>
`;
}

function addProgresAnime({ id, chapters }) {
	return `
        <div class="progress-container">
                    <label for="progress-${id}" class="progress-label">Progreso</label>
                    <div class="progress-input-wrapper">
                        <input 
                            type="number" 
                            id="progress-${id}"
                            class="progress-input" 
                            min="0"
                            max="${chapters}"
                            value="0"
                            aria-label="Capítulos vistos"
                        />
                        <span class="progress-total"> / ${chapters}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>    
        `;
}
