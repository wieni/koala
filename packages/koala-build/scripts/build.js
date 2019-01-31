#!/usr/bin/env node
/* eslint-disable no-console */
const webpack = require('webpack');
const chalk = require('chalk');
const Table = require('cli-table');

const config = require('../webpack-config');

const logResult = ({ stats }) => {
    const table = new Table({
        head: ['Filename', 'Filesize'],
        colWidth: [300, 200],
    });

    stats.toJson()
        .assets.filter(asset => /\.(js|css)$/.test(asset.name))
        .map(asset => (table.push([asset.name, `${asset.size / 1000.0}kb`])));

    console.log(chalk.blue.bold(table.toString()));
};

const build = () => {
    console.log(chalk.yellow('🐨 -- Creating an optimized production build.'));

    const compiler = webpack(config({}, { mode: 'production' }));

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const messages = stats.toJson({}, true);

            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }

                return reject(new Error(messages.errors.join('\n\n')));
            }

            if (process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length) {
                return reject(new Error(messages.warnings.join('\n\n')));
            }

            console.log(chalk.red('🐨 -- Koala is done with your assets.'));

            return resolve({ stats, warnings: messages.warnings });
        });
    });
};

build().then(res => logResult(res));
