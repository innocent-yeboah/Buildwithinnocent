import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/internal/StatusBadge";

/** Loads proposal via service role at request time. */
export const dynamic = "force-dynamic";
import { formatCurrency, formatDate } from "@/lib/internal/format";
import { getProposalPublic, recordProposalView } from "@/lib/internal/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalPublicPage({ params }: PageProps) {
  const { id } = await params;

  await recordProposalView(id);
  const proposal = await getProposalPublic(id);

  if (!proposal) {
    notFound();
  }

  const clientName =
    proposal.leads?.business_name ??
    proposal.leads?.contact_name ??
    "Client";

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
          <div>
            <p className="text-sm font-semibold text-brand-green">Build With Innocent</p>
            <p className="text-xs text-brand-body">Digital Business Systems</p>
          </div>
          {proposal.proposal_number ? (
            <p className="text-sm font-medium text-brand-navy">{proposal.proposal_number}</p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-navy">Proposal Summary</h1>
              <p className="mt-1 text-brand-body">Prepared for {clientName}</p>
            </div>
            <StatusBadge type="proposal" value={proposal.status} />
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-brand-body">Client</dt>
              <dd className="mt-1 text-lg font-semibold text-brand-navy">{clientName}</dd>
              {proposal.leads?.contact_name && proposal.leads?.business_name ? (
                <dd className="mt-0.5 text-sm text-slate-500">{proposal.leads.contact_name}</dd>
              ) : null}
            </div>

            <div>
              <dt className="text-sm font-medium text-brand-body">Proposed amount</dt>
              <dd className="mt-1 text-2xl font-bold text-brand-navy">
                {formatCurrency(proposal.amount)}
              </dd>
            </div>

            {proposal.sent_date ? (
              <div>
                <dt className="text-sm font-medium text-brand-body">Sent</dt>
                <dd className="mt-1 text-brand-navy">{formatDate(proposal.sent_date)}</dd>
              </div>
            ) : null}

            {proposal.viewed_date ? (
              <div>
                <dt className="text-sm font-medium text-brand-body">Viewed</dt>
                <dd className="mt-1 text-brand-navy">{formatDate(proposal.viewed_date)}</dd>
              </div>
            ) : null}
          </dl>

          {proposal.notes ? (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h2 className="text-sm font-semibold text-brand-navy">Notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-brand-body">{proposal.notes}</p>
            </div>
          ) : null}

          <p className="mt-8 text-sm text-slate-500">
            Questions about this proposal? Reply to your Build With Innocent contact or email{" "}
            <a
              href="mailto:hello@buildwithinnocent.com"
              className="font-medium text-brand-green hover:underline"
            >
              hello@buildwithinnocent.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
