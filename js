gsap.registerPlugin(Draggable, InertiaPlugin);

var cards = gsap.utils.toArray(".creative-pro"),
    dragDistancePerRotation = 3000,
    radius = 520,
    proxy = document.createElement("div"), // just a dummy element that'll get dragged, but we don't care about it.
    progressWrap = gsap.utils.wrap(0, 1),
    spin = gsap.fromTo(cards, {
      rotationY: i => i * 360 / cards.length
    }, {
      rotationY: "-=360",
      duration: 20,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50% " + -radius + "px"
    }),
    startProgress;

Draggable.create(proxy, {
  trigger: ".demoWrapper", // activate the dragging when the user presses on the .demoWrapper
  type: "x", // we only care about movement on the x-axis.
  inertia: true,
  allowNativeTouchScrolling: true,
  onPress() {
    gsap.killTweensOf(spin); // if it's in the middle of animating the spin back to timeScale: 1, kill that.
    spin.timeScale(0); // stop the spin.
    startProgress = spin.progress(); // remember the current progress value because we'll make the drag relative to that.
  },
  onDrag: updateRotation,
  onThrowUpdate: updateRotation,
  onRelease() {
    if (!this.tween || !this.tween.isActive()) { // if the user clicked and released (no inertia flick), resume the spin
      gsap.to(spin, {timeScale: 1, duration: 1});
    }
  },
  onThrowComplete() { // resume the spin after the inertia tween finishes
    gsap.to(spin, {timeScale: 1, duration: 1});
  }
});

function updateRotation() {
  let p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
  spin.progress(progressWrap(p));
}
