"use client"

import { useState, useEffect } from "react";
import { getProductById } from "@/app/actions/product";

// Try to dynamically import the scanner to avoid SSR issues
import dynamic from 'next/dynamic';
// For the purpose of this migration, we'll use a simple mock or the global script approach
// If we had a specific react-qr component we could import it here.

export default function DistributorDashboard({ role }: { role: string }) {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // We load html5-qrcode from CDN to keep it simple and consistent with legacy, or we use the npm package
  useEffect(() => {
    if (scanning) {
      import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
        scanner.render(
          (decodedText) => {
            setProductId(decodedText);
            setScanning(false);
            scanner.clear();
            fetchProduct(decodedText);
          },
          (err) => { /* ignore */ }
        );
      });
    }
  }, [scanning]);

  async function fetchProduct(idToFetch: string = productId) {
    if (!idToFetch) return;
    setError(null);
    setProduct(null);
    
    const p = await getProductById(parseInt(idToFetch));
    if (p) {
      setProduct(p);
    } else {
      setError("Product not found");
    }
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    alert("Status update logic goes here. (Requires Server Action for Updating Stages)");
    // In a full implementation, you would call updateProductStatus(id, newOwner, newStage, location)
  }

  return (
    <div className="glass-card animate-fade-in animate-delay-1">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>🔍 Track & Update Product</h3>
      <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Scan a product ID to update its status in the supply chain.</p>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="number" 
          value={productId} 
          onChange={e => setProductId(e.target.value)} 
          placeholder="Enter Product ID" 
          className="form-control" 
        />
        <button onClick={() => fetchProduct()} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Search
        </button>
        <button onClick={() => setScanning(!scanning)} className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
          {scanning ? "Stop Scanner" : "📸 Scan QR"}
        </button>
      </div>

      <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: scanning ? 'block' : 'none' }}></div>

      {product && (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Product Details</h4>
          <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
            <div><small style={{ opacity: 0.7 }}>Name</small><br/><strong>{product.crop_name}</strong></div>
            <div><small style={{ opacity: 0.7 }}>Farmer</small><br/><strong>{product.farmer.username}</strong></div>
            <div><small style={{ opacity: 0.7 }}>Location</small><br/><strong>{product.location}</strong></div>
          </div>

          <hr style={{ borderColor: 'var(--surface-border)', marginBottom: '1.5rem' }} />

          <h4 style={{ marginBottom: '1rem' }}>Update Status</h4>
          <form onSubmit={handleUpdate}>
            <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Stage</label>
                <select className="form-control">
                  <option value="1">Distribution (1)</option>
                  <option value="2">Retail (2)</option>
                  <option value="3">Sold (3)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" placeholder="Update Location..." className="form-control" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Product Status</button>
          </form>
        </div>
      )}
    </div>
  );
}
