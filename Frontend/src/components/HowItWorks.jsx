function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Find the right thing',
      text: 'Search listings and compare daily prices before choosing what suits your plans.',
    },
    {
      number: '02',
      title: 'Send a rental request',
      text: 'Choose your dates and share the details needed to arrange your rental.',
    },
    {
      number: '03',
      title: 'Get the owner’s answer',
      text: 'The store owner reviews your request. Your rental is not confirmed until it is approved.',
    },
  ]

  return (
    <section className="how" id="how-it-works" aria-labelledby="how-heading">
      <div className="how-intro">
        <p className="eyebrow">HOW RENTIFY WORKS</p>
        <h2 id="how-heading">Less buying. More doing.</h2>
        <p className="section-description">A straightforward way to get the things you need, only for the time you need them.</p>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <article className="step-card" key={step.number}>
            <span className="step-number" aria-hidden="true">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
