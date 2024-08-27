// src/installPrompt.js

console.log('installPrompt Loaded');

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installButton = document.getElementById('installButton');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

document.getElementById('installButton')?.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
      const installButton = document.getElementById('installButton');
      if (installButton) {
        installButton.style.display = 'none';
      }
    });
  }
});
