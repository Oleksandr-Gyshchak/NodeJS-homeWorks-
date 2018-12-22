document.addEventListener("DOMContentLoaded", function (event) {
    const loginUrl = '/login-api/signup';

    const userName = document.getElementById('username');
    const passWord = document.getElementById('password');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const description = document.getElementById('description');

    const singup = document.getElementById('singup');
    const growl = document.getElementById('app-growl');

    singup.addEventListener('click', (event) => {
        console.log('clicked');
        event.preventDefault();

        let formData = new FormData();
        formData.append('username', userName.value);
        formData.append('password', passWord.value);
        formData.append('email', email.value);
        formData.append('description', description.value);
        formData.append('firstName', firstName.value);
        formData.append('lastName', lastName.value);


        fetch(loginUrl, {
                method: 'POST',
                body: formData
            })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    let growlBody = document.createElement('div');
                    growlBody.classList.add('alert', 'alert-dark', 'alert-dismissible', 'fade', 'show');
                    growlBody.setAttribute('role', 'alert');
                    const text = document.createTextNode('Пользователь успешно создан. Войдите в систему под своей новой учетной записью');
                    growlBody.appendChild(text);
                    growl.appendChild(growlBody);
                    setTimeout(() => {
                        growl.innerHTML = '';
                        window.location = '/login'
                    }, 2 * 1000);
                } else {
                    let growlBody = document.createElement('div');
                    growlBody.classList.add('alert', 'alert-dark', 'alert-dismissible', 'fade', 'show');
                    growlBody.setAttribute('role', 'alert');
                    const text = document.createTextNode('Введите корректно логин и пароль.');
                    growlBody.appendChild(text);
                    growl.appendChild(growlBody);

                    setTimeout(() => {
                        growl.innerHTML = '';
                    }, 2 * 1000);
                }
            })
            .catch(e => console.error(e));
    });
});