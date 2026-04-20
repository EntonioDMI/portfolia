import Lenis from 'lenis';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { startTransition, useEffect, useRef, useState } from 'react';
import portrait from './assets/portrait.png';
import CustomCursor from './components/CustomCursor';
import PanelShell from './components/PanelShell';
import PortfolioCarousel from './components/PortfolioCarousel';
import { projects } from './data/projects';

const ease = [0.22, 1, 0.36, 1];

const telegramUrl = 'https://t.me/Dmitign';
const pricingUrl =
  'https://docs.google.com/document/d/18sSayog3-WJLaFqUqhhyE7nH6RuCicPZDKC-fKneBeM/edit?usp=sharing';
const discordUrl = 'https://discord.com/app';
const email = 'soccious@gmail.com';

const marqueeItems = [
  'Лендинги',
  'Интерфейсы',
  'Плавные анимации',
  'Современная разработка',
];

const aboutLabels = [
  'Чёрно-белая эстетика',
  'Плавное взаимодействие',
  'Минимализм без пустоты',
];

const contactRows = [
  ['Telegram', '@Dmitign'],
  ['Discord', 'soccious'],
  ['E-mail', email],
];

const projectCopyMotion = {
  enter: (direction) => ({
    opacity: 0,
    y: direction >= 0 ? 20 : -20,
    filter: 'blur(10px)',
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.58, delay: 0.12, ease },
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction >= 0 ? -16 : 16,
    filter: 'blur(8px)',
    transition: { duration: 0.3, ease },
  }),
};

