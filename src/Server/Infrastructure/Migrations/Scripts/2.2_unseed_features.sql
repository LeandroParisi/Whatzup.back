  DELETE FROM default_plan_features WHERE default_plan_id = 1;
  DELETE FROM default_plans WHERE id = 1;
  DELETE FROM features WHERE id IN (1, 2);
  DELETE FROM feature_types WHERE id = 1;