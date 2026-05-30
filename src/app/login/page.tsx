"use client"

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    formData.append("redirectTo", "/dashboard");
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="glass-card animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
        
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
