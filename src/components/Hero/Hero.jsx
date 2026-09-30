import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__image">
        <div className="hero__overlay"></div>

        <div className="hero__content">
          <p className="hero__label">SCHOOL LIBRARY</p>
          <h1>MAKTAB 230</h1>
          <p className="hero__description">
            Discover books, novels, stories and learning materials.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero