import React from 'react';
import {
  BookLogoIcon,
  ChartIcon,
  GridIcon,
  LibraryIcon,
  SettingsIcon,
} from './Icons';

interface SidebarProps {
  userName?: string;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon },
  { id: 'library', label: 'My Library', icon: LibraryIcon, active: true },
  { id: 'analytics', label: 'Analytics', icon: ChartIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ userName, onLogout }) => {
  return (
    <aside className="store-sidebar glass-panel">
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <BookLogoIcon />
        </span>
        <span>Bookify</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon, active }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-nav-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="sidebar-nav-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{userName?.charAt(0) ?? 'A'}</div>
          <div>
            <div className="sidebar-user-name">{userName ?? 'Guest'}</div>
            <div className="sidebar-user-role">Library Member</div>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
};
