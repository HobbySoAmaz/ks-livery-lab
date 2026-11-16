import { useEffect, useMemo, useState } from "react";
import {
  Menu, Bell, Home, Ticket, Car, Cloud, Image,
  Users, Settings, RefreshCw, UploadCloud,
  FileText, CheckCircle2, Activity, Zap,
  ChevronRight, MoreHorizontal, LogOut, ShieldCheck,
  LoaderCircle, AlertCircle
} from "lucide-react";
import "./App.css";

type DiscordUser = {
  id: string;
  username: string;
  avatar: string | null;
  roles: string[];
};

type Permissions = {
  is_member: boolean;
  is_admin: boolean;
  is_moderator: boolean;
  create_ticket: boolean;
  view_own_tickets: boolean;
  view_all_tickets: boolean;
  moderate_tickets: boolean;
  generate_renders: boolean;
  manage_users: boolean;
  cloud_controls: boolean;
};

type MeResponse = {
  authenticated: boolean;
  user: DiscordUser;
  permissions: Permissions;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const allNavigation = [
  { name: "Dashboard", icon: Home, allowed: (_p: Permissions) => true },
  { name: "Tickets", icon: Ticket, allowed: (p: Permissions) => p.view_own_tickets || p.view_all_tickets },
  { name: "Catalogue", icon: Car, allowed: (_p: Permissions) => true },
  { name: "Rendering", icon: Image, allowed: (p: Permissions) => p.generate_renders },
  { name: "Cloud", icon: Cloud, allowed: (p: Permissions) => p.cloud_controls },
  { name: "Members", icon: Users, allowed: (p: Permissions) => p.manage_users },
  { name: "Settings", icon: Settings, allowed: (p: Permissions) => p.is_admin },
];

const emptyPermissions: Permissions = {
  is_member: false, is_admin: false, is_moderator: false,
  create_ticket: false, view_own_tickets: false, view_all_tickets: false,
  moderate_tickets: false, generate_renders: false, manage_users: false,
  cloud_controls: false,
};

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = useMemo(
    () => session ? allNavigation.filter(item => item.allowed(session.permissions)) : [],
    [session]
  );

  async function loadSession() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (response.status === 401) {
        setSession(null);
        return;
      }
      if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`);
      const data = await response.json() as MeResponse;
      setSession(data);
      if (!data.permissions?.is_admin && !data.permissions?.view_all_tickets && page === "Tickets") {
        setPage("Dashboard");
      }
    } catch (err) {
      setSession(null);
      setError(err instanceof Error ? err.message : "Unable to contact the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadSession(); }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch(`${API_BASE}/auth/discord/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setSession(null);
      setPage("Dashboard");
      setLoggingOut(false);
    }
  }

  if (loading) {
    return <div className="auth-screen"><div className="auth-card"><div className="brand-logo">KS<span>↗</span></div><div className="brand-sub">LIVERY LAB</div><LoaderCircle className="loading-spinner" size={28} /><p>Checking your Discord session…</p></div></div>;
  }

  if (!session) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="brand-logo">KS<span>↗</span></div>
          <div className="brand-sub">LIVERY LAB</div>
          <div className="auth-emblem"><ShieldCheck size={30} /></div>
          <span className="eyebrow">KS MOTORSPORT / CONTROL CENTER</span>
          <h1>Welcome to Livery Lab</h1>
          <p className="auth-description">Sign in with Discord to access your team's workspace. Access is limited to verified members of the KS Livery Lab server.</p>
          {error && <div className="auth-error"><AlertCircle size={16} /><span>{error}. Make sure the FastAPI backend is running.</span></div>}
          <a className="discord-login" href={`${API_BASE}/auth/discord/login`}>
            <span className="discord-mark">D</span> Continue with Discord
          </a>
          <button className="retry-btn" onClick={() => void loadSession()}>Retry connection</button>
          <span className="auth-footnote">SECURE DISCORD AUTHENTICATION</span>
        </div>
      </div>
    );
  }

  const { user, permissions } = session;
  const active = navigation.find(item => item.name === page);
  const PageIcon = active?.icon || Home;
  const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=96` : "";

  return (
    <div className="app">
      <header className="header">
        <button className="icon-btn" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
        <div className="brand"><div className="brand-logo">KS<span>↗</span></div><div className="brand-sub">LIVERY LAB</div></div>
        <div className="profile-actions">
          <button className="icon-btn notification" aria-label="Notifications"><Bell /><span className="notification-dot" /></button>
          <div className="user-chip" title={user.username}>
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <span className="avatar-fallback">{user.username.slice(0, 1).toUpperCase()}</span>}
            <span>{user.username}</span>
          </div>
          <button className="icon-btn logout-btn" aria-label="Log out" title="Log out" disabled={loggingOut} onClick={() => void logout()}><LogOut /></button>
        </div>
      </header>

      <main className="main">
        <div className="page-heading">
          <span className="eyebrow">KS MOTORSPORT / CONTROL CENTER</span>
          <h1>{page}</h1>
          <p>Welcome back, {user.username}.</p>
          <div className="role-line"><ShieldCheck size={14} /> {permissions.is_admin ? "Dashboard Administrator" : permissions.is_moderator ? "Ticket Moderator" : "Server Member"}</div>
        </div>

        {page === "Dashboard" ? (
          <>
            <section className="status-card">
              <div className="discord-icon">D</div>
              <div className="status-info"><span>Discord Bot Status</span><strong><i className="online-dot" /> Backend session active</strong></div>
              <div className="uptime"><span>ACCESS</span><strong>{permissions.is_admin ? "ADMIN" : "MEMBER"}</strong></div>
            </section>
            <section className="stats">
              <div className="stat-card red"><Ticket /><span>{permissions.view_all_tickets ? "All Tickets" : "My Tickets"}<strong>—</strong></span></div>
              {permissions.generate_renders && <div className="stat-card purple"><Image /><span>Rendering<strong>—</strong></span></div>}
              {permissions.manage_users && <div className="stat-card blue"><Users /><span>Members<strong>—</strong></span></div>}
            </section>
            <section className="panel">
              <div className="panel-title"><h2><Activity /> Account Access</h2></div>
              <div className="permission-list">
                <div><span>Discord account</span><strong>{user.username}</strong></div>
                <div><span>Create tickets</span><strong>{permissions.create_ticket ? "Allowed" : "Not allowed"}</strong></div>
                <div><span>View all tickets</span><strong>{permissions.view_all_tickets ? "Allowed" : "Own tickets only"}</strong></div>
                <div><span>Ticket moderation</span><strong>{permissions.moderate_tickets ? "Allowed" : "Not allowed"}</strong></div>
                <div><span>Render generation</span><strong>{permissions.generate_renders ? "Allowed" : "Not allowed"}</strong></div>
                <div><span>Cloud controls</span><strong>{permissions.cloud_controls ? "Allowed" : "Not allowed"}</strong></div>
              </div>
            </section>
            <section className="panel">
              <div className="panel-title"><h2><Zap /> Quick Actions</h2></div>
              <div className="actions">
                {permissions.create_ticket && <button onClick={() => setPage("Tickets")}><Ticket /><span>My Tickets</span></button>}
                {permissions.generate_renders && <button onClick={() => setPage("Rendering")}><Image /><span>Rendering</span></button>}
                {permissions.cloud_controls && <button onClick={() => setPage("Cloud")}><UploadCloud /><span>Cloud Controls</span></button>}
                {permissions.manage_users && <button onClick={() => setPage("Members")}><Users /><span>Members</span></button>}
              </div>
            </section>
          </>
        ) : (
          <section className="panel empty-page">
            <div className="empty-icon"><PageIcon size={32} /></div>
            <h2>{page}</h2>
            <p>This module is ready for development. Your account permissions have been applied.</p>
            <span className="coming-soon">MODULE IN DEVELOPMENT</span>
          </section>
        )}
      </main>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}><nav className="side-menu" onClick={event => event.stopPropagation()}>
        <div className="menu-brand">KS LIVERY LAB</div>
        {navigation.map(item => <button key={item.name} className={page === item.name ? "selected" : ""} onClick={() => { setPage(item.name); setMenuOpen(false); }}><item.icon size={19} />{item.name}</button>)}
        <div className="menu-access-note">Signed in as <strong>{user.username}</strong></div>
      </nav></div>}

      <nav className="bottom-nav">
        {navigation.slice(0, 5).map(item => <button key={item.name} className={page === item.name ? "active" : ""} onClick={() => setPage(item.name)}><item.icon size={21} /><span>{item.name === "Catalogue" ? "Cars" : item.name}</span></button>)}
        <button onClick={() => setMenuOpen(true)}><MoreHorizontal size={22} /><span>More</span></button>
      </nav>
    </div>
  );
}
