function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Find what fits your plans',
      text: 'Browse real listings, compare daily prices, and open an item to check its details.',
    },
    {
      number: '02',
      title: 'Choose your dates',
      text: 'Send a rental request with the dates and information asked for at checkout.',
    },
    {
      number: '03',
      title: 'Hear back from the owner',
      text: 'The store owner reviews your request and lets you know whether it is approved.',
    },
  ]

  return (
    <section className="how" id="how-it-works" aria-labelledby="how-heading">
      <div className="section-heading how-heading">
        <p className="eyebrow">A few simple steps</p>
        <h2 id="how-heading">Renting, made straightforward.</h2>
        <p className="section-description">No need to buy something you will only use once. Start with what you need.</p>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <article className="step-card" key={step.number}>
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
