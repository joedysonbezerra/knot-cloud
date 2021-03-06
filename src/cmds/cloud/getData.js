/* eslint-disable no-console */
import yargs from 'yargs';
import chalk from 'chalk';
import { Client } from '@cesarbr/knot-cloud-sdk-js';
import options from './utils/options';
import getFileCredentials from './utils/getFileCredentials';

const getData = async (args) => {
  const client = new Client({
    hostname: args.server,
    port: args.port,
    protocol: args.protocol,
    username: args.username,
    password: args.password,
    token: args.token,
  });

  await client.connect();
  await client.getData(args.thingId, [args.sensorId]);
  await client.close();
};

yargs
  .config('credentials-file', path => getFileCredentials(path))
  .command({
    command: 'get-data <thing-id> <sensor-id>',
    desc: 'Requests the current value of <sensor-id> from <thing-id>',
    builder: (_yargs) => {
      _yargs
        .options(options)
        .positional('thing-id', {
          describe: 'Thing ID',
        })
        .positional('sensor-id', {
          describe: 'ID of the sensor to request the data',
        });
    },
    handler: async (args) => {
      try {
        await getData(args);
        console.log(chalk.green('data successfully requested'));
        console.log(chalk.grey("subscribe to the 'data' event to receive the requested data"));
      } catch (err) {
        console.log(chalk.red('it was not possible to request the data :('));
        console.log(chalk.red(err));
      }
    },
  });
