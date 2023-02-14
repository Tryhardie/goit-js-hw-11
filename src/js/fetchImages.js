import axios from 'axios';

export default class SearchImages {
  constructor() {
    this.pageNumber = 1;
    this.searchQuery = '';
  }
  async fetchImages() {
    const URL = 'https://pixabay.com/api/';
    const KEY = '33644854-2628b0b3994d15cdaa93d4151';
    const response = await axios.get(
      `${URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.pageNumber}`
    );
    this.incrementPage();
    return response;
  }
  resetPage() {
    this.pageNumber = 1;
  }
  incrementPage() {
    this.pageNumber += 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
