import PrivateRoute from '@/components/privateRoute/PrivateRoute';
import ClientUI from '@/components/clientUI/ClientUI';

export default function ClientPage() {
  return (
    <PrivateRoute>
      <ClientUI />
    </PrivateRoute>
  );
}
