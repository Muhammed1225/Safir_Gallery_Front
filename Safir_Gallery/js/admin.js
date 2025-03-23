const container = document.getElementById('container');
const menuButton = document.getElementById('bars');
const menu = document.getElementById('menu');
const login = sessionStorage.getItem('login');
const logout = document.getElementById('logout');
const flowerForm = document.getElementById('flowerForm');
const closeBtn = document.getElementById('closeBtn');
const textInput = document.getElementById('text');
const fileInput = document.getElementById('file');
const categoryInput = document.getElementById('category');
const addBtn = document.getElementById('add');
let clickedBtn = '';
let elementId = 0;

$(document).ready(function () {
    getFlowers();
    getCategories();
});

//todo: addEventListeners

menuButton.addEventListener('click', function () {
    if (menu.style.opacity != '100') {
        menu.style.opacity = '100';
        menu.style.visibility = 'visible';
    } else {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
    }
})

addBtn.addEventListener('click', function() {
    clickedBtn = 'add';
})

logout.addEventListener('click', function () {
    sessionStorage.clear();
    window.location.reload();
});

closeBtn.addEventListener('click', function () {
    categoryInput.value = 0;
    textInput.value = '';
    fileInput.value = '';
})

flowerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (clickedBtn == 'add') {
        addElement();
    } else {
        updateElement(elementId);
    }
});

//todo: api's functions

function getFlowers() {
    $.ajax({
        url: "http://localhost:8080/flowers",
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {
            container.innerHTML = '';
            response.flowers.forEach(element => {
                container.innerHTML +=
                    `<div class="card">
                        <div id="carouselExampleAutoplaying${element.id}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner" id="inner${element.id}"></div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying${element.id}"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying${element.id}"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${element.text}</h5>
                            <p class="card-text">${element.category}</p>
                            <a class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="edit(${element.id})">
                            <i class="fa-solid fa-edit"> &nbsp;Edit</i></a>
                            <a class="btn btn-danger" onclick="deleteElement(${element.id})">
                            <i class="fa-solid fa-trash"> &nbsp;Delete</i></a>
                        </div>
                    </div>`;

                const inner = document.getElementById(`inner${element.id}`);

                element.images.forEach(image => {
                    if (image == element.images[0]) {
                        inner.innerHTML +=
                            `<div class="carousel-item active">
                            <img src="http://localhost:8080/uploads/${image}" class="d-block w-100">
                        </div>`;
                    } else {
                        inner.innerHTML +=
                            `<div class="carousel-item">
                            <img src="http://localhost:8080/uploads/${image}" class="d-block w-100">
                        </div>`;
                    }
                });

            });
        },
        error: function (xhr, status, error) {
            window.location.href = 'login.html';
        }
    });
}

function updateElement(elementId) {
    const text = textInput.value;
    const category = categoryInput.value;
    var formData = new FormData();

    const files = fileInput.files;
    if (files.length > 0) {
        Array.from(files).forEach(function (file) {
            formData.append('files', file);
        });
    }
    formData.append('text', text);
    formData.append('categoryId', category);
    formData.append('id', elementId);

    $.ajax({
        url: 'http://localhost:8080/flowers',
        type: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            getFlowers();
            closeBtn.click();
        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    });
}

function getCategories() {
    $.ajax({
        url: 'http://localhost:8080/categories',
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {

            response.categories.forEach(element => {
                categoryInput.innerHTML += `<option value="${element.id}">
                    ${element.name}</option>`;
            });

        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    })
};

function getFlowerById(id) {
    $.ajax({
        url: 'http://localhost:8080/flowers/' + id,
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {
            const element = response.flowers[0];
            textInput.value = element.text;
            categoryInput.value = element.categoryId;
        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    })
}

function addElement() {    
    const text = textInput.value;
    const category = categoryInput.value;
    var formData = new FormData();

    const files = fileInput.files;
    if (files.length > 0) {
        Array.from(files).forEach(function (file) {
            formData.append('files', file);
        });
    }
    formData.append('text', text);
    formData.append('categoryId', category);

    $.ajax({
        url: 'http://localhost:8080/flowers',
        type: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            getFlowers();
            closeBtn.click();
        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    });
}

//todo: functions

function deleteElement(id) {
    if( confirm('Silmək istədiyinizdən əminsiniz?') ) {
        $.ajax({
            url: 'http://localhost:8080/flowers/' + id,
            type: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(login)
            },
            success: function (response) {
                getFlowers();
            },
            error: function (xhr, status, error) {
                window.location.href = "login.html";
            }
        })
    }
}

function edit(id) {
    clickedBtn = 'edit';
    elementId = id;
    getFlowerById(id);
}
