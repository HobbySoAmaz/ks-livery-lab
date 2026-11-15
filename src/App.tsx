
import { useState } from "react";
import {
  Menu, Bell, Home, Ticket, Car, Cloud, Image,
  Users, Settings, RefreshCw, UploadCloud,
  FileText, CheckCircle2, Activity, Zap,
  ChevronRight, MoreHorizontal, ShieldCheck
} from "lucide-react";
import "./App.css";

const navigation = [
  { name: "Dashboard", icon: Home },
  { name: "Tickets", icon: Ticket },
  { name: "Catalogue", icon: Car },
  { name: "Rendering", icon: Image },
  { name: "Cloud", icon: Cloud },
  { name: "Members", icon: Users },
  { name: "Settings", icon: Settings }
];

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const active = navigation.find(item => item.name === page);
  const PageIcon = active?.icon || Home;

  return (
    <div className="app">

      <header className="header">
        <button className="icon-btn"
          onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>

        <div className="brand">
          <div className="brand-logo">KS<span>↗</span></div>
          <div className="brand-sub">LIVERY LAB</div>
        </div>

        <button className="icon-btn notification">
          <Bell />
          <span className="notification-dot" />
        </button>
      </header>

      <main className="main">

        <div className="page-heading">
          <span className="eyebrow">
            KS MOTORSPORT / CONTROL CENTER
          </span>
          <h1>{page}</h1>
          <p>Welcome back to your Livery Lab.</p>
        </div>

        {page === "Dashboard" ? (

          <>
            <section className="status-card">
              <div className="discord-icon">D</div>

              <div className="status-info">
                <span>Discord Bot Status</span>
                <strong>
                  <i className="online-dot" /> Online
                </strong>
              </div>

              <div className="uptime">
                <span>UPTIME</span>
                <strong>--:--:--</strong>
              </div>
            </section>

            <section className="stats">
              <div className="stat-card red">
                <Ticket />
                <span>Open Tickets</span>
                <strong>03</strong>
              </div>

              <div className="stat-card purple">
                <Image />
                <span>Rendering</span>
                <strong>01</strong>
              </div>

              <div className="stat-card blue">
                <Users />
                <span>Members</span>
                <strong>128</strong>
              </div>
            </section>

            <section className="panel">
              <div className="panel-title">
                <h2><Activity /> Recent Activity</h2>
                <button onClick={() => setPage("Tickets")}>
                  View all <ChevronRight size={16} />
                </button>
              </div>

              <div className="activity">
                <div className="activity-icon red">
                  <Ticket />
                </div>
                <div className="activity-text">
                  <strong>New commission ticket</strong>
                  <span>#1047 — Porsche 992 GT3 R</span>
                </div>
                <time>2m</time>
              </div>

              <div className="activity">
                <div className="activity-icon purple">
                  <Image />
                </div>
                <div className="activity-text">
                  <strong>Rendering completed</strong>
                  <span>KS_Motorsport_Livery.png</span>
                </div>
                <time>8m</time>
              </div>

              <div className="activity">
                <div className="activity-icon green">
                  <CheckCircle2 />
                </div>
                <div className="activity-text">
                  <strong>System health check</strong>
                  <span>All systems operational</span>
                </div>
                <time>10m</time>
              </div>
            </section>

            <section className="panel">
              <div className="panel-title">
                <h2><Zap /> Quick Actions</h2>
              </div>

              <div className="actions">
                <button onClick={() => setPage("Cloud")}>
                  <UploadCloud />
                  <span>Update Cloud</span>
                </button>

                <button onClick={() => setPage("Cloud")}>
                  <RefreshCw />
                  <span>Restart Bot</span>
                </button>

                <button onClick={() => setPage("Cloud")}>
                  <FileText />
                  <span>View Logs</span>
                </button>

                <button onClick={() => setPage("Settings")}>
                  <Settings />
                  <span>Settings</span>
                </button>
              </div>
            </section>
          </>

        ) : (

          <section className="panel empty-page">
            <div className="empty-icon">
              <PageIcon size={32} />
            </div>
            <h2>{page}</h2>
            <p>This module is ready for development.</p>
            <span className="coming-soon">
              MODULE IN DEVELOPMENT
            </span>
          </section>

        )}

      </main>

      {menuOpen && (
        <div className="menu-overlay"
          onClick={() => setMenuOpen(false)}>

          <nav className="side-menu"
            onClick={event => event.stopPropagation()}>

            <div className="menu-brand">KS LIVERY LAB</div>

            {navigation.map(item => (
              <button
                key={item.name}
                className={page === item.name ? "selected" : ""}
                onClick={() => {
                  setPage(item.name);
                  setMenuOpen(false);
                }}>
                <item.icon size={19} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      <nav className="bottom-nav">
        {navigation.slice(0, 5).map(item => (
          <button
            key={item.name}
            className={page === item.name ? "active" : ""}
            onClick={() => setPage(item.name)}>
            <item.icon size={21} />
            <span>
              {item.name === "Catalogue" ? "Cars" : item.name}
            </span>
          </button>
        ))}

        <button onClick={() => setPage("Settings")}>
          <MoreHorizontal size={22} />
          <span>More</span>
        </button>
      </nav>

    </div>
  );
}
