function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Open a store',
      text: 'Create a shop with a name, description, and location so visitors can find you.',
    },
    {
      number: '02',
      title: 'Add products',
      text: 'List the items you want to rent. They appear in your store and the marketplace.',
    },
    {
      number: '03',
      title: 'Browse and save',
      text: 'Visitors explore stores, open product details, and save items they want to rent.',
    },
  ]

  return (
    <section className="how" id="how-it-works">
      <div className="section-heading">
        <p className="eyebrow">Simple process</p>
        <h2>How Rentify works</h2>
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
