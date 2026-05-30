import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FarmerDashboard from "@/components/FarmerDashboard";
import DistributorDashboard from "@/components/DistributorDashboard";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const { role, name } = session.user;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
        <h2>Welcome back, <span style={{ color: 'var(--primary)' }}>{name}</span></h2>
        <p style={{ opacity: 0.8 }}>Role: <strong style={{ textTransform: 'capitalize' }}>{role}</strong></p>
      </header>

      {(role === 'farmer' || role === 'admin') && <FarmerDashboard />}
      
      {(role === 'distributor' || role === 'retailer' || role === 'admin') && (
        <div style={{ marginTop: '3rem' }}>
          <DistributorDashboard role={role} />
        </div>
      )}
    </div>
  );
}
