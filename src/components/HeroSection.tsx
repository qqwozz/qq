import { Ref } from 'react'

interface HeroProps {
  heroTitleRef: Ref<HTMLHeadingElement>
  heroSubRef: Ref<HTMLParagraphElement>
  scrollIndicatorRef: Ref<HTMLDivElement>
}

export function HeroSection({ heroTitleRef, heroSubRef, scrollIndicatorRef }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-particles" aria-hidden="true">
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title" ref={heroTitleRef}>Дима Киселев</h1>
        <p className="hero-subtitle" ref={heroSubRef}></p>
      </div>
      <div className="scroll-indicator" ref={scrollIndicatorRef}>
        <div className="scroll-line" aria-hidden="true" />
      </div>
    </section>
  )
}
