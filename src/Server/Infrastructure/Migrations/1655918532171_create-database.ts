/* eslint-disable camelcase */

export const upScript : string = `
  CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "whatsapp_number" varchar UNIQUE NOT NULL,
    "whatsapp_id" varchar UNIQUE NOT NULL,
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
    "is_active" bool DEFAULT false,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "users_bots" (
    "user_id" int,
    "bot_id" int
  );

  CREATE TABLE "bots" (
    "id" SERIAL PRIMARY KEY,
    "bot_name" varchar NOT NULL,
    "steps" json,
    "is_active" bool,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "user_plan" (
    "id" SERIAL PRIMARY KEY,
    "user_id" int,
    "is_custom_plan" bool,
    "default_plan_id" int,
    "custom_plan_id" int,
    "is_active" bool,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "custom_plans" (
    "id" SERIAL PRIMARY KEY,
    "price" decimal NOT NULL
  );

  CREATE TABLE "custom_plan_features" (
    "custom_plan_id" int,
    "feature_id" int,
    "max_limit" int,
    "is_active" bool,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "default_plans" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL,
    "price" decimal NOT NULL
  );

  CREATE TABLE "default_plan_features" (
    "default_plan_id" int,
    "feature_id" int,
    "max_limit" int,
    "is_active" bool
  );

  CREATE TABLE "feature_types" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL
  );

  CREATE TABLE "features" (
    "id" SERIAL PRIMARY KEY,
    "type_id" int,
    "name" varchar NOT NULL,
    "is_active" bool,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "payments" (
    "id" SERIAL PRIMARY KEY,
    "user_plan_id" int,
    "reference_year" int NOT NULL,
    "reference_month" int NOT NULL,
    "was_sent" bool,
    "send_date" date,
    "was_paid" bool,
    "payment_date" date,
    "created_at" date NOT NULL DEFAULT 'now()',
    "updated_at" date NOT NULL DEFAULT 'now()'
  );

  CREATE TABLE "countries" (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    iso2 char(2) NOT NULL
  );

  CREATE TABLE "states" (
    "id" SERIAL PRIMARY KEY,
    country_id int NOT NULL,
    "name" varchar UNIQUE NOT NULL,
    "state_code" varchar UNIQUE NOT NULL,
    iso2 char(2) NOT NULL
  );

  CREATE TABLE "cities" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL
  );

  CREATE INDEX "whatsapp_number" ON "users" ("whatsapp_number");

  ALTER TABLE "users" ADD FOREIGN KEY ("country_id") REFERENCES "countries" ("id");

  ALTER TABLE "states" ADD FOREIGN KEY ("country_id") REFERENCES "countries" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("state_id") REFERENCES "states" ("id");

  ALTER TABLE "users" ADD FOREIGN KEY ("city_id") REFERENCES "cities" ("id");

  ALTER TABLE "users_bots" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

  ALTER TABLE "users_bots" ADD FOREIGN KEY ("bot_id") REFERENCES "bots" ("id");

  ALTER TABLE "user_plan" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

  ALTER TABLE "user_plan" ADD FOREIGN KEY ("default_plan_id") REFERENCES "default_plans" ("id");

  ALTER TABLE "user_plan" ADD FOREIGN KEY ("custom_plan_id") REFERENCES "custom_plans" ("id");

  ALTER TABLE "custom_plan_features" ADD FOREIGN KEY ("custom_plan_id") REFERENCES "custom_plans" ("id");

  ALTER TABLE "custom_plan_features" ADD FOREIGN KEY ("feature_id") REFERENCES "features" ("id");

  ALTER TABLE "features" ADD FOREIGN KEY ("type_id") REFERENCES "feature_types" ("id");

  ALTER TABLE "default_plan_features" ADD FOREIGN KEY ("default_plan_id") REFERENCES "default_plans" ("id");

  ALTER TABLE "default_plan_features" ADD FOREIGN KEY ("feature_id") REFERENCES "features" ("id");


  ALTER TABLE "payments" ADD FOREIGN KEY ("user_plan_id") REFERENCES "user_plan" ("id");
`

export const downScript : string = `
  DROP TABLE default_plan_features;
  DROP TABLE custom_plan_features;
  DROP TABLE features;
  DROP TABLE feature_types;
  DROP TABLE users_bots;
  DROP TABLE payments;
  DROP TABLE user_plan;
  DROP TABLE default_plans;
  DROP TABLE custom_plans;
  DROP TABLE users;
  DROP TABLE bots;
  DROP TABLE cities;
  DROP TABLE states;
  DROP TABLE countries;
`
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(upScript)
};

exports.down = pgm => {
  pgm.sql(downScript)
};
