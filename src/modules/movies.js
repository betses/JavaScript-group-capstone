class Movies {
  constructor() {
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
        <h4><b>${movie.name}</b></h4> 
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
}

export default Movies;