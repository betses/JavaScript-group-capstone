import addItem from './add.js';

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
  }

  getLikes = async () => {
    const likedList = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/likes').then((response) => response.json());
    this.likes = likedList;
  }

  displayMovies = async () => {
    await this.getLikes();
    const div = document.querySelector('.grid-container');
    const response = await this.getMovie();
    for (let movies = 1; movies <= 20; movies += 1) {
      const count = 0;
      const movieNumber = addItem(count, movies);
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
          <button class="btn" data-id=${movie.id}><i class="fa fa-play"></i></button>
        </div>
      </div>
      <div class="title-container">
        <h4><b>${movie.name} ${movieNumber}</b></h4> 
        <div class="like-icon"> <i class="fa fa-heart" data-pos=${movie.id}></i> <span id="movie-id"> ${msgLikes} </span> Like(s)</div>
      </div>
      `;
      div.append(card);
    }
    const likeButtons = document.querySelectorAll('.fa-heart');
    likeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const movieId = parseInt(btn.getAttribute('data-pos'), 10);
        this.addLike(movieId, btn);
        btn.disabled = true;
        btn.style.color = 'red';
      }, { once: true });
    });
    const comments = document.querySelectorAll('.btn');
    comments.forEach((comment) => {
      comment.addEventListener('click', async (e) => {
        e.preventDefault();
        const main = document.querySelector('main');
        main.style.filter = 'blur(8px)';
        const result = await this.popupDetails(e.target.dataset.id);
        this.displayPopup(result);
        window.scroll({ top: 0, left: 0 });
      });
    });
  }

  addLike = async (itemId, likeButton) => {
    await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/g47Ybpe3Iv9MLdD87d0m/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId }),
    }).then((response) => response.text(response)).then((json) => json);
    await this.getLikes();
    // const span = document.getElementById('movie-id');
    const index = this.likes.findIndex((like) => like.item_id === itemId);
    const msgLikes = index >= 0 ? this.likes[index].likes : 0;
    likeButton.nextElementSibling.innerHTML = msgLikes;
  }

  popupDetails = async (id) => {
    const data = await fetch(`https://api.tvmaze.com/shows/${id}`);
    try {
      const response = await data.json();
      return response;
    } catch (error) {
      return error;
    }
  };

  displayPopup = (response) => {
    const body = document.querySelector('body');
    const popup = document.createElement('div');
    popup.classList.add('popup');
    const img = response.image.medium;
    console.log(response);
    popup.innerHTML = `
    <div class="close-btn-wrapper">
    <span class="close">&times;</span>
    </div>
    <img src="${img}" alt="Avatar" class="popup-image" >
    <div class="popup-wrapper">
    <h2>${response.name}</h2>
    <p class = "rating"><span>Imbd rating : ${response.rating.average}</span><span>Average Length: ${response.averageRuntime}min</span></p>
    <p class = "info"><span>Genre(s) : ${response.genres}</span><br><span>Premiered: ${response.premiered}</span></p>
    <h3>Comments(<span>0</span>)</h3>
    <ul class="comments"></ul>
    <h4>Add a comment</h4>
    <form action="#" class="form">
    <input type="text" placeholder="Your name">
    <textarea name="comments"  class = "add-comment" placeholder="Comment"></textarea>
    <button type="submit" class = "submit">Comment</button>
    </form>
    </div>
    `;
    body.append(popup);
    const close = document.querySelector('.close');
    close.addEventListener('click', () => {
      const body = document.querySelector('body');
      const main = document.querySelector('main');
      body.removeChild(body.lastChild);
      main.style.filter = 'blur(0)';
    });
  }
}

export default Movies;