-- migrate:up

drop table if exists story;
CREATE TABLE if not exists story (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    keywords text,
    content text not null,
    category_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- migrate:down

