/**
 * Kênh scroll dùng chung cho mọi hiệu ứng theo vị trí cuộn (parallax, hero, header...).
 *
 * 1) subscribeScroll: SmoothScroll gọi emitScroll() ngay trong sự kiện "scroll" của Lenis — CÙNG frame
 *    mà Lenis vừa đổi vị trí trang. Nếu mỗi hiệu ứng tự nghe window "scroll" rồi đợi requestAnimationFrame,
 *    transform sẽ luôn trễ 1 frame so với trang → ảnh/chữ bị rung.
 *
 * 2) onLayoutChange + pageTop: đo vị trí phần tử MỘT LẦN và chỉ đo lại khi trang đổi kích thước
 *    (resize, ảnh tải xong, accordion mở...). Trong lúc cuộn, mỗi frame chỉ còn phép trừ với scrollY —
 *    không gọi getBoundingClientRect, không ép trình duyệt tính lại style/bố cục giữa các lần ghi transform.
 */
const subscribers = new Set();

export function subscribeScroll(fn) {
  subscribers.add(fn);
  fn();
  return () => subscribers.delete(fn);
}

export function emitScroll() {
  subscribers.forEach((fn) => fn());
}

/** Toạ độ mép trên phần tử tính từ đầu trang, bỏ qua transform (không bị parallax/animation làm lệch). */
export function pageTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

const layoutSubscribers = new Set();
let observer = null;
let raf = 0;

function flushLayout() {
  raf = 0;
  layoutSubscribers.forEach((fn) => fn());
}
function scheduleLayout() {
  if (!raf) raf = requestAnimationFrame(flushLayout);
}

/** Gọi fn ngay và mỗi khi bố cục trang thay đổi (gộp nhiều thay đổi trong 1 frame thành 1 lần). */
export function onLayoutChange(fn) {
  layoutSubscribers.add(fn);
  if (!observer && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(scheduleLayout);
    observer.observe(document.body);
    window.addEventListener("resize", scheduleLayout);
  }
  fn();
  return () => {
    layoutSubscribers.delete(fn);
    if (!layoutSubscribers.size && observer) {
      observer.disconnect();
      observer = null;
      window.removeEventListener("resize", scheduleLayout);
    }
  };
}
