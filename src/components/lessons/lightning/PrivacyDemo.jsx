import { 
  EyeOff, 
  Eye,
  Zap,
  Shield,
  Check,
  X,
  Lock,
  ArrowRight,
  FileText,
  Clock
} from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './PrivacyDemo.module.css';

const PAYMENT_AMOUNT = '50,000';

export function PrivacyDemo() {
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <EyeOff size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Lightning Privacy</h3>
              <p className={styles.subtitle}>
                How Lightning protects your financial privacy
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className={styles.comparisonSection}>
          {/* On-Chain Column */}
          <div className={styles.comparisonColumn} data-type="onchain">
            <div className={styles.columnHeader}>
              <div className={styles.columnIcon} data-type="onchain">
                <Eye size={18} />
              </div>
              <div>
                <h4>On-Chain</h4>
                <Badge variant="error" size="small">Public</Badge>
              </div>
            </div>
            
            <div className={styles.visibilityList}>
              <div className={styles.visibilityItem} data-visible="true">
                <Eye size={14} />
                <span>Receiver address</span>
              </div>
              <div className={styles.visibilityItem} data-visible="true">
                <Eye size={14} />
                <span>Amount sent</span>
              </div>
              <div className={styles.visibilityItem} data-visible="true">
                <Eye size={14} />
                <span>Transaction time</span>
              </div>
              <div className={styles.visibilityItem} data-visible="true">
                <Eye size={14} />
                <span>Permanent record</span>
              </div>
            </div>
            
            <div className={styles.columnFooter} data-type="onchain">
              <X size={16} />
              <span>Anyone can trace payments</span>
            </div>
          </div>

          {/* Lightning Column */}
          <div className={styles.comparisonColumn} data-type="lightning">
            <div className={styles.columnHeader}>
              <div className={styles.columnIcon} data-type="lightning">
                <Zap size={18} />
              </div>
              <div>
                <h4>Lightning</h4>
                <Badge variant="success" size="small">Private</Badge>
              </div>
            </div>
            
            <div className={styles.visibilityList}>
              <div className={styles.visibilityItem} data-visible="false">
                <EyeOff size={14} />
                <span>Sender hidden</span>
              </div>
              <div className={styles.visibilityItem} data-visible="false">
                <EyeOff size={14} />
                <span>Amount hidden to Public</span>
              </div>
              <div className={styles.visibilityItem} data-visible="false">
                <EyeOff size={14} />
                <span>No public record</span>
              </div>
              <div className={styles.visibilityItem} data-visible="false">
                <EyeOff size={14} />
                <span>Onion routing</span>
              </div>
            </div>
            
            <div className={styles.columnFooter} data-type="lightning">
              <Check size={16} />
              <span>Only sender, receiver, and routers know</span>
            </div>
          </div>
        </div>

        {/* Onion Routing Visualization */}
        <div className={styles.onionSection}>
          <h4 className={styles.sectionTitle}>
            <Lock size={18} />
            Onion Routing
          </h4>
          <p className={styles.sectionDesc}>
            Each routing node only sees the previous and next hop - never the full path
          </p>
          
          <div className={styles.routePath}>
            <div className={styles.routeNode} data-role="sender">
              <div className={styles.nodeAvatar}>A</div>
              <span className={styles.nodeName}>Alice</span>
              <span className={styles.nodeRole}>Sender</span>
              <div className={styles.nodeKnows}>
                <Check size={12} /> Knows full route
              </div>
            </div>
            
            <div className={styles.routeArrow}>
              <div className={styles.arrowLine} />
              <div className={styles.encryptedLabel}>
                <Lock size={10} />
                <span>Encrypted</span>
              </div>
            </div>
            
            <div className={styles.routeNode} data-role="routing">
              <div className={styles.nodeAvatar}>B</div>
              <span className={styles.nodeName}>Bob</span>
              <span className={styles.nodeRole}>Routing</span>
              <div className={styles.nodeKnows}>
                <EyeOff size={12} /> Only sees neighbors
              </div>
            </div>
            
            <div className={styles.routeArrow}>
              <div className={styles.arrowLine} />
              <div className={styles.encryptedLabel}>
                <Lock size={10} />
                <span>Encrypted</span>
              </div>
            </div>
            
            <div className={styles.routeNode} data-role="routing">
              <div className={styles.nodeAvatar}>C</div>
              <span className={styles.nodeName}>Carol</span>
              <span className={styles.nodeRole}>Routing</span>
              <div className={styles.nodeKnows}>
                <EyeOff size={12} /> Only sees neighbors
              </div>
            </div>
            
            <div className={styles.routeArrow}>
              <div className={styles.arrowLine} />
              <div className={styles.encryptedLabel}>
                <Lock size={10} />
                <span>Encrypted</span>
              </div>
            </div>
            
            <div className={styles.routeNode} data-role="receiver">
              <div className={styles.nodeAvatar}>D</div>
              <span className={styles.nodeName}>Dave</span>
              <span className={styles.nodeRole}>Receiver</span>
              <div className={styles.nodeKnows}>
                <Check size={12} /> Knows payment details
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Benefits Grid */}
        <div className={styles.benefitsSection}>
          <h4 className={styles.sectionTitle}>
            <Shield size={18} />
            Privacy Benefits
          </h4>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.benefitContent}>
                <strong>No Public Record</strong>
                <p>Payments aren't recorded on the blockchain</p>
              </div>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <EyeOff size={20} />
              </div>
              <div className={styles.benefitContent}>
                <strong>Sender/Receiver Unlinkable</strong>
                <p>Routing nodes can't connect endpoints</p>
              </div>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Lock size={20} />
              </div>
              <div className={styles.benefitContent}>
                <strong>Amount Hidden</strong>
                <p>Intermediaries don't see payment amounts</p>
              </div>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Zap size={20} />
              </div>
              <div className={styles.benefitContent}>
                <strong>Instant & Private</strong>
                <p>Fast settlement with strong privacy</p>
              </div>
            </div>
          </div>
        </div>

      </Card>
      
    </div>
  );
}

export default PrivacyDemo;
