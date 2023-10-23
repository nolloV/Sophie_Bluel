async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works/");
  const photos = await reponse.json();
  return photos;
}
async function getCategory() {
  const reponse = await fetch("http://localhost:5678/api/categories/");
  const category = await reponse.json();
  return category;
}

let i = 0;

// Remplacement photos //
async function createFigure(works = null) {
  if (works === null) {
    works = await getWorks();
  }

  let gallery = document.querySelector(".gallery");

  for (let work of works) {
    const figureAdd = document.createElement("figure");
    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    nomElement.innerText = work.title;

    gallery.appendChild(figureAdd);
    figureAdd.appendChild(imageElement);
    figureAdd.appendChild(nomElement);
  }
}

// Création catégorie et tri //
async function createCategory() {
  const categoriesContainer = document.querySelector(".categories");
  const categories = await getCategory();
  categories.unshift({ id: -1, name: "Tous" });

  for (let category of categories) {
    const divElement = document.createElement("div");
    divElement.innerText = category.name;
    divElement.classList.add("category-item");
    divElement.id = category.id;
    categoriesContainer.appendChild(divElement);

    if (category.id === -1) {
      divElement.style.backgroundColor = "#1D6154";
      divElement.style.color = "#FFF";
    }

    divElement.addEventListener("click", async function (event) {
      const id = event.target.id;

      const categoryItems = document.querySelectorAll(".category-item");
      categoryItems.forEach((item) => {
        item.style.backgroundColor = "#FFF";
        item.style.color = "#1D6154";
      });
      event.target.style.backgroundColor = "#1D6154";
      event.target.style.color = "#FFF";

      document.querySelector(".gallery").innerHTML = "";

      if (id === "-1") {
        const works = await getWorks();
        createFigure(works);
      } else {
        const works = await getWorks();
        const filteredWorks = works.filter((work) => work.category.id == id);
        createFigure(filteredWorks);
      }
    });
  }
}

createFigure();
createCategory();
