import React from 'react';
import { ArrowLeft, FileText, RefreshCcw, ShieldCheck } from 'lucide-react';

type LegalPolicyType = 'privacy-policy' | 'terms-and-conditions' | 'return-policy';

interface LegalPageProps {
  policy: LegalPolicyType;
  onNavigate: (tab: string) => void;
}

const policyContent: Record<LegalPolicyType, {
  eyebrow: string;
  title: string;
  summary: string;
  icon: React.ElementType;
  sections: Array<{ heading: string; body: string[] }>;
}> = {
  'privacy-policy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    summary: 'This policy explains how CampusLink collects, uses, stores, and protects personal information across student, expert, institution, and marketplace activities.',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'CampusLink may collect account details such as your name, email address, phone number, institution details, course information, department, level, and profile data you provide when registering or updating your account.',
          'For verification and security, we may also collect KYC information, uploaded identity documents, student verification records, transaction references, wallet records, and platform activity related to messages, listings, bookings, and purchases.'
        ]
      },
      {
        heading: 'How we use your information',
        body: [
          'We use your information to create and manage your account, process purchases, manage wallet and billing activity, review verification requests, provide support, improve marketplace trust, and maintain platform security.',
          'We may also use limited account and activity data for fraud prevention, abuse monitoring, service optimization, dispute handling, compliance reviews, and service-related communication.'
        ]
      },
      {
        heading: 'How data is shared',
        body: [
          'CampusLink does not sell your personal data. We may share necessary data with payment providers, verification reviewers, infrastructure providers, or law enforcement where disclosure is required for payment processing, compliance, security, or legal obligations.',
          'Marketplace buyers and sellers may also see limited public-facing information required to complete transactions, such as listing details, seller names, or message-based coordination data.'
        ]
      },
      {
        heading: 'Storage and security',
        body: [
          'We take reasonable technical and administrative measures to protect your data from unauthorized access, misuse, alteration, or loss. However, no digital system can guarantee absolute security.',
          'You are responsible for keeping your password and account access secure. If you believe your account or identity documents have been compromised, contact support immediately.'
        ]
      },
      {
        heading: 'Your rights',
        body: [
          'You may request updates to inaccurate account information, withdraw from optional communications, or request support regarding your stored personal data, subject to applicable legal or operational retention requirements.',
          'Where certain records must be retained for legal, financial, fraud, dispute, or audit reasons, CampusLink may keep them for as long as reasonably necessary.'
        ]
      }
    ]
  },
  'terms-and-conditions': {
    eyebrow: 'Legal',
    title: 'Terms and Conditions',
    summary: 'These terms govern access to CampusLink, including user accounts, marketplace activity, payments, messaging, expert services, and verification requirements.',
    icon: FileText,
    sections: [
      {
        heading: 'Acceptance of terms',
        body: [
          'By creating an account, browsing the platform, submitting content, or using CampusLink services, you agree to these Terms and Conditions and any related policies referenced by the platform.',
          'If you do not agree with these terms, you should not use the platform or continue with account creation, listing publication, payments, or service requests.'
        ]
      },
      {
        heading: 'Accounts and verification',
        body: [
          'Users must provide accurate registration details and keep account information up to date. Certain platform features may require verification, identity review, KYC submission, or super admin approval before full access is granted.',
          'CampusLink may suspend, restrict, or terminate accounts that provide misleading information, violate community trust, attempt fraud, abuse the platform, or breach legal obligations.'
        ]
      },
      {
        heading: 'Marketplace and services',
        body: [
          'Sellers, experts, and institutions are responsible for the accuracy of the information they publish, including pricing, delivery expectations, descriptions, and representation of qualifications or goods.',
          'Buyers are responsible for reviewing listing details carefully before purchase. CampusLink may moderate listings, remove unsafe content, or intervene in disputes where needed to protect platform integrity.'
        ]
      },
      {
        heading: 'Payments and fees',
        body: [
          'Transactions processed through CampusLink may include service fees, delivery fees, subscription fees, wallet transactions, or payment gateway processing rules. Users are responsible for reviewing totals before payment.',
          'Payment confirmations may be subject to successful verification by the relevant payment provider. CampusLink may delay fulfillment, premium activation, or account benefits until payment status is confirmed.'
        ]
      },
      {
        heading: 'Platform conduct',
        body: [
          'Users must not misuse the platform, harass others, upload illegal or deceptive content, impersonate any person or institution, interfere with security controls, or attempt to bypass approval and payment workflows.',
          'CampusLink reserves the right to investigate misuse, restrict access, reverse benefits, remove listings, or cooperate with enforcement authorities where platform abuse is identified.'
        ]
      }
    ]
  },
  'return-policy': {
    eyebrow: 'Legal',
    title: 'Return Policy',
    summary: 'This policy describes how CampusLink handles returns, refunds, cancellations, and disputes for goods, digital services, marketplace transactions, and platform fees.',
    icon: RefreshCcw,
    sections: [
      {
        heading: 'Goods and physical items',
        body: [
          'Returns for physical goods may be considered where the delivered item is materially different from the listing, damaged on arrival, defective, or not delivered as agreed.',
          'Return requests should be submitted as quickly as possible with supporting evidence such as photos, delivery notes, or message history. Approval may depend on item condition, seller response, and dispute review.'
        ]
      },
      {
        heading: 'Expert services and digital work',
        body: [
          'Services, tutoring sessions, research support, data work, and digital deliverables are generally not refundable once the agreed work has started, been delivered, or been substantially completed.',
          'Where a service was not delivered as described, was abandoned, or clearly failed to meet the agreed scope, CampusLink may review the case and decide whether partial credit, rework, cancellation, or refund support is appropriate.'
        ]
      },
      {
        heading: 'Subscriptions and wallet funding',
        body: [
          'Premium subscriptions, wallet top-ups, and completed payment gateway transactions are generally final once the payment has been successfully processed and the platform benefit or balance has been made available.',
          'Refunds may still be reviewed in exceptional cases involving duplicate charges, confirmed processing errors, or unauthorized payment events, subject to payment provider verification.'
        ]
      },
      {
        heading: 'How to request a return or refund',
        body: [
          'To request a return, cancellation, or refund review, contact CampusLink support with your order reference, payment reference, account email, item or service details, and any evidence that supports your claim.',
          'CampusLink may request additional information from the buyer, seller, or service provider before making a decision. Final resolution may include refund, rejection, credit, replacement, or case closure.'
        ]
      },
      {
        heading: 'Policy limitations',
        body: [
          'CampusLink reserves the right to reject fraudulent, abusive, or unsupported refund requests. Repeated misuse of dispute or refund processes may lead to account restriction or permanent suspension.',
          'Nothing in this policy limits any rights that may apply under mandatory consumer protection laws where such rights cannot legally be excluded.'
        ]
      }
    ]
  }
};

