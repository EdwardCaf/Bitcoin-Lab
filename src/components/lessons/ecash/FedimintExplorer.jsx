import { 
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  Coins,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Card, Badge } from '../../common';
import styles from './FedimintExplorer.module.css';

const GUARDIANS = [
  { id: 1, name: 'Coffee Shop', icon: '☕' },
  { id: 2, name: 'Local Bank', icon: '🏦' },
  { id: 3, name: 'Community Center', icon: '🏘️' },
  { id: 4, name: 'Bitcoin Meetup', icon: '₿' },
  { id: 5, name: 'Tech Cooperative', icon: '💻' }
];

export function FedimintExplorer() {
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Users size={24} />
            </div>
            <div>
              <h3 className={styles.title}>What is Fedimint?</h3>
              <p className={styles.subtitle}>
                A community custody solution that distributes trust across multiple guardians
              </p>
            </div>
          </div>
        </div>

        {/* Static Diagram */}
        <div className={styles.diagram}>
          {/* Users Section */}
          <div className={styles.diagramSection}>
            <div className={styles.diagramHeader}>
              <Users size={20} />
              <h4>Community Members</h4>
            </div>
            <div className={styles.userGroup}>
              <div className={styles.userIcon}>👤</div>
              <div className={styles.userIcon}>👤</div>
              <div className={styles.userIcon}>👤</div>
            </div>
            <p className={styles.diagramLabel}>Deposit Bitcoin</p>
          </div>

          {/* Arrow */}
          <div className={styles.arrowDown}>
            <ArrowRight size={32} />
          </div>

          {/* Federation Section */}
          <div className={styles.diagramSection}>
            <div className={styles.diagramHeader}>
              <Shield size={20} />
              <h4>Federation (3-of-5 Multisig)</h4>
            </div>
            <div className={styles.guardiansGrid}>
              {GUARDIANS.map((guardian) => (
                <div key={guardian.id} className={styles.guardian}>
                  <div className={styles.guardianIcon}>
                    <span className={styles.emoji}>{guardian.icon}</span>
                  </div>
                  <div className={styles.guardianName}>{guardian.name}</div>
                </div>
              ))}
            </div>
            <div className={styles.federationExplainer}>
              <Lock size={16} />
              <span>Bitcoin held in multisig wallet requiring 3 of 5 guardians to approve withdrawals</span>
            </div>
          </div>

          {/* Arrow */}
          <div className={styles.arrowDown}>
            <ArrowRight size={32} />
          </div>

          {/* eCash Section */}
          <div className={styles.diagramSection}>
            <div className={styles.diagramHeader}>
              <Coins size={20} />
              <h4>eCash Tokens</h4>
            </div>
            <div className={styles.ecashTokens}>
              <div className={styles.token}>💵</div>
              <div className={styles.token}>💵</div>
              <div className={styles.token}>💵</div>
            </div>
            <p className={styles.diagramLabel}>Private, instant transfers within community</p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className={styles.benefits}>
          <h4>Key Benefits</h4>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <CheckCircle size={20} />
              <div>
                <strong>Distributed Trust</strong>
                <p>No single guardian can steal funds - requires 3 of 5 to collude</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <CheckCircle size={20} />
              <div>
                <strong>Perfect Privacy</strong>
                <p>Blind signatures ensure guardians cannot track your spending</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <CheckCircle size={20} />
              <div>
                <strong>Resilient</strong>
                <p>Federation continues operating even if 2 guardians go offline</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <CheckCircle size={20} />
              <div>
                <strong>Instant Transfers</strong>
                <p>Send eCash tokens instantly with zero fees within your community</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparison Card */}
      <Card variant="elevated" padding="large">
        <h3 className={styles.comparisonTitle}>
          <Building size={20} />
          Single Mint vs. Federated Mint
        </h3>
        
        <div className={styles.comparison}>
          <div className={styles.comparisonItem}>
            <div className={styles.comparisonHeader}>
              <Building size={24} className={styles.singleMint} />
              <h4>Single Mint (Cashu)</h4>
            </div>
            <ul>
              <li className={styles.negative}>
                <XCircle size={16} />
                <span>One party holds all funds</span>
              </li>
              <li className={styles.negative}>
                <XCircle size={16} />
                <span>Single point of failure</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Simple to set up and use</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Near-perfect privacy via blind signatures</span>
              </li>
              <li className={styles.warning}>
                <AlertTriangle size={16} />
                <span>Best for small amounts with trusted mints</span>
              </li>
            </ul>
          </div>

          <div className={styles.comparisonDivider}>
            <span>VS</span>
          </div>

          <div className={styles.comparisonItem}>
            <div className={styles.comparisonHeader}>
              <Users size={24} className={styles.federation} />
              <h4>Federated Mint (Fedimint)</h4>
            </div>
            <ul>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Distributed trust across guardians</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Resilient to individual failures</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Community-managed custody</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Same blind signature privacy</span>
              </li>
              <li className={styles.warning}>
                <AlertTriangle size={16} />
                <span>More complex setup, requires trusted guardians</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      
    </div>
  );
}

export default FedimintExplorer;
