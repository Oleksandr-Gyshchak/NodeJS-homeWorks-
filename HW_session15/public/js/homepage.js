document.addEventListener("DOMContentLoaded", function () {
    const postsUrl = '/api/posts'; // OK
    const userProfileUrl = '/api/user-profile';
    const likesUrl = '/api/likes'; // OK
    const commentsUrl = '/api/comments'; // /api/posts/:postId/comments/

    const body = document.getElementById('body');
    const feed = document.getElementById('feed');
    const logout = document.getElementById('logout-box');

    const profileFullName = document.getElementById('profile');
    const profileUrls = document.getElementsByClassName('profile-url');
    const profileImg = document.getElementById('profile-img');
    const profileDescription = document.getElementById('profile-description');

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const loadMoreButton = document.getElementById('load-more-button');
    const loadMoreBox = document.getElementById('load-more-box');
    const goTopBox = document.getElementById('go-top-box');
    const goTopButton = document.getElementById('go-top-button');

    let actualPosts = [];
    let postsPage = 1;


    init();

    function init() {
        initListeners();
        getUserDataPostsAndRender();
    }

    function getUserDataPostsAndRender() {
        if (localStorage.getItem('token') || localStorage.getItem('current_user_id')) {
            body.classList.remove('hide');

            getUserDataAndRender();
            getPostsAndRender(searchInput.value);
        } else {
            window.location = '/login'
        }

    }


    function renderPosts(posts) {
        feed.innerText = '';

        if (posts.length === 0) {
            let timer = 3;
            feed.innerText = `Нет публикаций за таким запросом. Возврат на главную через ${timer} секунд`;
            postsPage = 1;
            let interval = setInterval(() => {
                timer--;
                feed.innerText = `Нет публикаций за таким запросом. Возврат на главную через ${timer} секунд`;
                if (timer === 0) {
                    clearTimeout(interval);
                    scrollTopAndRefresh();
                }
            }, 1000);
        }


        posts.forEach(post => {
            feed.innerHTML += (post.editable) ?
                `<li class="rv b agz">
              <img class="bos vb yb aff" src="${post.author.avatar}">
              <div class="rw">
                <div class="bpb">
                  <small class="acx axc">${moment(post.publicationDate).fromNow()}</small>
                  <h6><a href="/profile?id=${post.author._id}">${post.author.firstName} ${post.author.lastName}</a></h6>
                </div>
    
                <p>${post.text}
                </p>
    
                <div class="boy" data-grid="images"><img style="display: inline-block; width: 346px; height: 335px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" data-width="640" data-height="640" data-action="zoom" src="${post.picture}"></div>
                
                <button class="cg ${post.isLiked ? 'nq' : 'ns'}" type="button" for="like" data-id="${post._id}">
                  <span class="h bmc" for="like" data-id="${post._id}"></span>
                  ${post.isLiked ? 'Liked!' : 'Like'}
                </button>
                <button class="cg nq" type="button" >
                  <span class="h bnc"></span>
                  ${post.numberOfLikes ? post.numberOfLikes : 0}
                </button>
                <hr>
                <p>
                
                    <a href="#postModalEdit" class="boa" data-toggle="modal" for="edit" data-id="${post._id}">
                        <button class="cg nz ok" data-id="${post._id}" for="edit" title="Редактировать пост">
                            <span class="h bit"></span> Редактировать пост
                        </button>
                    </a>
                    
                    <a href="#postModalComment" class="boa" data-toggle="modal" for="comment" data-id="${post._id}">
                        <button class="cg nz ok" data-id="${post._id}" for="comment" title="Оставить комментарий">
                            <span class="h bmv"></span> Оставить комментарий
                        </button>
                    </a>
                    <a class="boa" for="delete" data-id="${post._id}">
                        <button type="button" class="close" aria-hidden="true" title="Удалить" data-id="${post._id}" for="delete"><span data-id="${post._id}" for="delete" class="h bbg"></span></button>
                    </a>
                    
                </p>
                <ul class="bow afa commentBlock" id="comment-${post._id}">
                </ul>
              </div>
            </li>` :
                `<li class="rv b agz">
              <img class="bos vb yb aff" src="${post.author.avatar}">
              <div class="rw">
                <div class="bpb">
                  <small class="acx axc">${moment(post.publicationDate).fromNow()}</small>
                  <h6><a href="/profile?id=${post.author._id}">${post.author.firstName} ${post.author.lastName}</a></h6>
                </div>
    
                <p>${post.text}
                </p>
    
                <div class="boy" data-grid="images"><img style="display: inline-block; width: 346px; height: 335px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" data-width="640" data-height="640" data-action="zoom" src="${post.picture}"></div>
                
                <button class="cg ${post.isLiked ? 'nq' : 'ns'}" type="button" for="like" data-id="${post._id}">
                  <span class="h bmc" for="like" data-id="${post._id}"></span>
                  ${post.isLiked ? 'Liked!' : 'Like'}
                </button>
                <button class="cg nq" type="button">
                  <span class="h bnc"></span>
                  ${post.numberOfLikes ? post.numberOfLikes : 0}
                </button>
                <hr>
                <p>
                    <a href="#postModalComment" class="boa" data-toggle="modal" for="comment" data-id="${post._id}">
                        <button class="cg nz ok" data-id="${post._id}" for="comment" title="Оставить комментарий">
                            <span class="h bmv"></span> Оставить комментарий
                        </button>
                    </a>
                    
                </p>
                <ul class="bow afa commentBlock" id="comment-${post._id}">
                </ul>
              </div>
            </li>`

        })
    }

    function renderUserProfile(profile) {

        profileFullName.innerText = `${profile.firstName} ${profile.lastName}`;
        profileDescription.innerText = profile.description;
        profileImg.setAttribute('src', profile.avatar);
        Array.prototype.forEach.call(profileUrls, (link) => {
            link.setAttribute('href', `/profile?id=${profile._id}`);
        })
    }

    function renderComments(posts) {
        posts.forEach(post => {
            const commentBlock = document.getElementById(`comment-${post._id}`);

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(`${postsUrl}/${post._id}/comments`, {
                    method: 'GET',
                    headers: headers
                })
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(response => response.json())
                .then(response => {
                    response
                        .forEach(comment => {
                            commentBlock.innerHTML += (comment.editable) ?
                                `<li class="rv afh">
                                        <div class="qa">
                                            <div class="rv">
                                                <img class="bos us aff yb" src="${comment.author.avatar}">
                                                <div class="rw">
                                                    <div class="bpd">
                                                        <div class="bpb">
                                                            <small class="acx axc">${moment(comment.publicationDate).fromNow()}</small>
                                                            <h6><a href="/profile?id=${comment.author._id}">${comment.author.firstName} ${comment.author.lastName}</a></h6>
                                                        </div>
                                                        <div class="bpb">
                                                        ${comment.text}
                                                        </div>
                                                        
                                                        <a href="#postModalCommentEdit" class="boa" data-toggle="modal" for="edit-comment" data-id=${comment._id}>
                                                            <button type="button" class="cg axo axu oh" post-Id=${post._id}  data-id=${comment._id} for="edit-comment" title="Оставить комментарий">Редактировать комментарий</button>
                                                        </a>
                                                        <button type="button" class="close" aria-hidden="true" data-id=${comment._id} for="delete-comment" title="Удалить">
                                                            <span class="h bbg" post-Id=${post._id}   data-id=${comment._id} for="delete-comment"></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                      </li>` :
                                `<li class="rv afh">
                                    <div class="qa">
                                        <div class="rv">
                                            <img class="bos us aff yb" src="${comment.author.avatar}">
                                            <div class="rw">
                                                <div class="bpd">
                                                    <div class="bpb">
                                                        <small class="acx axc">${moment(comment.publicationDate).fromNow()}</small>
                                                        <h6><a href="/profile?id=${comment.author._id}">${comment.author.fullName}</a></h6>
                                                    </div>
                                                    <div class="bpb">
                                                    ${comment.text}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                  </li>`
                        });
                })

        })
    }

    function initListeners() {
        document.getElementById('postModalCreate').addEventListener('click', postModalCreateListener);
        document.getElementById('postModalEdit').addEventListener('click', postModalEditListener);
        document.getElementById('createPost').addEventListener('click', createPostListener);
        document.getElementById('postModalComment').addEventListener('click', postModalCommentListener);
        document.getElementById('postModalCommentEdit').addEventListener('click', postModalCommentEditListener);

        feed.addEventListener('click', editPostListener);
        feed.addEventListener('click', deletePostListener);
        feed.addEventListener('click', likePostListener);
        feed.addEventListener('click', publishCommentListener);
        feed.addEventListener('click', editCommentListener);
        feed.addEventListener('click', deleteCommentListener);
        logout.addEventListener('click', logOutListener);

        searchForm.addEventListener('submit', searchFormListener);
        loadMoreButton.addEventListener('click', loadMoreButtonListener);
        goTopButton.addEventListener('click', scrollTopAndRefresh);
    }

    function postModalCreateListener(e) {
        if (!(e.target.id === 'postModalCreate')) return;

        e.target.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="d">
                        <h4 class="modal-title" id="postTitleCreate">Create post</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>

                    <div class="modal-body afx">
                        <div class="axw">
                            <ul class="bow cj ca">
                                <li class="b">
                                    <textarea type="text" class="form-control" placeholder="Message" id="postTextCreate"></textarea>
                                </li>
                                <li class="b">
                                    <img style="display: inline-block; width: 208px; height: 201px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;" src="https://via.placeholder.com/346x335.png" id="postImageCreate">
                                </li>
                                <li class="b">
                                    <input type="file" class="form-control" placeholder="Message" id="postAttachCreate">
                                </li>
                                <li class="b">
                                    <button class="cg nz ok" id="postPublishCreate" data-dismiss="modal">Опубликовать</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('createPost').addEventListener('click', createPostListener);
    }

    function postModalEditListener(e) {
        if (!(e.target.id === 'postModalEdit')) return;

        e.target.innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
            <div class="d">
                <h4 class="modal-title" id="postTitleEdit">Edit post</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>

            <div class="modal-body afx">
                <div class="axw">
                    <ul class="bow cj ca">
                        <li class="b">
                            <textarea type="text" class="form-control" placeholder="Message" id="postTextEdit"></textarea>
                        </li>
                        <li class="b">
                            <img
                                    style="display: inline-block; width: 208px; height: 201px; margin-bottom: 10px; margin-right: 0px; vertical-align: bottom;"
                                    src="/assets/img/instagram_3.jpg"
                                    id="postImageEdit"
                            >
                        </li>
                        <li class="b">
                            <input type="file" class="form-control" placeholder="Message" id="postAttachEdit">
                        </li>
                        <li class="b">
                            <button class="cg nz ok" id="postPublishEdit" data-dismiss="modal">Опубликовать</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;
        feed.addEventListener('click', editPostListener);
    }

    function postModalCommentListener(e) {
        if (!(e.target.id === 'postModalComment')) return;

        e.target.innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
            <div class="d">
                <h4 class="modal-title">Создать комментарий</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>

            <div class="modal-body afx">
                <div class="axw">
                    <ul class="bow cj ca">
                        <li class="b">
                            <textarea type="text" class="form-control" placeholder="Message" id="commentText"></textarea>
                        </li>
                        <li class="b">
                            <button class="cg nz ok" id="commentPublish" data-dismiss="modal">Опубликовать</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;

        feed.addEventListener('click', publishCommentListener);
    }

    function postModalCommentEditListener(e) {
        if (!(e.target.id === 'postModalCommentEdit')) return;

        e.target.innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
            <div class="d">
                <h4 class="modal-title">Редактировать комментарий</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>

            <div class="modal-body afx">
                <div class="axw">
                    <ul class="bow cj ca">
                        <li class="b">
                            <textarea type="text" class="form-control" placeholder="Message" id="commentTextEdit"></textarea>
                        </li>
                        <li class="b">
                            <button class="cg nz ok" id="commentPublishEdit" data-dismiss="modal">Опубликовать</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;
        feed.addEventListener('click', editCommentListener);
    }

    function logOutListener(event) {
        event.preventDefault();

        localStorage.clear();
        setTimeout(() => {
            window.location = '/login';
        }, 1000)
    }

    function editPostListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'edit') {
            return;
        }

        const postTextEdit = document.getElementById('postTextEdit');
        const postAttachEdit = document.getElementById('postAttachEdit');
        const postImageEdit = document.getElementById('postImageEdit');
        const postPublishEdit = document.getElementById('postPublishEdit');

        const id = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${postsUrl}/${id}`, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 401) window.location = '/login';
                return response;
            })
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
                        formData.append('picture', postAttachEdit.files[0], `${post.picture}`);
                    } else {
                        formData.append('picture', postImageEdit.getAttribute('src'));
                    }

                    const apiToken = localStorage.getItem('token');
                    const headers = new Headers();
                    headers.append('Authorization', apiToken);


                    fetch(postsUrl, {
                            method: 'PATCH',
                            body: formData,
                            headers: headers
                        })
                        .then(response => {
                            if (response.status === 401) window.location = '/login';
                            return response;
                        })
                        .then(() => {
                            postPublishEdit.removeEventListener('click', publishHandler);
                            getPostsAndRender();
                        });
                };

                postPublishEdit.addEventListener('click', publishHandler);
            })
    }

    function likePostListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'like') {
            return;
        }
        const id = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        let formData = new FormData();
        formData.append('postId', id);

        fetch(`${likesUrl}`, {
                method: 'POST',
                body: formData,
                headers: headers
            })
            .then(response => {
                if (response.status === 401) window.location = '/login';
                return response;
            })
            .then(() => getPostsAndRender())
    }

    function deletePostListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'delete') {
            return;
        }
        const id = event.target.getAttribute("data-id");

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${postsUrl}/${id}`, {
                method: 'DELETE',
                headers: headers
            })
            .then(response => {
                if (response.status === 401) window.location = '/login';
                return response;
            })
            .then(() => getPostsAndRender())
    }

    function editCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'edit-comment') {
            return;
        }

        const commentTextEdit = document.getElementById('commentTextEdit');
        const commentPublishEdit = document.getElementById('commentPublishEdit');

        const commentId = event.target.getAttribute("data-id");
        let postId = event.target.getAttribute("post-id")

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${postsUrl}/${postId}/comments/${commentId}`, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(res => res.json())
            .then(comment => {
                commentTextEdit.value = comment.text;

                const editCommentHandler = () => {
                    let formData = new FormData();
                    formData.append('text', commentTextEdit.value);
                    formData.append('_id', comment._id);

                    fetch(`${postsUrl}/${postId}/comments/${commentId}`, {
                            method: 'PATCH',
                            body: formData,
                            headers: headers
                        })
                        .then(response => {
                            if (response.status === 403) window.location = '/login';
                            return response;
                        })
                        .then(() => {
                            commentPublishEdit.removeEventListener('click', editCommentHandler);
                            getPostsAndRender();
                        });
                };

                commentPublishEdit.addEventListener('click', editCommentHandler);
            });
    }


    function deleteCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'delete-comment') {
            return;
        }

        const commentId = event.target.getAttribute("data-id");
        let postId = event.target.getAttribute("post-id")

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${postsUrl}/${postId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: headers
            })
            .then(response => {
                if (response.status === 403) window.location = '/login';
                return response;
            })
            .then(() => getPostsAndRender())
    }

    function createPostListener() {
        const postTextCreate = document.getElementById('postTextCreate');
        const postAttachCreate = document.getElementById('postAttachCreate');
        const postImageCreate = document.getElementById('postImageCreate');
        const postPublishCreate = document.getElementById('postPublishCreate');

        postImageCreate.setAttribute('src', 'https://via.placeholder.com/346x335.png');

        const createHandler = () => {
            let formData = new FormData();
            formData.append('text', postTextCreate.value);


            if (postAttachCreate.files[0]) {
                formData.append('picture', postAttachCreate.files[0], 'postPicture');
            } else {
                formData.append('picture', postImageCreate.getAttribute('src'));
            }

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(postsUrl, {
                    method: 'POST',
                    body: formData,
                    headers: headers
                })
                .then(response => {
                    if (response.status === 401) window.location = '/login';
                    return response;
                })
                .then(() => {
                    postPublishCreate.removeEventListener('click', createHandler);
                    postTextCreate.value = '';
                    postAttachCreate.value = '';
                    actualPosts = [];
                    getPostsAndRender();
                });
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
    }

    function publishCommentListener(event) {
        if (!event.target.getAttribute("data-id") || event.target.getAttribute('for') !== 'comment') {
            return;
        }

        const commentText = document.getElementById('commentText');
        const commentPublish = document.getElementById('commentPublish');

        const postId = event.target.getAttribute("data-id");

        const createHandler = () => {
            let formData = new FormData();
            formData.append('text', commentText.value);
            formData.append('postId', postId);

            const apiToken = localStorage.getItem('token');
            const headers = new Headers();
            headers.append('Authorization', apiToken);

            fetch(`${postsUrl}/${postId}/comments`, {
                    method: 'POST',
                    body: formData,
                    headers: headers
                })
                .then(response => {
                    if (response.status === 403) window.location = '/login';
                    return response;
                })
                .then(() => {
                    commentPublish.removeEventListener('click', createHandler);
                    commentText.value = '';
                    getPostsAndRender();
                });
        };

        commentPublish.addEventListener('click', createHandler);

    }

    function searchFormListener(event) {
        event.preventDefault();
        postsPage = 1;
        getPostsAndRender(searchInput.value);
    }

    function loadMoreButtonListener() {
        postsPage++;
        getPostsAndRender(searchInput.value, true);
    }

    function getPostsAndRender(q = null, isClickedLoadMore = false) {

        const apiToken = localStorage.getItem('token');
        const headers = new Headers();
        headers.append('Authorization', apiToken);
        let _postsUrl = postsUrl + `?`;
        if (q) {
            _postsUrl += `query=${q}&`;
        }

        _postsUrl += `page=${postsPage}`;

        fetch(_postsUrl, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 401) window.location = '/login';
                return response;
            })
            .then(response => response.json())
            .then(response => {
                console.log(response, isClickedLoadMore);
                checkIsEnd(response.page == response.totalPages);

                actualPosts = (isClickedLoadMore) ? actualPosts.concat(response.docs) : response.docs;

                renderPosts(actualPosts);

                renderComments(actualPosts);

            })
            .catch(e => console.log(e));
    }

    function getUserDataAndRender() {
        const apiToken = localStorage.getItem('token');

        const headers = new Headers();
        headers.append('Authorization', apiToken);

        fetch(`${userProfileUrl}`, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (response.status === 401) window.location = '/login';
                return response;
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                let userProfile = response;
                renderUserProfile(userProfile);
            });
    }

    function checkIsEnd(isEnd) {
        if (isEnd) {
            loadMoreBox.classList.remove('show');
            loadMoreBox.classList.add('hide');
            goTopBox.classList.remove('hide');
            goTopBox.classList.add('show');
        } else {
            loadMoreBox.classList.remove('hide');
            loadMoreBox.classList.add('show');
            goTopBox.classList.remove('show');
            goTopBox.classList.add('hide');
        }
    }

    function scrollTopAndRefresh() {
        postsPage = 1;
        actualPosts = [];
        searchInput.value = '';
        getPostsAndRender();
        document.documentElement.scrollTop = 0;
    }
});