const container = document.getElementById("flowerContainer");

const flowers = [
    { id: 1, name: "Gül Buketi", price: 50, img: "https://via.placeholder.com/200" },
    { id: 2, name: "Papatya Buketi", price: 40, img: "https://via.placeholder.com/200" },
    { id: 3, name: "Lale Buketi", price: 60, img: "https://via.placeholder.com/200" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderFlowers() {
    const container = document.getElementById("flowerContainer");
    container.innerHTML = "";
    flowers.forEach(flower => {
        container.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${flower.img}" class="card-img-top" alt="${flower.name}">
                    <div class="card-body">
                        <h5 class="card-title">${flower.name}</h5>
                        <p class="card-text">Fiyat: ${flower.price} TL</p>
                        <button class="btn btn-primary" onclick="addToCart(${flower.id})">Sepete Ekle</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const flower = flowers.find(f => f.id === id);
    cart.push(flower);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart");
    if (!cartList) return;
    cartList.innerHTML = "";
    cart.forEach((item, index) => {
        cartList.innerHTML += `<li class="list-group-item">${item.name} - ${item.price} TL <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button></li>`;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function searchFlowers() {
    const searchValue = document.getElementById("searchBox").value.toLowerCase();
    const container = document.getElementById("flowerContainer");
    container.innerHTML = "";
    flowers.filter(flower => flower.name.toLowerCase().includes(searchValue)).forEach(flower => {
        container.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${flower.img}" class="card-img-top" alt="${flower.name}">
                    <div class="card-body">
                        <h5 class="card-title">${flower.name}</h5>
                        <p class="card-text">Fiyat: ${flower.price} TL</p>
                        <button class="btn btn-primary" onclick="addToCart(${flower.id})">Sepete Ekle</button>
                    </div>
                </div>
            </div>
        `;
    });
}

document.getElementById("toggleSidebar").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    this.innerHTML = sidebar.classList.contains("open") ? "&lt;" : "&gt;";
});

renderFlowers();
updateCart();