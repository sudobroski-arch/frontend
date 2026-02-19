CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_urls TEXT[],                -- array of original URLs
  source_names TEXT[],                -- e.g., {"CNN","BBC"}
  category VARCHAR(50),               -- 'politics', 'science', 'tech'
  region VARCHAR(10),                  -- 'us', 'eu', 'global'
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_category_region ON articles(category, region);
