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
    <section className="page-section hero-stats snap-target" data-animate="metrics">
      <div className="content-max">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-5">
            <div className="section-heading text-lg-start text-center fade-up" data-animate="stagger">
              <p className="eyebrow text-uppercase">impact at a glance</p>
              <h2>Growing a network of hope</h2>
              <p>Cause Connect helps NGOs gain visibility and support while empowering citizens to take action where it matters most.</p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row g-4 justify-content-center" data-animate="stagger-cards" data-stagger-target=".glass-panel">
              {STAT_BLOCKS.map((stat) => (
                <div className="col-6 col-md-4" key={stat.label}>
                  <div className="glass-panel p-4 text-center fade-up reveal-mask" data-animate="mask">
                    <div
                      className="display-5 fw-bold mb-2"
                      data-animate="counter"
                      data-counter-end={stat.end}
                      data-counter-suffix={stat.suffix}
                      data-counter-format={stat.format}
                    >
                      {`${formatNumber(stat.end, stat.format)}${stat.suffix}`}
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
