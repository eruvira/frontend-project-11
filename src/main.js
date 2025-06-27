import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import initView from './view';
import createState from './state';

const makeSchema = (existingUrls) =>
  yup
    .string()
    .trim()
    .required('URL обязателен')
    .url('Неверный URL')
    .notOneOf(existingUrls, 'RSS уже добавлен');

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    form: document.getElementById('rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.getElementById('feedback'),
  };

  const state = createState();
  const watchedState = initView(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url-input').trim();
    watchedState.form.url = url;

    const schema = makeSchema(watchedState.feeds.map((f) => f.url));

    schema
      .validate(url)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.error = null;

        watchedState.feeds.push({ url });

        elements.input.value = '';
        elements.input.focus();
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
});

