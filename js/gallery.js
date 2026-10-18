const gallery = document.querySelector(".gallery");
const images = [...document.querySelectorAll(".artwork img")];
const progressButtons = [...document.querySelectorAll(".progress-button")];
const slideTitle = document.querySelector(".slide-title");
const currentCount = document.querySelector(".current-count");
const counter = document.querySelector(".counter");
const playPauseButton = document.querySelector(".icon-button");
const titles = ["The Enforcer", "The Empire", "The Mask"];
const slideDuration = 6000;
let currentSlide = 0;
let isPlaying = true;
let timer;

function showSlide(index) {
  currentSlide = (index + images.length) % images.length;

  images.forEach((image, imageIndex) => {
    image.classList.toggle("is-active", imageIndex === currentSlide);
  });

  progressButtons.forEach((button) => button.classList.remove("is-active"));
  void gallery.offsetWidth;

  progressButtons.forEach((button, buttonIndex) => {
    const isCurrent = buttonIndex === currentSlide;
    button.classList.toggle("is-active", isCurrent);
    button.classList.toggle("is-complete", buttonIndex < currentSlide);

    if (isCurrent) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  slideTitle.textContent = titles[currentSlide];
  currentCount.textContent = String(currentSlide + 1).padStart(2, "0");
  counter.setAttribute("aria-label", `Image ${currentSlide + 1} of ${images.length}`);
  restartTimer();
}

function restartTimer() {
  clearTimeout(timer);
  if (isPlaying) {
    timer = setTimeout(() => showSlide(currentSlide + 1), slideDuration);
  }
}

function setPlaying(playing) {
  isPlaying = playing;
  gallery.classList.toggle("is-paused", !isPlaying);
  playPauseButton.setAttribute("aria-pressed", String(!isPlaying));
  playPauseButton.setAttribute("aria-label", isPlaying ? "Pause slideshow" : "Play slideshow");

  if (isPlaying) {
    showSlide(currentSlide);
  } else {
    restartTimer();
  }
}

progressButtons.forEach((button, index) => {
  button.addEventListener("click", () => showSlide(index));
});

playPauseButton.addEventListener("click", () => setPlaying(!isPlaying));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    showSlide(currentSlide + 1);
  } else if (event.key === "ArrowLeft") {
    showSlide(currentSlide - 1);
  } else if (
    event.code === "Space" &&
    !event.repeat &&
    !(event.target instanceof HTMLButtonElement)
  ) {
    event.preventDefault();
    setPlaying(!isPlaying);
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearTimeout(timer);
    gallery.classList.add("is-paused");
  } else {
    if (isPlaying) {
      gallery.classList.remove("is-paused");
    }
    showSlide(currentSlide);
  }
});

restartTimer();
