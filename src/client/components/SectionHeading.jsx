import React from 'react';

function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`section-heading text-${align} fade-up`} data-animate="stagger">
      {eyebrow && <p className="eyebrow text-uppercase">{eyebrow}</p>}
      {title && <h2 data-animate="split-lines">{title}</h2>}
      {description && <p>{description}</p>}
    </div>
  );
}

export default SectionHeading;
