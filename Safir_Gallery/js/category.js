const login = sessionStorage.getItem('login');
const logout = document.getElementById('logout');
const addForm = document.getElementById('addForm');
const categoryName = document.getElementById('name');
const closeBtn = document.getElementById('close');
const addBtn = document.getElementById('add');
const tbody = document.getElementById('category');
let clickedBtn = '';
let elementId = 0;

$(document).ready(function () {
    getCategories();
});

//todo: addEventListeners

logout.addEventListener('click', function () {
    sessionStorage.clear();
    window.location.reload();
});

addBtn.addEventListener('click', function() {
    clickedBtn = 'add';
})

addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (clickedBtn == 'add') {
        addCategory();
    } else {
        updateCategory(elementId);
    }
});

closeBtn.addEventListener('click', function() {
    categoryName.value = '';
})

function getCategories() {
    let counter = 1;
    $.ajax({
        url: 'http://localhost:8080/categories',
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {
            tbody.innerHTML = '';
            response.categories = response.categories.reverse();

            response.categories.forEach(element => {
                tbody.innerHTML += `<tr>
                    <th scope="row">${counter}</th>
                    <td>${element.name}</td>
                    <td>
                    <button class="btn btn-warning" onclick="edit(${element.id})"
                    data-bs-toggle="modal" data-bs-target="#modal">
                    <i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-danger" 
                    onclick="deleteCategory(${element.id})">
                    <i class="fa-solid fa-trash"></i></button>
                    </td>
                    </tr>`;
                counter++;
            });

        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    })
};

function addCategory() {
    const nameValue = categoryName.value;

    $.ajax({
        url: "http://localhost:8080/categories",
        type: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        contentType: "application/json",
        data: JSON.stringify({
            name: nameValue,
        }),
        success: function (response) {
            getCategories();
            closeBtn.click();
        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    });
}

function updateCategory(elementId) {
    const nameValue = categoryName.value;

    $.ajax({
        url: 'http://localhost:8080/categories',
        type: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        contentType: "application/json",
        data: JSON.stringify({
            id: elementId,
            name: nameValue,
        }),
        success: function (response) {
            getCategories();
            closeBtn.click();
        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    });
}

function deleteCategory(id) {
    if( confirm('Silmək istədiyinizdən əminsiniz?') ) {
        $.ajax({
            url: `http://localhost:8080/categories/${id}`,
            type: "DELETE",
            headers: {
                'Authorization': 'Basic ' + btoa(login)
            },
            contentType: "application/json",
            success: function (response) {
                getCategories();
            },
            error: function (xhr, status, error) {
                window.location.href = "login.html";
            }
        });
    }
}

function getCategoryById(id) {
    $.ajax({
        url: 'http://localhost:8080/categories/' + id,
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {
            
            const category = response.categories[0];
            categoryName.value = category.name;

        },
        error: function (xhr, status, error) {
            window.location.href = "login.html";
        }
    })
};

function edit(id) {
    clickedBtn = 'edit';
    elementId = id;
    getCategoryById(id);
}