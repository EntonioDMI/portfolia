import { motion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1];

export default function PanelShell({
  id,
  index,
  sideLabel,
  navItems,
  activeSection,
  onNavigate,
  children,
  footer,
  className = '',
  bodyClassName = '',
  footerClassName = '',
}) {
  return (
    <motion.section
      id={id}
      data-panel-section="true"
      className="panel-stage"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease }}
    >
      <span aria-hidden="true" className="edge-index hidden xl:block">
        {index}
      </span>

      <span aria-hidden="true" className="vertical-label hidden xl:flex">
        {sideLabel}
      </span>

      <div className={`panel-shell ${className}`}>
        <div className="panel-sheen" aria-hidden="true" />
        <div className="panel-grid" aria-hidden="true" />

        <header className="panel-header">
          <button
            type="button"
            onClick={() => onNavigate('main')}
            className="panel-logo-button"
            data-cursor="active"
            aria-label="Перейти к началу страницы"
          >
            <span className="panel-logo">SI</span>
          </button>

          <div className="panel-header-meta">
            <nav aria-label="Локальная навигация" className="hidden md:block">
              <ul className="panel-nav-list">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      data-cursor="active"
                      className={`panel-nav-link ${
                        activeSection === item.id ? 'panel-nav-link-active' : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <span
              className={`panel-index-badge ${
                activeSection === id
                  ? 'border-[color:var(--line-strong)] text-[var(--text)]'
                  : 'border-[color:var(--line)] text-[var(--text-soft)]'
              }`}
            >
              {index}
            </span>
          </div>
        </header>

        <div className={`panel-body ${bodyClassName}`}>{children}</div>

        {footer ? <footer className={`panel-footer ${footerClassName}`}>{footer}</footer> : null}
      </div>
    </motion.section>
  );
}
