// Content script - handles feedback message display
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showFeedback') {
    showFeedbackMessage(message.title, message.isError);
  }
});

function showFeedbackMessage(title, isError = false) {
  // Remove any existing feedback
  const existing = document.querySelector('#reading-list-feedback');
  if (existing) {
    existing.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.id = 'reading-list-feedback';
  feedback.className = isError ? 'rl-feedback rl-error' : 'rl-feedback rl-success';
  
  const icon = isError ? '⚠️' : '📖';
  const message = isError ? 'Failed to add to Reading List' : `Added "${title}" to Reading List`;
  
  feedback.innerHTML = `
    <div class="rl-content">
      <span class="rl-icon">${icon}</span>
      <span class="rl-text">${message}</span>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(feedback);
  
  // Show with animation
  setTimeout(() => {
    feedback.classList.add('rl-show');
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    feedback.classList.remove('rl-show');
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 300);
  }, 3000);
}