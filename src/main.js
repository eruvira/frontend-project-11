import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'


const form = document.getElementById('rss-form');
const input = document.getElementById('url-input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value.trim();

  fetch(url) 
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(new Error('Network error'));
      }
      return res.text();
    })
    .then((data) => {
      console.log('Загружено:', data);
    })
    .catch((err) => {
      console.error('Ошибка:', err);
    });
});

