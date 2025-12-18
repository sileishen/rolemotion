// Function to change video and description for each role
function changeVideo(role, direction) {
  const roleContainer = document.getElementById(role);
  const videos = JSON.parse(roleContainer.getAttribute('data-videos'));
  const texts = JSON.parse(roleContainer.getAttribute('data-texts'));
  let currentIndex = roleContainer.getAttribute('data-index') || 0;

  if (direction === 'next') {
    currentIndex = (parseInt(currentIndex) + 1) % videos.length;  // Loop to first video
  } else {
    currentIndex = (parseInt(currentIndex) - 1 + videos.length) % videos.length;  // Loop to last video
  }

  roleContainer.setAttribute('data-index', currentIndex);
  roleContainer.querySelector('.role-video').src = videos[currentIndex];
  roleContainer.querySelector('.role-text').innerText = texts[currentIndex];
}

// Add event listeners to control buttons for each role
const roleContainers = document.querySelectorAll('.role-container');

roleContainers.forEach(container => {
  container.querySelector('.next').addEventListener('click', () => changeVideo(container.id, 'next'));
  container.querySelector('.prev').addEventListener('click', () => changeVideo(container.id, 'prev'));
});
