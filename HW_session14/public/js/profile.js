document.addEventListener("DOMContentLoaded", function () {
    const userProfileUrl = '/api/user-profile';
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserId = urlParams.get('id');
    const apiToken = localStorage.getItem('token');

    const profileDescription = document.getElementById('profile-description');
    const profileImg = document.getElementById('profile-img');
    const profileFullName = document.getElementById('profile');
    const profileLogin = document.getElementById('profile-login');
    const profileEmail = document.getElementById('profile-email');
    const profileFirstName = document.getElementById('profile-first-name');
    const profileLastName = document.getElementById('profile-last-name');
    const postsNumber = document.getElementById('profile-posts-number');
    const commentsNumber = document.getElementById('profile-comments-number');
    const likesNumber = document.getElementById('profile-likes-number');
    const commentsAVG = document.getElementById('profile-comments-avg');
    const profileLink = document.getElementById('profile-link');


    const editBlock = document.getElementById('edit-block');
    const viewBlock = document.getElementById('view-block');
    const editBtn = document.getElementById('edit-button');
    const cancelBtn = document.getElementById('cancel-button');
    const submitBtn = document.getElementById('submit-button');

    // edit form
    const loginInput = document.getElementById('login-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const firstNameInput = document.getElementById('first-name-input');
    const lastNameInput = document.getElementById('last-name-input');
    const descriptionInput = document.getElementById('description-input');

    function renderUserProfile(profile) {
        console.log(profile)
        profileDescription.innerText = profile.description;
        profileFullName.innerText = `${profile.firstName} ${profile.lastName}`;
        profileImg.setAttribute('src', profile.avatar);
        profileLogin.innerText = profile.username;
        profileEmail.innerText = profile.email;
        profileFirstName.innerText = profile.firstName;
        profileLastName.innerText = profile.lastName;
        postsNumber.innerText = profile.postsNumber;
        likesNumber.innerText = profile.likesNumber;
        commentsNumber.innerText = profile.commentsNumber;
        commentsAVG.innerText = profile.commentsAVG;
        profileLink.setAttribute('src', `/profile/${profile._id}`);
        if (!profile.editable) {
            editBtn.classList.add('hide');
        }
    }

    function initListeners() {
        editBtn.addEventListener('click', editHandler);
        cancelBtn.addEventListener('click', showView);
        submitBtn.addEventListener('click', submitHandler)
    }

    function editHandler(ev) {
        ev.preventDefault();
        showEdit();

        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${userProfileUrl}/${currentUserId}`, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(response => response.json())
            .then(response => {
                loginInput.value = response.username;
                emailInput.value = response.email;
                passwordInput.value = response.password;
                firstNameInput.value = response.firstName;
                lastNameInput.value = response.lastName;
                descriptionInput.value = response.description;
            });
    }

    function submitHandler() {
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        let formData = new FormData();
        formData.append('id', currentUserId);
        formData.append('username', loginInput.value);
        formData.append('password', passwordInput.value);
        formData.append('firstName', firstNameInput.value);
        formData.append('lastName', lastNameInput.value);
        formData.append('email', emailInput.value);
        formData.append('description', descriptionInput.value);

        fetch(`${userProfileUrl}/${currentUserId}`, {
                method: 'POST',
                body: formData,
                headers: headers
            })
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then((response) => {
                showView();
                getProfileData();
            });
    }

    function showEdit() {
        editBlock.classList.remove('hide');
        editBlock.classList.add('show');

        viewBlock.classList.remove('show');
        viewBlock.classList.add('hide');

    }

    function showView() {
        editBlock.classList.remove('show');
        editBlock.classList.add('hide');

        viewBlock.classList.toggle('hide');
        viewBlock.classList.add('show');

    }

    function init() {
        editBlock.classList.add('hide');
        initListeners();

        getProfileData()

    }

    function getProfileData() {
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${userProfileUrl}/${currentUserId}`, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(response => response.json())
            .then(response => {
                renderUserProfile(response);
            });
    }

    init();
});