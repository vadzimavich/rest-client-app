import PrivateRoute from "@/components/PrivateRoute";

export default function VariablesPage() {
  return (
    <PrivateRoute>
      <h1>Variables Page</h1>
      <p>This page is protected.</p>
    </PrivateRoute>
  );
}