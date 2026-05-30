"use client"

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await registerAction(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="glass-card animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form action={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-control" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-control" required defaultValue="">
              <option value="" disabled>Select your role...</option>
              <option value="farmer">Farmer</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
