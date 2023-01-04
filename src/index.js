import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from '../src/fetchCountries';

const DEBOUNCE_DELAY = 300;
const TIMEOUT_NOTIFICATION = 2000;
const searchFieldRef = document.getElementById('search-box');
const countriesList = document.querySelector('.country-list');
const countriesInfo = document.querySelector('.country-info');

searchFieldRef.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(e) {
  const valueInput = e.target.value.trim();

  fetchCountries(valueInput)
    .then(onRenderCountriesList)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name', {
        timeout: TIMEOUT_NOTIFICATION,
      });
      countriesList.innerHTML = '';
      countriesInfo.innerHTML = '';
    });
}

function onRenderCountriesList(countries) {
  const countriesCount = countries.length;

  const markupCountriesList = countries
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li class="country"><img src="${svg}"
      alt="Flag of ${official}" />
      <h1>${official}</h1></li>`
    )
    .join('');
  countriesList.innerHTML = markupCountriesList;

  if (countriesCount === 1) {
    const fullInfoRender = document.querySelector('.country');
    fullInfoRender.classList.add('fullInfoRender');

    const countryInfo = countries
      .map(
        ({ capital, population, languages }) =>
          `<p><b>Capital: </b>${capital}</p>
         <p><b>Population: </b>${population}</p>
         <p><b>Languages: </b>${Object.values(languages)}</p>`
      )
      .join('');
    countriesInfo.innerHTML = countryInfo;
    return;
  }
  countriesInfo.innerHTML = '';
  if (countriesCount > 10) {
    countriesInfo.innerHTML = '';
    countriesList.innerHTML = '';
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name',
      {
        timeout: TIMEOUT_NOTIFICATION,
      }
    );
  }
}
