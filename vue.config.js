/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let MOCKING_LOCATION = null;
if (fs.existsSync('./.mockingLocation')) {
    MOCKING_LOCATION = fs.readFileSync('./.mockingLocation', 'utf-8');
}
if (process.env.NODE_ENV === 'development' && MOCKING_LOCATION) {
    console.log(chalk.red('MOCKING_LOCATION', MOCKING_LOCATION));
}

module.exports = {
    lintOnSave: 'error',
    crossorigin: 'anonymous',
    integrity: true,
    configureWebpack: {
        resolve: {
            mainFields: ['browser', 'module', 'main'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    },

    devServer: {
        open: true,
        port: 8080,
        proxy: {
            '.*': {
                target: MOCKING_LOCATION ? MOCKING_LOCATION : 'https://cn.bing.com',
            },
        },
    },
};
