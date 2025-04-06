import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return session ? <Outlet /> : <Navigate to="/login" />;
};

export function PublicOnlyRoute() {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return !session ? <Outlet /> : <Navigate to="/home" />;
}
