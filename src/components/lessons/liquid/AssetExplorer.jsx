import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins,
  DollarSign,
  TrendingUp,
  Building2,
  Shield,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './AssetExplorer.module.css';

// Example Liquid assets
const ASSETS = [
  {
    id: 'lbtc',
    name: 'Liquid Bitcoin',
    ticker: 'L-BTC',
    icon: '₿',
    color: '#f97316',
    type: 'Native',
    issuer: 'Federation Peg',
    description: 'The native asset of Liquid, pegged 1:1 with Bitcoin',
    totalSupply: '~3,500',
    features: ['1:1 BTC backing', 'Confidential amounts', '1-min finality'],
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    ticker: 'USDt',
    icon: '$',
    color: '#22c55e',
    type: 'Stablecoin',
    issuer: 'Tether Operations',
    description: 'USD-backed stablecoin issued on Liquid',
    totalSupply: '~2.5B',
    features: ['USD backing', 'Fast settlement', 'Exchange support'],
  },
  {
    id: 'bmn',
    name: 'BlockMint NFT',
    ticker: 'BMN',
    icon: '◆',
    color: '#a855f7',
    type: 'Security Token',
    issuer: 'Blockstream Mining',
    description: 'Tokenized hashrate representing Bitcoin mining power',
    totalSupply: '185,000',
    features: ['Mining exposure', 'Tradeable', 'Regulated'],
  },
  {
    id: 'jpy',
    name: 'Japan Yen Token',
    ticker: 'JPYS',
    icon: '¥',
    color: '#ec4899',
    type: 'Stablecoin',
    issuer: 'Digital Garage',
    description: 'Japanese Yen stablecoin for Asian markets',
    totalSupply: '~500M',
    features: ['JPY backing', 'Regulated issuer', 'Fast settlement'],
  },
];

export function AssetExplorer() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Coins size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Liquid Issued Assets</h3>
              <p className={styles.subtitle}>
                Explore tokens issued on the Liquid Network
              </p>
            </div>
          </div>
        </div>

        {/* Asset Grid */}
        <div className={styles.assetGrid}>
          {ASSETS.map((asset) => (
            <motion.button
              key={asset.id}
              className={`${styles.assetCard} ${selectedAsset.id === asset.id ? styles.selected : ''}`}
              onClick={() => {
                setSelectedAsset(asset);
                setShowDetails(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                borderColor: selectedAsset.id === asset.id ? asset.color : 'transparent',
              }}
            >
              <div 
                className={styles.assetIcon}
                style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
              >
                {asset.icon}
              </div>
              <div className={styles.assetInfo}>
                <span className={styles.assetName}>{asset.name}</span>
                <span className={styles.assetTicker}>{asset.ticker}</span>
              </div>
              <Badge 
                variant="outline" 
                size="small"
                style={{ borderColor: asset.color, color: asset.color }}
              >
                {asset.type}
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* Asset Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedAsset.id}
            className={styles.detailsSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={styles.detailsHeader}
              style={{ borderLeftColor: selectedAsset.color }}
            >
              <div 
                className={styles.detailsIcon}
                style={{ backgroundColor: selectedAsset.color }}
              >
                {selectedAsset.icon}
              </div>
              <div>
                <h4>{selectedAsset.name}</h4>
                <span className={styles.ticker}>{selectedAsset.ticker}</span>
              </div>
            </div>

            <p className={styles.description}>{selectedAsset.description}</p>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <Building2 size={16} />
                <div>
                  <span className={styles.statLabel}>Issuer</span>
                  <span className={styles.statValue}>{selectedAsset.issuer}</span>
                </div>
              </div>
              <div className={styles.stat}>
                <TrendingUp size={16} />
                <div>
                  <span className={styles.statLabel}>Total Supply</span>
                  <span className={styles.statValue}>{selectedAsset.totalSupply}</span>
                </div>
              </div>
            </div>

            <div className={styles.features}>
              <span className={styles.featuresLabel}>Features:</span>
              <div className={styles.featuresList}>
                {selectedAsset.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" size="small">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* How It Works */}
        <div className={styles.howItWorks}>
          <h4>How Asset Issuance Works</h4>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <strong>Create Asset</strong>
                <p>Issuer defines asset metadata (name, supply, etc.) and creates issuance transaction</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <strong>Receive Tokens</strong>
                <p>Tokens are sent to the issuer's address, ready for distribution</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <strong>Transfer & Trade</strong>
                <p>Tokens can be sent to any Liquid address with confidential amounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className={styles.infoBox}>
          <Info size={18} />
          <div>
            <strong>Asset ID</strong>
            <p>
              Each asset has a unique 64-character hex ID derived from its issuance transaction. 
              This prevents asset spoofing - you always know exactly which asset you're receiving.
            </p>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Issued Assets on Liquid"
        variant="deepdive"
        icon={<Coins size={16} />}
      >
        <p>
          Liquid supports the issuance of arbitrary assets, similar to tokens on Ethereum 
          but with some key differences:
        </p>
        <ul>
          <li>
            <strong>Native protocol support:</strong> Assets are first-class citizens in 
            Liquid, not smart contracts. This makes them simpler and more efficient.
          </li>
          <li>
            <strong>Confidential Assets:</strong> Not only are amounts hidden, but the 
            asset type itself can be hidden! Observers can't tell if a transaction moved 
            L-BTC, USDt, or any other asset.
          </li>
          <li>
            <strong>Reissuance tokens:</strong> Issuers can create "reissuance tokens" that 
            allow minting more of an asset later. Without one, supply is permanently fixed.
          </li>
          <li>
            <strong>Atomic swaps:</strong> Multiple assets can be exchanged in a single 
            transaction, enabling trustless peer-to-peer trading.
          </li>
        </ul>
        <p>
          <strong>Use cases:</strong> Stablecoins, security tokens, reward points, 
          tokenized commodities, collectibles, and more.
        </p>
      </Accordion>
    </div>
  );
}

export default AssetExplorer;
