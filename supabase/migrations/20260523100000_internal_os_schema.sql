-- Internal Business OS schema for Build With Innocent
-- Preserves website form submissions in website_leads; CRM uses leads + related tables.

-- ─── Preserve existing website leads table ───────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'form_type'
  ) THEN
    ALTER TABLE public.leads RENAME TO website_leads;
  END IF;
END $$;

-- ─── CRM: leads ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  source TEXT CHECK (source IN ('linkedin', 'whatsapp', 'referral', 'cold_dm', 'website', 'other')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost')),
  last_contact DATE,
  next_action TEXT,
  next_action_date DATE,
  notes TEXT,
  estimated_value DECIMAL(10,2),
  website_lead_id BIGINT
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_next_action_date_idx ON public.leads (next_action_date);

-- ─── proposals ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  proposal_number TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  sent_date DATE,
  viewed_date DATE,
  accepted_date DATE,
  follow_up_date DATE,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS proposals_status_idx ON public.proposals (status);
CREATE INDEX IF NOT EXISTS proposals_lead_id_idx ON public.proposals (lead_id);
CREATE INDEX IF NOT EXISTS proposals_follow_up_date_idx ON public.proposals (follow_up_date);

-- ─── projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  client_name TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  deposit_amount DECIMAL(10,2),
  deposit_received BOOLEAN DEFAULT FALSE,
  deposit_received_date DATE,
  total_amount DECIMAL(10,2),
  balance_due DECIMAL(10,2),
  stage TEXT NOT NULL DEFAULT 'discovery' CHECK (stage IN ('discovery', 'design', 'development', 'review', 'launch', 'completed')),
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS projects_stage_idx ON public.projects (stage);

-- ─── maintenance_plans ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.maintenance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  client_name TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'standard', 'premium')),
  monthly_amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  next_invoice_date DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS maintenance_plans_active_idx ON public.maintenance_plans (active);
CREATE INDEX IF NOT EXISTS maintenance_plans_next_invoice_idx ON public.maintenance_plans (next_invoice_date);

-- ─── revenue ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('project_deposit', 'project_balance', 'maintenance', 'blueprint', 'consulting')),
  amount DECIMAL(10,2) NOT NULL,
  client_name TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS revenue_date_idx ON public.revenue (date);
CREATE INDEX IF NOT EXISTS revenue_source_idx ON public.revenue (source);

-- ─── referrals ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('client', 'promoter', 'friend', 'other')),
  referred_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  commission_amount DECIMAL(10,2),
  commission_paid BOOLEAN DEFAULT FALSE
);

-- ─── website_leads table (if fresh project without prior leads table) ─────────
CREATE TABLE IF NOT EXISTS public.website_leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT,
  message TEXT,
  goals TEXT,
  experience_level TEXT,
  agreed_terms_at TIMESTAMPTZ,
  form_type TEXT NOT NULL DEFAULT 'consultation' CHECK (form_type IN ('consultation', 'registration')),
  source TEXT,
  contacted BOOLEAN DEFAULT FALSE
);

-- Link column for website → CRM sync (only if website_leads uses bigserial)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'website_lead_id'
  ) THEN
    NULL;
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- ─── Sync website inquiries into CRM leads ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_website_lead_to_crm()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.leads (
    business_name,
    contact_name,
    phone,
    email,
    source,
    status,
    notes,
    website_lead_id
  ) VALUES (
    COALESCE(NULLIF(TRIM(NEW.service_interest), ''), NEW.name, 'Website inquiry'),
    NEW.name,
    NEW.phone,
    NEW.email,
    'website',
    'new',
    CONCAT_WS(E'\n',
      CASE WHEN NEW.message IS NOT NULL THEN 'Message: ' || NEW.message ELSE NULL END,
      CASE WHEN NEW.goals IS NOT NULL THEN 'Goals: ' || NEW.goals ELSE NULL END,
      CASE WHEN NEW.form_type IS NOT NULL THEN 'Form: ' || NEW.form_type ELSE NULL END
    ),
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS website_leads_sync_crm ON public.website_leads;
CREATE TRIGGER website_leads_sync_crm
  AFTER INSERT ON public.website_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_website_lead_to_crm();

-- ─── Proposal number generator ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_proposal_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.proposal_number IS NULL OR NEW.proposal_number = '' THEN
    NEW.proposal_number := 'BWI-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('public.proposal_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS public.proposal_number_seq START 1;

DROP TRIGGER IF EXISTS proposals_set_number ON public.proposals;
CREATE TRIGGER proposals_set_number
  BEFORE INSERT ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_proposal_number();

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;

-- Authenticated admin: full CRM access
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['leads', 'proposals', 'projects', 'maintenance_plans', 'revenue', 'referrals']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "auth_full_access" ON public.%I', tbl);
    EXECUTE format(
      'CREATE POLICY "auth_full_access" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl
    );
  END LOOP;
END $$;

-- Public website form: anon insert only on website_leads
DROP POLICY IF EXISTS "anon_insert_website_leads" ON public.website_leads;
CREATE POLICY "anon_insert_website_leads"
  ON public.website_leads FOR INSERT TO anon
  WITH CHECK (true);

-- Service role bypasses RLS by default in Supabase
