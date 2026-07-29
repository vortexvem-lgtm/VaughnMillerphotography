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

// 🔥 REPO INFO — update if you ever rename the repo or change branch
const REPO_OWNER = "vortexvem-lgtm";
const REPO_NAME = "VaughnMillerphotography";
const BRANCH = "main"; // change to "master" if that's your default branch

// 🔥 CATEGORY FOLDERS — one subfolder per category, nothing else to edit
const categoryFolders = {
  Street: "images/gallery/street",
  Portraits: "images/gallery/portrait",
  Other: "images/gallery/other"
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

function isImageFile(filename) {
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}


// COLUMN COUNT
function getColumnCount() {
  const w = window.innerWidth;
  if (w < 600) return 1;
  if (w < 900) return 2;
  return 3;
}


// FETCH ONE FOLDER'S CONTENTS FROM GITHUB
async function fetchFolder(path) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Could not load folder: ${path} (status ${res.status})`);
      return [];
    }
    const data = await res.json();
    return data
      .filter(item => item.type === "file" && isImageFile(item.name))
      .map(item => item.download_url);
  } catch (err) {
    console.warn(`Error loading folder: ${path}`, err);
    return [];
  }
}


// BUILD IMAGE ELEMENTS FROM A LIST OF URLS + CATEGORY
function buildImages(urls, category) {
  return urls.map(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.className = 'gallery-item';
    img.style.width = '100%';
    img.style.display = 'block';
    img.dataset.category = category;

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

    return img;
  });
}


// LOAD ALL CATEGORIES
async function loadAllImages() {
  const entries = Object.entries(categoryFolders);

  const results = await Promise.all(
    entries.map(([category, path]) => fetchFolder(path))
  );

  results.forEach((urls, i) => {
    const [category] = entries[i];
    allImages.push(...buildImages(urls, category));
  });

  filteredImages = [...allImages];
  applyFilter();
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
loadAllImages();


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
