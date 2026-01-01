import { useState } from 'react';
import { 
  FileText,
  QrCode,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Hash,
  User,
  DollarSign,
  MessageSquare,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './InvoiceExplorer.module.css';

// Sample invoices with decoded information
const SAMPLE_INVOICES = [
  {
    raw: 'lnbc10u1pjq4xyzpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52dl6a3xmsqpfhxkfsnvdmcxferctvqc7q',
    decoded: {
      network: 'mainnet',
      amount: 0.00001,
      amountSats: 1000,
      timestamp: Date.now() - 300000,
      expiry: 3600,
      paymentHash: 'qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqf',
      description: 'Coffee at Bitcoin Cafe',
      destination: '03e7156ae33b0a208d0744199163177e909e80176e55d97a2f221ede0f934dd9ad',
    }
  },
  {
    raw: 'lnbc500n1pjq5abcpp5xyz123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcqdqqcqzpgxqyz5vqsp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfs9qyyssqr4uxhk2lpqfjc6mj9dhrqxf8',
    decoded: {
      network: 'mainnet',
      amount: 0.00000050,
      amountSats: 50,
      timestamp: Date.now() - 120000,
      expiry: 600,
      paymentHash: 'xyz123abc456def789ghi012jkl345mno678pqr901stu234',
      description: 'Tip for great service',
      destination: '02a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef12345678',
    }
  },
  {
    raw: 'lnbc1m1pjq6defpp5mno345pqr678stu901vwx234yza567bcd890efg123hij456klm789noqdq8w3jhxaqxqyjw5qcqp2sp5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqs9qyyssqabc123',
    decoded: {
      network: 'mainnet',
      amount: 0.001,
      amountSats: 100000,
      timestamp: Date.now() - 60000,
      expiry: 86400,
      paymentHash: 'mno345pqr678stu901vwx234yza567bcd890efg123hij456',
      description: 'Monthly subscription',
      destination: '03f1e2d3c4b5a697089abcdef0123456789abcdef0123456789abcdef01234567',
    }
  }
];

export function InvoiceExplorer() {
  const [currentInvoice, setCurrentInvoice] = useState(0);
  const [copied, setCopied] = useState(false);

  const invoice = SAMPLE_INVOICES[currentInvoice];

  const generateNewInvoice = () => {
    setCurrentInvoice((prev) => (prev + 1) % SAMPLE_INVOICES.length);
  };

  const copyInvoice = async () => {
    await navigator.clipboard.writeText(invoice.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleString();
  };

  const formatExpiry = (seconds) => {
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    return `${Math.floor(seconds / 86400)} days`;
  };

  const isExpired = () => {
    return Date.now() > invoice.decoded.timestamp + (invoice.decoded.expiry * 1000);
  };

  const timeRemaining = () => {
    const expireTime = invoice.decoded.timestamp + (invoice.decoded.expiry * 1000);
    const remaining = expireTime - Date.now();
    if (remaining <= 0) return 'Expired';
    return formatExpiry(remaining / 1000) + ' remaining';
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <FileText size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Lightning Invoice Explorer</h3>
              <p className={styles.subtitle}>
                Decode and understand BOLT11 Lightning invoices
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            <Button
              variant="secondary"
              size="small"
              icon={<RefreshCw size={14} />}
              onClick={generateNewInvoice}
            >
              New Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Display */}
        <div className={styles.invoiceSection}>
          <div className={styles.invoiceHeader}>
            <h4>BOLT11 Invoice</h4>
            <div className={styles.invoiceActions}>
              <Button
                variant="ghost"
                size="small"
                icon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={copyInvoice}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          
          <div className={styles.invoiceRaw}>
            <code>{invoice.raw}</code>
          </div>

          {/* QR Code Placeholder */}
          <div className={styles.qrSection}>
            <div className={styles.qrPlaceholder}>
              <QrCode size={80} />
              <span>QR Code</span>
            </div>
            <p className={styles.qrHint}>
              Scan with a Lightning wallet to pay
            </p>
          </div>
        </div>

        {/* Invoice Components */}
        <div className={styles.componentsSection}>
          <h4>Invoice Components</h4>
          <p className={styles.componentsIntro}>
            A BOLT-11 invoice encodes all the information needed to make a Lightning payment:
          </p>
          
          <div className={styles.componentsList}>
            <div className={styles.componentGroup}>
              <h5 className={styles.componentGroupTitle}>Human-Readable Part</h5>
              <ul className={styles.componentItems}>
                <li><strong>Prefix</strong> <code>ln</code> - Identifies this as a Lightning Network invoice</li>
                <li><strong>Network</strong> <code>bc</code> - Which Bitcoin network (bc, tb, tbs, bcrt)</li>
                <li><strong>Amount</strong> <code>10u</code> - Payment amount with multiplier (m, u, n, p)</li>
              </ul>
            </div>

            <div className={styles.componentGroup}>
              <h5 className={styles.componentGroupTitle}>Data Part</h5>
              <ul className={styles.componentItems}>
                <li><strong>Timestamp</strong> <code>1496314658</code> - When the invoice was created (Unix time)</li>
                <li><strong>Payment Hash</strong> <code>pp5...</code> - Unique 256-bit identifier; its preimage is proof of payment</li>
                <li><strong>Payment Secret</strong> <code>sp5...</code> - Prevents probing attacks and enables multi-path payments</li>
                <li><strong>Description</strong> <code>dq...</code> - Human-readable text explaining what the payment is for</li>
                <li><strong>Expiry</strong> <code>xq...</code> - How long until the invoice expires (default: 1 hour)</li>
                <li><strong>Min Final CLTV Expiry</strong> <code>cq...</code> - Minimum timelock for the final hop</li>
                <li><strong>Routing Hints</strong> <code>rq...</code> - Channel info for reaching nodes with private channels</li>
                <li><strong>Feature Bits</strong> <code>9q...</code> - Indicates required and supported protocol features</li>
                <li><strong>Payee Public Key</strong> <code>nq...</code> - The recipient's node ID (optional)</li>
              </ul>
            </div>

            <div className={styles.componentGroup}>
              <h5 className={styles.componentGroupTitle}>Signature</h5>
              <ul className={styles.componentItems}>
                <li><strong>ECDSA Signature</strong> <code>3045022100...</code> - 65-byte recoverable signature proving the invoice came from the payee</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Decoded Information */}
        <div className={styles.decodedSection}>
          <h4>Decoded Information</h4>
          
          <div className={styles.decodedGrid}>
            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <DollarSign size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Amount</span>
                <span className={styles.decodedValue}>
                  {invoice.decoded.amount} BTC
                  <span className={styles.satsValue}>
                    ({invoice.decoded.amountSats.toLocaleString()} sats)
                  </span>
                </span>
              </div>
            </div>

            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <MessageSquare size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Description</span>
                <span className={styles.decodedValue}>{invoice.decoded.description}</span>
              </div>
            </div>

            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <Clock size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Created</span>
                <span className={styles.decodedValue}>
                  {formatTimestamp(invoice.decoded.timestamp)}
                </span>
              </div>
            </div>

            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <Clock size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Expires</span>
                <span className={styles.decodedValue}>
                  {formatExpiry(invoice.decoded.expiry)}
                  <Badge 
                    variant={isExpired() ? 'error' : 'success'} 
                    size="small"
                    style={{ marginLeft: 'var(--spacing-sm)' }}
                  >
                    {timeRemaining()}
                  </Badge>
                </span>
              </div>
            </div>

            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <Hash size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Payment Hash</span>
                <code className={styles.hashValue}>
                  {invoice.decoded.paymentHash.slice(0, 20)}...
                </code>
              </div>
            </div>

            <div className={styles.decodedItem}>
              <div className={styles.decodedIcon}>
                <User size={18} />
              </div>
              <div className={styles.decodedContent}>
                <span className={styles.decodedLabel}>Destination</span>
                <code className={styles.hashValue}>
                  {invoice.decoded.destination.slice(0, 20)}...
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Network Badge */}
        <div className={styles.networkInfo}>
          <Info size={14} />
          <span>Network: </span>
          <Badge variant="primary" size="small">
            Bitcoin {invoice.decoded.network}
          </Badge>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: BOLT-12 Offers"
        variant="deepdive"
        icon={<FileText size={16} />}
      >
        <p>
          <strong>BOLT-12</strong> is the next generation of Lightning payments, solving key limitations 
          of BOLT-11 invoices. Instead of single-use invoices, BOLT-12 introduces <strong>Offers</strong>.
        </p>
        
        <h5>What's an Offer?</h5>
        <p>
          An Offer is like a reusable payment link. You can publish one static Offer and receive 
          unlimited payments to it - no more generating a new invoice for every transaction.
        </p>

        <h5>Key Benefits</h5>
        <ul>
          <li>
            <strong>Reusable:</strong> One Offer can be paid multiple times, perfect for donation 
            pages, tip jars, or recurring payments
          </li>
          <li>
            <strong>No expiration:</strong> Offers don't expire like BOLT-11 invoices do
          </li>
          <li>
            <strong>Better privacy:</strong> Uses onion messages so the payer doesn't learn the 
            recipient's node ID
          </li>
          <li>
            <strong>Refunds built-in:</strong> Native support for the merchant to send money back 
            to the payer
          </li>
          <li>
            <strong>Payer proofs:</strong> Cryptographic proof that you made a specific payment
          </li>
        </ul>

        <h5>How It Works</h5>
        <p>
          When you scan an Offer, your wallet sends an onion message to request a fresh invoice. 
          The recipient's node automatically responds with a unique invoice just for you. This 
          happens instantly and privately over the Lightning Network itself - no web server needed.
        </p>

        <p>
          <strong>Adoption:</strong> BOLT-12 is implemented in Core Lightning and is being added 
          to other implementations. Look for Offers starting with <code>lno1...</code> instead 
          of the familiar <code>lnbc...</code> invoices.
        </p>
      </Accordion>
    </div>
  );
}

export default InvoiceExplorer;
