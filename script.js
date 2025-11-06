document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobApplicationForm');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent default page reload
    successMessage.textContent = '';
    errorMessage.textContent = '';

    const formData = new FormData(form);

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Server error');

      const result = await response.text();
      successMessage.textContent = result;
      form.reset();
    } catch (error) {
      console.error(error);
      errorMessage.textContent = 'Error submitting application.';
    }
  });
});
