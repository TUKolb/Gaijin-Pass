import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '📖', title: 'Structured Guidebook', desc: 'Step-by-step guidance on admin registration, daily living, and social adaptation.' },
  { icon: '✅', title: 'Checklists', desc: 'Track your important setup tasks so nothing slips through the cracks.' },
  { icon: '💬', title: 'Community Posts', desc: 'Read and share real experiences from other foreigners living in Japan.' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '56px 0 48px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: 2, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 12 }}>
          Your starting point in Japan
        </p>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: -1, lineHeight: 1.2, marginBottom: 16 }}>
          Life in Japan,<br />simplified.
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 32px' }}>
          Gaijin Pass gives newcomers structured guidance, practical checklists, and a community of shared experiences to help you settle in with confidence.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/guidebook"><button className="btn btn-primary">Browse Guidebook</button></Link>
          <Link to="/posts"><button className="btn btn-secondary">See Community Posts</button></Link>
        </div>
      </section>

      <hr className="divider" />

      {/* Features */}
      <section className="grid-3" style={{ marginBottom: 48 }}>
        {FEATURES.map(f => (
          <div key={f.title} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA strip */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Ready to get started?</h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Create an account to post, comment, and track your checklist.</p>
        </div>
        <Link to="/register"><button className="btn btn-primary">Create Account</button></Link>
      </div>
    </div>
  )
}
