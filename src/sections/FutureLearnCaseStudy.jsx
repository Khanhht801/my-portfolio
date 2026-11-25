import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import futurelearnImage from '../../image/futurelearn.png';

function Icon({ name }) {
  const paths = {
    code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18" /></>,
    layers: <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />,
    math: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1" /></>,
    book: <><path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2V3Z" /><path d="m6 7 3 .7m6 0 3-.7" /></>,
    screen: <><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    server: <><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" /></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0" /></>,
    bulb: <><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" /><path d="M12 1v1M2 9H1m22 0h-1M4 3l1 1m14 0 1-1" /></>,
    external: <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg className="case-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function SectionTitle({ number, children, id }) {
  return <h3 className="case-dialog__section-title" id={id}><span>{number} /</span> {children}</h3>;
}

function FeatureImage({ viewBox, label }) {
  return <figure className="case-dialog__feature-image">
    <svg viewBox={viewBox} role="img" aria-label={label}>
      <image href={futurelearnImage} width="1881" height="1160" />
    </svg>
  </figure>;
}

export default function FutureLearnCaseStudy({ onClose }) {
  const dialogRef = useRef(null);
  const backdropStart = useRef(false);

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} className="case-dialog" aria-labelledby="case-title" onClose={onClose}
      onPointerDown={(event) => { backdropStart.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (event.target === event.currentTarget && (backdropStart.current || event.detail === 0)) event.currentTarget.close();
        backdropStart.current = false;
      }}>
      <div className="case-dialog__surface">
        <header className="case-dialog__top">
          <span>CASE STUDY / FUTURELEARN</span>
          <button className="case-dialog__close" type="button" aria-label="Đóng case study" onClick={() => dialogRef.current.close()}><Icon name="close" /></button>
        </header>
        <div className="case-dialog__content">
          <div className="case-dialog__intro">
            <h2 id="case-title">Học tập vui hơn cùng <span>FutureLearn.</span></h2>
            <p>Nền tảng học tiếng Anh và Toán dành cho trẻ mầm non, tiểu học, đồng hành cùng phụ huynh trong quá trình theo dõi việc học của con.</p>
            <ul className="case-dialog__meta" aria-label="Thông tin dự án">
              <li><Icon name="code" />Fullstack Developer</li>
              <li><Icon name="calendar" />2026</li>
              <li><Icon name="layers" />Dự án học tập</li>
            </ul>
          </div>
          <figure className="case-dialog__overview">
            <div className="case-dialog__browser" aria-hidden="true"><i /><i /><i /><span>future-learn.khanhht.tech</span><Icon name="external" /></div>
            <img src={futurelearnImage} width="1881" height="1160" alt="Toàn cảnh giao diện FutureLearn với Hành tinh Toán, Đảo tiếng Anh và mục tiêu học tập" />
          </figure>
          <div className="case-dialog__details">
            <section aria-labelledby="case-problem"><SectionTitle number="01" id="case-problem">Bài toán</SectionTitle><p>Dự án hướng đến hai nhu cầu: giúp trẻ tiếp cận bài học tiếng Anh và Toán qua giao diện trực quan, đồng thời giúp phụ huynh theo dõi tiến độ học tập của con.</p></section>
            <section aria-labelledby="case-role"><SectionTitle number="02" id="case-role">Đóng góp</SectionTitle><ul className="case-dialog__list"><li>Tham gia phát triển ứng dụng với vai trò Fullstack Developer.</li><li>Tập trung vào trải nghiệm học tập và cách tổ chức thông tin cho trẻ.</li><li>Kết nối nhu cầu học của trẻ với việc theo dõi tiến độ của phụ huynh.</li></ul></section>
          </div>
          <section className="case-dialog__section" aria-labelledby="case-features">
            <SectionTitle number="03" id="case-features">Điểm nổi bật</SectionTitle>
            <div className="case-dialog__feature">
              <FeatureImage viewBox="335 410 515 450" label="Chi tiết thẻ Hành tinh Toán trong giao diện FutureLearn" />
              <div><h4><Icon name="math" />Hành tinh Toán</h4><p>Không gian khám phá Toán với hình ảnh vũ trụ sinh động. Thẻ nội dung hiển thị tiến độ để trẻ dễ nhận biết hành trình học của mình.</p></div>
            </div>
            <div className="case-dialog__feature">
              <FeatureImage viewBox="875 410 515 450" label="Chi tiết thẻ Đảo tiếng Anh trong giao diện FutureLearn" />
              <div><h4><Icon name="book" />Đảo tiếng Anh</h4><p>Chủ đề hòn đảo đầy màu sắc giúp việc tiếp cận tiếng Anh trở nên gần gũi. Nội dung và tiến độ được trình bày rõ ràng ngay trên góc học tập.</p></div>
            </div>
          </section>
          <section className="case-dialog__section" aria-labelledby="case-lessons">
            <SectionTitle number="04" id="case-lessons">Hướng phát triển</SectionTitle>
            <div className="case-dialog__lesson"><Icon name="bulb" /><p>FutureLearn là dự án thực hành xây dựng sản phẩm web dành cho trẻ em. Hướng phát triển tiếp theo là hoàn thiện trải nghiệm học và cách thể hiện tiến độ, để sản phẩm dễ sử dụng hơn với cả trẻ và phụ huynh.</p></div>
          </section>
          <footer className="case-dialog__bottom"><a href="https://future-learn.khanhht.tech" target="_blank" rel="noopener noreferrer"><Icon name="external" />Xem demo</a><button type="button" onClick={() => dialogRef.current.close()}>Quay lại dự án</button></footer>
        </div>
      </div>
    </dialog>, document.body
  );
}
