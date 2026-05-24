-- Prevent duplicate CRM leads from website submissions (trigger + API sync)
CREATE UNIQUE INDEX IF NOT EXISTS leads_website_lead_id_unique
  ON public.leads (website_lead_id)
  WHERE website_lead_id IS NOT NULL;

-- Idempotent trigger: skip if CRM lead already linked
CREATE OR REPLACE FUNCTION public.sync_website_lead_to_crm()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.leads WHERE website_lead_id = NEW.id
  ) THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.leads (
    business_name,
    contact_name,
    phone,
    email,
    source,
    status,
    next_action,
    next_action_date,
    notes,
    website_lead_id
  ) VALUES (
    COALESCE(NULLIF(TRIM(NEW.service_interest), ''), NEW.name, 'Website inquiry'),
    NEW.name,
    NEW.phone,
    NEW.email,
  CASE
    WHEN NEW.source = 'bootcamp_registration' THEN 'website'
    ELSE 'website'
  END,
    'new',
    CASE
      WHEN NEW.form_type = 'registration' THEN 'Follow up on bootcamp registration'
      ELSE 'Respond to consultation request'
    END,
    (CURRENT_DATE + INTERVAL '1 day')::date,
    CONCAT_WS(E'\n',
      CASE WHEN NEW.message IS NOT NULL THEN 'Message: ' || NEW.message ELSE NULL END,
      CASE WHEN NEW.goals IS NOT NULL THEN 'Goals: ' || NEW.goals ELSE NULL END,
      CASE WHEN NEW.experience_level IS NOT NULL THEN 'Experience: ' || NEW.experience_level ELSE NULL END,
      CASE WHEN NEW.form_type IS NOT NULL THEN 'Form: ' || NEW.form_type ELSE NULL END,
      CASE WHEN NEW.source IS NOT NULL THEN 'Website tag: ' || NEW.source ELSE NULL END
    ),
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
