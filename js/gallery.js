// ===============================
// 🔴🔴🔴 CHANGE THIS NUMBER 🔴🔴🔴
// ===============================
const totalImages = 21; 
// 👆 SET THIS TO HOW MANY IMAGES YOU HAVE
// Example:
// 21 images → 21
// 9 images → 9
// ===============================


const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

const gap = 25;

let columnElements = [];

// Determine column count
function getColumnCount() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}

// Create columns
function createColumns() {
  gallery.innerHTML = '';
  const columns = getColumnCount();
  columnElements = [];

  for (let i = 0; i < columns; i++) {
    const col = document.createElement('div');
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.gap = gap + 'px';
    col.style.width = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

    gallery.appendChild(col);
    columnElements.push(col);
  }

  gallery.style.display = 'flex';
  gallery.style.gap = gap + 'px';
}

// Load images
function loadImages() {
  for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement('img');

    // If your files are 01.jpg, 02.jpg, etc.
    const num = String(i).padStart(2, '0');

    img.src = `images/gallery/${num}.jpg`;

    img.className = 'gallery-item';
    img.style.width = '100%';
    img.style.display = 'block';
    img.loading = 'lazy';

    // Lightbox
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });

    // Add to shortest column AFTER load
    img.onload = () => {
      const shortestCol = columnElements.reduce((prev, curr) =>
        prev.offsetHeight < curr.offsetHeight ? prev : curr
      );
      shortestCol.appendChild(img);
    };

    // Show missing images in console
    img.onerror = () => {
      console.warn(`❌ Missing: ${img.src}`);
    };
  }
}

// Initialize
createColumns();
loadImages();

// Rebuild on resize
window.addEventListener('resize', () => {
  createColumns();
  loadImages();
});

// Lightbox close
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});
