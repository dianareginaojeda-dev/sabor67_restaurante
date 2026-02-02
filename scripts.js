const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemConteiner = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const checAvaliacaoBtn = document.getElementById("checAvaliacao-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressSetorInput = document.getElementById("addressSetor")
const addressBlocoInput = document.getElementById("addressbloco")
const addressHorarioInput = document.getElementById("addresshorario")
const addresswharn = document.getElementById("address-warn")
const addresswharnSetor = document.getElementById("address-warn-setor")
const addresswharnBloco = document.getElementById("address-warn-bloco")
const addresswharnhorario = document.getElementById("address-warn-horario")

let cart = []
// abrir menu carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
})
// fechar menu carrinho quando clicar fora 
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
// fechar menu carrinho quando clicar no botão de fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})
menu.addEventListener("click", function(event){
    // console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    //adicionar no carrinho
    addToCart(name, price)
    }
    
})
//função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find(
    item => item.name === name
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartMotal();
}
// atualizar o modal do carrinho
function updateCartMotal() {
  cartItemConteiner.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "nm-4", "flex-col")

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
    <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
    </div>

    
    <button class="remove-from-cart-btn" data-name="${item.name}">
    Remover
    </button>
    
    </div>   
    `
    total += item.price * item.quantity;

    cartItemConteiner.appendChild(cartItemElement)

})
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//Romover o item do carrinho
cartItemConteiner.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

     if(item.quantity > 1){
        item.quantity -= 1;
        updateCartMotal();
        return;
    }
      cart.splice(index, 1);
       updateCartMotal();
    }}
// NOME
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addresswharn.classList.add("hidden")
    }
})

// SETOR
addressSetorInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressSetorInput.classList.remove("border-red-500")
        addresswharnSetor.classList.add("hidden")
    }
})
    
// BLOCO
addressBlocoInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressBlocoInput.classList.remove("border-red-500")
        addresswharnBloco.classList.add("hidden")
    }
})
// HORARIO
addressHorarioInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressHorarioInput.classList.remove("border-red-500")
        addresswharnhorario.classList.add("hidden")
    }
})

function gerarNumeroPedido() {
  return Math.floor(100000 + Math.random() * 900000);
}

function formatarDataHora() {
  const agora = new Date();
  return agora.toLocaleString("pt-BR", {
    timeZone: "America/Campo_Grande",
    dateStyle: "short",
    timeStyle: "short"
  });
}

function checkRestaurantOpen() {
  const agora = new Date();
  const hora = Number(agora.toLocaleString("pt-BR", {
    timeZone: "America/Campo_Grande",
    hour: "2-digit",
    hour12: false
  }));

  return hora >= 8 && hora < 16;
}

checkoutBtn.addEventListener("click", function () {

  if (!checkRestaurantOpen()) {
    Toastify({
      text: "🔴 Restaurante fechado! Atendimento das 08:00 às 16:00.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "#ef4444" }
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addresswharn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  if (addressSetorInput.value === "") {
    addresswharnSetor.classList.remove("hidden");
    addressSetorInput.classList.add("border-red-500");
    return;
  }

  if (addressBlocoInput.value === "") {
    addresswharnBloco.classList.remove("hidden");
    addressBlocoInput.classList.add("border-red-500");
    return;
  }

  if (addressHorarioInput.value === "") {
    addresswharnhorario.classList.remove("hidden");
    addressHorarioInput.classList.add("border-red-500");
    return;
  }

  const numeroPedido = gerarNumeroPedido();
  const dataHora = formatarDataHora();

  const cartItems = cart.map((item) => {
    return `• ${item.name} (Qtd: ${item.quantity}) - R$ ${item.price.toFixed(2)}`;
  }).join("\n");

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const texto =
`🧾 *Pedido Nº ${numeroPedido}*
📅 ${dataHora}

🛒 *Itens*
${cartItems}

💰 *Total: R$ ${total}*

👤 *Solicitante:* ${addressInput.value}
🏢 *Setor:* ${addressSetorInput.value}
🏬 *Bloco:* ${addressBlocoInput.value}
⏰ *Horário de Retirada:* ${addressHorarioInput.value}

🍽️ Restaurante Sabor 67`;

  const phone = "67992777140";
  const mensagem = encodeURIComponent(texto);

  window.open(`https://wa.me/${phone}?text=${mensagem}`, "_blank");

  cart = [];
  updateCartModal();
});
