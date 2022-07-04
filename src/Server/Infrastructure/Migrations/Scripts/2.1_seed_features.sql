INSERT INTO features (id, type, name, is_active)
  VALUES
    (1, 'max_limit', 'number_of_steps', true),
    (2, 'max_limit', 'number_of_bots', true);

INSERT INTO plans (id, is_custom_plan, price, name, is_active)
  VALUES
    (1, false, 50, 'free_tier', true);

INSERT INTO plans_features
  VALUES
    (1, 1, 5),
    (1, 2, 1);