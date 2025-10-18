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

function createSection({ animes, category, limit = 4 }) {
  const sectionAnimeContainer = document.createElement("section");
  sectionAnimeContainer.classList.add("section-anime");
  const headerSection = document.createElement("header");
  headerSection.classList.add("header-anime");
  headerSection.innerHTML = `
    <h2>${category}</h2>
    <a href="/categoria.html">Ver +</a>
  `;
  const containAnimes = document.createElement("div");
  containAnimes.classList.add("content-animes");

  animes.forEach(({ title, img, id }, i) => {
    if (i < limit) {
      const card_anime = `
                          <article class="card_anime">
                              <a href="./pages/description?id=${id}">
                                  <img width="230" height="370" src="${img}" alt="portada de ${title}">
                                  <div class="shadow"></div>
                                  <h3>${title}</h3>
                              </a>
                          </article>
                      `;
      containAnimes.innerHTML += card_anime;
    }
  });
  sectionAnimeContainer.appendChild(headerSection);
  sectionAnimeContainer.appendChild(containAnimes);

  return sectionAnimeContainer;
}

const template = document.querySelector(".anime_container");
const emsionAnimes = await getAnimesByCategory({ category: "Emision" });
const completadoAnimes = await getAnimesByCategory({
  category: "Completados",
});
const sectionEmision = createSection({
  animes: emsionAnimes,
  category: "Emision",
});
const sectionCompletado = createSection({
  animes: completadoAnimes,
  category: "Completado",
});

template.appendChild(sectionEmision);
template.appendChild(sectionCompletado);
