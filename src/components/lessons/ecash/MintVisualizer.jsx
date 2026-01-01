import { 
  Coins,
  Zap,
  ArrowRight,
  Building,
  Check
} from 'lucide-react';
import { Card } from '../../common';
import styles from './MintVisualizer.module.css';

export function MintVisualizer() {
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Coins size={24} />
          </div>
          <div>
            <h3 className={styles.title}>Cashu Basics</h3>
            <p className={styles.subtitle}>
              How Bitcoin becomes eCash tokens (and back again)
            </p>
          </div>
        </div>

        {/* Simple explanation */}
        <div className={styles.explainer}>
          <p>
            A <strong>mint</strong> is like a bank that holds your Bitcoin and gives you 
            digital tokens in return. These tokens can be sent to anyone instantly and privately.
          </p>
        </div>

        {/* Two operations side by side */}
        <div className={styles.operationsGrid}>
          {/* Minting */}
          <div className={styles.operationCard}>
            <h4 className={styles.operationTitle}>
              <span className={styles.stepNumber}>1</span>
              Minting (Deposit)
            </h4>
            <p className={styles.operationDesc}>
              Convert your Bitcoin into eCash tokens
            </p>
            
            <div className={styles.flowDiagram}>
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="lightning">
                  <Zap size={20} />
                </div>
                <span>You send Bitcoin</span>
              </div>
              
              <ArrowRight size={20} className={styles.flowArrow} />
              
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="mint">
                  <Building size={20} />
                </div>
                <span>Mint holds it</span>
              </div>
              
              <ArrowRight size={20} className={styles.flowArrow} />
              
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="tokens">
                  <Coins size={20} />
                </div>
                <span>You get tokens</span>
              </div>
            </div>

            <div className={styles.exampleBox}>
              <strong>Example:</strong> Send 1000 sats via Lightning, receive eCash tokens worth 1000 sats
            </div>
          </div>

          {/* Melting */}
          <div className={styles.operationCard}>
            <h4 className={styles.operationTitle}>
              <span className={styles.stepNumber}>2</span>
              Melting (Withdraw)
            </h4>
            <p className={styles.operationDesc}>
              Convert your eCash tokens back to Bitcoin
            </p>
            
            <div className={styles.flowDiagram}>
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="tokens">
                  <Coins size={20} />
                </div>
                <span>You send tokens</span>
              </div>
              
              <ArrowRight size={20} className={styles.flowArrow} />
              
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="mint">
                  <Building size={20} />
                </div>
                <span>Mint destroys them</span>
              </div>
              
              <ArrowRight size={20} className={styles.flowArrow} />
              
              <div className={styles.flowItem}>
                <div className={styles.flowIcon} data-type="lightning">
                  <Zap size={20} />
                </div>
                <span>You get Bitcoin</span>
              </div>
            </div>

            <div className={styles.exampleBox}>
              <strong>Example:</strong> Redeem 500 sats of tokens, receive 500 sats via Lightning
            </div>
          </div>
        </div>

        {/* Token denominations - simplified */}
        <div className={styles.tokenSection}>
          <h4 className={styles.tokenTitle}>How Tokens Work</h4>
          <p className={styles.tokenDesc}>
            eCash tokens come in fixed sizes (like coins). Your balance is split into multiple tokens 
            that add up to your total.
          </p>
          
          <div className={styles.tokenExample}>
            <div className={styles.tokenEquation}>
              <span className={styles.tokenAmount}>100 sats</span>
              <span className={styles.tokenEquals}>=</span>
              <div className={styles.tokenBreakdown}>
                <span className={styles.tokenChip} data-value="64">64</span>
                <span className={styles.tokenPlus}>+</span>
                <span className={styles.tokenChip} data-value="32">32</span>
                <span className={styles.tokenPlus}>+</span>
                <span className={styles.tokenChip} data-value="4">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key points */}
        <div className={styles.keyPoints}>
          <h4 className={styles.keyPointsTitle}>Key Points</h4>
          <ul className={styles.keyPointsList}>
            <li>
              <Check size={16} className={styles.checkIcon} />
              <span>Tokens can be sent to anyone <strong>instantly</strong> with <strong>no fees</strong></span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} />
              <span>The mint <strong>cannot see</strong> who you send tokens to (that's the privacy!)</span>
            </li>
            <li>
              <Check size={16} className={styles.checkIcon} />
              <span>The mint <strong>holds your Bitcoin</strong> - choose one you trust</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default MintVisualizer;
