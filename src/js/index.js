import SearchImages from './fetchImages';
import LoadMoreBtn from './loadMoreBtn';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const imageGrid = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

const searchImages = new SearchImages();

const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMoreBtn',
  isHidden: true,
});

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchMoreImages);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  searchImages.searchQuery = form.elements.searchQuery.value.trim();

  clearPage();
  searchImages.resetPage();
  loadMoreBtn.show();
  fetchMoreImages();
}

async function fetchMoreImages() {
  loadMoreBtn.disable();
  try {
    const newSearch = await searchImages.fetchImages();

    if (newSearch.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
    } else if (newSearch.data.hits.length < 40) {
      createImageGrid(newSearch.data);
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      createImageGrid(newSearch.data);
      loadMoreBtn.enable();
    }
  } catch (error) {
    onError(error);
  } finally {
    form.reset();
  }
}

function createImageGrid({ hits }) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
    <a class = "gallery-item" href = "${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
    `
    )
    .join('');
  imageGrid.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearPage() {
  imageGrid.innerHTML = '';
}

function onError(error) {
  console.error(error);
  clearPage();
  Notiflix.Notify.failure(
    'Sorry,there are no images matching your search query.Please try again'
  );
}
