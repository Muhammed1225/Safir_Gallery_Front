const username = document.getElementById('username');
const password = document.getElementById('password');
const invalid = document.getElementById('invalid');
const loginForm = document.getElementById('loginForm');

if (sessionStorage.getItem('login')) {
    window.location.href = 'admin.html';
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const login = username.value + ":" + password.value;

    $.ajax({
        url: "http://localhost:8080/users/login",
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(login)
        },
        success: function (response) {
            sessionStorage.setItem('login', login);            
            window.location.href = 'admin.html';
        },
        error: function (xhr, status, error) {
            invalid.style.opacity = '100';
            invalid.style.visibility = 'visible';
            checkInvalid();
        }
    });
});

function checkInvalid() {
    username.addEventListener('keydown', function () {
        invalid.style.opacity = '0';
        invalid.style.visibility = 'hidden';
    });
    password.addEventListener('keydown', function () {
        invalid.style.opacity = '0';
        invalid.style.visibility = 'hidden';
    })
}