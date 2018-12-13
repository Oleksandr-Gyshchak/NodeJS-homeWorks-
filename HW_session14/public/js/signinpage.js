document.addEventListener("DOMContentLoaded", function() {
    const loginUrl = '/login-api/signin';

    const userName = document.getElementById('username');
    const passWord = document.getElementById('password') ;
    const login = document.getElementById('login');
    const growl = document.getElementById('app-growl');

    login.addEventListener('click', (event) => {

        event.preventDefault();

        let formData = new FormData();
        formData.append('username', userName.value);
        formData.append('password', passWord.value);

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
                    const text = document.createTextNode('Успешный вход в систему.');
                    growlBody.appendChild(text);
                    growl.appendChild(growlBody);

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('current_user_id', response.userId);

                    setTimeout(() => {
                        window.location = '/';
                    }, 2*1000);
                } else {
                    let growlBody = document.createElement('div');
                    growlBody.classList.add('alert', 'alert-dark', 'alert-dismissible', 'fade', 'show');
                    growlBody.setAttribute('role', 'alert');
                    const text = document.createTextNode('Не авторизировано.');
                    growlBody.appendChild(text);
                    growl.appendChild(growlBody);

                    setTimeout(() => {
                        growl.innerHTML = '';
                    }, 2*1000);
                }
            })
            .catch(e => console.error(e));
    });
});