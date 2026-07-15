'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '../LogoutButton';

export default function AdminHeader() {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') return null;

  return (
    <header style={{ 
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: '24px 32px', 
      marginBottom: '32px', 
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      gap: '16px'
    }}>
      <div>
        <h1 style={{ 
          margin: 0, 
          color: '#1f6b2c', 
          fontSize: '1.8rem', 
          fontWeight: '800',
          letterSpacing: '-0.02em'
        }}>
          Malati Nursery
        </h1>
        <p style={{ 
          margin: '4px 0 0 0', 
          color: '#666',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          Admin Dashboard
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link href="/admin/change-password" style={{
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem',
          transition: 'all 0.2s',
          border: '1px solid #ddd'
        }}>
          Change Password
        </Link>
        <Link href="/" style={{
          padding: '10px 20px',
          backgroundColor: '#eaf4ee',
          color: '#1f6b2c',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem',
          transition: 'all 0.2s',
          border: '1px solid #cde2d3'
        }}>
          View Store
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
