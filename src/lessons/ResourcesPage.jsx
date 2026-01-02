import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Zap,
  Coins,
  Droplets,
  Shield,
  Server,
  ArrowLeftRight,
  BookOpen,
  Search,
  ExternalLink,
  Library,
  Wallet,
  Filter,
  X
} from 'lucide-react';
import { Badge, Button } from '../components/common';
import styles from './ResourcesPage.module.css';

// Resource data structure
const RESOURCES = {
  desktopWallets: {
    title: 'Desktop Wallets',
    icon: Monitor,
    description: 'Full-featured Bitcoin wallets for desktop computers',
    resources: [
      {
        name: 'Sparrow Wallet',
        url: 'https://sparrowwallet.com',
        description: 'Full-featured desktop wallet with advanced coin control and privacy features.',
        tags: ['Desktop'],
        icon: Monitor,
        favorite: true
      },
      {
        name: 'Nunchuk',
        url: 'https://nunchuk.io',
        description: 'Collaborative multisig wallet for desktop and mobile with assisted key management.',
        tags: ['Desktop', 'Mobile'],
        icon: Shield
      }
    ]
  },
  mobileWallets: {
    title: 'Mobile Wallets',
    icon: Smartphone,
    description: 'Bitcoin wallets for iOS and Android devices',
    resources: [
      {
        name: 'Blue Wallet',
        url: 'https://bluewallet.io',
        description: 'Easy-to-use mobile wallet with Watch-only support.',
        tags: ['Mobile'],
        icon: Smartphone
      },
      {
        name: 'Bull Bitcoin Wallet',
        url: 'https://bullbitcoin.com',
        description: 'Non-custodial mobile wallet focused on Canadian Bitcoin users.',
        tags: ['Mobile', 'Liquid'],
        favorite: true,
        icon: Smartphone
      }
    ]
  },
  lightningWallets: {
    title: 'Lightning Wallets',
    icon: Zap,
    description: 'Wallets focused on Lightning Network payments',
    resources: [
      {
        name: 'Phoenix',
        url: 'https://phoenix.acinq.co',
        description: 'Self-custodial Lightning wallet with automatic channel management.',
        tags: ['Lightning', 'Mobile'],
        icon: Zap
      },
      {
        name: 'Zeus',
        url: 'https://zeusln.com',
        description: 'Mobile wallet for managing your Lightning node and on-chain funds.',
        tags: ['Lightning', 'Mobile'],
        icon: Zap
      }
    ]
  },
  ecashWallets: {
    title: 'Ecash Wallets',
    icon: Coins,
    description: 'Cashu ecash wallets for private payments',
    resources: [
      {
        name: 'Macadamia',
        url: 'https://macadamia.cash',
        description: 'Cashu ecash wallet with focus on privacy and ease of use.',
        tags: ['Ecash', 'Mobile'],
        icon: Coins
      },
      {
        name: 'Minibits',
        url: 'https://minibits.cash',
        description: 'Lightning and Cashu ecash wallet for private payments.',
        tags: ['Ecash', 'Mobile'],
        icon: Coins
      },
      {
        name: 'Cashu.me',
        url: 'https://Cashu.me',
        description: 'Progressive Web App Cashu wallet with built-in mint discovery.',
        tags: ['Ecash', 'Mobile'],
        icon: Coins
      }
    ]
  },
  liquidWallets: {
    title: 'Liquid Wallets',
    icon: Droplets,
    description: 'Wallets supporting the Liquid Network sidechain',
    resources: [
      {
        name: 'Blockstream Wallet',
        url: 'https://blockstream.com/green',
        description: 'Multi-platform wallet supporting Bitcoin and Liquid Network.',
        tags: ['Liquid', 'Mobile', 'Desktop'],
        icon: Droplets
      },
      {
        name: 'AQUA Wallet',
        url: 'https://aquawallet.io',
        description: 'Mobile wallet for Liquid Network with focus on UX.',
        tags: ['Liquid', 'Mobile'],
        icon: Droplets
      }
    ]
  },
  hardware: {
    title: 'Hardware Wallets',
    icon: Shield,
    description: 'Physical devices for secure Bitcoin key storage',
    resources: [
      {
        name: 'Coldcard',
        url: 'https://coldcard.com',
        description: 'Air-gapped Bitcoin hardware wallet with advanced security features.',
        tags: ['Air-gapped'],
        favorite: true,
        icon: Shield
      },
      {
        name: 'BitBox02',
        url: 'https://bitbox.swiss',
        description: 'Swiss-made hardware wallet with Bitcoin-only edition.',
        tags: ['Bitcoin-only'],
        icon: Shield
      },
      {
        name: 'Blockstream Jade',
        url: 'https://blockstream.com/jade',
        description: 'Budget-friendly hardware wallet with QR air-gapped signing.',
        tags: ['Air-gapped', 'Budget'],
        icon: Shield
      },
      {
        name: 'Tapsigner',
        url: 'https://tapsigner.com',
        description: 'NFC card for secure Bitcoin key storage in your wallet.',
        tags: ['NFC', 'Budget'],
        icon: Shield
      },
      {
        name: 'Foundation Passport',
        url: 'https://foundation.xyz/passport',
        description: 'Open-source, air-gapped hardware wallet with a beautiful interface.',
        tags: ['Air-gapped'],
        icon: Shield
      },
      {
        name: 'Trezor Safe 7',
        url: 'https://trezor.io/trezor-safe-7',
        description: 'Bitcoin-only edition hardware wallet with secure element and touchscreen.',
        tags: ['Bitcoin-only'],
        icon: Shield
      }
    ]
  },
  nodes: {
    title: 'Node Software',
    icon: Server,
    description: 'Run your own Bitcoin node for sovereignty and privacy',
    resources: [
      {
        name: 'Bitcoin Core',
        url: 'https://bitcoincore.org',
        description: 'The reference implementation of the Bitcoin protocol.',
        tags: ['Node', 'Reference'],
        icon: Server
      },
      {
        name: 'Umbrel',
        url: 'https://umbrel.com',
        description: 'User-friendly home server for Bitcoin, Lightning, and apps.',
        tags: ['Node'],
        icon: Server
      },
      {
        name: 'Start9',
        url: 'https://start9.com',
        description: 'Sovereign computing platform for running Bitcoin and other services.',
        tags: ['Node'],
        icon: Server,
        favorite: true
      }
    ]
  },
  exchanges: {
    title: 'Exchanges & Services',
    icon: ArrowLeftRight,
    description: 'Buy, sell, and trade Bitcoin',
    resources: [
      {
        name: 'River Financial',
        url: 'https://river.com',
        description: 'US-based Bitcoin exchange with Lightning withdrawals.',
        tags: ['Exchange', 'US', 'Lightning'],
        icon: ArrowLeftRight
      },
      {
        name: 'Strike',
        url: 'https://strike.me',
        description: 'Lightning-native app for sending money globally.',
        tags: ['Exchange', 'Global', 'Lightning'],
        icon: Zap,
        favorite: true
      },
      {
        name: 'Cash App',
        url: 'https://cash.app',
        description: 'Popular US payment app with Bitcoin buying and Lightning support.',
        tags: ['Exchange', 'US', 'Lightning'],
        icon: ArrowLeftRight
      },
      {
        name: 'Bisq 2',
        url: 'https://bisq.network',
        description: 'Decentralized peer-to-peer Bitcoin exchange.',
        tags: ['P2P'],
        icon: ArrowLeftRight
      },
      {
        name: 'RoboSats',
        url: 'https://learn.robosats.org',
        description: 'Private peer-to-peer Bitcoin exchange over Lightning and Tor.',
        tags: ['P2P'],
        icon: Zap
      },
      {
        name: 'Hodl Hodl',
        url: 'https://hodlhodl.com',
        description: 'Non-custodial peer-to-peer Bitcoin trading platform.',
        tags: ['P2P'],
        icon: ArrowLeftRight
      }
    ]
  },
  education: {
    title: 'Educational Resources',
    icon: BookOpen,
    description: 'Learn about Bitcoin from trusted sources',
    resources: [
      {
        name: 'Bitcoin.org',
        url: 'https://bitcoin.org',
        description: 'Official Bitcoin resource with guides, documentation, and wallet info.',
        tags: ['Reference'],
        icon: BookOpen
      },
      {
        name: 'BTC Sessions',
        url: 'https://youtube.com/@BTCSessions',
        description: 'Video tutorials covering wallets, nodes, Lightning, and privacy.',
        tags: ['Video', 'Tutorials'],
        icon: BookOpen,
        favorite: true
      },
      {
        name: 'Nakamoto Institute',
        url: 'https://nakamotoinstitute.org',
        description: 'Literature and research on Bitcoin, cryptography, and Austrian economics.',
        tags: ['Literature', 'History'],
        icon: Library
      }
    ]
  },
  books: {
    title: 'Books & Technical Reading',
    icon: Library,
    description: 'Deep dive into Bitcoin with these essential books',
    resources: [
      {
        name: 'Mastering Bitcoin',
        url: 'https://github.com/bitcoinbook/bitcoinbook',
        description: 'Andreas Antonopoulos\'s comprehensive technical guide to Bitcoin (free online).',
        tags: ['Technical'],
        icon: BookOpen
      },
      {
        name: 'Bitcoin Whitepaper',
        url: 'https://bitcoin.org/bitcoin.pdf',
        description: 'Satoshi Nakamoto\'s original Bitcoin whitepaper from 2008.',
        tags: ['Documentation'],
        icon: BookOpen
      }
    ]
  },
  explorers: {
    title: 'Block Explorers',
    icon: Search,
    description: 'Explore the Bitcoin blockchain and mempool',
    resources: [
      {
        name: 'Mempool.space',
        url: 'https://mempool.space',
        description: 'Open-source block explorer with mempool visualization and fee estimation.',
        tags: ['Block Explorer'],
        icon: Search
      },
      {
        name: 'Timechain Calendar',
        url: 'https://timechaincalendar.com',
        description: 'Unique visualization of Bitcoin blocks as a calendar.',
        tags: ['Visualization'],
        icon: Search
      }
    ]
  }
};

