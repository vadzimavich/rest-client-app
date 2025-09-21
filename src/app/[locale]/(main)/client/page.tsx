import PrivateRoute from '@/components/PrivateRoute';
import ClientUI from '@/components/clientUI/ClientUI';

export default function ClientPage() {
  return (
    <PrivateRoute>
      <ClientUI />
    </PrivateRoute>
  );
}
