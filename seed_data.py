"""
seed_data.py — Load the Bitext CSV into PostgreSQL after running schema_and_seed.sql
Usage:
    DB_URL="postgresql://user:pass@localhost:5432/chatbot_db" python3 seed_data.py
"""
import os, re, sys
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# ── Config ────────────────────────────────────────────────────────────────────
DB_URL   = os.getenv("DB_URL", "postgresql://postgres:postgres@localhost:5432/chatbot_db")
CSV_PATH = os.getenv("CSV_PATH", "bitext-retail-ecommerce-llm-chatbot-training-dataset.csv")
BATCH    = 500

PROFANITY_RE = re.compile(r'\b(fuck|shit|damn|crap|ass)\b', re.IGNORECASE)

def clean(txt):
    return re.sub(r'\s+', ' ', str(txt).strip())

def main():
    print("Connecting to PostgreSQL …")
    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()

    # ── Load CSV ──────────────────────────────────────────────────────────────
    print(f"Loading {CSV_PATH} …")
    df = pd.read_csv(CSV_PATH).drop_duplicates()
    df['instruction'] = df['instruction'].apply(clean)
    df['response']    = df['response'].apply(clean)
    df['intent']      = df['intent'].str.strip().str.lower()
    df['category']    = df['category'].str.strip().str.upper()
    df['has_profanity'] = df['instruction'].str.contains(PROFANITY_RE)
    print(f"  {len(df):,} rows loaded after dedup")

    # ── Fetch FK maps ─────────────────────────────────────────────────────────
    cur.execute("SELECT name, id FROM categories")
    cat_map = {r[0]: r[1] for r in cur.fetchall()}

    cur.execute("SELECT name, id FROM intents")
    int_map = {r[0]: r[1] for r in cur.fetchall()}

    # ── Insert training_samples ───────────────────────────────────────────────
    print("Inserting training_samples …")
    rows = []
    skipped = 0
    for _, row in df.iterrows():
        cat_id = cat_map.get(row['category'])
        int_id = int_map.get(row['intent'])
        if cat_id is None or int_id is None:
            skipped += 1
            continue
        rows.append((
            row['instruction'], int_id, cat_id,
            row['tags'], row['response'], bool(row['has_profanity'])
        ))

    sql = """
        INSERT INTO training_samples
            (instruction, intent_id, category_id, tags, response, has_profanity)
        VALUES %s
        ON CONFLICT DO NOTHING
        RETURNING id, tags
    """
    inserted_ids = []
    for i in range(0, len(rows), BATCH):
        batch = rows[i:i+BATCH]
        execute_values(cur, sql, batch, fetch=True)
        result = cur.fetchall()
        inserted_ids.extend(result)
        conn.commit()
        print(f"  … {min(i+BATCH, len(rows)):,}/{len(rows):,}", end='\r')

    print(f"\n  Inserted {len(inserted_ids):,} samples (skipped {skipped})")

    # ── Insert sample_tags ────────────────────────────────────────────────────
    print("Inserting sample_tags …")
    tag_rows = []
    for sample_id, tags in inserted_ids:
        for ch in (tags or ''):
            tag_rows.append((sample_id, ch))

    execute_values(cur,
        "INSERT INTO sample_tags(sample_id, tag_code) VALUES %s ON CONFLICT DO NOTHING",
        tag_rows)
    conn.commit()
    print(f"  {len(tag_rows):,} tag associations inserted")

    # ── Seed one analytics_daily row (today) ──────────────────────────────────
    cur.execute("""
        INSERT INTO analytics_daily(day, total_sessions, total_turns, unique_intents,
                                    avg_similarity, profanity_count)
        VALUES (CURRENT_DATE, 0, 0,
                (SELECT COUNT(DISTINCT intent_id) FROM training_samples),
                NULL,
                (SELECT COUNT(*) FROM training_samples WHERE has_profanity))
        ON CONFLICT (day) DO NOTHING
    """)
    conn.commit()

    cur.close()
    conn.close()
    print("\n✅ Seed complete!")

if __name__ == "__main__":
    main()
