import React from 'react';

export default function HomePage({
  onStartAnalyzing,
  onSeeSample,
  setCurrentView
}) {
  const outputPills = [
    'Summary',
    'Features',
    'Tech stack',
    'Architecture',
    'Roadmap',
    'Questions',
    'Estimate',
    'Proposal'
  ];

  const featureCards = [
    {
      title: 'Instant analysis',
      desc: 'Requirements turned into a clear project summary.'
    },
    {
      title: 'Plan and stack',
      desc: 'Features, technologies, architecture and roadmap.'
    },
    {
      title: 'Ask better questions',
      desc: 'Smart questions to clear up gaps with your client.'
    },
    {
      title: 'Proposal in one click',
      desc: 'Timeline, pricing and a professional proposal.'
    }
  ];

  return (
    <div className="fm-home-wrapper">
      <div className="fm-container">
        {/* Hero Section */}
        <section className="fm-hero-grid">
          {/* Left Column: Headline & Action Buttons */}
          <div className="fm-hero-left">
            <div className="fm-badge-pill">
              AI planning for freelancers
            </div>

            <h1 className="fm-hero-headline">
              Turn a client <br />
              message into a <span className="fm-gradient-text">full</span> <br />
              <span className="fm-gradient-text">project plan.</span>
            </h1>

            <p className="fm-hero-subtext">
              Paste what your client sent. Get a summary, features, tech
              stack, roadmap, estimate and a ready-to-send proposal.
            </p>

            <div className="fm-hero-actions">
              <button
                type="button"
                className="fm-btn-primary fm-hero-btn-primary"
                onClick={onStartAnalyzing}
              >
                Start analyzing
              </button>

              <button
                type="button"
                className="fm-btn-secondary fm-hero-btn-secondary"
                onClick={onSeeSample}
              >
                See a sample
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Visual Showcase Card */}
          <div className="fm-hero-right">
            <div className="fm-preview-card">
              <div className="fm-card-section">
                <span className="fm-section-label">CLIENT MESSAGE</span>
                <div className="fm-client-bubble">
                  Hi, we need a website for our bakery with online ordering and delivery
                  slots...
                </div>
              </div>

              <div className="fm-card-section" style={{ marginTop: '1.25rem' }}>
                <span className="fm-section-label">AI OUTPUT</span>
                <div className="fm-pills-wrap">
                  {outputPills.map((pill, idx) => (
                    <span
                      key={idx}
                      className="fm-output-pill"
                      onClick={onSeeSample}
                      title={`Preview sample ${pill}`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom 4 Feature Cards */}
        <section className="fm-features-grid">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="fm-feature-item-card"
              onClick={() => setCurrentView('features')}
              role="button"
              tabIndex={0}
            >
              <h3 className="fm-feature-card-title">{card.title}</h3>
              <p className="fm-feature-card-desc">{card.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
