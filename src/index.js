import './index.css';
import header from './modules/Header.js';
import Movies from './modules/movies.js';

const movies = new Movies();

header();
movies.displayMovies();