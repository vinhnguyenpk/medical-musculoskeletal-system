-- migrate:up
ALTER TABLE story ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE story ADD COLUMN IF NOT EXISTS short_content TEXT;

-- migrate:down
ALTER TABLE story DROP COLUMN IF EXISTS title;
ALTER TABLE story DROP COLUMN IF EXISTS short_content;