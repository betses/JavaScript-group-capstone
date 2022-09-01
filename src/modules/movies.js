class Movies {
  constructor() {
    this.movie = [];
    this.likes = [];
  }

  getMovie = async () => {
    const data = await fetch('https://api.tvmaze.com/shows');
    try {
      const response = await data.json();
      return response;
    } catch (error) {
      return error;
    }
  };

  getLikes = async () => {
    const likedList = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/likes').then((response) => response.json());
    this.likes = likedList;
  };

  getMoviesCountNum = async () => {
    const result = await this.getMovie();
    return result.length;
  };

  displayMovies = async () => {
    await this.getLikes();
    const div = document.querySelector('.grid-container');
    const response = await this.getMovie();
    let count = 0;
    for (let movies = 20; movies < 40; movies += 1) {
      const card = document.createElement('div');
      card.classList.add('card');
      const movie = response[movies];
      const index = this.likes.findIndex((like) => like.item_id === movie.id);
      const msgLikes = index >= 0 ? this.likes[index].likes : 0;
      card.id = `${movie.id}`;
      card.innerHTML += `
      <div class="container">
        <img src="${movie.image.original}" alt="Avatar" class="image" >
        <div class="middle">
          <button class="btn" id=${movie.id}><i class="fa fa-play"></i></button>
        </div>
      </div>
      <div class="title-container">
        <h4><b>${movie.name}</b></h4> 
        <div class="like-icon"> <i class="fa fa-heart" data-pos=${movie.id}></i> <span id="movie-id"> ${msgLikes} </span> Like(s)</div>
      </div>
      `;
      div.append(card);
      count += 1;
    }
    const mainTitle = document.querySelector('.main-title');
    mainTitle.innerHTML = `Top ${count} Movies`;
    const likeButtons = document.querySelectorAll('.fa-heart');
    likeButtons.forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          const movieId = parseInt(btn.getAttribute('data-pos'), 10);
          this.addLike(movieId, btn);
          btn.disabled = true;
          btn.style.color = 'red';
        },
        { once: true },
      );
    });
    const comments = document.querySelectorAll('.btn');
    comments.forEach((comment) => {
      comment.addEventListener('click', async () => {
        const result = await this.popupDetails(comment.id);
        const main = document.querySelector('main');
        main.style.filter = 'blur(8px)';
        this.displayPopup(result);
        window.scroll({ top: 0, left: 0 });
      });
    });
  };

  addLike = async (itemId, likeButton) => {
    await fetch(
      'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/likes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId }),
      },
    )
      .then((response) => response.text(response))
      .then((json) => json);
    await this.getLikes();
    // const span = document.getElementById('movie-id');
    const index = this.likes.findIndex((like) => like.item_id === itemId);
    const msgLikes = index >= 0 ? this.likes[index].likes : 0;
    likeButton.nextElementSibling.innerHTML = msgLikes;
  };

  popupDetails = async (id) => {
    const data = await fetch(`https://api.tvmaze.com/shows/${id}`);
    try {
      const response = await data.json();
      return response;
    } catch (error) {
      return error;
    }
  };

  getComment = async (id) => {
    const data = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/comments?item_id=${id}`);
    const response = data.json();
    return response;
  }

  getCommentCountNum = async (id) => {
    const result = await this.getComment(id);
    if (result.length > 0) {
      return result.length;
    } return 0;
  }

  displayComment = async (response) => {
    const commentss = document.getElementById('show');
    const counter = document.getElementById('counter-count');
    commentss.innerHTML = '';
    const dataa = await this.getComment(response);
    counter.innerHTML = await this.getCommentCountNum(response);
    if (dataa.length > 0) {
      await dataa.forEach((data) => {
        commentss.innerHTML += `
        <li>
            <small>${data.creation_date}</small>
            <small>${data.username}</small>
            <small>${data.comment}</small>
        </li>
      `;
      });
    }
  }

  displayPopup = async (response) => {
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add('popup');
    const img = response.image.original;
    popup.innerHTML = `
    <div class="close-btn-wrapper">
    <span class="close">&times;</span>
    </div>
    <img src="${img}" alt="Avatar" class="popup-image" >
    <div class="popup-wrapper">
    <h2>${response.name}</h2>
    <p class = "rating"><span>Imbd rating : ${response.rating.average}</span><span>Average Length: ${response.averageRuntime}min</span></p>
    <p class = "info"><span>Genre(s) : ${response.genres}</span><br><span>Premiered: ${response.premiered}</span></p>
    <h3 >Comments(<span id="counter-count">${await this.getCommentCountNum(response.id)}</span>)</h3>
    <ul id='show' class="comments"></ul>
    <h4>Add a comment</h4>
    <form id ='form' action="#" data-id=${response.id} class="form">
    <input id ='username' name ='username' type="text" placeholder="username">
    <textarea id ='comment' name="comment"  class = "add-comment" placeholder="comment"></textarea>
    <button type="submit" class = "submit">Comment</button>
    </form>
    </div>
    `;
    body.append(popup);
    const close = document.querySelector('.close');
    close.addEventListener('click', (e) => {
      e.preventDefault();
      const body = document.querySelector('body');
      const main = document.querySelector('main');
      body.removeChild(body.lastChild);
      main.style.filter = 'blur(0)';
    });
    this.displayComment(response.id);
    this.submitForm(response.id);
  }

  submitForm = async (response) => {
    const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/comments';
    const form = document.getElementById('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username');
      const comment = document.getElementById('comment');
      const formData = new FormData(form);
      const payLoad = formData;

      const extractedPayLoad = [...payLoad];

      const userNamevalue = extractedPayLoad[0][1];
      const commentvalue = extractedPayLoad[1][1];

      const payLoadObject = {
        item_id: e.target.dataset.id,
        username: userNamevalue,
        comment: commentvalue,
      };
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(payLoadObject),
      });
      username.value = '';
      comment.value = '';
      this.displayComment(response);
    });
  }
}

export default Movies;
