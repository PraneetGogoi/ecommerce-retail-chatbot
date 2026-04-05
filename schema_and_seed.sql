-- =============================================================================
--  Retail E-Commerce Chatbot Analytics — PostgreSQL Schema & Seed
--  Compatible with PostgreSQL 13+
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;          -- fuzzy text search

-- ─── Drop existing tables (safe re-run) ──────────────────────────────────────
DROP TABLE IF EXISTS chat_sessions     CASCADE;
DROP TABLE IF EXISTS chat_turns        CASCADE;
DROP TABLE IF EXISTS training_samples  CASCADE;
DROP TABLE IF EXISTS intents           CASCADE;
DROP TABLE IF EXISTS categories        CASCADE;
DROP TABLE IF EXISTS tag_types         CASCADE;
DROP TABLE IF EXISTS sample_tags       CASCADE;
DROP TABLE IF EXISTS analytics_daily   CASCADE;
DROP VIEW  IF EXISTS vw_intent_stats;
DROP VIEW  IF EXISTS vw_category_stats;
DROP VIEW  IF EXISTS vw_tag_stats;
DROP VIEW  IF EXISTS vw_chatbot_kpis;

-- =============================================================================
-- LOOKUP TABLES
-- =============================================================================

CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(60) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE intents (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tag_types (
    code        CHAR(1) PRIMARY KEY,
    label       VARCHAR(50) NOT NULL,
    description TEXT
);

-- =============================================================================
-- CORE TRAINING DATA TABLE
-- =============================================================================

CREATE TABLE training_samples (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    instruction     TEXT NOT NULL,
    intent_id       INT REFERENCES intents(id) ON DELETE SET NULL,
    category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
    tags            VARCHAR(20),
    response        TEXT NOT NULL,
    -- derived / computed
    inst_char_len   INT  GENERATED ALWAYS AS (char_length(instruction)) STORED,
    resp_char_len   INT  GENERATED ALWAYS AS (char_length(response))    STORED,
    has_profanity   BOOL DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- GIN index for fast full-text search on instruction
CREATE INDEX idx_ts_instruction_fts ON training_samples
    USING gin(to_tsvector('english', instruction));

-- B-tree indexes on FK cols
CREATE INDEX idx_ts_intent_id    ON training_samples(intent_id);
CREATE INDEX idx_ts_category_id  ON training_samples(category_id);

-- =============================================================================
-- MANY-TO-MANY: sample ↔ tags
-- =============================================================================

CREATE TABLE sample_tags (
    sample_id  INT  REFERENCES training_samples(id) ON DELETE CASCADE,
    tag_code   CHAR(1) REFERENCES tag_types(code) ON DELETE CASCADE,
    PRIMARY KEY (sample_id, tag_code)
);

-- =============================================================================
-- CHAT RUNTIME TABLES  (for live dashboard)
-- =============================================================================

CREATE TABLE chat_sessions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    started_at     TIMESTAMPTZ DEFAULT NOW(),
    ended_at       TIMESTAMPTZ,
    user_agent     TEXT,
    total_turns    INT DEFAULT 0
);

CREATE TABLE chat_turns (
    id              SERIAL PRIMARY KEY,
    session_id      UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    turn_number     INT NOT NULL,
    user_input      TEXT NOT NULL,
    predicted_intent_id  INT REFERENCES intents(id),
    predicted_category_id INT REFERENCES categories(id),
    similarity_score FLOAT,
    bot_response    TEXT NOT NULL,
    response_time_ms INT,
    thumbs_up       BOOL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ct_session   ON chat_turns(session_id);
CREATE INDEX idx_ct_intent    ON chat_turns(predicted_intent_id);
CREATE INDEX idx_ct_created   ON chat_turns(created_at);

-- =============================================================================
-- ANALYTICS DAILY AGGREGATE TABLE  (pre-computed for dashboard speed)
-- =============================================================================

CREATE TABLE analytics_daily (
    day             DATE PRIMARY KEY,
    total_sessions  INT DEFAULT 0,
    total_turns     INT DEFAULT 0,
    unique_intents  INT DEFAULT 0,
    avg_similarity  FLOAT,
    profanity_count INT DEFAULT 0,
    thumbs_up_pct   FLOAT,
    top_intent      VARCHAR(100),
    top_category    VARCHAR(60),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SEED LOOKUP DATA
-- =============================================================================

INSERT INTO categories(name, description) VALUES
('RETURNS',     'Product return and exchange queries'),
('PRODUCT',     'Product information, availability, ideas'),
('DELIVERY',    'Delivery tracking, timing, issues'),
('ACCOUNT',     'User account management'),
('ORDER',       'Order management and history'),
('PAYMENT',     'Payment methods and issues'),
('FEEDBACK',    'Customer feedback and complaints'),
('APP_WEBSITE', 'App and website technical issues'),
('CONTACT',     'Contact and customer service'),
('CART',        'Shopping cart operations'),
('STORE',       'Physical store information'),
('SALES',       'Promotions and sales periods'),
('USER',        'User profile and preferences');

INSERT INTO intents(name, category_id) VALUES
('add_product',               (SELECT id FROM categories WHERE name='CART')),
('availability',              (SELECT id FROM categories WHERE name='PRODUCT')),
('availability_in_store',     (SELECT id FROM categories WHERE name='PRODUCT')),
('availability_online',       (SELECT id FROM categories WHERE name='PRODUCT')),
('cancel_order',              (SELECT id FROM categories WHERE name='ORDER')),
('change_account',            (SELECT id FROM categories WHERE name='ACCOUNT')),
('change_order',              (SELECT id FROM categories WHERE name='ORDER')),
('close_account',             (SELECT id FROM categories WHERE name='ACCOUNT')),
('customer_service',          (SELECT id FROM categories WHERE name='CONTACT')),
('damaged_delivery',          (SELECT id FROM categories WHERE name='DELIVERY')),
('delivery_issue',            (SELECT id FROM categories WHERE name='DELIVERY')),
('delivery_time',             (SELECT id FROM categories WHERE name='DELIVERY')),
('exchange_product',          (SELECT id FROM categories WHERE name='RETURNS')),
('exchange_product_in_store', (SELECT id FROM categories WHERE name='RETURNS')),
('human_agent',               (SELECT id FROM categories WHERE name='CONTACT')),
('missing_item',              (SELECT id FROM categories WHERE name='ORDER')),
('open_account',              (SELECT id FROM categories WHERE name='ACCOUNT')),
('order_history',             (SELECT id FROM categories WHERE name='ORDER')),
('pay',                       (SELECT id FROM categories WHERE name='PAYMENT')),
('payment_issue',             (SELECT id FROM categories WHERE name='PAYMENT')),
('payment_methods',           (SELECT id FROM categories WHERE name='PAYMENT')),
('product_information',       (SELECT id FROM categories WHERE name='PRODUCT')),
('product_issue',             (SELECT id FROM categories WHERE name='PRODUCT')),
('recover_password',          (SELECT id FROM categories WHERE name='ACCOUNT')),
('refund_policy',             (SELECT id FROM categories WHERE name='RETURNS')),
('refund_status',             (SELECT id FROM categories WHERE name='RETURNS')),
('remove_product',            (SELECT id FROM categories WHERE name='CART')),
('request_invoice',           (SELECT id FROM categories WHERE name='ORDER')),
('request_refund',            (SELECT id FROM categories WHERE name='RETURNS')),
('request_right_to_rectification', (SELECT id FROM categories WHERE name='ACCOUNT')),
('return_policy',             (SELECT id FROM categories WHERE name='RETURNS')),
('return_product',            (SELECT id FROM categories WHERE name='RETURNS')),
('return_product_in_store',   (SELECT id FROM categories WHERE name='RETURNS')),
('return_product_online',     (SELECT id FROM categories WHERE name='RETURNS')),
('sales_period',              (SELECT id FROM categories WHERE name='SALES')),
('shipping_costs',            (SELECT id FROM categories WHERE name='DELIVERY')),
('store_location',            (SELECT id FROM categories WHERE name='STORE')),
('store_opening_hours',       (SELECT id FROM categories WHERE name='STORE')),
('submit_feedback',           (SELECT id FROM categories WHERE name='FEEDBACK')),
('submit_product_feedback',   (SELECT id FROM categories WHERE name='FEEDBACK')),
('submit_product_idea',       (SELECT id FROM categories WHERE name='PRODUCT')),
('technical_issue',           (SELECT id FROM categories WHERE name='APP_WEBSITE')),
('track_delivery',            (SELECT id FROM categories WHERE name='DELIVERY')),
('track_order',               (SELECT id FROM categories WHERE name='ORDER')),
('use_app',                   (SELECT id FROM categories WHERE name='APP_WEBSITE')),
('wrong_item',                (SELECT id FROM categories WHERE name='ORDER'));

INSERT INTO tag_types(code, label, description) VALUES
('B', 'Basic',           'Standard phrasing with no special variation'),
('C', 'Contextual',      'Includes contextual details'),
('E', 'Escalation',      'Shows frustration / escalation cues'),
('I', 'Indirect',        'Indirect or polite request phrasing'),
('L', 'Long',            'Longer-than-average instruction'),
('M', 'Misspelled',      'Contains typos or misspellings'),
('P', 'Polite',          'Explicitly polite language'),
('Q', 'Question',        'Phrased as a direct question'),
('W', 'With_Profanity',  'Contains profane language'),
('Z', 'Zigzag_syntax',   'Non-standard or scrambled syntax');

-- =============================================================================
-- PYTHON SEED SCRIPT (run separately to load CSV data)
-- =============================================================================
-- Save the block below as seed_data.py and run:
--   python3 seed_data.py
-- It requires: psycopg2, pandas
-- Update DB_URL to match your PostgreSQL connection.
-- =============================================================================

-- =============================================================================
-- ANALYTICAL VIEWS
-- =============================================================================

CREATE VIEW vw_intent_stats AS
SELECT
    i.name                               AS intent,
    c.name                               AS category,
    COUNT(ts.id)                         AS sample_count,
    ROUND(AVG(ts.inst_char_len)::numeric,1) AS avg_inst_len,
    ROUND(AVG(ts.resp_char_len)::numeric,1) AS avg_resp_len,
    SUM(CASE WHEN ts.has_profanity THEN 1 ELSE 0 END) AS profanity_count,
    ROUND(100.0 * SUM(CASE WHEN ts.has_profanity THEN 1 ELSE 0 END)
              / NULLIF(COUNT(*),0), 2)   AS profanity_pct
FROM training_samples ts
JOIN intents   i ON ts.intent_id   = i.id
JOIN categories c ON ts.category_id = c.id
GROUP BY i.name, c.name
ORDER BY sample_count DESC;

CREATE VIEW vw_category_stats AS
SELECT
    c.name                               AS category,
    COUNT(ts.id)                         AS sample_count,
    COUNT(DISTINCT ts.intent_id)         AS distinct_intents,
    ROUND(AVG(ts.inst_char_len)::numeric,1) AS avg_inst_len,
    ROUND(AVG(ts.resp_char_len)::numeric,1) AS avg_resp_len,
    ROUND(100.0 * SUM(CASE WHEN ts.has_profanity THEN 1 ELSE 0 END)
              / NULLIF(COUNT(*),0), 2)   AS profanity_pct
FROM training_samples ts
JOIN categories c ON ts.category_id = c.id
GROUP BY c.name
ORDER BY sample_count DESC;

CREATE VIEW vw_tag_stats AS
SELECT
    tt.label                             AS tag_label,
    COUNT(st.sample_id)                  AS frequency,
    ROUND(100.0 * COUNT(st.sample_id)
              / (SELECT COUNT(*) FROM training_samples), 2) AS pct_of_total
FROM sample_tags st
JOIN tag_types tt ON st.tag_code = tt.code
GROUP BY tt.label
ORDER BY frequency DESC;

CREATE VIEW vw_chatbot_kpis AS
SELECT
    COUNT(DISTINCT cs.id)                AS total_sessions,
    COUNT(ct.id)                         AS total_turns,
    ROUND(AVG(ct.similarity_score)::numeric, 4) AS avg_similarity,
    ROUND(100.0 * SUM(CASE WHEN ct.thumbs_up THEN 1 ELSE 0 END)
              / NULLIF(COUNT(ct.id),0), 2) AS thumbs_up_pct,
    ROUND(AVG(ct.response_time_ms)::numeric, 0) AS avg_response_ms
FROM chat_sessions cs
LEFT JOIN chat_turns ct ON cs.id = ct.session_id;

-- =============================================================================
-- USEFUL QUERIES FOR THE WEB DASHBOARD
-- =============================================================================

-- 1. Live KPIs
-- SELECT * FROM vw_chatbot_kpis;

-- 2. Category breakdown
-- SELECT * FROM vw_category_stats;

-- 3. Intent drill-down
-- SELECT * FROM vw_intent_stats WHERE category = 'RETURNS' ORDER BY sample_count DESC;

-- 4. Full-text search example
-- SELECT id, instruction, intent_id FROM training_samples
-- WHERE to_tsvector('english', instruction) @@ plainto_tsquery('english', 'cancel order');

-- 5. Recent chat turns
-- SELECT ct.created_at, ct.user_input, i.name AS intent, c.name AS category,
--        ct.similarity_score, ct.thumbs_up
-- FROM chat_turns ct
-- LEFT JOIN intents    i ON ct.predicted_intent_id   = i.id
-- LEFT JOIN categories c ON ct.predicted_category_id = c.id
-- ORDER BY ct.created_at DESC LIMIT 20;

-- 6. Daily analytics
-- SELECT * FROM analytics_daily ORDER BY day DESC LIMIT 30;
