document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".slide");

  // If there are less than 2 slides, don't run slideshow
  if (slides.length < 2) {
    console.log("Not enough slides to run slideshow.");
    return;
  }

  let current = 0;

  function nextSlide() {
    // Remove active class from current slide
    slides[current].classList.remove("active");

    // Move to next slide (loop back to 0 at end)
    current = (current + 1) % slides.length;

    // Add active class to new slide
    slides[current].classList.add("active");
  }

  // Change slide every 5 seconds
  setInterval(nextSlide, 5000);

});
