-- ============================================================================
-- MELODIVA SKIN CARE - CHECKLIST BOARD SUPABASE SCHEMA & SEED DATA
-- Comprehensive 2-Month Roadmap & Website Launch Checklist
-- ============================================================================

-- 1. CHECKLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tab VARCHAR(50) NOT NULL CHECK (tab IN ('website', 'social_media')),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'pending_review', 'done')),
  assigned_to VARCHAR(100) DEFAULT 'Unassigned',
  due_date DATE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CHECKLIST COMMENTS TABLE
CREATE TABLE IF NOT EXISTS checklist_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_checklist_items_tab ON checklist_items(tab);
CREATE INDEX IF NOT EXISTS idx_checklist_items_status ON checklist_items(status);
CREATE INDEX IF NOT EXISTS idx_checklist_comments_item_id ON checklist_comments(item_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select on checklist_items" ON checklist_items;
CREATE POLICY "Allow public select on checklist_items" ON checklist_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on checklist_items" ON checklist_items;
CREATE POLICY "Allow public insert on checklist_items" ON checklist_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on checklist_items" ON checklist_items;
CREATE POLICY "Allow public update on checklist_items" ON checklist_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on checklist_items" ON checklist_items;
CREATE POLICY "Allow public delete on checklist_items" ON checklist_items FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public select on checklist_comments" ON checklist_comments;
CREATE POLICY "Allow public select on checklist_comments" ON checklist_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on checklist_comments" ON checklist_comments;
CREATE POLICY "Allow public insert on checklist_comments" ON checklist_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on checklist_comments" ON checklist_comments;
CREATE POLICY "Allow public update on checklist_comments" ON checklist_comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on checklist_comments" ON checklist_comments;
CREATE POLICY "Allow public delete on checklist_comments" ON checklist_comments FOR DELETE USING (true);

-- 5. CHRONOLOGICAL SEED DATA FOR WEBSITE & 2-MONTH SOCIAL MEDIA ROADMAP
INSERT INTO checklist_items (tab, title, description, category, status, assigned_to, due_date, order_index)
VALUES 
  -- ============================================================================
  -- WEBSITE LAUNCH ROADMAP (Logical Sequence: Pricing -> Backend -> Audit -> Assets -> Policies -> Hosting -> QA -> Launch)
  -- ============================================================================
  ('website', '1. Provide State & City Delivery Pricing Data', 'Gather and provide complete delivery fee information for all Nigerian states and Lagos LGAs/cities to TMB for database setup.', 'Delivery Pricing', 'in_progress', 'Melody', CURRENT_DATE + INTERVAL '5 days', 1),
  ('website', '2. Run Backend Setup & Environment Verification', 'Start local/production backend server, connect database endpoints, and integrate state/city delivery pricing tables provided by Melody.', 'Backend & Infra', 'todo', 'TMB', CURRENT_DATE + INTERVAL '7 days', 2),
  ('website', '3. Fix Missing Footer Links & Page Routes', 'Ensure /shipping, /returns, and legal policy links in Footer navigate properly to existing content pages.', 'Website Audit', 'todo', 'TMB', CURRENT_DATE + INTERVAL '10 days', 3),
  ('website', '4. Source & Update High-Res Product & Hero Imagery', 'Gather high-resolution studio photos for homepage hero banner, Black Soap variants (Exquisite/Perfume/Natural), and Kernel Oil sizes.', 'Media & Assets', 'todo', 'Favor', CURRENT_DATE + INTERVAL '12 days', 4),
  ('website', '5. Draft & Publish Privacy, Shipping & Return Policies', 'Write and publish Privacy Policy, Terms & Conditions, Shipping Info, and Returns/Refund Policy pages on the website.', 'Legal & Policies', 'todo', 'Favor', CURRENT_DATE + INTERVAL '14 days', 5),
  ('website', '6. Hosting Setup & Custom Domain SSL Deployment', 'Deploy frontend to Vercel/Netlify, set custom domain mapping, configure SSL certificate, and verify live API endpoints before final testing.', 'Deployment', 'todo', 'TMB', CURRENT_DATE + INTERVAL '18 days', 6),
  ('website', '7. Final End-to-End Cart & Checkout QA Testing', 'Execute comprehensive live QA tests on deployed domain for shopping cart, checkout flow, WhatsApp order link generation, and delivery fee calculations.', 'QA & Testing', 'todo', 'Favor', CURRENT_DATE + INTERVAL '21 days', 7),
  ('website', '8. Website Launch Release & Technical Signoff', 'Supervisory final review of website security, legal compliance, order routing, and production deployment readiness.', 'Supervision', 'todo', 'Mrs. Faith', CURRENT_DATE + INTERVAL '22 days', 8),

  -- ============================================================================
  -- SOCIAL MEDIA 2-MONTH CAMPAIGN ROADMAP (Ordered Chronologically: Weeks 1 - 8)
  -- ============================================================================

  -- PHASE 1: FOUNDATION & STRATEGY SETUP (Weeks 1 - 2)
  ('social_media', '1. Provide Official Email & Social Media Credentials to TMB', 'Mrs. Faith (Supervisor) provides official Melodiva email accounts, domain registrar access, and existing social media login credentials to TMB for environment & channel setup.', 'Phase 1: Setup', 'todo', 'Mrs. Faith', CURRENT_DATE + INTERVAL '2 days', 1),
  ('social_media', '2. Grant Favor Admin & Manager Access to Social Media Channels', 'TMB configures security settings, 2FA, and grants Favor admin/manager access across Instagram, TikTok, Facebook, and Meta Business Suite for daily channel operations.', 'Phase 1: Setup', 'todo', 'TMB', CURRENT_DATE + INTERVAL '3 days', 2),
  ('social_media', '3. Reactivate & Optimize Official Social Media Channels', 'Re-establish and configure accounts, bio links, tracking pixels, profile graphics, and business profiles for Facebook, Instagram, and TikTok.', 'Phase 1: Setup', 'todo', 'TMB', CURRENT_DATE + INTERVAL '5 days', 3),
  ('social_media', '4. Formulate 60-Day Content Strategy & Editorial Calendar', 'Formulate overarching content strategy, weekly theme pillars, educational topics, and 60-day posting calendar to guide Favor.', 'Phase 1: Setup', 'todo', 'TMB', CURRENT_DATE + INTERVAL '10 days', 4),
  ('social_media', '5. Design Social Media Graphic Templates & Branding Assets', 'Create reusable Canva/Photoshop graphics, story templates, carousel slides, and reel covers based on TMB strategy guidelines.', 'Phase 1: Setup', 'todo', 'Favor', CURRENT_DATE + INTERVAL '14 days', 5),
  ('social_media', '6. Configure WhatsApp Business Quick Replies & Link-in-Bio', 'Set up Linktree/bio page connecting website shop, WhatsApp order chat, affiliate registration, and customer FAQs.', 'Phase 1: Setup', 'todo', 'TMB', CURRENT_DATE + INTERVAL '14 days', 6),

  -- PHASE 2: BRAND STORY & AFFILIATE LAUNCH (Weeks 3 - 4)
  ('social_media', '7. Publish Melodiva Brand Story & Ingredients Series', 'Schedule and post introductory brand series highlighting Melodiva inception (Nov 2023), natural African Black Soap heritage, and Kernel Oil benefits.', 'Phase 2: Launch', 'todo', 'Favor', CURRENT_DATE + INTERVAL '21 days', 7),
  ('social_media', '8. Kickstart Affiliate Marketing Campaign Strategy & Collateral', 'Design campaign structure, commission rate promotions (10%), and affiliate onboarding collateral to recruit micro-influencers and ambassadors.', 'Phase 2: Launch', 'todo', 'TMB', CURRENT_DATE + INTERVAL '25 days', 8),
  ('social_media', '9. Launch Affiliate Recruitment Posts & DM Outreach', 'Publish promotional posts and stories inviting beauty creators to join the Melodiva affiliate program with unique tracking links.', 'Phase 2: Launch', 'todo', 'Favor', CURRENT_DATE + INTERVAL '28 days', 9),

  -- PHASE 3: PRODUCT SPOTLIGHTS & SOCIAL PROOF (Weeks 5 - 6)
  ('social_media', '10. Roll Out Black Soap & Kernel Oil Product Spotlights', 'Publish weekly product highlight videos and carousels showcasing Black Soap (Exquisite, Perfume, Natural) and Kernel Oil (250ml, 500ml, 1000ml).', 'Phase 3: Spotlights', 'todo', 'Favor', CURRENT_DATE + INTERVAL '35 days', 10),
  ('social_media', '11. Launch Customer Testimonials & Before/After UGC Series', 'Share genuine customer reviews, video unboxings, and skin transformation stories with purchase call-to-actions.', 'Phase 3: Spotlights', 'todo', 'Favor', CURRENT_DATE + INTERVAL '42 days', 11),

  -- PHASE 4: SALES PUSH, GIVEAWAYS & FINAL REVIEW (Weeks 7 - 8)
  ('social_media', '12. Host 2-Month Campaign Anniversary Giveaway', 'Host interactive Instagram/TikTok giveaway encouraging tags, shares, and website cart visits to boost engagement and follower growth.', 'Phase 4: Sales Push', 'todo', 'Favor', CURRENT_DATE + INTERVAL '49 days', 12),
  ('social_media', '13. Execute Retargeting & Daily Follower Engagement Push', 'Actively engage in comments, reply to direct messages, send exclusive coupon codes to loyal customers, and drive final 60-day sales conversions.', 'Phase 4: Sales Push', 'todo', 'Favor', CURRENT_DATE + INTERVAL '56 days', 13),
  ('social_media', '14. Social Media 2-Month Campaign Milestone Review', 'Supervisory audit of 60-day follower growth, conversion metrics, affiliate payouts, and content quality signoff.', 'Phase 4: Supervision', 'todo', 'Mrs. Faith', CURRENT_DATE + INTERVAL '60 days', 14);
