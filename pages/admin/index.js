import { AnimeService } from "../../Anime.js";

const animeService = new AnimeService();

// DOM Elements
const animeList = document.getElementById("animeList");

const AdminCard = (anime) => {
	const imageFallback = "../../public/fallback-image.png";

	return `
		<article class="admin-card">
			<img src="${anime?.img || imageFallback}" alt="${anime.title}">
			<div class="card-content">
				<h3 class="card-title">${anime.title}</h3>
				<p class="card-info">${anime.chapters} Episodios</p>
				<div class="card-actions">
					<button class="btn btn-edit" data-id="${anime.id}" title="Editar">
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
	`;
};

// Render Functions
function renderAnimes({ animes }) {
	const listAnimes = animes.map((anime) => AdminCard(anime)).join("");

	animeList.innerHTML = listAnimes;
}

animeService.getAllAnimes().then(({ animes }) => {
	renderAnimes({ animes });
});

let oldAnimeData = {};

// Anime List
animeList.addEventListener("click", async (e) => {
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

	const buttonEdit = e.target.closest(".btn-edit");
	if (buttonEdit) {
		const id = buttonEdit.dataset.id;
		const { animes } = await animeService.getAnimeById({ id: [id] });
		const { title, description, img, chapters, category } = animes[0]
		oldAnimeData = { id, title, description, img, chapters, category }

		const oldTitle = document.getElementById("old_title");
		const oldDescription = document.getElementById("old_description");
		const oldImage = document.getElementById("old_image");
		const oldChapters = document.getElementById("old_chapters");

		oldTitle.value = title;
		oldDescription.value = description;
		oldImage.value = img ?? "";
		oldChapters.value = chapters;

		// TODO: review pre-select genres and update counter
		// Pre-select genres
		const updateCheckboxes =
			updateGenreContainer.querySelectorAll(".genre-checkbox");
		updateCheckboxes.forEach((checkbox) => {
			checkbox.checked =
				category && category.includes(checkbox.value);
		});

		// Update counter
		const selectedCount = updateGenreContainer.querySelectorAll(
			".genre-checkbox:checked",
		).length;
		updateCounter.textContent = `(${selectedCount} seleccionados)`;

		const dialogUpdate = document.getElementById("update-modal");
		dialogUpdate.showModal();
	}
});

// Selectors for Multi-select Genre (Add Modal)
const addGenreContainer = document.getElementById("add-genresContainer");
const addExpandBtn = document.getElementById("add-expandBtn");
const addCollapseBtn = document.getElementById("add-collapseBtn");
const addCounter = document.getElementById("add-selectedCounter");

// Selectors for Multi-select Genre (Update Modal)
const updateGenreContainer = document.getElementById("update-genresContainer");
const updateExpandBtn = document.getElementById("update-expandBtn");
const updateCollapseBtn = document.getElementById("update-collapseBtn");
const updateCounter = document.getElementById("update-selectedCounter");

// Helper function to handle expansion
const setupGenreToggle = (container, expandBtn, collapseBtn) => {
	expandBtn.addEventListener("click", () => {
		container.classList.add("expanded");
		expandBtn.hidden = true;
		collapseBtn.hidden = false;
	});
	collapseBtn.addEventListener("click", () => {
		container.classList.remove("expanded");
		expandBtn.hidden = false;
		collapseBtn.hidden = true;
	});
};

// Helper function to update counter
const setupCounter = (container, counterElement) => {
	container.addEventListener("change", () => {
		const selectedCount = container.querySelectorAll(
			".genre-checkbox:checked",
		).length;
		counterElement.textContent = `(${selectedCount} seleccionados)`;
	});
};

// add genre
setupGenreToggle(addGenreContainer, addExpandBtn, addCollapseBtn);
setupCounter(addGenreContainer, addCounter);
// update genre
setupGenreToggle(updateGenreContainer, updateExpandBtn, updateCollapseBtn);
setupCounter(updateGenreContainer, updateCounter);

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
		location.reload(); // Reload to see changes
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
	const genders = formData.getAll("gender");

	await animeService.createAnime({
		title,
		chapters,
		img,
		description,
		genders,
	});
	modalAdd.close();
	e.target.reset();
	addCounter.textContent = "(0 seleccionados)";
});

const btnCloseModal = document.querySelector(".btn-close-modal");

btnCloseModal.addEventListener("click", () => {
	modalAdd.close();
});

const formUpdate = document.getElementById("update-form");

formUpdate.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const title = formData.get("old_title");
	const chapters = formData.get("old_chapters");
	const img = formData.get("old_image").trim();
	const description = formData.get("old_description");

	// Collect all selected genres
	const selectedGenders = formData.getAll("old_gender");

	const newAnime = {};

	if (title !== oldAnimeData.title) {
		newAnime.title = title;
	}

	if (Number(chapters) !== oldAnimeData.chapters) {
		newAnime.chapters = chapters;
	}

	if (img && img !== oldAnimeData.img) {
		newAnime.img = img;
	}

	if (description !== oldAnimeData.description) {
		newAnime.description = description;
	}

	// Compare categories (array comparison)
	const oldCategories = oldAnimeData.category || [];

	const lengthChanged = selectedGenders.length !== oldCategories.length;
	const contentChanged = !selectedGenders.every((gender) =>
		oldCategories.includes(gender),
	);
	const categoriesChanged = lengthChanged || contentChanged;

	if (categoriesChanged) {
		newAnime.category = selectedGenders;
	}

	try {
		const response = await animeService.updateAnime({
			id: oldAnimeData.id,
			anime: newAnime,
		});
		console.log(response.status);
		return;
	} catch (error) {
		console.error(error);
	}

	const dialogUpdate = document.getElementById("update-modal");
	dialogUpdate.close();
	e.target.reset();
	updateCounter.textContent = "(0 seleccionados)";
});

const btnCloseUpdateModal = document.querySelector(
	"#update-modal .btn-close-modal",
);

btnCloseUpdateModal.addEventListener("click", () => {
	const dialogUpdate = document.getElementById("update-modal");
	dialogUpdate.close();
});
