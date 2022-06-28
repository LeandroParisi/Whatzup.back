/* eslint-disable camelcase */

export const upScript : string = `
  INSERT INTO feature_types (id, name)
    VALUES
      (1, 'limit_number');

  INSERT INTO features (id, type_id, name, is_active)
    VALUES
      (1, 1, 'number_of_steps', true),
      (2, 1, 'number_of_bots', true);

  INSERT INTO default_plans (id, name, price)
    VALUES
      (1, 'free_tier', 0);

  INSERT INTO default_plan_features
    VALUES
      (1, 1, 5, true),
      (1, 2, 1, true);
`

export const downScript : string = `
  DELETE FROM default_plan_features WHERE default_plan_id = 1;
  DELETE FROM default_plans WHERE id = 1;
  DELETE FROM features WHERE id = 1;
  DELETE FROM feature_types WHERE id = 1;

`
exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(upScript)
};

exports.down = pgm => {
  pgm.sql(downScript)
};
