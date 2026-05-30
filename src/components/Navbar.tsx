import Link from 'next/link';
import { auth } from '@/auth';
import styles from './Navbar.module.css';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className={`glass ${styles.navbar}`}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logo}>
          <Link href="/">
            <strong>🌿 CropChain</strong>
          </Link>
        </div>
        
        <div className={styles.navLinks}>
          {session ? (
            <>
              <Link href="/dashboard" className={styles.link}>Dashboard</Link>
              <Link href="/marketplace" className={styles.link}>Marketplace</Link>
              <Link href="/directory" className={styles.link}>Directory</Link>
              <span className={styles.userRole}>
                {session.user.name} ({session.user.role})
              </span>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.link}>Login</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
