global.Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { join, resolve } = require("path");
const Japanisme = require("./JapanismeClient");
const TreeMap = require("../util/treemap");
const LoggingFactory = require("./loggingfactory");
const Util = require("../util/util");
const Discord = require("discord.js");

module.exports = class CommandClient extends Japanisme {
  constructor(options, djsopt) {
    super(djsopt);
    this.path = options.path;
    this.commands = new TreeMap();
    this.aliases = new TreeMap();
    this.modules = new TreeMap();
    this.cooldowns = new TreeMap();
    this.util = new Util(Discord, this);
  }

  /**
   * @getter
   */
  get Commands() {
    return this.commands;
  }
  get Aliases() {
    return this.aliases;
  }

  build() {
    const logger = new LoggingFactory(this);
    const modules = fs.readdirSync(join("./src", this.path));
    for (const Module of modules) {
      logger.print(`${Module} Loaded!`);
      this.modules.set(Module, {
        name: Module,
        commands: []
      });

      const commands = fs.readdirSync(join("./src", this.path, Module));
      for (const file of commands) {
        const moduleConfig = this.modules.get(Module);
        const Command = require(`../${this.path}/${Module}/${file}`);
        const resolved = new Command();
        moduleConfig.commands.push(resolved);
        if (resolved.constructor.name !== file.split(".")[0]) {
          const errors = new Error();
          errors.name = "ANOMALY_CLASS_FILENAME";
          errors.message = `[${
            file.split(".")[0]
          }] classname is not found in ${resolve(
            __dirname,
            `../${this.path}/${Module}/${file}`
          )}`;
          throw errors;
        }
        resolved.category = moduleConfig;
        logger.print(`Resolving command ${resolved.name}`);
        this.commands.set(resolved.name.toLowerCase(), resolved);
        for (const alias of resolved.aliases) {
          this.aliases.set(alias.toLowerCase(), resolved.name.toLowerCase());
        }
      }
    }
  }
};
