#! /usr/bin/env node
const readJson = require("read-package-json");
const inquirer = require("inquirer");
const runAll = require("npm-run-all");
const path = require("path");

/* Hopefully someone doesn't name a script this */
const QUIT_COMMAND_KEY = "___quit___and___exit___prompt___";
const MAX_DESCRIPTION = 50;

/**
 * Helper to truncate long npm scripts descriptions.
 *
 * @param description command description
 */
const formatDescription = description => {
  return description.replace(/\n/gi, "").slice(0, MAX_DESCRIPTION);
};

/**
 * Helper to format script options for vertical alignment.
 *
 * @param script command name
 * @param description command description
 * @param maxLength longest command name length
 */
const formatScriptOption = (script, description, maxLength) => {
  return `${script}${" ".repeat(
    maxLength - script.length,
  )}- ${formatDescription(description)}`;
};

/**
 * Helper to gather the npm script options from the file input
 * data.
 *
 * @param data package.json file data
 */
const parseFileAndGatherChoices = data => {
  const npmScripts = data.scripts;

  let maxScriptLength = 0;
  for (let scriptName of Object.keys(npmScripts)) {
    maxScriptLength = Math.max(scriptName.length, maxScriptLength);
  }

  maxScriptLength += 3;

  return Object.entries(npmScripts)
    .map(([scriptName, description]) => {
      return {
        value: scriptName,
        name: formatScriptOption(scriptName, description, maxScriptLength),
      };
    })
    .concat({
      value: QUIT_COMMAND_KEY,
      name: formatScriptOption(
        "(quit-prompt)",
        "Quit the prompt and exit",
        maxScriptLength,
      ),
    });
};

/**
 * Main prompt function.
 *
 * @param error
 * @param data
 */
const promptUser = (error, data) => {
  if (error) {
    console.error("An error occurred reading package.json!\n---");
    console.error(error.message);
    process.exit(1);
  } else {
    const choices = parseFileAndGatherChoices(data);
    console.log(`\n- ${choices.length} scripts found for ${data.name} 📟\n`);
    inquirer
      .prompt({
        choices,
        name: "script",
        type: "list",
        pageSize: choices.length,
        message: "Select an npm script to run",
      })
      .then(runScript)
      .catch(console.error);
  }
};

/**
 * Execute the user selected script.
 *
 * @param inquirer prompt result.
 */
const runScript = ({ script }) => {
  if (script === QUIT_COMMAND_KEY) {
    console.log("\n- Exiting! Thanks and come again ⛵️\n");
    process.exit(1);
  } else {
    runAll(script, {
      stdout: process.stdout,
      stderr: process.stderr,
    }).catch(error => {
      console.error(error);
    });
  }
};

/**
 * Run the program:
 */
readJson(
  path.join(process.cwd(), "package.json"),
  console.error,
  false,
  promptUser,
);
