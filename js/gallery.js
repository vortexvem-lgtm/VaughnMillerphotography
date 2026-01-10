const gallery = document.getElementById('gallery');

// How many images are in your folder
const totalImages = 6; // <-- update this if you add more

for (let i = 1; i <= totalImages; i++) {
  const img = document.createElement('img');
  img.src = `images/gallery/${i}.jpg`; // 1.jpg, 2.jpg, etc.
  img.alt = `Artwork ${i}`;
  img.className = "gallery-item";

  gallery.appendChild(img);
}

