const getAllAnimes = async ()  => {
    const response = await fetch("./animes.json");
    const animes =  response.json();
    return animes
}

getAllAnimes().then(animes => {
    const template = document.querySelector(".anime_container");
    
    animes.forEach(({ title, img, id }, i) => {
        const card_anime = `
                      <article class="card_anime">
                          <a href="./pages/description?id=${id}">
                              <img width="164" height="255" src="${img}" alt="portada de ${title}">
                              <div class="shadow"></div>
                              <h3>${title}</h3>
                          </a>
                      </article>
                  `;
      
        template.innerHTML += card_anime
    })
})


