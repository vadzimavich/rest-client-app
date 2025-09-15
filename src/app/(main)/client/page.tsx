import PrivateRoute from "@/components/PrivateRoute";
import ClientUI from "@/components/ClientUI";

export default function ClientPage() {
  return (
    <PrivateRoute>
      <ClientUI />
    </PrivateRoute>
  );
}
