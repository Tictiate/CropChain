"use client"

import { useState, useEffect } from "react";
import { addProduct, getFarmerProducts } from "@/app/actions/product";

export default function FarmerDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getFarmerProducts();
    setProducts(data);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage({ text: "Processing...", type: 'success' });
    
    const res = await addProduct(formData);
    if (res?.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setMessage({ text: "Product added successfully!", type: 'success' });
      // @ts-ignore
      document.getElementById('addCropForm').reset();
      loadProducts();
    }
    setLoading(false);
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const locInput = document.getElementById("location") as HTMLInputElement;
          if (locInput) locInput.value = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        },
        (err) => alert("Geolocation error: " + err.message)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>🌱 Log Crop Produce</h3>
      
      {message && (
        <div style={{ 
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
          color: message.type === 'error' ? '#ef4444' : '#059669', 
          padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' 
        }}>
          {message.text}
        </div>
      )}

      <form id="addCropForm" action={handleSubmit}>
        <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Crop Name</label>
            <input type="text" name="cropName" placeholder="e.g. Organic Wheat" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Origin</label>
            <input type="text" name="origin" placeholder="e.g. Punjab Farm" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity (kg)</label>
            <input type="number" name="quantity" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Quality / Grade</label>
            <input type="text" name="quality" placeholder="e.g. Grade A" className="form-control" required />
          </div>
        </div>

        <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Expected Price (per kg)</label>
            <input type="number" step="0.01" name="price" className="form-control" required />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" id="location" name="location" placeholder="Waiting for location..." className="form-control" readOnly required />
              <button type="button" onClick={getLocation} className="btn btn-secondary" style={{ padding: '0 1rem' }}>
                📍
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
          {loading ? "Submitting..." : "Submit to Ledger"}
        </button>
      </form>

      <hr style={{ margin: '2.5rem 0', borderColor: 'var(--surface-border)' }} />
      
      <h3 style={{ marginBottom: '1.5rem' }}>📦 My Inventory</h3>
      <div className="grid grid-cols-1">
        {products.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No products found in your inventory.</p>
        ) : (
          products.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{p.crop_name} <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>(ID: {p.id})</span></h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}><strong>Quality:</strong> {p.quality} | <strong>Qty:</strong> {p.quantity}kg</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}><strong>Price:</strong> ₹{p.expected_price}</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Logged on: {new Date(p.logged_at).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                {/* QR Code Placeholder for now */}
                <div style={{ width: '80px', height: '80px', background: 'white', padding: '5px', borderRadius: '4px' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${p.id}`} alt="QR" style={{ width: '100%', height: '100%' }} />
                </div>
                <small style={{ display: 'block', marginTop: '0.2rem', opacity: 0.7 }}>Scan Me</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
