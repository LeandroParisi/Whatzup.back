  UPDATE users SET plan_id = null WHERE plan_id = 1;
  DELETE FROM plans_features WHERE plan_id = 1;
  DELETE FROM plans WHERE id = 1;
  DELETE FROM features WHERE id IN (1, 2, 3);