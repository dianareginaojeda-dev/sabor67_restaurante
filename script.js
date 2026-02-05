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

  if (nomeInput.value.trim() === "") {
    nomeWarn.classList.remove("hidden");
    valido = false;
  }

  if (setorInput.value.trim() === "") {
    setorWarn.classList.remove("hidden");
    valido = false;
  }

  if (horarioInput.value.trim() === "") {
    horarioWarn.classList.remove("hidden");
    valido = false;
  }

  if (!valido) return;

  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const numeroPedido = gerarNumeroPedido();

  let mensagem = `🧾 *Pedido Nº ${numeroPedido}*\n\n`;
  mensagem += `👤 *Nome:* ${nomeInput.value}\n`;
  mensagem += `🏢 *Setor/Bloco:* ${setorInput.value}\n`;
  mensagem += `⏰ *Horário de Retirada:* ${horarioInput.value}\n\n`;
  mensagem += `🍱 *Itens do Pedido:*\n`;

  cart.forEach(item => {
  mensagem += `🍱 *${item.name}* - R$ ${item.price.toFixed(2)}\n`;

  if (item.extras.length > 0) {
    mensagem += `   ➕ Adicionais: ${item.extras.join(", ")}\n`;
  }

  if (item.removidos.length > 0) {
    mensagem += `   ➖ Retirar: ${item.removidos.join(", ")}\n`;
  }

  if (item.obs && item.obs.trim() !== "") {
    mensagem += `   📝 Obs: ${item.obs}\n`;
  }

  mensagem += `\n`;
});


  mensagem += `\n💰 *Total:* R$ ${cartTotal.textContent}`;

🍽️ `Restaurante Sabor 67`;
  
  const telefone = "5567992777140";
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  // ✅ FUNCIONA EM TODOS OS NAVEGADORES
  window.location.href = url;

  // limpar depois do envio
  cart = [];
  updateCartModal();
  cartModal.classList.add("hidden");
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
function verificarHorarioFuncionamento() {
  const dateSpan = document.getElementById("date-span");
  const dateText = document.getElementById("date-text");

  const agora = new Date();
  const diaSemana = agora.getDay(); // 0=Domingo | 1=Segunda ... 6=Sábado

  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const horarioAtual = hora * 60 + minuto;

  const inicio = 11 * 60;        // 11:00
  const fim = 13 * 60 + 30;      // 13:30

  const dentroHorario =
    diaSemana >= 1 && diaSemana <= 5 &&
    horarioAtual >= inicio &&
    horarioAtual <= fim;

  if (dentroHorario) {
    // VERDE
    dateSpan.classList.remove("bg-red-600");
    dateSpan.classList.add("bg-green-600");
    dateText.textContent = "Seg á Sex - 11:00 as 13:30";
  } else {
    // VERMELHO
    dateSpan.classList.remove("bg-green-600");
    dateSpan.classList.add("bg-red-600");
    dateText.textContent = "⛔ Fora do horário de pedidos (11:00 às 13:30)";
  }
}

// executa ao carregar a página
verificarHorarioFuncionamento();



window.openCustomization = openCustomization;


