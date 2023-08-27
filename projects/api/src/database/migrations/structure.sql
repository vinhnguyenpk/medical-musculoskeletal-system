-- Create extentions auto create uuid v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table category
drop table if exists category;
create table if not exists category (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text not null,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create table story
drop table if exists story;
CREATE TABLE if not exists story (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    keywords text,
    content text not null,
    category_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed data sample category
insert into category(id, name) values ('ed6eb28d-696c-40ef-a580-28257c8bf042','Cổ');
insert into category(id, name) values ('6e19f895-0906-4f28-97f3-732ab7f4c80a','Vai');
insert into category(id, name) values ('3afab1c3-8922-4058-8a07-b78d3d2f7181','Gáy');
insert into category(id, name) values ('18f1b77d-982c-4cbd-ba87-85317683b5d3','Tay');
insert into category(id, name) values ('72d26dac-951c-4c1c-a6db-3e49dbc9d3c6','Chân');
insert into category(id, name) values ('e56388f9-ccf4-4ea2-b3c8-dedbe0b16be6','Eo');
insert into category(id, name) values ('5f11463d-c23b-4e0c-bb87-53c0cd864e02','Xương Sống');
insert into category(id, name) values ('4be6353a-1908-40eb-88f9-f9143dbf42f0','Thắt Lưng');

-- Seed data sample story
insert into story(keywords, content, category_id) values('Đau Cổ', 'Trị Đau Cổ', 'ed6eb28d-696c-40ef-a580-28257c8bf042');
insert into story(keywords, content, category_id) values('Đau Vai', 'Trị Đau Vai', '6e19f895-0906-4f28-97f3-732ab7f4c80a');
insert into story(keywords, content, category_id) values('Đau Gáy', 'Trị Đau Gáy', '3afab1c3-8922-4058-8a07-b78d3d2f7181');
insert into story(keywords, content, category_id) values('Đau Tay', 'Trị Đau Tay', '18f1b77d-982c-4cbd-ba87-85317683b5d3');
insert into story(keywords, content, category_id) values('Đau Chân', 'Trị Đau Chân', '72d26dac-951c-4c1c-a6db-3e49dbc9d3c6');
insert into story(keywords, content, category_id) values('Đau Eo', 'Trị Đau Eo', 'e56388f9-ccf4-4ea2-b3c8-dedbe0b16be6');
insert into story(keywords, content, category_id) values('Đau Xương Sống', 'Trị Đau Xương Sống', '5f11463d-c23b-4e0c-bb87-53c0cd864e02');
insert into story(keywords, content, category_id) values('Đau Thắt Lưng', 'Trị Đau Thắt Lưng', '4be6353a-1908-40eb-88f9-f9143dbf42f0');

-- Sample Query for get all
select *
from story s
inner join category c on c.id = s.category_id
;

