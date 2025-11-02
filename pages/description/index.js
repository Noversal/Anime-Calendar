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

	const animeDescription = `<article class="card-description">
                <header>
                    <picture class="poster">
                        <img src="${anime.img}" alt="Caratula de el anime ${anime.title}">
                    </picture>
                    <button class="like-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                            <path d="M12 21V10C12 7.23858 9.76142 5 7 5H3V18.7143" stroke="currentcolor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3 19H7.5C10.5 19 11 20 12 21" stroke="currentcolor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 21V10C12 7.23858 14.2386 5 17 5H21V18.7143" stroke="currentcolor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21 19H16.5C13.5 19 13 20 12 21" stroke="currentcolor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>Agregar Anime</span>
                    </button>
                </header>
    
                <div class="info">
                    <h1 class="info-title">${anime.title}</h1>
                    <div class="info-detail">
                        <p>Episodios : <span>13</span></p>
                        <p>Emisión : <span>Finalizada</span></p>
                    </div>
    
                    <p class="info-description">${anime.description}</p>
    
                    <div class="genders">
                        ${anime.category
													.map((categorie) => {
														return `<span>${categorie}</span>`;
													})
													.join("")}
                    </div>
                    <div class="actions">
                        <!-- <button disabled>Ver Trailer</button> -->
                        <select name="" id="">
                            <option disabled selected value="">Estado de Visualizacion</option>
                            <option value="">Agendado</option>
                            <option value="">Completado</option>
                            <option value="">En curso</option>
                        </select>
                    </div>
                </div>
            </article>`;

	containerDescription.innerHTML = animeDescription;
});
