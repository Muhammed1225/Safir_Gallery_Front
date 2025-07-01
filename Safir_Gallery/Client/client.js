const container = document.getElementById('goods');
let basket = JSON.parse(localStorage.getItem('basket')) || [];

function getFlowers() {
  $.ajax({
    url: "http://localhost:8080/categories",
    type: 'GET',
    success: function (response) {
      response.categories.forEach(element => {
        container.innerHTML += `<h3 class="category-name">${element.name}</h3>`;
        container.innerHTML += `<div class="goods-container" id="goods-container-${element.id}"></div>`;
        const goodsContainer = document.getElementById(`goods-container-${element.id}`);
        element.flowers = element.flowers.reverse();
        if (element.flowers.length === 0) {
          goodsContainer.innerHTML = `<h3 class="no-goods">Bu kateqoriyada məhsul yoxdur</h3>`;
          return;
        }

        element.flowers.forEach(flower => {
          goodsContainer.innerHTML +=
            `<div class="goods-item">
              <img src="http://localhost:8080/uploads/${flower.images[0]}"
                alt="flower">
              <h4>${flower.text}</h4>
              <p class="price">₼${flower.price}</p>
              <button class="btn" id="btn-${flower.id}" onclick="addToBasket(${flower.id})">${basket.includes(flower.id) ? 'Əlavə Edildi' : 'Səbətə Əlavə Et'}</button>
            </div>`;
        });
      })
    },
    error: function () {
      window.location.href = 'login.html';
    }
  });
};

function addToBasket(id) {
  const button = document.getElementById(`btn-${id}`);
  if (basket.includes(id)) {
    basket = basket.filter(item => item !== id);
    button.innerText = 'Səbətə Əlavə Et';
  } else {
    basket.push(id);
    button.innerText = 'Əlavə Edildi';
  }
  localStorage.setItem('basket', JSON.stringify(basket));
}

getFlowers();