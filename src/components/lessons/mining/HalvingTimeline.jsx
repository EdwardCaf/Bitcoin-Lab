import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Coins, TrendingUp, Clock, Info } from 'lucide-react';
import { Card, Slider, Badge, Accordion } from '../../common';
import { 
  getBlockReward, 
  getTotalSupply, 
  getHalvingEvents,
  HALVING_INTERVAL,
  MAX_SUPPLY,
  CURRENT_BLOCK_HEIGHT
} from '../../../utils/bitcoin';
import styles from './HalvingTimeline.module.css';

const halvingEvents = getHalvingEvents();

export function HalvingTimeline() {
  const [blockHeight, setBlockHeight] = useState(CURRENT_BLOCK_HEIGHT);
  
  const currentReward = useMemo(() => getBlockReward(blockHeight), [blockHeight]);
  const totalSupply = useMemo(() => getTotalSupply(blockHeight), [blockHeight]);
  const supplyPercentage = (totalSupply / MAX_SUPPLY) * 100;
  
  // Find current halving era
  const currentEra = useMemo(() => {
    const era = halvingEvents.findIndex((event, i) => {
      const nextEvent = halvingEvents[i + 1];
      return blockHeight >= event.blockHeight && (!nextEvent || blockHeight < nextEvent.blockHeight);
    });
    return era >= 0 ? era : halvingEvents.length - 1;
  }, [blockHeight]);
  
  // Calculate next halving
  const nextHalving = useMemo(() => {
    const nextEvent = halvingEvents[currentEra + 1];
    if (!nextEvent) return null;
    return {
      blockHeight: nextEvent.blockHeight,
      blocksRemaining: nextEvent.blockHeight - blockHeight,
      estimatedDate: new Date(2009, 0, 3).getTime() + (nextEvent.blockHeight * 10 * 60 * 1000)
    };
  }, [blockHeight, currentEra]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className={styles.container}>
      {/* Main Card */}
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Coins size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Bitcoin Halving & Supply</h3>
              <p className={styles.subtitle}>
                Explore Bitcoin's predictable monetary policy
              </p>
            </div>
          </div>
        </div>

        {/* Block Height Slider */}
        <div className={styles.sliderSection}>
          <Slider
            value={blockHeight}
            onChange={setBlockHeight}
            min={0}
            max={2100000}
            step={1000}
            label="Block Height"
            formatValue={(v) => `#${v.toLocaleString()}`}
          />
          <div className={styles.sliderLabels}>
            <span>Genesis (2009)</span>
            <span>Year ~2140</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Coins size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Block Reward</span>
              <span className={styles.statValue}>
                {currentReward >= 0.00000001 ? `${currentReward} BTC` : '0 BTC'}
              </span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Supply</span>
              <span className={styles.statValue}>
                {formatNumber(totalSupply)} BTC
              </span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Halving Era</span>
              <span className={styles.statValue}>
                {currentEra + 1} of ~32
              </span>
            </div>
          </div>
        </div>

        {/* Supply Progress */}
        <div className={styles.supplySection}>
          <div className={styles.supplyHeader}>
            <span className={styles.supplyLabel}>Supply Mined</span>
            <span className={styles.supplyPercent}>{supplyPercentage.toFixed(2)}%</span>
          </div>
          <div className={styles.supplyBar}>
            <motion.div 
              className={styles.supplyFill}
              initial={{ width: 0 }}
              animate={{ width: `${supplyPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className={styles.supplyLabels}>
            <span>0 BTC</span>
            <span>21,000,000 BTC (Max)</span>
          </div>
        </div>

        {/* Next Halving */}
        {nextHalving && (
          <div className={styles.nextHalving}>
            <div className={styles.nextHalvingIcon}>
              <Clock size={20} />
            </div>
            <div className={styles.nextHalvingContent}>
              <span className={styles.nextHalvingLabel}>Next Halving</span>
              <span className={styles.nextHalvingValue}>
                {formatNumber(nextHalving.blocksRemaining)} blocks away
              </span>
              <span className={styles.nextHalvingMeta}>
                Block #{nextHalving.blockHeight.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className={styles.timeline}>
          <h4 className={styles.timelineTitle}>Halving History</h4>
          <div className={styles.timelineTrack}>
            {halvingEvents.slice(0, 8).map((event, index) => {
              const isActive = index === currentEra;
              const isPast = index < currentEra;
              
              return (
                <div 
                  key={index}
                  className={`${styles.timelineItem} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''}`}
                  onClick={() => setBlockHeight(event.blockHeight + 1000)}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineYear}>{event.year}</span>
                    <span className={styles.timelineReward}>{event.reward} BTC</span>
                    <span className={styles.timelineBlock}>
                      Block {formatNumber(event.blockHeight)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className={styles.insights}>
        <Card padding="medium" className={styles.insightCard}>
          <h4>Predictable Supply</h4>
          <p>Unlike fiat currency, Bitcoin's issuance is completely transparent and predictable.</p>
        </Card>
        <Card padding="medium" className={styles.insightCard}>
          <h4>Decreasing Inflation</h4>
          <p>Each halving cuts the new supply in half, making Bitcoin increasingly scarce.</p>
        </Card>
        <Card padding="medium" className={styles.insightCard}>
          <h4>21 Million Cap</h4>
          <p>By ~2140, all bitcoin will be mined. Miners will earn fees only.</p>
        </Card>
      </div>

      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: The Halving Mechanism"
        variant="deepdive"
        icon={<Coins size={16} />}
      >
        <p>
          The halving is hardcoded into Bitcoin's protocol. Every 210,000 blocks 
          (approximately 4 years), the block reward is cut in half.
        </p>
        <p>Historical halvings:</p>
        <ul>
          <li><strong>2009:</strong> 50 BTC per block (genesis)</li>
          <li><strong>2012:</strong> 25 BTC (first halving)</li>
          <li><strong>2016:</strong> 12.5 BTC</li>
          <li><strong>2020:</strong> 6.25 BTC</li>
          <li><strong>2024:</strong> 3.125 BTC (current)</li>
        </ul>
        <p>
          This creates a disinflationary monetary policy. The last bitcoin will be 
          mined around the year 2140, when the reward becomes less than 1 satoshi 
          (the smallest unit of bitcoin).
        </p>
      </Accordion>
    </div>
  );
}

export default HalvingTimeline;
