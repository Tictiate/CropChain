import { prisma } from "@/lib/prisma";

export default async function DirectoryPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    select: { id: true, username: true, role: true, created_at: true }
  });

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
        <h2>👥 Network <span style={{ color: 'var(--primary)' }}>Directory</span></h2>
        <p style={{ opacity: 0.8 }}>View registered participants in the CropChain network.</p>
      </header>

      <div className="glass-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--primary-dark)' }}>Username</th>
                <th style={{ padding: '1rem', color: 'var(--primary-dark)' }}>Role</th>
                <th style={{ padding: '1rem', color: 'var(--primary-dark)' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{u.username}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                    <span style={{ 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      color: 'var(--secondary)', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
