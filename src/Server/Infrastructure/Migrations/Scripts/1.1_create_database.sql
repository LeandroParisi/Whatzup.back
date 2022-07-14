  CREATE TABLE phone_numbers (
    "id" SERIAL PRIMARY KEY,
    "whatsapp_number" varchar NOT NULL,
    "whatsapp_id" varchar,
    "is_active" bool DEFAULT true,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "plan_id" int,
    "phone_number_id" int,
    "email" varchar UNIQUE NOT NULL,
    "password" varchar UNIQUE NOT NULL,
    "document_number" varchar UNIQUE NOT NULL,
    "first_name" varchar NOT NULL,
    "middle_name" varchar,
    "last_name" varchar NOT NULL,
    "country_id" int NOT NULL,
    "state_id" int NOT NULL,
    "city_id" int NOT NULL,
    "neighbourhood" varchar,
    "address_street" varchar,
    "address_number" varchar,
    "address_complement" varchar,
    "postal_code" varchar,
    "was_activated" bool DEFAULT false,
    "is_active" bool DEFAULT true,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE bots (
    "id" SERIAL PRIMARY KEY,
    "bot_name" varchar NOT NULL,
    "steps" json,
    "is_active" bool,
    "user_id" int NOT NULL,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE bots_phone_numbers (
    "bot_id" int NOT NULL,
    "phone_number_id" int NOT NULL
  );

  CREATE TABLE plans (
    "id" SERIAL PRIMARY KEY,
    "is_custom_plan" bool NOT NULL,
    "price" decimal NOT NULL,
    "name" varchar,
    "is_active" bool DEFAULT true,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE plans_features (
    "plan_id" int NOT NULL,
    "feature_id" int NOT NULL,
    "max_limit" int
  );

  CREATE TABLE features (
    "id" SERIAL PRIMARY KEY,
    "type" varchar NOT NULL,
    "name" varchar NOT NULL,
    "is_active" bool,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE payments (
    "id" SERIAL PRIMARY KEY,
    "plan_id" int,
    "user_id" int,
    "reference_year" int NOT NULL,
    "reference_month" int NOT NULL,
    "was_sent" bool,
    "send_date" date,
    "was_paid" bool,
    "payment_date" date,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    iso2 char(2) NOT NULL
  );

  CREATE TABLE states (
    "id" SERIAL PRIMARY KEY,
    country_id int NOT NULL,
    "name" varchar UNIQUE NOT NULL,
    "state_code" varchar UNIQUE NOT NULL,
    iso2 char(2) NOT NULL
  );

  CREATE TABLE cities (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL
  );

  CREATE INDEX "whatsapp_number" ON "phone_numbers" ("whatsapp_number");

  CREATE INDEX "whatsapp_id" ON "phone_numbers" ("whatsapp_id");

  
-- todo: composite unique constraint
  -- bots_phone_numbers

  ALTER TABLE "users" ADD FOREIGN KEY ("country_id") REFERENCES "countries" ("id");

  ALTER TABLE "states" ADD FOREIGN KEY ("country_id") REFERENCES "countries" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("state_id") REFERENCES "states" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("city_id") REFERENCES "cities" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("phone_number_id") REFERENCES "phone_numbers" ("id");

  ALTER TABLE "bots_phone_numbers" ADD FOREIGN KEY ("bot_id") REFERENCES "bots" ("id");

  ALTER TABLE "bots_phone_numbers" ADD FOREIGN KEY ("phone_number_id") REFERENCES "phone_numbers" ("id");

  ALTER TABLE "bots" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("plan_id") REFERENCES "plans" ("id");

  ALTER TABLE "plans_features" ADD FOREIGN KEY ("plan_id") REFERENCES "plans" ("id");

  ALTER TABLE "plans_features" ADD FOREIGN KEY ("feature_id") REFERENCES "features" ("id");

  ALTER TABLE "payments" ADD FOREIGN KEY ("plan_id") REFERENCES "plans" ("id");

  ALTER TABLE "payments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

