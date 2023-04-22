import conditions from './conditions.js';
console.log(conditions);
const apiKey = '02b05daf80d94e789dc55817232204';

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeElem(selector) {
  const prevCard = document.querySelector(selector);
  if (prevCard) prevCard.remove();
}
function showError(errorMessage) {
  const card = `
        <div class='weather-card'>
          <div class='container weather-container'>
            <div class='weather-wrapper'>
              ${errorMessage}
            </div>
          </div>
        </div>`;
  header.insertAdjacentHTML('afterend', card);
}
function showElem({
  cityName,
  countryName,
  currTemp,
  currCondition,
  iconLink,
}) {
  const card = `
            <article class='weather-card'>
              <div class='container weather-container'>
                  <div class='weather-wrapper'>
                  <span class='weather-city'>
                      ${cityName}
                  </span>
                      <div class='weather-country-badge'>
                          ${countryName}
                      </div>
                      <div class='weather-line-wrapper'>
                          <div class='weather-temp'>
                              ${currTemp}<sup>°C</sup>
                          </div>
                          <div class='weather-image'>
                              <img src='${iconLink}' alt='Weather icon' width='64' height='64'>
                          </div>
                      </div>
                      <div class='weather-detailed'>
                          ${currCondition}
                      </div>
                  </div>
              </div>
          </article>
      `;
  header.insertAdjacentHTML('afterend', card);
}
async function getWeather(city) {
  const urlAddress = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  const response = await fetch(urlAddress);
  const data = await response.json();

  console.log(data);
  return data;
}
input.addEventListener('focus', () => {
  input.value = '';
});

form.onsubmit = async function (e) {
  e.preventDefault();
  let city = input.value.trim();
  console.log(city);

  const data = await getWeather(city);

  if (data.error) {
    removeElem('.weather-card');
    showError(data.error.message);
  } else {
    removeElem('.weather-card');

    console.log(data.current.condition.code);

    const info = conditions.find(
      (obj) => obj.code === data.current.condition.code,
    );

    console.log(info);
    const iconPath =
      './assets/img/icons/' + (data.current.is_day ? 'day' : 'night') + '/';

    const iconName = info.icon + '.png';
    console.log(iconName);

    const iconLink = iconPath + iconName;
    console.log(iconLink);

    const weatherData = {
      cityName: data.location.name,
      countryName: data.location.country,
      currTemp: data.current.temp_c,
      currCondition: data.current.is_day
        ? info.languages[23]['day_text']
        : info.languages[23]['night_text'],
      iconLink: iconLink,
    };
    showElem(weatherData);
  }
};
