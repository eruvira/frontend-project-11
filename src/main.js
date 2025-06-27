import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import i18next from 'i18next';
import ru from './locales/ru';
import initView from './view';
import createState from './state';

yup.setLocale({
  string: {
    url: () => 'form.errors.url',
  },
  mixed: {
    required: () => 'form.errors.required',
    notOneOf: () => 'form.errors.duplicate',
  },
});

const makeSchema = (existingUrls) =>
  yup.string().trim().required().url().notOneOf(existingUrls);

document.addEventListener('DOMContentLoaded', () => {
  i18next
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      const state = createState();

      const elements = {
        form: document.getElementById('rss-form'),
        input: document.getElementById('url-input'),
        feedback: document.getElementById('feedback'),
      };

      const watchedState = initView(state, elements);

      document.querySelectorAll('[data-i18n]').forEach((elOriginal) => {
        const el = elOriginal;
        const key = el.getAttribute('data-i18n');
        el.textContent = i18next.t(key);
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach((elOriginal) => {
        const el = elOriginal;
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', i18next.t(key));
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const url = formData.get('url-input').trim();

        watchedState.form.url = url;

        const existingUrls = watchedState.feeds.map((f) => f.url);
        const schema = makeSchema(existingUrls);

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
            watchedState.form.error = i18next.t(err.message);
          });
      });
    });
});
