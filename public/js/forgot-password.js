
document.getElementById('forgotPasswordForm').addEventListener('submit', (event) => {

    event.preventDefault();
  
    const email = document.getElementById('email').value;
  
    fetch('/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {throw err}); // Extract error JSON
        }
        return response.json();
    })
    .then(data => {
        // Show success modal
        M.Modal.getInstance(document.getElementById('success-modal')).open();
    })
    .catch(error => {
        // Show error modal with error message
        const errorModal = M.Modal.getInstance(document.getElementById('error-modal'));
        document.getElementById('error-message').textContent = error.message || "An error occurred. Please try again later.";
        errorModal.open();
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  });