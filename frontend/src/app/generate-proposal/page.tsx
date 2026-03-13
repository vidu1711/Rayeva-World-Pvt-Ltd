'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateProposal } from '@/lib/api';

const INDUSTRY_OPTIONS = ['Office', 'Retail', 'Hospitality', 'Healthcare', 'Manufacturing'] as const;

const SUSTAINABILITY_OPTIONS = [
  { id: 'plastic-free', label: 'Plastic Free' },
  { id: 'recycled', label: 'Recycled Materials' },
  { id: 'compostable', label: 'Compostable' },
  { id: 'carbon-neutral', label: 'Carbon Neutral' },
  { id: 'local-sourcing', label: 'Local Sourcing' },
] as const;

export default function GenerateProposalPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('sample hospital tools');
  const [budget, setBudget] = useState('3998');
  const [industryType, setIndustryType] = useState<string>('Healthcare');
  const [sustainabilityGoals, setSustainabilityGoals] = useState<Record<string, boolean>>({
    'plastic-free': false,
    recycled: false,
    compostable: true,
    'carbon-neutral': true,
    'local-sourcing': false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industryOpen, setIndustryOpen] = useState(false);

  function toggleGoal(id: string) {
    setSustainabilityGoals((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const selectedGoals = SUSTAINABILITY_OPTIONS.filter((o) => sustainabilityGoals[o.id]).map((o) => o.label);
  const sustainabilityGoalString = selectedGoals.length > 0 ? selectedGoals.join(', ') : 'General sustainability';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const event_type = `${companyName.trim()} (${industryType})`;
      const data = await generateProposal({
        event_type,
        budget: Number(budget) || 0,
        sustainability_goal: sustainabilityGoalString,
      });
      router.push(`/proposals?created=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate proposal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Generate Proposal</h1>
        <p className="mt-1 text-sm text-gray-500">AI-powered sustainable B2B proposal generator.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">Proposal Details</h2>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
              <input
                type="number"
                min="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Industry Type</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIndustryOpen(!industryOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <span>{industryType}</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {industryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIndustryOpen(false)} aria-hidden="true" />
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg" role="listbox">
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        role="option"
                        onClick={() => {
                          setIndustryType(opt);
                          setIndustryOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm ${
                          industryType === opt ? 'bg-primary text-white' : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {opt}
                        {industryType === opt && (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sustainability Goals</label>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {SUSTAINABILITY_OPTIONS.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sustainabilityGoals[opt.id] ?? false}
                    onChange={() => toggleGoal(opt.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
            {selectedGoals.length === 0 && (
              <p className="mt-1.5 text-xs text-amber-600">Select at least one goal for a better proposal.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-card transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating proposal…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M14.6 10.2c0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1zM9.4 13.8c.6 0 1.1-.5 1.1-1.1 0-.6-.5-1.1-1.1-1.1-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.2 13.2c-.3.3-.7.5-1.2.5-.4 0-.8-.1-1.1-.4l-.1-.1c-.1-.2-.2-.4-.2-.6 0-.2.1-.4.2-.6l.1-.1c.6-.6 1.6-.6 2.2 0 .3.3.5.7.5 1.2 0 .4-.2.8-.4 1.1l-.2.2zm-6.4 0c-.3-.3-.5-.7-.5-1.2 0-.4.1-.8.4-1.1l.1-.1c.2-.1.4-.2.6-.2.2 0 .4.1.6.2l.1.1c.6.6.6 1.6 0 2.2-.3.3-.7.5-1.2.5-.4 0-.8-.1-1.1-.4l-.2-.2z" />
                </svg>
                Generate Proposal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
