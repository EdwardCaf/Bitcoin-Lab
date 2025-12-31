import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Sparkles,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Zap
} from 'lucide-react';
import { Button, Badge } from '../components/common';
import { BlackHoleVisualization, StatsSection, LearningPath } from '../components/home';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.heroContent}>
          <Badge variant="primary" size="medium" icon={<Sparkles size={14} />}>
            Interactive Bitcoin Education
          </Badge>
          
          <h1 className={styles.heroTitle}>
            Welcome to<br />
            <span className={styles.heroHighlight}>The Bitcoin OPtic</span>
          </h1>
          
          <p className={styles.heroText}>
            Learn Bitcoin through beautiful visualizations. Explore wallets, 
            mine blocks, route Lightning payments, and master the technology that's 
            revolutionizing money. No setup required, all completely free.
          </p>
          
          <div className={styles.heroButtons}>
            <Link to="/lessons/wallets">
              <Button 
                variant="primary" 
                size="large"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Start Learning
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="large"
              icon={<GraduationCap size={18} />}
              onClick={() => document.getElementById('learning-path').scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Lessons
            </Button>
          </div>
          
          <div className={styles.heroBadges}>
            <span className={styles.badge}>
              <BookOpen size={16} />
              11 Lessons
            </span>
            <span className={styles.badge}>
              <Zap size={16} />
              No Setup
            </span>
            <span className={styles.badge}>
              <Sparkles size={16} />
              100% Free
            </span>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <BlackHoleVisualization />
        </div>
      </motion.section>

      {/* Stats Section */}
      <StatsSection />

      {/* Learning Path */}
      <LearningPath />

      {/* Features Section */}
      <motion.section
        className={styles.featuresSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>Why The Bitcoin <span className={styles.sectionOrange}>OP</span>tic?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Gamepad2 size={24} />
            </div>
            <h4>Hands-On Learning</h4>
            <p>Interactive simulations let you experiment with Bitcoin concepts in real-time without risk</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <BookOpen size={24} />
            </div>
            <h4>Beginner Friendly</h4>
            <p>Start from zero knowledge with clear explanations and relatable analogies</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <h4>Deep Technical Content</h4>
            <p>Expand any topic to dive into the underlying technical details and cryptography</p>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className={styles.ctaSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.ctaTitle}>Ready to Master Bitcoin?</h2>
        <p className={styles.ctaText}>
          Start your journey from complete beginner to Bitcoin expert
        </p>
        <Link to="/lessons/wallets">
          <Button 
            variant="primary" 
            size="large"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Begin Your Journey
          </Button>
        </Link>
        <p className={styles.ctaSubtext}>
          No account required • Takes 2 minutes to start • Completely free
        </p>
      </motion.section>
    </div>
  );
}

export default HomePage;