function ActionButton({ children, variant = 'primary', onClick, className = '' }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      data-cursor="active"
      className={`inline-flex min-h-[3rem] items-center justify-center rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.28em] transition-colors duration-300 sm:px-6 ${
        variant === 'primary'
          ? 'border-[color:var(--text)] bg-[var(--text)] text-[var(--panel)] hover:bg-transparent hover:text-[var(--text)]'
          : 'border-[color:var(--line-strong)] bg-white/[0.02] text-[var(--text)] hover:border-[color:var(--text)] hover:bg-white/[0.06]'
      } ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.22, ease }}
    >
      {children}
    </motion.button>
  );
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef(null);
  const heroRef = useRef(null);
  const [activeSection, setActiveSection] = useState('main');
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [projectDirection, setProjectDirection] = useState(1);
  const [toast, setToast] = useState('');

  const activeProject = projects[activeProjectIndex] ?? null;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 56]), {
    stiffness: 80,
    damping: 20,
    mass: 0.4,
  });

  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.025]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 0.92,
    });

    lenisRef.current = lenis;

    let frameId = 0;
    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast('');
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-panel-section="true"]'));

    const observer = new IntersectionObserver(
      (entries) => {
        const topEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!topEntry?.target?.id) {
          return;
        }

        startTransition(() => {
          setActiveSection(topEntry.target.id);
        });
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-16% 0px -18% 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  function navigateTo(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    lenisRef.current?.scrollTo(target, { offset: -20, duration: 1.2 });
  }

  function openExternal(url) {
    try {
      window.open(url, '_blank', 'noreferrer');
      setToast('Ссылка открыта');
    } catch {
      setToast('Не удалось выполнить действие');
    }
  }

  function changeProject(nextIndex) {
    if (!projects.length) {
      return;
    }

    const normalizedNext = ((nextIndex % projects.length) + projects.length) % projects.length;
    const forwardDistance = (normalizedNext - activeProjectIndex + projects.length) % projects.length;
    const backwardDistance = (activeProjectIndex - normalizedNext + projects.length) % projects.length;
    const direction = forwardDistance === 0 ? 0 : forwardDistance <= backwardDistance ? 1 : -1;

    setProjectDirection(direction);

    startTransition(() => {
      setActiveProjectIndex(normalizedNext);
    });
  }

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'absolute';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        document.body.removeChild(field);
      }

      setToast('E-mail скопирован');
    } catch {
      setToast('Не удалось выполнить действие');
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--page-bg)] text-[var(--text)]">
      <CustomCursor />

      <div className="page-atmosphere" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="hero-halo"
        style={reduceMotion ? undefined : { y: haloY }}
      />
      <div className="page-noise" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-14 px-4 py-6 sm:px-6 sm:py-8 lg:gap-24 lg:px-8 lg:py-10">
        <PanelShell
          id="main"
          index=".01"
          sideLabel="SCROLL"
          activeSection={activeSection}
          onNavigate={navigateTo}
          navItems={[
            { id: 'about', label: 'ОБО МНЕ' },
            { id: 'project', label: 'ПРОЕКТ' },
            { id: 'contact', label: 'КОНТАКТЫ' },
          ]}
          bodyClassName="min-h-[500px] lg:min-h-[548px]"
          footerClassName="hero-panel-footer"
          footer={
            <div className="hero-footer-grid grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="hero-meta-grid grid gap-5 sm:grid-cols-2">
                <div className="hero-meta-item space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-soft)]">
                    Опыт
                  </p>
                  <p className="text-sm text-[var(--text)]">1+ year</p>
                </div>

                <div className="hero-meta-item space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-soft)]">
                    Фокус
                  </p>
                  <p className="text-sm text-[var(--text)]">React / Vue / интерфейсы</p>
                </div>
              </div>

              <div className="marquee-row marquee-rail">
                <div className="marquee-track">
                  {[...marqueeItems, ...marqueeItems].map((item, index) => (
                    <span key={`${item}-${index}`} className="marquee-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <div
            ref={heroRef}
            className="grid gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(300px,0.82fr)] lg:items-center lg:gap-5"
          >
            <div className="flex max-w-[680px] flex-col justify-start lg:pt-1">
              <motion.p
                className="meta-chip"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                Веб-разработчик
              </motion.p>

              <motion.p
                className="mt-5 text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.06, ease }}
              >
                Привет, я Дмитрий
              </motion.p>

              <motion.h1
                className="mt-3 text-[clamp(3.8rem,12.2vw,8rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.08em]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.08, ease }}
              >
                Sinveil
              </motion.h1>

              <motion.p
                className="mt-4 max-w-[16ch] text-[clamp(1.35rem,3.15vw,2.35rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-[var(--text)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.14, ease }}
              >
                Создаю сайты, которые выглядят цельно, дорого и современно
              </motion.p>

              <motion.p
                className="mt-5 max-w-[560px] text-sm leading-6 text-[var(--text-soft)] sm:text-[14px]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.88, delay: 0.2, ease }}
              >
                Разрабатываю лендинги, небольшие сайты и web-приложения с акцентом на
                визуальную чистоту, плавное движение и цельный пользовательский опыт.
              </motion.p>

              <motion.div
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.82, delay: 0.26, ease }}
              >
                <ActionButton onClick={() => openExternal(telegramUrl)}>
                  Написать в Telegram
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => openExternal(pricingUrl)}>
                  Узнать о расценках
                </ActionButton>
              </motion.div>
            </div>

            <motion.div
              className="relative flex min-h-[360px] items-end justify-center lg:min-h-[560px]"
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.16, ease }}
            >
              <div className="portrait-plinth" aria-hidden="true" />
              <div className="portrait-shadow" aria-hidden="true" />

              <motion.div
                className="portrait-shell"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        y: portraitY,
                        scale: portraitScale,
                      }
                }
              >
                <div className="portrait-backdrop" aria-hidden="true" />
                <img
                  src={portrait}
                  alt="Портрет Дмитрия, Sinveil"
                  className="portrait-image"
                />
                <div className="portrait-fade" aria-hidden="true" />
              </motion.div>
            </motion.div>
          </div>
        </PanelShell>

        <PanelShell
          id="about"
          index=".02"
          sideLabel="ABOUT"
          activeSection={activeSection}
          onNavigate={navigateTo}
          navItems={[
            { id: 'main', label: 'ГЛАВНАЯ' },
            { id: 'project', label: 'ПРОЕКТ' },
            { id: 'contact', label: 'КОНТАКТЫ' },
          ]}
          bodyClassName="min-h-[596px] lg:min-h-[676px]"
          footer={
            <div className="flex flex-wrap gap-3">
              {aboutLabels.map((item) => (
                <span key={item} className="meta-chip meta-chip-soft">
                  {item}
                </span>
              ))}
            </div>
          }
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(220px,0.52fr)_minmax(0,1fr)] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">
                ОБО МНЕ
              </p>
              <h2 className="mt-6 max-w-[7ch] text-[clamp(2.9rem,6vw,5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.07em]">
                ОБО МНЕ
              </h2>
            </motion.div>

            <motion.div
              className="space-y-8 text-[15px] leading-8 text-[var(--text-soft)]"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.82, delay: 0.08, ease }}
            >
              <p>
                Делаю небольшие, но выразительные сайты для тех, кому нужна сильная подача,
                чистая структура и современное визуальное ощущение.
              </p>
              <p>
                Мне близок подход, в котором интерфейс не распадается на случайные элементы:
                всё связано типографикой, ритмом, движением и логикой взаимодействия.
              </p>
              <p>
                Если проект требует большего, могу собрать и более широкое решение — от
                лендинга до небольшого продукта с административной частью.
              </p>
            </motion.div>
          </div>
        </PanelShell>

        <PanelShell
          id="project"
          index=".03"
          sideLabel="PROJECT"
          activeSection={activeSection}
          onNavigate={navigateTo}
          navItems={[
            { id: 'main', label: 'ГЛАВНАЯ' },
            { id: 'about', label: 'ОБО МНЕ' },
            { id: 'contact', label: 'КОНТАКТЫ' },
          ]}
          bodyClassName="min-h-[612px] lg:min-h-[692px]"
          footer={
            <div className="grid gap-3 text-xs uppercase tracking-[0.32em] text-[var(--text-soft)] sm:grid-cols-2">
              <p>Первый опубликованный проект</p>
              <p className="text-left sm:text-right">Новые работы легко добавить позже</p>
            </div>
          }
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(260px,0.5fr)_minmax(0,1fr)] lg:items-center">
            <motion.div
              className="max-w-[430px]"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.82, ease }}
            >
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">
                ПРОЕКТ
              </p>
              <h2 className="mt-6 text-[clamp(2.9rem,6vw,5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.07em]">
                ПРОЕКТЫ
              </h2>

              {activeProject ? (
                <div className="portfolio-copy-stage">
                  <AnimatePresence initial={false} custom={projectDirection}>
                    <motion.div
                      key={activeProject.id}
                      custom={projectDirection}
                      variants={projectCopyMotion}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="portfolio-copy-panel"
                    >
                      <div className="portfolio-copy-meta">
                        <span>{activeProject.status}</span>
                        <span>{activeProject.year}</span>
                      </div>

                      <div className="mt-8">
                        <p className="portfolio-copy-title">{activeProject.title}</p>
                        <p className="portfolio-copy-type">{activeProject.type}</p>
                        <p className="portfolio-copy-summary">{activeProject.summary}</p>
                        <div className="portfolio-copy-tags">
                          {activeProject.tags.map((tag) => (
                            <span key={tag} className="portfolio-copy-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-10">
                        <ActionButton onClick={() => openExternal(activeProject.url)}>
                          ОТКРЫТЬ ПРОЕКТ
                        </ActionButton>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  <p className="text-sm uppercase tracking-[0.34em] text-[var(--text-soft)]">
                    Проекты скоро появятся
                  </p>
                  <p className="portfolio-copy-summary">
                    Добавьте первый объект в <code>src/data/projects.js</code>, чтобы заполнить
                    карусель.
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
            >
              <PortfolioCarousel
                projects={projects}
                activeIndex={activeProjectIndex}
                onChange={changeProject}
                onOpenProject={(project) => openExternal(project.url)}
              />
            </motion.div>
          </div>
        </PanelShell>

        <PanelShell
          id="contact"
          index=".04"
          sideLabel="CONTACT"
          activeSection={activeSection}
          onNavigate={navigateTo}
          navItems={[
            { id: 'main', label: 'ГЛАВНАЯ' },
            { id: 'about', label: 'ОБО МНЕ' },
            { id: 'project', label: 'ПРОЕКТ' },
          ]}
          bodyClassName="min-h-[576px] lg:min-h-[656px]"
          footer={
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <ActionButton onClick={() => openExternal(telegramUrl)}>
                Открыть Telegram
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => openExternal(discordUrl)}>
                Написать в Discord
              </ActionButton>
              <ActionButton variant="secondary" onClick={copyEmail}>
                Скопировать e-mail
              </ActionButton>
            </div>
          }
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(260px,0.52fr)_minmax(0,1fr)] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">
                КОНТАКТЫ
              </p>
              <h2 className="mt-6 text-[clamp(2.9rem,6vw,5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.07em]">
                КОНТАКТЫ
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.82, delay: 0.08, ease }}
            >
              <p className="max-w-[620px] text-[15px] leading-8 text-[var(--text-soft)]">
                Если нужен аккуратный сайт с сильной подачей и вниманием к деталям —
                напишите мне удобным способом.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {contactRows.map(([label, value]) => (
                  <div key={label} className="contact-card">
                    <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--text-soft)]">
                      {label}
                    </p>
                    <p className="mt-4 text-sm text-[var(--text)]">
                      {label} — {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </PanelShell>

        <motion.footer
          className="px-2 pb-8 pt-2 sm:px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="flex flex-col items-start justify-between gap-4 border-t border-[color:var(--line)] px-2 pt-8 sm:flex-row sm:items-end">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">
              Спасибо за просмотр
            </p>
            <p className="text-sm text-[var(--text)]">Sinveil · Дмитрий</p>
          </div>
        </motion.footer>
      </main>

      <AnimatePresence>
        {toast ? (
          <motion.div
            aria-live="polite"
            role="status"
            className="pointer-events-none fixed bottom-5 right-4 z-[95] sm:right-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease }}
          >
            <div className="rounded-full border border-[color:var(--line-strong)] bg-[rgba(8,8,9,0.88)] px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[var(--text)] shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
              {toast}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
