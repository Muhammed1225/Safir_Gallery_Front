const container = document.getElementById('basket-container');
const dateOptionsDiv = document.getElementById("date-options");
const basketForm = document.getElementById('basket-form');
let basket = JSON.parse(localStorage.getItem('basket')) || [];
const today = new Date();
today.setDate(today.getDate() + 7);

for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const formatted = date.toISOString().split('T')[0];
    const p = document.createElement("p");
    p.innerHTML = `<i class="fa-solid fa-calendar"></i> ${formatted}`;
    dateOptionsDiv.appendChild(p);
}

let selectedDate = null;
let selectedElement = null;

function getDate(event) {
    selectedDate = event.target.textContent.trim();
    console.log("Seçilen tarix:", selectedDate);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-group2 p').forEach(p => {
        p.addEventListener('click', getDate);
    });
});

basketForm.addEventListener('submit', function (event) {
    event.preventDefault();
    order();
})

function getBasket() {
    if (basket.length === 0) {
        container.innerHTML = '<h3>Səbətiniz boşdur</h3>';
        return;
    }

    basket.forEach(element => {
        $.ajax({
            url: "http://localhost:8080/flowers/" + element,
            type: 'GET',
            success: function (response) {
                response.flowers.forEach(flower => {
                    container.innerHTML +=
                        `<div class="goods-item">
                            <img src="http://localhost:8080/uploads/${flower.images[0]}" alt="flower">
                            <h4>${flower.text}</h4>
                            <p class="price">₼${flower.price}</p>
                            <button class="btn" id="btn-${flower.id}" onclick="removeFromBasket(${flower.id})"><i class="fa-solid fa-trash"></i>
                                Sil</button>
                        </div>`;
                });
                container.innerHTML += `<h3 class="total-price">Cəmi: ₼${calculateTotalPrice()}</h3>`;
            },
            error: function () {
                window.location.href = 'login.html';
            }
        });
    });
}

function removeFromBasket(id) {
    const button = document.getElementById(`btn-${id}`);
    basket = basket.filter(item => item !== id);
    button.parentElement.remove();
    localStorage.setItem('basket', JSON.stringify(basket));

    if (basket.length === 0) {
        container.innerHTML = '<h3>Səbətiniz boşdur</h3>';
    } else {
        document.querySelector('.total-price').innerText = `Cəmi: ₼${calculateTotalPrice()}`;
    }
}

function calculateTotalPrice() {
    let total = 0;
    basket.forEach(id => {
        const flower = document.querySelector(`#btn-${id}`).parentElement;
        const price = parseFloat(flower.querySelector('.price').innerText.replace('₼', ''));
        total += price;
    });
    return total.toFixed(2);
}

function order() {
    if (basket.length === 0) {
        alert('Səbətiniz boşdur');
        return;
    }

    $.ajax({
        url: "http://localhost:8080/baskets",
        type: 'POST',
        data: JSON.stringify({
            client: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            deliveryDate: selectedDate,
            flowers: basket
        }),
        contentType: 'application/json',
        success: function (response) {
            alert('Sifarişiniz qəbul edildi');
            localStorage.removeItem('basket');
            basket = [];
            container.innerHTML = '<h3>Səbətiniz boşdur</h3>';
            selectedElement.classList.remove('selected');
            selectedDate = null;
            selectedElement = null;
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
        },
        error: function () {
            alert('Sifariş zamanı xəta baş verdi');
        }
    });
}

function getDate(event) {
    selectedDate = event.target.textContent.trim();
    event.target.classList.add('selected');
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    selectedElement = event.target;
}

document.querySelectorAll('.form-group2 p').forEach(p => {
    p.addEventListener('click', getDate);
});

getBasket();