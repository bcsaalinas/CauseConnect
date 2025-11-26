import React from 'react';
import { STAT_BLOCKS } from '../data';

const formatNumber = (value, format) => {
  if (format === "compact") {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
      value
    );
  }
  return value.toLocaleString("en-US");
};

function HeroStats() {
  return (
    <section className="page-section hero-stats snap-target">
      <div className="content-max">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-5">
            <div className="section-heading text-lg-start text-center">
              <p className="eyebrow text-uppercase">impact at a glance</p>
              <h2>Growing a network of hope</h2>
              <p>Cause Connect helps NGOs gain visibility and support while empowering citizens to take action where it matters most.</p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row g-4 justify-content-center">
              {STAT_BLOCKS.map((stat) => (
                <div className="col-6 col-md-4" key={stat.label}>
                  <div className="glass-panel p-4 text-center reveal-mask stat-item">
                    <div
                      className="display-5 fw-bold mb-2 stat-value"
                      data-value={stat.end}
                      data-suffix={stat.suffix}
                    >
                      {stat.suffix ? `0${stat.suffix}` : '0'}
                    </div>
                    <p className="mb-0 small text-muted text-uppercase">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default HeroStats;
