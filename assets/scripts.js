const reponse = await fetch("http://localhost:5678/api/works/");
const photos = await reponse.json();

let i = 0;
let gallery = document.querySelector(".gallery");

// Remplacement photos //
function createFigure() {
  for (let i = 0; i < photos.length; i++) {
    const figureAdd = document.createElement("figure");
    gallery.appendChild(figureAdd);

    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    imageElement.src = photos[i].imageUrl;
    imageElement.alt = photos[i].title;
    nomElement.innerText = photos[i].title;

    figureAdd.appendChild(imageElement);
    figureAdd.appendChild(nomElement);
  }
}
createFigure();

// Création bouton tri //
const filtreDiv = document.querySelector("#portfolio h2");
const div = document.createElement("div");
filtreDiv.appendChild(div);
const filtre = document.querySelector("#portfolio h2 div");

const boutonTous = document.createElement("input");
boutonTous.type = "submit";
boutonTous.value = "Tous";
filtre.appendChild(boutonTous);
boutonTous.classList.add("boutonTous");

const boutonObjets = document.createElement("input");
boutonObjets.type = "submit";
boutonObjets.value = "Objets";
filtre.appendChild(boutonObjets);
boutonObjets.classList.add("boutonObjets");

const boutonAppartements = document.createElement("input");
boutonAppartements.type = "submit";
boutonAppartements.value = "Appartements";
filtre.appendChild(boutonAppartements);
boutonAppartements.classList.add("boutonAppartements");

const boutonHotelRestaurant = document.createElement("input");
boutonHotelRestaurant.type = "submit";
boutonHotelRestaurant.value = "Hôtels & restaurants";
filtre.appendChild(boutonHotelRestaurant);
boutonHotelRestaurant.classList.add("boutonHotelRestaurant");

// Tri par catégorie //

const boutonTrier = document.querySelector(".boutonTous");
boutonTrier.addEventListener("click", function () {
  const photosOrdonnees = Array.from(photos);
  photosOrdonnees.sort(function (a, b) {
    return a.id - a.id;
  });
  console.log(photosOrdonnees);
});

const filtrerObjets = document.querySelector(".boutonObjets");

filtrerObjets.addEventListener("click", function () {
  const objetsFiltrees = photos.filter(function (item) {
    return item.category.name === "Objets";
  });
  console.log(objetsFiltrees);
});

const filtrerAppart = document.querySelector(".boutonAppartements");

filtrerAppart.addEventListener("click", function () {
  const appartFiltrees = photos.filter(function (item) {
    return item.category.name === "Appartements";
  });
  console.log(appartFiltrees);
});

const filtrerRestau = document.querySelector(".boutonHotelRestaurant");

filtrerRestau.addEventListener("click", function () {
  const restauFiltrees = photos.filter(function (item) {
    return item.category.name === "Hotels & restaurants";
  });
  console.log(restauFiltrees);
});
