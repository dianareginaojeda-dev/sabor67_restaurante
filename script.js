// ===== ELEMENTOS =====
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

// ===== CARRINHO =====
let cart = [];

// ===== MODAL PERSONALIZAÇÃO =====
const modal = document.getElementById("custom-modal");
const extrasBox = document.getElementById("extras-box");
const removeBox = document.getElementById("remove-box");
const modalTotal = document.getElementById("modal-total");

// ===== CONFIG =====
const extrasList = [
  { name: "Ovo", price: 2 },
  { name: "Bacon", price: 4 },
  { name: "Queijo", price: 3 }
];

const removeList = ["Cebola", "Tomate", "Feijão"];

// ===== ABRIR MODAL =====
function openCustomization(item) {
  currentItem = {
    ...item,
    extras: [],
    removidos: [],
    obs: "",
    price: item.basePrice,
    quantity: 1
  };

  extrasBox.innerHTML = "";
  removeBox.innerHTML = "";
  document.getElementById("modal-title").innerText = item.name;

  extrasList.forEach(extra => {
    extrasBox.innerHTML += `
      <label class="flex gap-2 items-center">
        <input type="checkbox" data-price="${extra.price}" value="${extra.name}">
        ${extra.name} (+R$ ${extra.price})
      </label>`;
  });

  removeList.forEach(rem => {
    removeBox.innerHTML += `
      <label class="flex gap-2 items-center">
        <input type="checkbox" value="${rem}">
        ${rem}
      </label>`;
  });

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  updateModalTotal();
}

// ===== CALCULAR TOTAL MODAL =====
function updateModalTotal() {
  let total = currentItem.basePrice;

  extrasBox.querySelectorAll("input:checked").forEach(el => {
    total += Number(el.dataset.price);
  });

  modalTotal.innerText = total.toFixed(2);
}

// ===== EVENTOS MODAL =====
extrasBox.addEventListener("change", updateModalTotal);

document.getElementById("confirm-custom").onclick = () => {
  const extras = [...extrasBox.querySelectorAll("input:checked")].map(el => el.value);
  const removidos = [...removeBox.querySelectorAll("input:checked")].map(el => el.value);

  cart.push({
    ...currentItem,
    extras,
    removidos,
    obs: document.getElementById("obs").value,
    price: Number(modalTotal.innerText)
  });

  updateCartModal();
  modal.classList.add("hidden");
};

document.getElementById("cancel-custom").onclick = () => modal.classList.add("hidden");

// ===== ABRIR / FECHAR CARRINHO =====
cartBtn.onclick = () => cartModal.classList.toggle("hidden");

// ===== ATUALIZAR CARRINHO =====
function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="border-b pb-2">
        <p class="font-bold">${item.name}</p>
        <p class="text-sm">Extras: ${item.extras.join(", ") || "Nenhum"}</p>
        <p class="text-sm">Retirar: ${item.removidos.join(", ") || "Nada"}</p>
        <p class="text-sm">Obs: ${item.obs || "-"}</p>
        <p class="font-semibold">R$ ${item.price.toFixed(2)}</p>
      </div>`;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.length;
}

// ===== FINALIZAR PEDIDO =====
checkoutBtn.onclick = () => {
  cart = [];
  updateCartModal();
  cartModal.classList.add("hidden");
};

