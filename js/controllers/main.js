import { servicesProducts } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

// Crear estructura HTML dinámicamente
function createCard({ name, price, image, id }) {
  const card = document.createElement("div");
  card.classList.add("productos-card");

  card.innerHTML = `
    <div class="img-container">
      <img src="${image}" alt="${name}">
    </div>
    <p class="nombre">${name}</p>
    <p class="precio">$ ${price}</p>
    <button class="delete-button" data-id="${id}">
      <img src="./assets/trashIcon.svg" alt="Eliminar">
    </button>
  `;

  // Agregar evento de eliminación
  addDeleteEvent(card, id);

  return card;
}

// Evento de eliminar producto
function addDeleteEvent(card, id) {
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      await servicesProducts.deleteProduct(id);
      card.remove();
      console.log(`Producto con id ${id} eliminado`);
    } catch (error) {
      console.error(`Error al eliminar el producto con id ${id}:`, error);
    }
  });
}

// Renderizar productos
const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    listProducts.forEach((product) => {
      const productCard = createCard(product);
      productsContainer.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error al renderizar productos:", err);
  }
};

// Evento para añadir producto
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector("[data-name]").value;
  const price = document.querySelector("[data-price]").value;
  const image = document.querySelector("[data-image]").value;

  if (name === "" || price === "" || image === "") {
    alert("Por favor, completa todos los campos");
  } else {
    try {
      const newProduct = await servicesProducts.createProduct(name, price, image);
      console.log("Producto creado:", newProduct);
      const newCard = createCard(newProduct);
      productsContainer.appendChild(newCard);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }

    form.reset(); // Limpiar el formulario
  }
});

renderProducts();
