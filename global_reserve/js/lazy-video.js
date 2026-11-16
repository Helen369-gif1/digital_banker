// Deferred video loading. Videos marked with data-src (Screen 4.5 and Screen 10)
// do not download when the page opens: the real src is assigned only once the
// video is within roughly one and a half screens of the viewport, so the hero
// video gets the whole connection first. Nothing else about the videos changes:
// autoplay, muted, loop, playsinline and the poster keep working as before.
// A video that is display:none (Screen 10 on narrow screens and under reduced
// motion, where its poster is used instead) never intersects, so it is never
// downloaded at all.
(function () {
  const videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  function load(video) {
    video.src = video.getAttribute('data-src');
    video.removeAttribute('data-src');
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach(load);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        load(entry.target);
      });
    },
    { rootMargin: '150% 0px' }
  );
  videos.forEach((video) => observer.observe(video));
})();
