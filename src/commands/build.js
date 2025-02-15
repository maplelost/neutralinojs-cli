const utils = require('../utils');
const bundler = require('../modules/bundler');
const config = require('../modules/config');
const constants = require('../constants');

module.exports.register = (program) => {
    program
        .command('build')
        .description('builds binaries for all supported platforms and resources.neu file')
        .option('-r, --release')
        .option('--config-file <path>', 'specify the *.config.json file')
        .option('--copy-storage')
        .option('--clean')
        .action(async (command) => {
            if(command.configFile) {
              utils.log(`Using config file file: ${command.configFile}`);
              constants.files.configFile = command.neuJson;
            }

            utils.checkCurrentProject();
            const configObj = config.get()
            const buildDir = configObj.cli.distributionPath ? utils.trimPath(configObj.cli.distributionPath) : 'dist';
            if(command.clean) {
                utils.log(`Cleaning previous build files from ${buildDir}...`);
                utils.clearDirectory(buildDir);
            }
            utils.log('Bundling app...');
            await bundler.bundleApp(command.release, command.copyStorage);
            utils.showArt();
            utils.log(`Application package was generated at the ${buildDir} directory!`);
            utils.log('Distribution guide: https://neutralino.js.org/docs/distribution/overview');
        });
}

