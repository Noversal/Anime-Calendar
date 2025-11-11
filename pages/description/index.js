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
                        <div class="anime-actions">
                            <div class="progress-container">
                                <label for="progress-${anime.id}" class="progress-label">Progreso</label>
                                <div class="progress-input-wrapper">
                                    <input 
                                        type="number" 
                                        id="progress-${anime.id}"
                                        class="progress-input" 
                                        min="0"
                                        max="${anime.chapters}"
                                        value="0"
                                        aria-label="Capítulos vistos"
                                    />
                                    <span class="progress-total"> / ${anime.chapters}</span>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                        </div>
                    </div>
                </article> 
            </section>`;

	containerDescription.innerHTML = animeDescription;
});
