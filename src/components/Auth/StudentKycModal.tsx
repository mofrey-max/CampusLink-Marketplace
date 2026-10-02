import React, { useEffect, useMemo, useState } from 'react';
import { Camera, FileBadge, Shield, X } from 'lucide-react';
import type { StudentKycData } from '../../types';

interface StudentKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentKycData) => Promise<void>;
  initialData?: StudentKycData;
}

const defaultFormState = {
  idNumber: '',
  faculty: '',
  department: '',
  level: '',
  certification: '',
  studentIdCardName: '',
  governmentIdName: '',
  livenessCheckCompleted: false
};

export const StudentKycModal: React.FC<StudentKycModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      idNumber: initialData?.idNumber || '',
      faculty: initialData?.faculty || '',
      department: initialData?.department || '',
      level: initialData?.level || '',
      certification: initialData?.certification || '',
      studentIdCardName: initialData?.studentIdCardName || '',
      governmentIdName: initialData?.governmentIdName || '',
      livenessCheckCompleted: initialData?.livenessCheckCompleted || false
    });
    setError('');
  }, [initialData, isOpen]);

  const isReadyToSubmit = useMemo(
    () =>
      !!formData.idNumber.trim() &&
      !!formData.department.trim() &&
      !!formData.level.trim() &&
      !!formData.studentIdCardName &&
      !!formData.governmentIdName &&
      formData.livenessCheckCompleted,
    [formData]
  );

  if (!isOpen) return null;

  const handleFileChange = (field: 'studentIdCardName' | 'governmentIdName', files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setFormData((current) => ({
      ...current,
      [field]: file.name
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isReadyToSubmit) {
      setError('Complete all required KYC fields before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await onSubmit({
        ...formData,
        idNumber: formData.idNumber.trim(),
        faculty: formData.faculty.trim(),
        department: formData.department.trim(),
        level: formData.level.trim(),
        certification: formData.certification.trim(),
        status: 'pending'
      });

      onClose();
    } catch (submissionError) {
      console.error('Student KYC submission failed:', submissionError);
      setError('Unable to submit KYC right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close KYC modal"
      />

      <div className="relative w-full max-w-3xl glass-panel-strong neo-card overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 bg-white/60 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Student KYC</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Complete student verification</h2>
            <p className="mt-1 text-sm text-slate-600">
              Required: ID number, department, level, student ID card, government issued ID, and liveness check.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 bg-white/80 p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">ID Number</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData((current) => ({ ...current, idNumber: e.target.value }))}
                className="w-full border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                placeholder="Enter your student ID number"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Faculty</label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData((current) => ({ ...current, faculty: e.target.value }))}
                className="w-full border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData((current) => ({ ...current, department: e.target.value }))}
                className="w-full border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                placeholder="Enter your department"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData((current) => ({ ...current, level: e.target.value }))}
                className="w-full border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                required
              >
                <option value="">Select level</option>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
                <option value="Final Year">Final Year</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Certification</label>
            <input
              type="text"
              value={formData.certification}
              onChange={(e) => setFormData((current) => ({ ...current, certification: e.target.value }))}
              className="w-full border border-slate-200 bg-white/85 px-4 py-3 text-slate-900 outline-none transition-all focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
              placeholder="Optional certification"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block border border-slate-200 bg-white/80 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <FileBadge className="h-5 w-5 text-violet-600" />
                <span className="font-medium">Student ID Card</span>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                className="block w-full text-sm text-slate-600"
                onChange={(e) => handleFileChange('studentIdCardName', e.target.files)}
              />
              {formData.studentIdCardName && (
                <p className="mt-2 text-xs text-slate-500">{formData.studentIdCardName}</p>
              )}
            </label>

            <label className="block border border-slate-200 bg-white/80 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-900">
                <Shield className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">Government Issued ID</span>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                className="block w-full text-sm text-slate-600"
                onChange={(e) => handleFileChange('governmentIdName', e.target.files)}
              />
              {formData.governmentIdName && (
                <p className="mt-2 text-xs text-slate-500">{formData.governmentIdName}</p>
              )}
            </label>
          </div>

          <label className="flex items-start gap-3 border border-slate-200 bg-white/80 p-4">
            <input
              type="checkbox"
              checked={formData.livenessCheckCompleted}
              onChange={(e) =>
                setFormData((current) => ({
                  ...current,
                  livenessCheckCompleted: e.target.checked
                }))
              }
              className="mt-1 h-4 w-4"
            />
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Camera className="h-4 w-4 text-emerald-600" />
                Liveness check
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Confirm that a live selfie / face check has been completed for this student profile.
              </p>
            </div>
          </label>

          {error && (
            <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Submissions are marked as pending until the KYC review is completed.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-slate-200 bg-white/80 px-4 py-3 text-slate-700 transition-colors hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-medium text-white transition-all hover:from-violet-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 neon-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit KYC'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
