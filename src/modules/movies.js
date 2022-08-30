class Movies {
  // constructor() {
  //   this.movies = [];
  // }

  getMovie = async () => {
    const data = await fetch('https://api.tvmaze.com/shows');
    try {
      const response = await data.json();
      return response;
    } catch (error) {
      return error;
    }
  }

  displayMovies = async () => {
    const div = document.querySelector('.grid-container');
    const response = await this.getMovie();
    for (let movies = 1; movies <= 20; movies += 1) {
      const card = document.createElement('div');
      card.classList.add('card');
      const movie = response[movies];
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
        <span> <i class="fa fa-heart" data-id=${movie.id}></i> 0Like(s)</span>
      </div>
      `;
      div.append(card);
    }
  }
}

export default Movies;