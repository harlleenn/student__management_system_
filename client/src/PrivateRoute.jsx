import { Navigate, Outlet } from "react-router";

export default function PrivateRoutes() {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/" />;
}