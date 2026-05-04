import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppSelector } from "../../store/hooks";
import { spinner } from "../../../App";

export const Layout = () => {
  const loading = useAppSelector((state) => state.spinner.loading);
  return (
    <div className="app-layout">
      {loading && spinner}
      <Sidebar />
      <div className="app-content">
        <Header />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
