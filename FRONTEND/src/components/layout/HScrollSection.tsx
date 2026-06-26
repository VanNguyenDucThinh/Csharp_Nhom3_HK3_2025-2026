// src/components/layout/HScrollSection.tsx
// Component dùng chung cho mọi section cuộn ngang kiểu Spotify

import { useRef, useState, useEffect } from "react";

interface Props {
  title: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}

export default function HScrollSection({ title, onSeeAll, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Kiểm tra bên trái để biết có cần hiện nút cuộn trái hay không.
    setCanScrollLeft(el.scrollLeft > 0);
    // Kiểm tra bên phải để biết còn sản phẩm nào chưa hiển thị hay không.
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Cuộn một khoảng cố định để người mới dễ hiểu cách điều hướng ngang hoạt động.
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <section style={styles.section}>
      {/* Header chỉ giữ tiêu đề và nút Hiện tất cả, không nhồi nút cuộn vào đây. */}
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onSeeAll && (
            <span style={styles.seeAll} onClick={onSeeAll}>
              Hiện tất cả
            </span>
          )}
        </div>
      </div>

      {/* Khung cuộn ngang: nút trái/phải đặt inline ngay trên hàng sản phẩm. */}
      <div style={styles.scrollShell}>
        <button
          style={{
            ...styles.arrowBtn,
            ...styles.leftArrowBtn,
            opacity: canScrollLeft ? 1 : 0.25,
            cursor: canScrollLeft ? "pointer" : "default",
          }}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          title="Trước"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div ref={scrollRef} style={styles.scrollRow} onScroll={checkScroll}>
          {children}
        </div>

        <button
          style={{
            ...styles.arrowBtn,
            ...styles.rightArrowBtn,
            opacity: canScrollRight ? 1 : 0.25,
            cursor: canScrollRight ? "pointer" : "default",
          }}
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          title="Tiếp"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { marginBottom: 40 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 800 },
  seeAll: {
    fontSize: 12,
    color: "#b3b3b3",
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollShell: {
    position: "relative",
  },
  arrowBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#3a3a3a",
    border: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
    transition: "background-color 0.15s, opacity 0.15s",
  },
  leftArrowBtn: {
    left: 0,
  },
  rightArrowBtn: {
    right: 0,
  },
  scrollRow: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE
    paddingBottom: 4,
  },
};
