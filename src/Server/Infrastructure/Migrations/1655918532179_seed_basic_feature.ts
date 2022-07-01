/* eslint-disable camelcase */
import * as fs from 'fs';
import path from 'path';

export const seedBasicFeatureScript : string = fs.readFileSync(`${path.join(path.resolve(__dirname), 'Scripts/2.1_seed_features.sql')}`).toString()

export const unseedBasicFeatureScript : string = fs.readFileSync(`${path.join(path.resolve(__dirname), 'Scripts/2.2_unseed_features.sql')}`).toString()

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(seedBasicFeatureScript)
};

exports.down = pgm => {
  pgm.sql(unseedBasicFeatureScript)
};
