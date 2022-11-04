/* eslint-disable camelcase */
import * as fs from 'fs';
import path from 'path';

export const seedBasicLocationsScript : string = fs.readFileSync(`${path.join(path.resolve(__dirname), './Seeds/Scripts/1.1_seed_locations.sql')}`).toString()

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(seedBasicLocationsScript)
};

exports.down = pgm => {
};
