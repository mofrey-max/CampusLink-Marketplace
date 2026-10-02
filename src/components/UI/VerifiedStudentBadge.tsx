import React from 'react';
import { Shield } from 'lucide-react';

interface VerifiedStudentBadgeProps {
  compact?: boolean;
  inverted?: boolean;
}

export const VerifiedStudentBadge: React.FC<VerifiedStudentBadgeProps> = ({
  compact = false,
  inverted = false
}) => {
  const palette = inverted
    ? 'bg-white/20 text-white border-white/25'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-1 text-xs font-medium ${palette}`}
    >
      <Shield className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{compact ? 'Verified' : 'Verified Student'}</span>
    </span>
  );
};
