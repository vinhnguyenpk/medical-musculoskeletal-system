-- migrate:up

drop table if exists category;
create table if not exists category (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text not null,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- migrate:down

