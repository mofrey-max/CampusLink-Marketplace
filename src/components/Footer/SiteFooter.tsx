import React from 'react';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';

interface SiteFooterProps {
  onNavigate?: (tab: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const services = [
    'Software Development',
    'IT Training & Consultancy',
    'Hardware & IoT Solutions'
  ];

  const quickLinks = [
    { label: 'Home', href: 'https://treyfatech.com.ng/' },
    { label: 'Services', href: 'https://treyfatech.com.ng/services' },
    { label: 'Contact', href: 'https://treyfatech.com.ng/contact' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', tab: 'privacy-policy' },
    { label: 'Terms and Conditions', tab: 'terms-and-conditions' },
    { label: 'Return Policy', tab: 'return-policy' }
  ];

  return (
    <footer className="glass-panel-strong text-slate-700 border-t border-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_24%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_1fr_0.9fr] gap-6 sm:gap-8">
          <div className="space-y-4 relative min-w-0">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-500 mb-3">Technology Partner</p>
              <h2 className="text-2xl font-semibold text-slate-900 text-neon">Treyfa-Tech & Integrated Services Ltd</h2>
            </div>
            <p className="text-sm text-slate-600 leading-6">
              World-class technology solutions tailored for businesses in Nigeria and beyond, with a focus on reliability,
              security, and scalable delivery.
            </p>
            <a
              href="https://treyfatech.com.ng/contact"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-medium hover:from-violet-500 hover:to-cyan-400 transition-colors neon-button"
            >
              Contact Treyfa-Tech
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Contact</h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-fuchsia-500 shrink-0" />
                <p>Shop No.5 EPP Plaza, Sangere FUTY Opposite MAU Main Gate, Adamawa State, Nigeria</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-fuchsia-500 shrink-0" />
                <div className="space-y-1">
                  <p>+2347014786424</p>
                  <p>08151991716</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-fuchsia-500 shrink-0" />
                <div className="space-y-1 break-all">
                  <p>info@treyfatech.com</p>
                  <p>support@treyfatech.com.ng</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Business Hours</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Clock3 className="w-4 h-4 mt-1 text-fuchsia-500 shrink-0" />
                <div className="space-y-1">
                  <p>Monday - Friday: 8AM - 6PM</p>
                  <p>Saturday: 9AM - 2PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Quick Links</h4>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-cyan-700 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Legal</h4>
              <div className="space-y-2">
                {legalLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => onNavigate?.(link.tab)}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-cyan-700 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-slate-500">
          <p>Powered by TREYFA-TECH &amp; INTEGRATED SERVICE LIMITED.</p>
          <p>CampusLink marketplace storefront</p>
        </div>
      </div>
    </footer>
  );
};
