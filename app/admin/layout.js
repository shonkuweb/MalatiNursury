export const metadata = {
  title: 'Admin Panel - Blooming Partners Nursery',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#1f6b2c' }}>Admin Panel</h1>
        <p style={{ margin: 0, color: '#666' }}>Manage your products here.</p>
      </header>
      {children}
    </div>
  );
}
