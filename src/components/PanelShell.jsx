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
            className="inline-flex items-center gap-3 text-left"
            data-cursor="active"
            aria-label="Перейти к началу страницы"
          >
            <span className="panel-logo">SI</span>
          </button>

          <div className="flex items-center gap-3 md:gap-5">
            <nav aria-label="Локальная навигация" className="hidden md:block">
              <ul className="flex items-center gap-4">
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
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.36em] ${
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

        {footer ? <footer className="panel-footer">{footer}</footer> : null}
      </div>
    </motion.section>
  );
}
