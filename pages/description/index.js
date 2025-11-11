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
                                        aria-hidden="true"
                                    >
                                        <path d="M3.3335 8H12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8 3.3335V12.6668" stroke="currentcolor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span class="btn-text">Agregar a mi lista</span>
                                </button>
                            </div>
                        </div>
                </article> 
            </section>`;

	containerDescription.innerHTML = animeDescription;
});
