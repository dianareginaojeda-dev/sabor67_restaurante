let currentItem = null;
// ===== ELEMENTOS =====
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");


// ===== CARRINHO =====
let cart = [];

cartItemsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-from-cart-btn")) {
    const index = e.target.dataset.index;

    cart.splice(index, 1);
    updateCartModal();
  }
});

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

         <button 
        class="remove-from-cart-btn text-red-600 text-sm mt-1"
        data-index="${index}">
        Remover
      </button>
    </div>
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

//PREENCHER OBRIGATORIO 
const btnCheckout = document.getElementById("checkout-btn");

const nomeInput = document.getElementById("address");
const setorInput = document.getElementById("addressSetor");
const horarioInput = document.getElementById("addresshorario");

const nomeWarn = document.getElementById("address-warn");
const setorWarn = document.getElementById("address-warn-setor");
const horarioWarn = document.getElementById("address-warn-horario");

btnCheckout.addEventListener("click", function () {

  let valido = true;

  // NOME
  if (nomeInput.value.trim() === "") {
    nomeWarn.classList.remove("hidden");
    nomeInput.classList.add("border-red-500");
    valido = false;
  } else {
    nomeWarn.classList.add("hidden");
    nomeInput.classList.remove("border-red-500");
  }

  // SETOR
  if (setorInput.value.trim() === "") {
    setorWarn.classList.remove("hidden");
    setorInput.classList.add("border-red-500");
    valido = false;
  } else {
    setorWarn.classList.add("hidden");
    setorInput.classList.remove("border-red-500");
  }

  // HORÁRIO
  if (horarioInput.value.trim() === "") {
    horarioWarn.classList.remove("hidden");
    horarioInput.classList.add("border-red-500");
    valido = false;
  } else {
    horarioWarn.classList.add("hidden");
    horarioInput.classList.remove("border-red-500");
  }


   const numeroPedido = gerarNumeroPedido();
  
   // ===== MONTAR MENSAGEM =====
  let mensagem = `🛒 *Novo Pedido*%0A%0A`;
  mensagem += `👤 *Nome:* ${nome.value}%0A`;
  mensagem += `🏢 *Setor/Bloco:* ${setor.value}%0A`;
  mensagem += `⏰ *Horário de Retirada:* ${horario.value}%0A%0A`;

  mensagem += `🍱 *Itens do Pedido:*%0A`;

  cart.forEach(item => {
    mensagem += `- ${item.name} - R$ ${item.price.toFixed(2)}%0A`;
  });

  mensagem += `%0A💰 *Total:* R$ ${cartTotal.textContent}`;

  // ===== NUMERO DO WHATSAPP =====
  const telefone = "5567992777140"; // coloque seu número aqui (DDD + número)

  const url = `https://wa.me/${telefone}?text=${mensagem}`;

  window.open(url, "_blank");
});



cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

// PARA FECHAR CLICANDO FORA
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
  }
});

function esconderAviso(inputId, warnId) {
  const input = document.getElementById(inputId);
  const warn = document.getElementById(warnId);

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      warn.classList.add("hidden");
      input.classList.remove("border-red-500");
    }
  });
}

function esconderAviso(inputId, warnId) {
  const input = document.getElementById(inputId);
  const warn = document.getElementById(warnId);

  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      warn.classList.add("hidden");
      input.classList.remove("border-red-500");
    }
  });
}

// aplicar para cada campo
esconderAviso("address", "address-warn");
esconderAviso("addressSetor", "address-warn-setor");
esconderAviso("addresshorario", "address-warn-horario");

//numero do pedido
function gerarNumeroPedido() {
  return Math.floor(100000 + Math.random() * 900000);
}



window.openCustomization = openCustomization;


