# Design Philosophy

Reference lesson: **WalletsLesson** (`src/lessons/WalletsLesson.jsx`)

Use this document to understand patterns when building new lessons or components.

---

## Architecture Overview

### Lesson Structure
```
LessonFile.jsx (orchestrator)
├── Uses LessonLayout wrapper
├── Defines sections array [{id, title}]
├── Manages currentSection state
├── Contains section components (IntroSection, etc.)
└── Imports interactive components from /components/lessons/{topic}/
```

### File Organization
```
src/
├── lessons/
│   └── TopicLesson.jsx          # Main lesson orchestrator
├── components/lessons/{topic}/
│   ├── index.js                  # Barrel exports
│   ├── ComponentName.jsx         # Interactive component
│   └── ComponentName.module.css  # Scoped styles
└── components/common/            # Reusable UI primitives
```

---

## Lesson Pattern

### Main Lesson File
```jsx
const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'concept', title: 'Key Concept' },
  // ...
];

export function TopicLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0: return <IntroSection />;
      case 1: return <ConceptSection />;
      default: return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="topic"
      title="Topic Title"
      description="Brief description"
      icon={IconComponent}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      nextLesson={{ path: '/lessons/next', title: 'Next Lesson' }}
    >
      {renderSection()}
    </LessonLayout>
  );
}
```

### Section Components
Each section is a private function within the lesson file:
```jsx
function IntroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      {/* Hero card for intro */}
      <div className={styles.heroCard}>
        <div className={styles.heroIcon}><Icon size={48} /></div>
        <h2 className={styles.heroTitle}>Main Question</h2>
        <p className={styles.heroText}>Core explanation</p>
      </div>

      {/* Concept grid - 3 cards */}
      <div className={styles.conceptGrid}>
        <Card padding="large" hover>...</Card>
        <Card padding="large" hover>...</Card>
        <Card padding="large" hover>...</Card>
      </div>

      {/* Accordion for analogies/explanations */}
      <Accordion title="Analogy Title" defaultOpen>...</Accordion>

      {/* Fact box for statistics */}
      <div className={styles.factBox}>...</div>
    </motion.div>
  );
}

function ConceptSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Section Title</h2>
      <p className={styles.sectionText}>Explanatory text with context.</p>
      
      {/* Interactive component */}
      <InteractiveDemo />
    </motion.div>
  );
}
```

---

## Interactive Component Pattern

### Structure
```jsx
export function ComponentName() {
  const [state, setState] = useState(initialValue);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}><Icon size={24} /></div>
            <div>
              <h3 className={styles.title}>Component Title</h3>
              <p className={styles.subtitle}>Brief description</p>
            </div>
          </div>
          <Button variant="secondary" size="small" onClick={action}>
            Action
          </Button>
        </div>

        {/* Main interactive area */}
        <div className={styles.mainContent}>
          {/* Interactive elements */}
        </div>

        {/* Warning/note if needed */}
        <div className={styles.warning}>
          <Icon size={16} />
          <span>Important note</span>
        </div>
      </Card>

      {/* Deep dive accordion outside the card */}
      <Accordion
        title="Deep Dive: Technical Details"
        variant="deepdive"
        icon={<Icon size={16} />}
      >
        <p>Technical explanation...</p>
        <ul>
          <li><strong>Point:</strong> Explanation</li>
        </ul>
      </Accordion>
    </div>
  );
}
```

---

## CSS Patterns

### CSS Variables (from globals.css)
```css
/* Colors */
--bg-primary: #0a0a0a;
--bg-secondary: #111111;
--bg-tertiary: #1a1a1a;
--bitcoin-orange: #f7931a;
--bitcoin-orange-subtle: rgba(247, 147, 26, 0.1);

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Typography */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--font-mono: 'JetBrains Mono', monospace;

/* Borders & Radius */
--border-subtle: #2a2a2a;
--radius-md: 8px;
--radius-lg: 12px;
```

### Common CSS Module Patterns
```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
}

.iconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--bitcoin-orange-subtle);
  border-radius: var(--radius-lg);
  color: var(--bitcoin-orange);
}

.title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: var(--spacing-xs) 0 0;
}
```

### Responsive Breakpoints
```css
@media (max-width: 900px) { /* Tablet */ }
@media (max-width: 600px) { /* Mobile */ }
```

---

## Common Components

### Card
```jsx
<Card variant="default|elevated" padding="small|medium|large" hover glow>
  {children}
</Card>
```

### Button
```jsx
<Button
  variant="primary|secondary"
  size="small|medium|large"
  icon={<Icon />}
  iconPosition="left|right"
  onClick={handler}
>
  Label
</Button>
```

### Accordion
```jsx
<Accordion
  title="Title"
  defaultOpen={false}
  variant="default|deepdive"
  icon={<Icon />}
>
  {content}
</Accordion>
```

### Badge
```jsx
<Badge variant="default|success|error|warning" size="small|medium">
  Text
</Badge>
```

---

## Animation Patterns

### Section Entrance (framer-motion)
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

### Staggered Children
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
```

---

## Key Principles

1. **Educational First**: Every component teaches a concept interactively
2. **Simulated Data**: Use fake/simulated cryptography for demos (never real keys)
3. **Dark Theme**: All styling uses dark background with orange accents
4. **Monospace for Data**: Use `--font-mono` for keys, addresses, hex values
5. **Progressive Disclosure**: Intro -> Concept -> Interactive -> Deep Dive
6. **Mobile Responsive**: Stack layouts on smaller screens
7. **Clear Warnings**: Always warn users when showing educational-only content

---

## Icons (Lucide React)

Import icons individually:
```jsx
import { Key, Lock, Unlock, Eye, EyeOff, Copy, Check, RefreshCw, ArrowRight } from 'lucide-react';
```

Standard sizes:
- Hero icons: `size={48}`
- Card/Section icons: `size={24}`
- Inline/Button icons: `size={16}` or `size={18}`
