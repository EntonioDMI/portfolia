import { motion } from 'motion/react';

const ease = [0.2, 0.86, 0.24, 1];

const previewVariants = {
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.34, ease },
  },
  hidden: {
    opacity: 0,
    y: -10,
    filter: 'blur(8px)',
    transition: { duration: 0.24, ease },
  },
};

const detailVariants = {
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: 0.12, ease },
  },
  hidden: {
    opacity: 0,
    height: 0,
    y: 14,
    filter: 'blur(10px)',
    transition: { duration: 0.28, ease },
  },
};

export default function ProjectCard({ project, position = 'active', onOpen, onActivate }) {
  if (!project) {
    return null;
  }

  const isActive = position === 'active';

  function handleKeyDown(event) {
    if (isActive) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate?.();
    }
  }

  return (
    <motion.article
      className={`project-card-surface ${
        isActive ? 'project-card-active' : 'project-card-side'
      } project-card-${position}`}
      role={isActive ? undefined : 'button'}
      tabIndex={isActive ? undefined : 0}
      onClick={isActive ? undefined : onActivate}
      onKeyDown={isActive ? undefined : handleKeyDown}
      data-cursor="active"
      aria-label={isActive ? undefined : `Сделать активным проект ${project.title}`}
    >
      <div className="project-cover-sheen" aria-hidden="true" />
      <div className="project-cover-grid" aria-hidden="true" />

      <div className="project-cover-top">
        <motion.span
          className="project-card-state-chip"
          initial={false}
          animate={isActive ? 'hidden' : 'visible'}
          variants={previewVariants}
          aria-hidden={isActive}
        >
          ПРЕВЬЮ
        </motion.span>

        <div className="project-cover-meta">
          <span className="project-cover-status">{project.status}</span>
          <span className="project-cover-year">{project.year}</span>
        </div>

        <p className="project-cover-type">{project.type}</p>
      </div>

      <div className="project-cover-body">
        <h3 className="project-cover-title">{project.title}</h3>

        <motion.div
          className="project-card-detail-block"
          initial={false}
          animate={isActive ? 'visible' : 'hidden'}
          variants={detailVariants}
        >
          <p className="project-cover-summary">{project.summary}</p>
        </motion.div>
      </div>

      <motion.div
        className="project-card-bottom-transition"
        initial={false}
        animate={isActive ? 'visible' : 'hidden'}
        variants={detailVariants}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
      >
        <div className="project-cover-bottom">
          <div className="project-cover-tags" aria-label="Теги проекта">
            {project.tags.map((tag) => (
              <span key={tag} className="project-cover-tag">
                {tag}
              </span>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.();
            }}
            data-cursor="active"
            className="project-cover-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.22, ease }}
          >
            ОТКРЫТЬ
          </motion.button>
        </div>
      </motion.div>
    </motion.article>
  );
}
