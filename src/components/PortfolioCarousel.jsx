import { motion } from 'motion/react';
import { useEffect } from 'react';
import ProjectCard from './ProjectCard';

const ease = [0.2, 0.86, 0.24, 1];
const slotMotion = {
  active: {
    x: '0%',
    scale: 1,
    rotate: 0,
    opacity: 1,
    zIndex: 30,
    pointerEvents: 'auto',
  },
  prev: {
    x: '-49%',
    scale: 0.68,
    rotate: -4,
    opacity: 0.5,
    zIndex: 16,
    pointerEvents: 'auto',
  },
  next: {
    x: '49%',
    scale: 0.68,
    rotate: 4,
    opacity: 0.5,
    zIndex: 16,
    pointerEvents: 'auto',
  },
  'hidden-left': {
    x: '-64%',
    scale: 0.6,
    rotate: -5.5,
    opacity: 0,
    zIndex: 8,
    pointerEvents: 'none',
  },
  'hidden-right': {
    x: '64%',
    scale: 0.6,
    rotate: 5.5,
    opacity: 0,
    zIndex: 8,
    pointerEvents: 'none',
  },
};

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

function getProjectState(projectIndex, activeIndex, total) {
  if (total === 1) {
    return projectIndex === activeIndex ? 'active' : null;
  }

  const forward = wrapIndex(projectIndex - activeIndex, total);

  if (forward === 0) {
    return 'active';
  }

  if (forward === 1) {
    return 'next';
  }

  if (forward === total - 1) {
    return 'prev';
  }

  if (total > 3 && forward === 2) {
    return 'hidden-right';
  }

  if (total > 3 && forward === total - 2) {
    return 'hidden-left';
  }

  return null;
}

function buildCarouselCards(projects, activeIndex) {
  const total = projects.length;

  if (total === 0) {
    return [];
  }

  if (total === 1) {
    return [
      {
        key: projects[0].id,
        project: projects[0],
        state: 'active',
      },
    ];
  }

  if (total === 2) {
    const activeProject = projects[wrapIndex(activeIndex, total)];
    const adjacentProject = projects[wrapIndex(activeIndex + 1, total)];

    return [
      {
        key: `${adjacentProject.id}-prev-clone`,
        project: adjacentProject,
        state: 'prev',
      },
      {
        key: activeProject.id,
        project: activeProject,
        state: 'active',
      },
      {
        key: `${adjacentProject.id}-next-clone`,
        project: adjacentProject,
        state: 'next',
      },
    ];
  }

  return projects
    .map((project, projectIndex) => {
      const state = getProjectState(projectIndex, activeIndex, total);

      if (!state) {
        return null;
      }

      return {
        key: project.id,
        project,
        state,
      };
    })
    .filter(Boolean);
}

export default function PortfolioCarousel({
  projects,
  activeIndex,
  onChange,
  onOpenProject,
}) {
  const total = projects.length;
  const hasProjects = total > 0;
  const visibleCards = buildCarouselCards(projects, activeIndex);
  const isSingle = total <= 1;

  useEffect(() => {
    if (total <= 1) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        onChange(activeIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        onChange(activeIndex + 1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onChange, total]);

  if (!hasProjects) {
    return (
      <div className="portfolio-carousel portfolio-carousel-empty">
        <div className="portfolio-stage">
          <div className="portfolio-empty-card">
            <p className="portfolio-empty-kicker">ПРОЕКТЫ</p>
            <p className="portfolio-empty-text">
              Добавьте первый объект в <code>src/data/projects.js</code>, чтобы заполнить карусель.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-carousel" aria-label="Карусель проектов">
      <div className="portfolio-stage">
        <div className="portfolio-stack">
          {visibleCards.map(({ key, project, state }) => (
            <div key={key} className="portfolio-card-anchor">
              <motion.div
                className={`portfolio-card-layer portfolio-card-layer-${state}`}
                initial={false}
                animate={slotMotion[state]}
                transition={{
                  duration: 0.84,
                  ease,
                  x: { duration: 0.9, ease },
                  scale: { duration: 0.82, ease },
                  rotate: { duration: 0.82, ease },
                  opacity: { duration: 0.52, ease },
                }}
              >
                <ProjectCard
                  project={project}
                  position={state}
                  onOpen={() => onOpenProject(project)}
                  onActivate={() => onChange(projects.findIndex((item) => item.id === project.id))}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className={`portfolio-controls ${isSingle ? 'portfolio-controls-static' : ''}`}>
        {!isSingle ? (
          <>
            <motion.button
              type="button"
              onClick={() => onChange(activeIndex - 1)}
              data-cursor="active"
              className="portfolio-arrow"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease }}
              aria-label="Предыдущий проект"
            >
              ←
            </motion.button>

            <div className="portfolio-counter">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(total).padStart(2, '0')}</span>
            </div>

            <motion.button
              type="button"
              onClick={() => onChange(activeIndex + 1)}
              data-cursor="active"
              className="portfolio-arrow"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease }}
              aria-label="Следующий проект"
            >
              →
            </motion.button>
          </>
        ) : (
          <div className="portfolio-counter">
            <span>01</span>
            <span>/</span>
            <span>01</span>
          </div>
        )}
      </div>
    </div>
  );
}
