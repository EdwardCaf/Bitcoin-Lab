import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet,
  ArrowLeftRight, 
  EyeOff,
  Pickaxe, 
  Blocks, 
  Network,
  Zap,
  Droplets,
  ArrowRight,
  Sparkles,
  BookOpen,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import { NetworkVisualization, StatsSection, LearningPath } from '../components/home';
import styles from './HomePage.module.css';

const lessons = [
  {
    id: 'wallets',
    title: 'Wallets & Addresses',
    description: 'Understand how Bitcoin wallets work, from private keys to address types and scripts.',
    icon: Wallet,
    path: '/lessons/wallets',
    difficulty: 'Beginner',
    duration: '15 min',
    topics: ['Private Keys', 'Address Types', 'Bitcoin Script', 'HD Wallets']
  },
  {
    id: 'transactions',
    title: 'Transactions',
    description: 'Learn how Bitcoin moves from one wallet to another through inputs, outputs, and fees.',
    icon: ArrowLeftRight,
    path: '/lessons/transactions',
    difficulty: 'Beginner',
    duration: '20 min',
    topics: ['UTXOs', 'Inputs & Outputs', 'Transaction Fees', 'Change Addresses']
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Explore Bitcoin privacy - how transactions can be traced and how to protect yourself.',
    icon: EyeOff,
    path: '/lessons/privacy',
    difficulty: 'Intermediate',
    duration: '18 min',
    topics: ['Address Reuse', 'Chain Analysis', 'CoinJoin', 'Best Practices']
  },
  {
    id: 'mining',
    title: 'Mining',
    description: 'Discover how miners secure the network and create new Bitcoin through proof-of-work.',
    icon: Pickaxe,
    path: '/lessons/mining',
    difficulty: 'Intermediate',
    duration: '20 min',
    topics: ['Hash Functions', 'Proof of Work', 'Difficulty', 'Block Rewards']
  },
  {
    id: 'blocks',
    title: 'Blocks & Blockchain',
    description: 'Understand how blocks are structured and chained together to form an immutable ledger.',
    icon: Blocks,
    path: '/lessons/blocks',
    difficulty: 'Intermediate',
    duration: '18 min',
    topics: ['Block Structure', 'Merkle Trees', 'Chain of Hashes', 'Immutability']
  },
  {
    id: 'network',
    title: 'Network & Nodes',
    description: 'Explore how Bitcoin\'s peer-to-peer network operates and reaches consensus.',
    icon: Network,
    path: '/lessons/network',
    difficulty: 'Intermediate',
    duration: '20 min',
    topics: ['Node Types', 'Transaction Propagation', 'Consensus Rules', 'Forks']
  },
  {
    id: 'lightning',
    title: 'Lightning Network',
    description: 'Learn how Lightning enables instant, low-fee Bitcoin payments through payment channels.',
    icon: Zap,
    path: '/lessons/lightning',
    difficulty: 'Advanced',
    duration: '25 min',
    topics: ['Payment Channels', 'Routing', 'HTLCs', 'Invoices']
  },
  {
    id: 'liquid',
    title: 'Liquid Network',
    description: 'Explore Bitcoin\'s federated sidechain for fast settlement and confidential transactions.',
    icon: Droplets,
    path: '/lessons/liquid',
    difficulty: 'Advanced',
    duration: '22 min',
    topics: ['Peg-In/Out', 'Confidential TX', 'Issued Assets', 'Trade-offs']
  }
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return 'success';
    case 'Intermediate':
      return 'warning';
    case 'Advanced':
      return 'error';
    default:
      return 'secondary';
  }
};

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
            <span className={styles.heroHighlight}>The Bitcoin Lab</span>
          </h1>
          
          <p className={styles.heroText}>
            Learn Bitcoin through hands-on interactive simulations. Explore wallets, 
            mine blocks, route Lightning payments, and master the technology that's 
            revolutionizing money. No setup required, completely free.
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
              onClick={() => document.getElementById('lessons').scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Lessons
            </Button>
          </div>
          
          <div className={styles.heroBadges}>
            <span className={styles.badge}>
              <BookOpen size={16} />
              8 Lessons
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
          <NetworkVisualization />
        </div>
      </motion.section>

      {/* Stats Section */}
      <StatsSection />

      {/* Learning Path */}
      <LearningPath />

      {/* Lessons Grid */}
      <motion.section 
        id="lessons"
        className={styles.lessonsSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Lessons</h2>
          <p className={styles.sectionSubtitle}>
            Comprehensive curriculum covering Bitcoin fundamentals to advanced topics
          </p>
        </div>
        
        <div className={styles.lessonsGrid}>
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Card 
                  padding="large" 
                  hover
                  className={styles.lessonCard}
                >
                  <div className={styles.lessonHeader}>
                    <div className={styles.lessonIcon}>
                      <Icon size={24} />
                    </div>
                    <div className={styles.lessonMeta}>
                      <Badge 
                        variant={getDifficultyColor(lesson.difficulty)} 
                        size="small"
                      >
                        {lesson.difficulty}
                      </Badge>
                      <span className={styles.duration}>{lesson.duration}</span>
                    </div>
                  </div>
                  
                  <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                  <p className={styles.lessonDescription}>{lesson.description}</p>
                  
                  <div className={styles.lessonTopics}>
                    {lesson.topics.map((topic) => (
                      <span key={topic} className={styles.topic}>{topic}</span>
                    ))}
                  </div>

                  <Link to={lesson.path} className={styles.lessonLink}>
                    <Button 
                      variant="primary"
                      fullWidth
                      icon={<ArrowRight size={16} />}
                      iconPosition="right"
                    >
                      Start Lesson
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className={styles.featuresSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>Why The Bitcoin Lab?</h2>
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
