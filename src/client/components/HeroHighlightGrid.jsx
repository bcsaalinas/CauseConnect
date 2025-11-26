import React from 'react';
import { HERO_HIGHLIGHTS } from '../data';

function HeroHighlightGrid() {
  return (
    <div className="row g-4">
      {HERO_HIGHLIGHTS.map((item) => (
        <div className="col-12 col-md-6 col-xl-3" key={item.title}>
          <div className="glass-panel h-100 p-4 tilt-card">
            <div className="badge-soft mb-3">{item.label}</div>
            <h3 className="h5 mb-2">{item.title}</h3>
            <p className="mb-0">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}


export default HeroHighlightGrid;
