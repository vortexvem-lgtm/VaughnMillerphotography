const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

const totalImages = 21; // your actual number of images
const gap = 25;

let allImages = [];
let columnElements = [];

// Determine column count based on screen width
function getColumnCount() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}

// Preload all images
function preloadImages(callback) {
  let loadedCount = 0;

  for (let i = 1; i <= totalImages; i++) {
    const img = new Image();
    img.src = `images/gallery/${i}.jpg`;
    img.alt = '';
    img.className = 'gallery-item';
    img.style.width = '100%';
    img.style.display = 'block';
    img.loading = 'lazy';

    // Lightbox click
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });

    img.onload = img.onerror = () => {
      loadedCount++;
      allImages.push(img); // add whether it loads or fails
      if (loadedCount === totalImages) callback();
    };
  }
}

// Assign images to columns
function createColumns() {
  gallery.innerHTML = '';
  const columns = getColumnCount();
  columnElements = [];

  for (let i = 0; i < columns; i++) {
    const col = document.createElement('div');
    col.className = 'masonry-column';
    col.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: ${gap}px;
      width: calc((100% - ${(columns - 1) * gap}px) / ${columns});
    `;
    gallery.appendChild(col);
    columnElements.push(col);
  }

  gallery.style.display = 'flex';
  gallery.style.gap = gap + 'px';
  gallery.style.justifyContent = 'center';

  const columnHeights = Array(columns).fill(0);

  allImages.forEach(img => {
    const minHeight = Math.min(...columnHeights);
    const colIndex = columnHeights.indexOf(minHeight);
    columnElements[colIndex].appendChild(img);
    columnHeights[colIndex] += img.offsetHeight + gap;
  });
}

// Initialize gallery
preloadImages(createColumns);

// Rebuild on resize
window.addEventListener('resize', () => createColumns());

// Lightbox close
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});
