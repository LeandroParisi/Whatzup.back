/* eslint-disable camelcase */
import * as fs from 'fs';
import path from 'path';
global.appRoot = path.resolve(__dirname);

console.log(global.appRoot)

export const createDatabaseScript : string = fs.readFileSync(`${path.join(path.resolve(__dirname), 'Scripts/1.1_create_database.sql')}`).toString()

export const dropDatabaseScript : string = fs.readFileSync(`${path.join(path.resolve(__dirname), 'Scripts/1.2_drop_database.sql')}`).toString()

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(createDatabaseScript)
};

exports.down = pgm => {
  pgm.sql(dropDatabaseScript)
};
