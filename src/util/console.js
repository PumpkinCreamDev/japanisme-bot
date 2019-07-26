const chalk = require("chalk");

class Logger {

    static info(data) {
        return console.info(`${chalk.red(`[${new Date().toString().split(" ", 5).join(" ")}]`)} [${chalk.magenta(data.name)}||${chalk.red(data.pid)}] ${chalk.green(" INFO : ")} ${data.message}`); // eslint-disable-line
    }

    static debug(data) {
        return console.debug(`${chalk.red(`[${new Date().toString().split(" ", 5).join(" ")}]`)} [${chalk.magenta(data.name)}||${chalk.red(data.pid)}] ${chalk.blue(" DEBUG: ")} ${data.message}`); // eslint-disable-line
    }

}

module.exports = Logger;