const getTagVariant = (tag) => {
  const tagLower = tag.toLowerCase();
  
  // Colored tags
  if (tagLower === 'desktop') return 'info';
  if (tagLower === 'mobile') return 'success';
  if (tagLower === 'lightning') return 'warning';
  if (tagLower === 'ecash') return 'purple';
  if (tagLower === 'liquid') return 'cyan';
  if (tagLower.includes('node')) return 'node';
  if (tagLower === 'exchange') return 'exchange';
  if (tagLower === 'p2p') return 'purple';
  
  // Default gray for descriptive tags
  return 'default';
};

// Get all unique tags from all resources
const getAllTags = () => {
  const tags = new Set();
  Object.values(RESOURCES).forEach(section => {
    section.resources.forEach(resource => {
      resource.tags.forEach(tag => tags.add(tag));
    });
  });
  return Array.from(tags).sort();
};

function ResourceCard({ resource }) {
  const Icon = resource.icon;
  const cardClasses = [styles.card, resource.favorite && styles.cardFavorite].filter(Boolean).join(' ');

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      {resource.favorite && (
        <span className={styles.favoriteBadge}>Favorite</span>
      )}
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <Icon size={20} />
        </div>
        <ExternalLink size={16} className={styles.externalIcon} />
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{resource.name}</h3>
        <p className={styles.cardDescription}>{resource.description}</p>
      </div>

      <div className={styles.cardTags}>
        {resource.tags.map((tag) => (
          <Badge key={tag} variant={getTagVariant(tag)} size="small">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.a>
  );
}

function ResourceSection({ section, delay = 0, filteredResources }) {
  const SectionIcon = section.icon;
  const resourcesToShow = filteredResources || section.resources;

  if (resourcesToShow.length === 0) return null;

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>
          <SectionIcon size={16} />
          <span>{section.title}</span>
        </div>
        <p className={styles.sectionDescription}>{section.description}</p>
      </div>

      <div className={styles.resourceGrid}>
        {resourcesToShow.map((resource, index) => (
          <ResourceCard key={resource.name} resource={resource} delay={delay + index * 0.05} />
        ))}
      </div>
    </motion.section>
  );
}

export function ResourcesPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const allTags = getAllTags();

  // Filter resources by selected tag
  const getFilteredResources = (section) => {
    if (!selectedTag) return section.resources;
    return section.resources.filter(resource => 
      resource.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    );
  };

  const clearFilter = () => {
    setSelectedTag(null);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="primary" size="medium" icon={<Library size={14} />}>
          Bitcoin-Only Resources
        </Badge>
        
        <h1 className={styles.heroTitle}>
          Bitcoin <span className={styles.heroHighlight}>Resources</span>
        </h1>
        
        <p className={styles.heroText}>
          A curated collection of Bitcoin-only wallets, hardware, node software, exchanges, 
          educational content, and tools. All resources are vetted for Bitcoin maximalism 
          and commitment to the Bitcoin standard.
        </p>

        {/* Filter Toggle */}
        <div className={styles.filterToggle}>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="medium"
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter by Tag
          </Button>
          {selectedTag && (
            <Badge variant={getTagVariant(selectedTag)} size="medium">
              {selectedTag}
              <button
                className={styles.clearFilter}
                onClick={clearFilter}
                aria-label="Clear filter"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
        </div>

        {/* Tag Filter Pills */}
        {showFilters && (
          <motion.div
            className={styles.tagFilter}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {allTags.map(tag => (
              <button
                key={tag}
                className={`${styles.tagPill} ${selectedTag === tag ? styles.active : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                <Badge variant={getTagVariant(tag)} size="small">
                  {tag}
                </Badge>
              </button>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Resource Sections */}
      <div className={styles.sections}>
        <ResourceSection 
          section={RESOURCES.desktopWallets} 
          delay={0}
          filteredResources={getFilteredResources(RESOURCES.desktopWallets)}
        />
        <ResourceSection 
          section={RESOURCES.mobileWallets} 
          delay={0.05}
          filteredResources={getFilteredResources(RESOURCES.mobileWallets)}
        />
        <ResourceSection 
          section={RESOURCES.lightningWallets} 
          delay={0.1}
          filteredResources={getFilteredResources(RESOURCES.lightningWallets)}
        />
        <ResourceSection 
          section={RESOURCES.ecashWallets} 
          delay={0.15}
          filteredResources={getFilteredResources(RESOURCES.ecashWallets)}
        />
        <ResourceSection 
          section={RESOURCES.liquidWallets} 
          delay={0.2}
          filteredResources={getFilteredResources(RESOURCES.liquidWallets)}
        />
        <ResourceSection 
          section={RESOURCES.hardware} 
          delay={0.25}
          filteredResources={getFilteredResources(RESOURCES.hardware)}
        />
        <ResourceSection 
          section={RESOURCES.nodes} 
          delay={0.3}
          filteredResources={getFilteredResources(RESOURCES.nodes)}
        />
        <ResourceSection 
          section={RESOURCES.exchanges} 
          delay={0.35}
          filteredResources={getFilteredResources(RESOURCES.exchanges)}
        />
        <ResourceSection 
          section={RESOURCES.education} 
          delay={0.4}
          filteredResources={getFilteredResources(RESOURCES.education)}
        />
        <ResourceSection 
          section={RESOURCES.books} 
          delay={0.45}
          filteredResources={getFilteredResources(RESOURCES.books)}
        />
        <ResourceSection 
          section={RESOURCES.explorers} 
          delay={0.5}
          filteredResources={getFilteredResources(RESOURCES.explorers)}
        />
      </div>

      {/* Disclaimer */}
      <motion.div
        className={styles.disclaimer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p>
          <strong>Disclaimer:</strong> These resources are provided for educational purposes. 
          Always do your own research (DYOR) before using any service or product. 
          The Bitcoin OPtic is not responsible for any losses incurred from using these resources.
        </p>
      </motion.div>
    </div>
  );
}

export default ResourcesPage;
