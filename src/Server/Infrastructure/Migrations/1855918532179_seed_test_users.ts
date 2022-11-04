/* eslint-disable camelcase */
import * as fs from 'fs';
import path from 'path';


export const seed : string = fs.readFileSync(`${path.join(path.resolve(__dirname), './Seeds/Scripts/2.1_seed_test_user.sql')}`).toString()

export const unseed : string = fs.readFileSync(`${path.join(path.resolve(__dirname), './Seeds/Scripts/2.2_unseed_test_user.sql')}`).toString()


exports.up = (pgm) => {
  pgm.sql(seed)
};

exports.down = pgm => {
  pgm.sql(unseed)
};
