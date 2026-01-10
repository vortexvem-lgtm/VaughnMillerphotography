const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

// Total number of images in your gallery folder
const totalImages = 6; // <-- adjust to match your images

for (let i = 1; i <= totalImages; i++) {
  const img = document.createElement('img');
  img.src = `images/gallery/${i}.jpg`;
  img.className = "gallery-item";

  // Click to open lightbox
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    caption.textContent = img.alt; // optional caption
  });

  gallery.appendChild(img);
}

// Close lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Click outside image closes lightbox
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});
