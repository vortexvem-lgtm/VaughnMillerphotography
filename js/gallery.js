const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

const totalImages = 21; // Update to your actual number of images
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

// Create image elements once
function createImages() {
  for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement('img');
    img.src = `images/gallery/${i}.jpg`;
    img.alt = ''; 
    img.className = 'gallery-item';
    img.style.width = '100%';
    img.style.display = 'block';
    img.loading = 'lazy'; // improves performance

    // Lightbox click
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });

    // Warn if image missing
    img.onerror = () => console.warn(`Missing image: ${img.src}`);

    allImages.push(img);
  }
}

// Create columns and assign images
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

  // Initialize column heights
  const columnHeights = Array(columns).fill(0);

  // Assign images reliably after they load
  allImages.forEach(img => {
    img.onload = () => assignImage(img, columnHeights);
    img.onerror = () => console.warn(`Failed to load: ${img.src}`);
    if (img.complete) assignImage(img, columnHeights); // already cached images
  });
}

// Function to assign image to the shortest column
function assignImage(img, columnHeights) {
  const minHeight = Math.min(...columnHeights);
  const colIndex = columnHeights.indexOf(minHeight);
  columnElements[colIndex].appendChild(img);

  // Use offsetHeight instead of img.height for accurate rendered height
  columnHeights[colIndex] += img.offsetHeight + gap;
}

// Initialize gallery
createImages();
createColumns();

// Rebuild on window resize
window.addEventListener('resize', () => createColumns());

// Lightbox close handlers
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});
