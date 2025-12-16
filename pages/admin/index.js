import { AnimeService } from "../../Anime.js";

const animeService = new AnimeService(false);

// DOM Elements
const animeList = document.getElementById("animeList");

const AdminCard = (anime) => {
	return `
		<article class="admin-card">
			<img src="${anime.img}" alt="${anime.title}">
			<div class="card-content">
				<h3 class="card-title">${anime.title}</h3>
				<p class="card-info">${anime.chapters} Episodios</p>
				<div class="card-actions">
					<button class="btn btn-edit" title="Editar">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
						</svg>
					</button>
					<button class="btn btn-delete" data-id="${anime.id}" title="Eliminar">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</button>
				</div>
			</div>
		</article>
	`
}



// Render Functions
function renderAnimes({ animes }) {
	const listAnimes = animes
		.map((anime) => AdminCard(anime))
		.join("");

	animeList.innerHTML = listAnimes;
}


animeService.getAllAnimes().then(({ animes }) => {
	renderAnimes({ animes });
});

// Anime List
animeList.addEventListener("click", (e) => {
	const animeTitle = document.getElementById("anime-title");
	const animeCard = e.target.closest(".admin-card");
	const animeCardTitle = animeCard.querySelector(".card-title").textContent;
	animeTitle.textContent = animeCardTitle;
	
	const buttonDelete = e.target.closest(".btn-delete");
	if (buttonDelete) {
		const id = buttonDelete.dataset.id;
		const dialogConfirm = document.getElementById("delete-modal");
		dialogConfirm.showModal();
		const confirmButton = dialogConfirm.querySelector("#confirm-delete-btn");
		confirmButton.dataset.id = id;
	}
});

// Delete Modal
const modalActions = document.querySelector(".modal-actions");
modalActions.addEventListener("click", async (e) => {
	const animeTitle = document.getElementById("anime-title");
	
	const dialogConfirm = document.getElementById("delete-modal");

	const buttonDelete = e.target.closest(".btn-delete");
	if (buttonDelete) {
		const id = buttonDelete.dataset.id;
		await animeService.deleteAnime(id);
		animeTitle.textContent = "";
		dialogConfirm.close();
	}

	const buttonCancel = e.target.closest(".btn-cancel");
	if (buttonCancel) {
		dialogConfirm.dataset.id = "";
		dialogConfirm.close();
		animeTitle.textContent = "";
	}
});


// Add Modal
const addBtn = document.querySelector(".add-btn");
const modalAdd = document.getElementById("add-modal");

addBtn.addEventListener("click", () => {
	modalAdd.showModal();
});

// Form Add
const formAdd = document.getElementById("add-form");

formAdd.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const title = formData.get("title");
	const chapters = formData.get("chapters");
	const img = formData.get("image");
	const description = formData.get("description");
	const genders = formData.get("gender");

	await animeService.createAnime({ title, chapters, img, description, genders });
	modalAdd.close();
	e.target.reset();
});

const btnCloseModal = document.querySelector(".btn-close-modal");

btnCloseModal.addEventListener("click", () => {
	modalAdd.close();
});


