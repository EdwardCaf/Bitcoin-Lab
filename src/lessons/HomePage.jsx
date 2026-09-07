import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Check,
  Globe,
  Handshake,
} from "lucide-react";
import { Button, Badge } from "../components/common";
import { useMailerLiteOnVisible } from "../hooks/useMailerLite";
import styles from "./HomePage.module.css";

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MAILERLITE_SUBSCRIBE_ENDPOINT =
  "https://assets.mailerlite.com/jsonp/2111034/forms/179249626676725407/subscribe";

export function HomePage() {
  const [copied, setCopied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterError, setNewsletterError] = useState("");
  const { targetRef: newsletterSectionRef } = useMailerLiteOnVisible({
    rootMargin: "1000px 0px",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("edward@bitcoinmentor.io");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitNewsletter = async (email) => {
    if (typeof window === "undefined") {
      throw new Error("Newsletter signup is only available in the browser.");
    }

    const params = new URLSearchParams({
      "fields[email]": email,
      "ml-submit": "1",
      anticsrf: "true",
    });

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `${MAILERLITE_SUBSCRIBE_ENDPOINT}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new Error("Unable to subscribe right now. Please try again.");
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        return response.json();
      }

      return {
        success: response.ok,
        message: await response.text(),
      };
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new Error("The request timed out. Please try again.");
      }

      throw new Error("Unable to connect to MailerLite. Please try again.");
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const getNewsletterOutcome = (response) => {
    const rawMessage =
      typeof response === "string"
        ? response
        : response?.msg || response?.message || response?.error || "";
    const message = String(rawMessage)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wasSuccessful =
      response?.success === true ||
      response?.success === "true" ||
      response?.status === "success" ||
      response?.result === "success" ||
      /success/i.test(message) ||
      /thank you/i.test(message) ||
      /already/i.test(message);

    return { wasSuccessful, message };
  };

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    const email = newsletterEmail.trim();
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);

    setNewsletterError("");

    if (!isEmailValid) {
      setNewsletterStatus("error");
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setNewsletterStatus("loading");

    try {
      const response = await submitNewsletter(email);
      const { wasSuccessful, message } = getNewsletterOutcome(response);

      if (wasSuccessful) {
        setNewsletterStatus("success");
        setNewsletterEmail("");
        return;
      }

      setNewsletterStatus("error");
      setNewsletterError(
        message || "Unable to subscribe right now. Please try again.",
      );
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterError(
        error?.message || "Unable to subscribe right now. Please try again.",
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.heroGlow} aria-hidden="true" />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine}>Welcome to</span>
            <span className={styles.heroTitleMain}>
              The Bitcoin <span className={styles.heroHighlight}>OP</span>tic
            </span>
          </h1>

          <p className={styles.heroText}>
            Learn Bitcoin through beautiful visualizations. Explore lessons on
            wallets, privacy, Lightning payments, and more. Master the
            technology, all completely for free.
          </p>
        </motion.div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        ref={newsletterSectionRef}
        className={styles.newsletterSection}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.newsletterShell}>
          <div className={styles.newsletterIntro}>
            <p className={styles.newsletterIntroEyebrow}>
              Ideas worth thinking about
            </p>
            <h2 className={styles.newsletterIntroTitle}>
              <span className={styles.newsletterHeadingMain}>Edward&apos;s</span>{" "}
              <span className={styles.newsletterTitleAccent}>Newsletter</span>
            </h2>
            <p className={styles.newsletterIntroText}>
              I write about technology, philosophy, bitcoin, and whatever else I
              find worth exploring.
            </p>
          </div>

          <div className={styles.newsletterCardWrap}>
            <div className={styles.newsletterSignup}>
              <p className={styles.newsletterTitle}>Follow my curiosity</p>
              <p className={styles.newsletterPromo}>
                Occasional notes on ideas, tools, books, conversations, and
                anything else that changes how I see the world.
              </p>
              <div className={styles.newsletterMeta}>
                <span>1-2 emails/month</span>
                <span>100% Free</span>
              </div>
              <form
                className={styles.newsletterForm}
                onSubmit={handleNewsletterSubmit}
              >
                <label
                  htmlFor="newsletter-email"
                  className={styles.newsletterLabel}
                >
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => {
                    setNewsletterEmail(event.target.value);
                    if (newsletterStatus !== "idle") {
                      setNewsletterStatus("idle");
                      setNewsletterError("");
                    }
                  }}
                  placeholder="you@example.com"
                  className={styles.newsletterInput}
                  required
                  disabled={newsletterStatus === "loading"}
                />
                <Button
                  type="submit"
                  size="medium"
                  icon={<Mail size={16} />}
                  className={styles.newsletterButton}
                  loading={newsletterStatus === "loading"}
                >
                  Subscribe
                </Button>
              </form>
              {newsletterStatus === "success" && (
                <p className={styles.newsletterSuccess}>
                  <span className={styles.newsletterSuccessPrimary}>
                    <Check size={16} />
                    Thanks for subscribing.
                  </span>
                  <span>Check your inbox to confirm your subscription.</span>
                </p>
              )}
              {newsletterStatus === "error" && (
                <p
                  className={styles.newsletterError}
                  role="alert"
                  aria-live="assertive"
                >
                  {newsletterError}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Personal Introduction */}
      <motion.section
        className={styles.mentorSection}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "80px" }}
        transition={{ duration: 0.25 }}
        aria-labelledby="mentor-heading"
      >
        <div className={styles.mentorCopy}>
          <div className={styles.mentorBadge}>
            <Badge
              variant="primary"
              size="medium"
              icon={<Handshake size={14} />}
            >
              Work with me 1-on-1
            </Badge>
          </div>
          <h2 id="mentor-heading" className={styles.mentorTitle}>
            Gain confidence on your path to financial sovereignty.
          </h2>
          <p className={styles.mentorText}>
            I&apos;ve been fascinated with bitcoin for over a decade and built
            The Bitcoin OPtic as my way of giving back to the community. If you
            are interested in self-custody then book a call with me and get
            started on your journey to financial sovereignty.
          </p>
          <div
            className={styles.mentorTopics}
            aria-label="Topics Edward helps with"
          >
            <span>Self-custody</span>
            <span>Privacy</span>
            <span>Inheritance</span>
          </div>
          <div className={styles.mentorCta}>
            <a
              href="https://calendar.proton.me/bookings#hAO6Yxm96KHGyHF8Be-K3A1mMjE-jIMnG2MgNj8UnDg="
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mentorButtonLink}
            >
              <span>Book Your Free Session</span>
              <ArrowRight size={20} />
            </a>
            <p className={styles.mentorCtaSubtext}>
              15-minute call &bull; No commitment &bull; 100% free
            </p>
          </div>
        </div>

        <aside className={styles.mentorCard} aria-label="About Edward">
          <div className={styles.mentorImageFrame}>
            <img
              src="/bio.jpg"
              alt="Edward, your Bitcoin mentor"
              className={styles.mentorImage}
            />
          </div>
          <div className={styles.mentorDetails}>
            <div className={styles.mentorIdentityRow}>
              <div>
                <p className={styles.mentorCardEyebrow}>Your Mentor</p>
                <h3 className={styles.mentorName}>Edward</h3>
              </div>
              <a
                href="https://btcmentor.io/mentor/edward-cafarella"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mentorBrand}
                aria-label="View Edward on BTC Mentor"
              >
                <img
                  src="/btcmentor-logo.png"
                  alt="BTC Mentor"
                  className={styles.mentorBrandLogo}
                />
              </a>
            </div>
            <p className={styles.mentorBio}>
              Bitcoin educator focused on self-custody, privacy, inheritance
              planning, and all of the latest freedom tech.
            </p>
          </div>
        </aside>
      </motion.section>

      {/* Footer Contact */}
      <motion.section
        className={styles.footerContact}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "80px" }}
        transition={{ duration: 0.2 }}
      >
        <span className={styles.footerLabel}>Connect with me</span>
        <div className={styles.footerLinks}>
          <a
            href="https://x.com/LiveFreeBTC"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <XIcon size={18} />
            <span className={styles.emailText}>@LiveFreeBTC</span>
          </a>
          <a
            href="https://primal.net/edward"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <Globe size={18} />
            <span className={styles.emailText}>Nostr</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className={styles.footerLink}
            type="button"
          >
            {copied ? <Check size={18} /> : <Mail size={18} />}
            <span className={styles.emailText}>
              {copied ? "Copied!" : "edward@bitcoinmentor.io"}
            </span>
          </button>
        </div>
      </motion.section>
    </div>
  );
}

export default HomePage;
