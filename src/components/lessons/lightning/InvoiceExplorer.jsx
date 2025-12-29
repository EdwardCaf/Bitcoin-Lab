import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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

const INVOICE_PARTS = [
  { prefix: 'ln', label: 'Lightning Network', color: '#f97316' },
  { prefix: 'bc', label: 'Bitcoin mainnet', color: '#3b82f6' },
  { prefix: '10u', label: 'Amount (10 microsats)', color: '#22c55e' },
  { prefix: '1', label: 'Separator', color: '#6b7280' },
  { prefix: 'pjq4xyz', label: 'Timestamp', color: '#a855f7' },
  { prefix: 'pp5...', label: 'Payment hash', color: '#ec4899' },
  { prefix: 'dpl...', label: 'Description', color: '#14b8a6' },
  { prefix: 'xaq...', label: 'Signature', color: '#f59e0b' },
];

export function InvoiceExplorer() {
  const [currentInvoice, setCurrentInvoice] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const invoice = SAMPLE_INVOICES[currentInvoice];

  const generateNewInvoice = () => {
    setCurrentInvoice((prev) => (prev + 1) % SAMPLE_INVOICES.length);
    setSelectedPart(null);
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

        {/* Invoice Parts Breakdown */}
        <div className={styles.partsSection}>
          <h4>Invoice Structure</h4>
          <p className={styles.partsHint}>Click each part to learn more</p>
          <div className={styles.partsList}>
            {INVOICE_PARTS.map((part, i) => (
              <motion.button
                key={i}
                className={`${styles.partChip} ${selectedPart === i ? styles.selected : ''}`}
                style={{ 
                  backgroundColor: selectedPart === i ? part.color : `${part.color}20`,
                  borderColor: part.color,
                  color: selectedPart === i ? 'white' : part.color
                }}
                onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <code>{part.prefix}</code>
              </motion.button>
            ))}
          </div>
          
          {selectedPart !== null && (
            <motion.div
              className={styles.partDetail}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderColor: INVOICE_PARTS[selectedPart].color }}
            >
              <strong style={{ color: INVOICE_PARTS[selectedPart].color }}>
                {INVOICE_PARTS[selectedPart].label}
              </strong>
              <p>{getPartDescription(selectedPart)}</p>
            </motion.div>
          )}
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
        title="Deep Dive: BOLT11 Invoice Format"
        variant="deepdive"
        icon={<FileText size={16} />}
      >
        <p>
          Lightning invoices follow the BOLT11 specification, encoding payment 
          information in a compact, human-readable format:
        </p>
        <ul>
          <li>
            <strong>Human-readable part:</strong> Starts with 'ln' (Lightning Network) 
            followed by the network ('bc' for mainnet, 'tb' for testnet) and amount
          </li>
          <li>
            <strong>Timestamp:</strong> Unix timestamp when the invoice was created, 
            encoded in base32
          </li>
          <li>
            <strong>Tagged fields:</strong> Include payment hash, description, expiry, 
            routing hints, and feature bits
          </li>
          <li>
            <strong>Signature:</strong> The payee's signature over the entire invoice, 
            proving authenticity
          </li>
        </ul>
        <p>
          <strong>Why invoices?</strong> Unlike Bitcoin addresses, Lightning invoices 
          are single-use and include the amount. This prevents payment errors and 
          enables the receiver to know exactly what payment to expect.
        </p>
      </Accordion>
    </div>
  );
}

function getPartDescription(index) {
  const descriptions = [
    'Indicates this is a Lightning Network invoice, distinguishing it from regular Bitcoin addresses.',
    'Specifies the Bitcoin network - "bc" for mainnet, "tb" for testnet, "bcrt" for regtest.',
    'The payment amount encoded using multiplier suffixes (m=milli, u=micro, n=nano, p=pico).',
    'A separator between the human-readable and data parts of the invoice.',
    'The creation timestamp, telling wallets when this invoice was generated.',
    'A unique 256-bit hash that identifies this specific payment. The preimage is revealed on success.',
    'A short description of what this payment is for, helping the payer identify the purchase.',
    'The payee\'s cryptographic signature, proving this invoice came from the intended recipient.',
  ];
  return descriptions[index] || '';
}

export default InvoiceExplorer;
