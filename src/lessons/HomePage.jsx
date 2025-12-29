import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet,
  ArrowLeftRight, 
  EyeOff,
  Pickaxe, 
  Blocks, 
  Network, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { Card, Button, Badge } from '../components/common';
import styles from './HomePage.module.css';

const lessons = [
  {
    id: 'wallets',
    title: 'Wallets & Addresses',
    description: 'Understand how Bitcoin wallets work, from private keys to address types and scripts.',
    icon: Wallet,
    path: '/lessons/wallets',
    available: true,
    topics: ['Private Keys', 'Address Types', 'Bitcoin Script', 'HD Wallets']
  },
  {
    id: 'transactions',
    title: 'Transactions',
    description: 'Learn how Bitcoin moves from one wallet to another through inputs, outputs, and fees.',
    icon: ArrowLeftRight,
    path: '/lessons/transactions',
    available: true,
    topics: ['UTXOs', 'Inputs & Outputs', 'Transaction Fees', 'Change Addresses']
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Explore Bitcoin privacy - how transactions can be traced and how to protect yourself.',
    icon: EyeOff,
    path: '/lessons/privacy',
    available: true,
    topics: ['Address Reuse', 'Chain Analysis', 'CoinJoin', 'Best Practices']
  },
  {
    id: 'mining',
    title: 'Mining',
    description: 'Discover how miners secure the network and create new Bitcoin through proof-of-work.',
    icon: Pickaxe,
    path: '/lessons/mining',
    available: true,
    topics: ['Hash Functions', 'Proof of Work', 'Difficulty', 'Block Rewards']
  },
  {
    id: 'blocks',
    title: 'Blocks & Blockchain',
    description: 'Understand how blocks are structured and chained together to form an immutable ledger.',
    icon: Blocks,
    path: '/lessons/blocks',
    available: true,
    topics: ['Block Structure', 'Merkle Trees', 'Chain of Hashes', 'Immutability']
  },
  {
    id: 'network',
    title: 'Network & Nodes',
    description: 'Explore how Bitcoin\'s peer-to-peer network operates and reaches consensus.',
    icon: Network,
    path: '/lessons/network',
    available: true,
    topics: ['Node Types', 'Transaction Propagation', 'Consensus Rules', 'Forks']
  }
];

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
            Interactive Learning
          </Badge>
          <h1 className={styles.heroTitle}>
            Master Bitcoin<br />
            <span className={styles.heroHighlight}>Through Simulation</span>
          </h1>
          <p className={styles.heroText}>
            Explore how Bitcoin really works through hands-on interactive lessons. 
            Build transactions, mine blocks, and understand the technology that's 
            changing the world.
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
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>
              <BookOpen size={32} />
            </div>
            <span>Educational</span>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>
              <Gamepad2 size={32} />
            </div>
            <span>Interactive</span>
          </div>
        </div>
      </motion.section>

      {/* Lessons Grid */}
      <motion.section 
        className={styles.lessonsSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>Available Lessons</h2>
        <div className={styles.lessonsGrid}>
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  padding="large" 
                  hover={lesson.available}
                  className={`${styles.lessonCard} ${!lesson.available ? styles.locked : ''}`}
                >
                  <div className={styles.lessonHeader}>
                    <div className={styles.lessonIcon}>
                      <Icon size={24} />
                    </div>
                    {!lesson.available && (
                      <Badge variant="outline" size="small">Coming Soon</Badge>
                    )}
                  </div>
                  
                  <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                  <p className={styles.lessonDescription}>{lesson.description}</p>
                  
                  <div className={styles.lessonTopics}>
                    {lesson.topics.map((topic) => (
                      <span key={topic} className={styles.topic}>{topic}</span>
                    ))}
                  </div>

                  {lesson.available && (
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
                  )}
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
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>Why Learn With Us</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Gamepad2 size={24} />
            </div>
            <h4>Interactive Simulations</h4>
            <p>Learn by doing with hands-on exercises and real-time visualizations</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <BookOpen size={24} />
            </div>
            <h4>Beginner Friendly</h4>
            <p>No technical background needed - concepts explained with simple analogies</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <h4>Deep Dives Available</h4>
            <p>Ready for more? Expand sections to learn the technical details</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;
