(() => {
    const apiUrl = '/api/posts';

    const feed = document.getElementById('feed');
    const createPost = document.getElementById('createPost');
    const postTextCreate = document.getElementById('postTextCreate');
    const postAttachCreate = document.getElementById('postAttachCreate');
    const postImageCreate = document.getElementById('postImageCreate');
    const postPublishCreate = document.getElementById('postPublishCreate');

    const postTextEdit = document.getElementById('postTextEdit');
    const postAttachEdit = document.getElementById('postAttachEdit');
    const postImageEdit = document.getElementById('postImageEdit');
    const postPublishEdit = document.getElementById('postPublishEdit');

    let actualPosts = [];

    init();

    function init() {
        getPostList()
        initListeners();

    }

    function getPostList() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(response => {
                actualPosts = response;
                renderPosts(actualPosts);
            })
            .catch(e => console.log(e));
    }



    function renderPosts(posts) {
        feed.innerHTML = '';
        console.table(posts);
        posts.forEach(post => {
            feed.innerHTML += `<li class="rv b agz">
          <img class="bos vb yb aff" src="${post.author.avatarUrl}">
          <div class="rw">
          
            <div class="bpb">
              <small class="acx axc">${moment(post.publicationDate).format('YYYY-MM-DD HH:mm')}</small>
              <h6>${post.author.username}</h6>
            </div>

            <p>${post.text}
            </p>

            <div class="boy" data-grid="images"><img style="display: inline-block; width: 346px; height: 335px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" data-width="640" data-height="640" data-action="zoom" src="${post.picture}"></div>
            <a href="#postModalEdit" class="boa" data-toggle="modal" data-id="${post._id}">
                <button class="cg nz ok" data-id="${post._id}">Редактировать пост</button>
            </a>
                <button type="button" data-id="${post._id}" class="close" aria-hidden="true" title="Удалить">×</button>
          </div>
        </li>`
        })
    }

    function initListeners() {
        createPost.addEventListener('click', createPostListener);
        feed.addEventListener('click', editPostListener);
        feed.addEventListener('click', deletePost);
    }


    function editPostListener(event) {
        if (!event.target.getAttribute("data-id")) {
            return;
        }
        const id = event.target.getAttribute("data-id");

        fetch(`${apiUrl}/${id}`)
            .then(res => res.json())
            .then(post => {
                postTextEdit.value = post.text;
                postImageEdit.setAttribute('src', `${post.picture}`);

                postAttachEdit.addEventListener('change', (event) => {
                    if (event.target.files && event.target.files[0]) {
                        const reader = new FileReader();
                        reader.readAsDataURL(event.target.files[0]);

                        reader.onload = (event) => {
                            postImageEdit.setAttribute('src', `${event.target.result}`);
                        };
                    }
                });

                const publishHandler = () => {
                    let formData = new FormData();
                    formData.append('text', postTextEdit.value);

                    if (postAttachEdit.files[0]) {
                        formData.append('picture', postAttachEdit.files[0], postAttachEdit.files[0].name);
                    } else {
                        formData.append('picture', postImageEdit.getAttribute('src'));
                    }

                    fetch(`${apiUrl}/${id}`, {
                            method: 'PATCH',
                            body: formData
                        })
                        .then(response => {
                            console.log(response);
                            postPublishEdit.removeEventListener('click', publishHandler);
                            getPostList();
                        });


                };

                postPublishEdit.addEventListener('click', publishHandler);
            })
    }

    function createPostListener() {
        postImageCreate.setAttribute('src', 'https://via.placeholder.com/346x335.png');

        const createHandler = () => {
            let formData = new FormData();
            formData.append('text', postTextCreate.value);


            if (postAttachCreate.files[0]) {
                formData.append('picture', postAttachCreate.files[0], postAttachCreate.files[0].name);
            } else {
                formData.append('picture', postImageCreate.getAttribute('src'));
            }

            fetch(apiUrl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    response.json();
                    if (!response.ok) {
                        throw response;
                    }
                })
                .then(() => {
                    postPublishCreate.removeEventListener('click', createHandler);
                    postTextCreate.value = '';
                    postAttachCreate.value = '';
                    getPostList();
                })
                .catch((error) => {
                        console.log(error);
                        alert("Ошибка")
                    }

                );
        };
        postPublishCreate.addEventListener('click', createHandler);

        postAttachCreate.addEventListener('change', (event) => {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]);

                reader.onload = (event) => {
                    postImageCreate.setAttribute('src', `${event.target.result}`);
                };
            }
        });
    };


    function deletePost(event) {
        if (!event.target.classList.contains("close")) {
            return;
        }

        const id = event.target.getAttribute("data-id");
        fetch(`${apiUrl}/${id}`, {
                method: 'delete'
            })
            .then((res) => {
                console.log(res);
                getPostList();
            })
            .catch((error) => {
                    console.log(error);
                }

            );
    }

})();