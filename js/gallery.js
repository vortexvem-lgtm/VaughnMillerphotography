const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

const gap = 25;

let allImages = [];
let filteredImages = [];
let columnElements = [];
let currentFilter = "all";


// 🔥 EDIT YOUR REAL PHOTOS HERE
// Just add the image number to the right category array below.
// Only numbers listed here will ever be requested — no more guessing/404s.
const categoryMap = {
  Street:    [1, 2, 3, 4],
  Portraits: [301, 302, 303, 304, 305, 306, 307],
  Other:     []
};


// COLUMN COUNT
function getColumnCount() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}


// CREATE IMAGES (only the ones that actually exist)
function createImages() {
  Object.entries(categoryMap).forEach(([category, numbers]) => {
    numbers.forEach(num => {
      const img = document.createElement('img');
      img.src = `images/gallery/${num}.jpg`;
      img.alt = '';
      img.className = 'gallery-item';
      img.style.width = '100%';
      img.style.display = 'block';
      img.dataset.category = category;

      // If a file listed here is ever missing/renamed, don't let it
      // break the layout — just drop it silently instead of hanging.
      img.addEventListener('error', () => {
        img.remove();
        allImages = allImages.filter(i => i !== img);
        filteredImages = filteredImages.filter(i => i !== img);
      });

      img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        caption.textContent = img.alt;
      });

      allImages.push(img);
    });
  });

  filteredImages = [...allImages];
}


// APPLY FILTER
function applyFilter() {
  if (currentFilter === "all") {
    filteredImages = [...allImages];
  } else {
    filteredImages = allImages.filter(
      img => img.dataset.category === currentFilter
    );
  }

  createColumns();
}


// CREATE COLUMNS
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

  filteredImages.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      assignImage(img, columnHeights);
    } else {
      img.onload = () => assignImage(img, columnHeights);
    }
  });
}


// ASSIGN IMAGE
function assignImage(img, columnHeights) {
  const minHeight = Math.min(...columnHeights);
  const colIndex = columnHeights.indexOf(minHeight);
  columnElements[colIndex].appendChild(img);
  columnHeights[colIndex] += img.height + gap;
}


// FILTER BUTTONS
const buttons = document.querySelectorAll(".filter-buttons button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentFilter = button.getAttribute("data-filter");
    applyFilter();
  });
});


// INIT
createImages();
applyFilter();


// RESIZE
window.addEventListener('resize', () => {
  createColumns();
});


// LIGHTBOX CLOSE
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});
