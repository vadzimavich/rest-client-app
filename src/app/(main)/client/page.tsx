import PrivateRoute from "@/components/PrivateRoute";

export default function ClientPage() {
  return (
    <PrivateRoute>
      <h1>REST Client Page</h1>
      <p>This page is protected.</p>
    </PrivateRoute>
  );
}