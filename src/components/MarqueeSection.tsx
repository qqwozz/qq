const TECHS = ['Python', 'Go', 'C++', 'FastAPI', 'Django', 'gRPC', 'PostgreSQL', 'Redis', 'Docker', 'Linux', 'Git', 'Nginx']

export function MarqueeSection() {
  return (
    <div className="marquee-wrapper anim" aria-hidden="true">
      <div className="marquee">
        <div className="marquee-track">
          {TECHS.concat(TECHS).map((t, i) => (
            <span key={i} className="marquee-item">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
