document.addEventListener("DOMContentLoaded", function (event) {
    const loginUrl = '/login-api/signup';

    const fullName = document.getElementById('fullName');
    const userName = document.getElementById('username');
    const passWord = document.getElementById('password');
    const singup = document.getElementById('singup');
    const growl = document.getElementById('app-growl');

    singup.addEventListener('click', (event) => {
        console.log('clicked');
        event.preventDefault();

        let formData = new FormData();
        formData.append('fullName', fullName.value);
        formData.append('username', userName.value);
        formData.append('password', passWord.value);

        fetch(loginUrl, {
                method: 'POST',
                body: formData
            })
            .then(
                (response) => {
                    console.log(response)
                    return response.json()
                })
            .then((response) => {
                console.log(response)
                if (response) {
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