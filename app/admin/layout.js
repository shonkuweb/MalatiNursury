import AdminHeader from './components/AdminHeader';

export const metadata = {
  title: 'Malati Nursery Admin',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: '"Inter", system-ui, sans-serif',
      backgroundColor: '#f8faf9' 
    }}>
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
