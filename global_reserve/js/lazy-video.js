// Deferred video loading. Videos marked with data-src (Screen 4.5 and Screen 10)
// do not download when the page opens: the real src is assigned only once the
// video is within roughly one and a half screens of the viewport, so the hero
// video gets the whole connection first. A video that is display:none (Screen 10
// on narrow screens and under reduced motion, where its poster is used instead)
// never intersects, so it is never downloaded at all.
//
// Smoothness: the file is loaded early, but it must not PLAY early. Autoplay would
// start decoding it the moment it arrives, while it is still off-screen, competing
// with the hero video's scroll scrubbing. So when the source is set off-screen,
// playback is paused, and it is switched on only while the video's screen is in
// view (and off again when it leaves) — the same section-level visibility rule
// that js/video-reveal.js uses for Screen 4.5. Under reduced motion nothing is
// played here.
(function () {
  const videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScreen(video) {
    const r = video.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }

  function load(video) {
    video.src = video.getAttribute('data-src');
    video.removeAttribute('data-src');
    if (!onScreen(video)) video.pause();   // cancels autoplay while off-screen; the observer below starts it later
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach((video) => { video.src = video.getAttribute('data-src'); video.removeAttribute('data-src'); });
    return;
  }

  const loader = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loader.unobserve(entry.target);
        load(entry.target);
      });
    },
    { rootMargin: '150% 0px' }
  );

  // Plays while its screen is in view, pauses when it is out of view.
  const owners = new Map();   // section element -> its lazy video
  const player = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = owners.get(entry.target);
        if (!video || video.hasAttribute('data-src') || reduceMotion) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    },
    { threshold: 0 }
  );

  videos.forEach((video) => {
    loader.observe(video);
    const section = video.closest('section');
    if (section) { owners.set(section, video); player.observe(section); }
  });
})();