export const LegalPage: React.FC<LegalPageProps> = ({ policy, onNavigate }) => {
  const content = policyContent[policy];
  const Icon = content.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-panel neo-card p-5 sm:p-6">
        <button
          type="button"
          onClick={() => onNavigate('marketplace')}
          className="inline-flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CampusLink
        </button>
      </div>

      <div className="glass-panel-strong neo-card p-6 sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
          <Icon className="w-4 h-4" />
          {content.eyebrow}
        </div>

        <div className="mt-6 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{content.title}</h1>
          <p className="text-base text-slate-600 max-w-3xl">{content.summary}</p>
          <p className="text-sm text-slate-500">Last updated: July 28, 2026</p>
        </div>
      </div>

      <div className="grid gap-4">
        {content.sections.map((section) => (
          <section key={section.heading} className="glass-panel neo-card p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">{section.heading}</h2>
            <div className="space-y-3 text-slate-600 leading-7">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="glass-panel neo-card p-5 sm:p-6 flex flex-wrap gap-3 items-center justify-between">
        <p className="text-sm text-slate-600">Need help with a policy question? Contact CampusLink support before placing an order or submitting verification.</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('privacy-policy')}
            className={`px-4 py-2 border text-sm transition-colors ${policy === 'privacy-policy' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'}`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onNavigate('terms-and-conditions')}
            className={`px-4 py-2 border text-sm transition-colors ${policy === 'terms-and-conditions' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'}`}
          >
            Terms and Conditions
          </button>
          <button
            type="button"
            onClick={() => onNavigate('return-policy')}
            className={`px-4 py-2 border text-sm transition-colors ${policy === 'return-policy' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'}`}
          >
            Return Policy
          </button>
        </div>
      </div>
    </div>
  );
};
