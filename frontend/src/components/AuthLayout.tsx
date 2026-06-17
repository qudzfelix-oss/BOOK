import React from 'react';

export const AuthDecor: React.FC = () => (
  <div className="auth-decor" aria-hidden="true">
    <div className="auth-glow auth-glow-left" />
    <div className="auth-glow auth-glow-right" />
    <div className="auth-book auth-book-one" />
    <div className="auth-book auth-book-two" />
    <div className="auth-book auth-book-three" />
    <div className="auth-particle auth-particle-one" />
    <div className="auth-particle auth-particle-two" />
    <div className="auth-particle auth-particle-three" />
    <div className="auth-particle auth-particle-four" />
  </div>
);

interface AuthShellProps {
  title: string;
  subtitle: string;
  cardTitle: string;
  cardSubtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  cardTitle,
  cardSubtitle,
  children,
  footer,
}) => (
  <div className="auth-scene">
    <AuthDecor />
    <div className="auth-content">
      <p className="auth-welcome">{title}</p>
      <h1 className="auth-brand-title">Bookify</h1>
      <p className="auth-brand-subtitle">{subtitle}</p>

      <div className="auth-glass-card glass-panel">
        <div className="auth-card-heading">{cardTitle}</div>
        <div className="auth-card-sub">{cardSubtitle}</div>
        {children}
        <div className="auth-footer">{footer}</div>
      </div>
    </div>
  </div>
);
