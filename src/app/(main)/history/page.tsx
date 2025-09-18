import PrivateRoute from '@/components/PrivateRoute';

export default function HistoryPage() {
  return (
    <PrivateRoute>
      <h1>History Page</h1>
      <p>This page is protected.</p>
    </PrivateRoute>
  );
}
