import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../asset/image/smartdevice-logo.png";
import dashboardIcon from "../../../asset/image/dashboard-icon.png";
import historyIcon from "../../../asset/image/history-icon.png";
import statisticIcon from "../../../asset/image/statistic-icon.png";
import profileIcon from "../../../asset/image/user-icon.png";

const menuItems = [
  { path: "/dashboard",  icon: dashboardIcon,  label: "Dashboard"    },
  { path: "/statistics", icon: statisticIcon,   label: "Data Sensor"  },
  { path: "/history",    icon: historyIcon,     label: "History"      },
  { path: "/profile",    icon: profileIcon,     label: "Profile"      },
];

export const Sidebar = () => {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="Smart Weather Logo" />
        <span className="sidebar-logo-text">Smart{"\n"}Weather</span>
      </div>

      {/* Menu items */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              "sidebar-item" + (isActive ? " active" : "")
            }
          >
            <img src={item.icon} alt={item.label} className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
