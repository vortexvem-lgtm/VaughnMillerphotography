const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-lightbox');

const totalImages = 999;
const gap = 25;

let allImages = [];
let filteredImages = [];
let columnElements = [];
let currentFilter = "all";


// 🔥 EDIT YOUR CATEGORIES HERE
function getCategory(index) {
  if (index >= 1 && index <= 300) return "Street";
  if (index >= 301 && index <= 650) return "Portraits";
  if (index >= 651 && index <= 999) return "Other";
  return "cars"; // default fallback if needed
}


// COLUMN COUNT
function getColumnCount() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}


// CREATE IMAGES
function createImages() {
  for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement('img');
    img.src = `images/gallery/${i}.jpg`;
    img.alt = '';
    img.className = 'gallery-item';
    img.style.width = '100%';
    img.style.display = 'block';

    img.dataset.category = getCategory(i);

    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });

    allImages.push(img);
  }

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
    if (img.complete) {
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
