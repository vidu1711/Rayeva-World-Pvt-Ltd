const API = '/api';

export type DashboardStats = {
  proposalCount: number;
  impactReportCount: number;
  totalPlasticSavedKg: string;
  totalCarbonAvoidedKg: string;
  recentProposals: Proposal[];
  recentImpactReports: ImpactReport[];
};

export type Proposal = {
  _id: string;
  event_type: string;
  budget: number;
  sustainability_goal: string;
  generated_proposal: {
    suggested_product_mix: { product_name: string; quantity: string; estimated_cost: string }[];
    budget_allocation: Record<string, string>;
    estimated_cost_breakdown: Record<string, unknown>;
    impact_summary: string;
  };
  createdAt: string;
};

export type ImpactReport = {
  _id: string;
  order_items: { product: string; quantity: number; material?: string }[];
  plastic_saved: string;
  carbon_avoided: string;
  local_sourcing_impact: string;
  impact_statement: string;
  createdAt: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const r = await fetch(`${API}/dashboard/stats`);
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  if (!j.success) throw new Error(j.error || 'Failed to load stats');
  return j.data;
}

export async function getProposals(): Promise<Proposal[]> {
  const r = await fetch(`${API}/proposals`);
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  if (!j.success) throw new Error(j.error || 'Failed to load proposals');
  return j.data;
}

export async function generateProposal(body: { event_type: string; budget: number; sustainability_goal: string }) {
  const r = await fetch(`${API}/proposal/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || j.errors?.join?.(', ') || 'Failed to generate proposal');
  if (!j.success) throw new Error(j.error || 'Failed to generate proposal');
  return j.data;
}

export async function getImpactReports(): Promise<ImpactReport[]> {
  const r = await fetch(`${API}/impact-reports`);
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  if (!j.success) throw new Error(j.error || 'Failed to load reports');
  return j.data;
}

export async function getImpactReport(id: string): Promise<ImpactReport> {
  const r = await fetch(`${API}/impact-reports/${id}`);
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  if (!j.success) throw new Error(j.error || 'Failed to load report');
  return j.data;
}

export async function generateImpactReport(body: { order_items: { product: string; quantity: number; material?: string }[] }) {
  const r = await fetch(`${API}/impact/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || j.errors?.join?.(', ') || 'Failed to generate impact report');
  if (!j.success) throw new Error(j.error || 'Failed to generate impact report');
  return j.data;
}
