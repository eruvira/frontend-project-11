import onChange from 'on-change';

const renderFormState = (elements, formState) => {
  const { input, feedback } = elements;

  if (formState.valid) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
  } else {
    input.classList.add('is-invalid');
    feedback.textContent = formState.error;
  }
};

export default (state, elements) =>
  onChange(state, (path) => {
    if (path === 'form.valid' || path === 'form.error') {
      renderFormState(elements, state.form);
    }
  });
