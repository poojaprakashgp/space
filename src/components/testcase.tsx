
'use client';

import { useState } from 'react';
import styles from './smartPay.module.scss';

const faqs = [
  {
    question: 'How do I lease with Smartpay?',
    answer:
      'Simply select SmartPay as your payment option at checkout. You will be asked to complete your SmartPay application before completing your transaction.',
  },
  {
    question: 'What can I lease with Smartpay?',
    answer: 'Phones, accessories, and more — as per vendor policy.',
  },
  {
    question: 'How much does SmartPay cost?',
    answer: 'Cost varies by lease amount, term, and approval criteria.',
  },
  {
    question: 'How many lease payments will I have?',
    answer: 'Typically monthly or bi-weekly. Final terms at checkout.',
  },
  {
    question: 'How can I return my leased items?',
    answer: 'Contact SmartPay support or return via original retailer.',
  },
];

export default function SmartPayModal() {
  const [activeTab, setActiveTab] = useState<'about' | 'faq'>('about');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.modal}>
      <div className={styles.tabHeader}>
        <div
          className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'faq' ? styles.active : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQS
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'about' ? (
          <div className={styles.about}>
            <p>
              Our Lease-to-own program is not available in MN, NJ, WI, WY and PR. You can use an alternate address to proceed, otherwise you will have to select a new payment method to continue.
            </p>
            <ul>
              <li>✔️ Apply in seconds</li>
              <li>💰 Get up to $1500</li>
              <li>📆 Pay over time</li>
            </ul>
          </div>
        ) : (
          <div className={styles.faq}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.question}
                  onClick={() => setOpenIndex(index === openIndex ? null : index)}
                >
                  {faq.question}
                  <span>{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className={styles.answer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



.modal {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  font-family: sans-serif;
}

.tabHeader {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  position: relative;
}

.active {
  color: #000;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 30%;
    right: 30%;
    height: 3px;
    background: #d31f27; // red underline
  }
}

.content {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}

.about p {
  margin-bottom: 12px;
}

.about ul {
  list-style: none;
  padding-left: 0;

  li {
    margin-bottom: 8px;
  }
}

.faqItem {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.question {
  width: 100%;
  background: none;
  border: none;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 0;
  font-size: 15px;
}

.answer {
  margin-top: 8px;
  color: #555;
  font-size: 14px;
}


.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  position: relative;

  &:hover {
    color: #000;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 30%;
      right: 30%;
      height: 3px;
      background: #d31f27; // same as active red underline
    }
  }
}

.active {
  color: #000;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 30%;
    right: 30%;
    height: 3px;
    background: #d31f27;
  }
}





.smartpay-modal {
  width: 100%;
  max-width: 500px;
  margin: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  .tab-container {
    display: flex;
    border-bottom: 1px solid #ddd;
    background: #f9f9f9;
  }

  .tab {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-weight: 600;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      color: #000;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 30%;
        right: 30%;
        height: 3px;
        background-color: #d31f27;
        border-radius: 3px;
      }
    }
  }

  .tab.active {
    color: #000;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 30%;
      right: 30%;
      height: 3px;
      background-color: #d31f27;
      border-radius: 3px;
    }
  }

  .tab-content {
    padding: 20px;
    font-size: 15px;
    color: #333;
    line-height: 1.5;
  }

  .faq-item {
    border-top: 1px solid #eee;
    padding: 16px 0;

    .faq-question {
      font-weight: 600;
      cursor: pointer;
    }

    .faq-answer {
      margin-top: 8px;
      color: #555;
      font-size: 14px;
    }
  }

  .close-button {
    position: absolute;
    right: 16px;
    top: 16px;
    cursor: pointer;
    font-size: 18px;
    color: #999;

    &:hover {
      color: #000;
    }
  }
}

