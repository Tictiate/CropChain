import Link from 'next/link';

export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Transparency from Farm to Fork
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--foreground)', opacity: 0.8, marginBottom: '2.5rem' }}>
          A blockchain-based ecosystem ensuring fair pricing, traceability, and trust for farmers, distributors, and consumers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3" style={{ textAlign: 'left', marginTop: '2rem' }}>
        <div className="glass-card animate-fade-in animate-delay-1">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>🚜 For Farmers</h3>
          <p style={{ opacity: 0.8 }}>
            Log your produce immutably and get fair market prices instantly. Upload photos to verify crop quality directly from the field.
          </p>
        </div>
        
        <div className="glass-card animate-fade-in animate-delay-2">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>🚚 For Distributors</h3>
          <p style={{ opacity: 0.8 }}>
            Track shipments and manage inventory with real-time geolocation. Scan QR codes for instant provenance data and history.
          </p>
        </div>
        
        <div className="glass-card animate-fade-in animate-delay-3">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>🛒 For Retailers</h3>
          <p style={{ opacity: 0.8 }}>
            Verify quality and origin to provide the best products to consumers. Ensure transparency at the final stage of the supply chain.
          </p>
        </div>
      </div>
    </div>
  );
}
