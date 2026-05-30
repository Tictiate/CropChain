import { prisma } from "@/lib/prisma";

export default async function MarketplacePage() {
  const products = await prisma.cropLog.findMany({
    orderBy: { logged_at: 'desc' },
    include: { farmer: { select: { username: true } } }
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
        <h2>🌾 Open <span style={{ color: 'var(--primary)' }}>Marketplace</span></h2>
        <p style={{ opacity: 0.8 }}>Browse available crops directly from farmers.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No products available in the marketplace currently.</p>
        ) : (
          products.map((p, index) => (
            <div key={p.id} className={`glass-card animate-fade-in animate-delay-${(index % 3) + 1}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{p.crop_name}</h3>
                <span style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  ₹{p.expected_price}/kg
                </span>
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1rem' }}>by <strong>{p.farmer.username}</strong></p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                <div><strong>Quality:</strong><br/>{p.quality}</div>
                <div><strong>Quantity:</strong><br/>{p.quantity}kg</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Location:</strong><br/>{p.location}</div>
              </div>

              <button className="btn btn-secondary" style={{ width: '100%' }}>Contact Farmer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
