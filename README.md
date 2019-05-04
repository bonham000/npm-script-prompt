# npm-script-prompt

An interactive runner for a npm project `package.json` scripts, inspired by [`interactive-scripts`](https://github.com/hawkins/interactive-scripts) by Josh Hawkins.

## Installation

Install globally:

```
npm i -g npm-script-prompt
```

Or, run with npx: `npx npm-script-prompt`.

## Usage

Install the package globally and then run `run` in an npm project. Choose the npm script you want to run and hit enter!

Example output prompt for for this repo:

```sh
- 5 scripts found for npm-script-prompt 📟

? Select an npm script to run (Use arrow keys)
❯ test            - node index.js
  command:one     - echo "Running an example command..."
  command:two     - echo "Running an example command..."
  command:three   - echo "Running an example command..."
  (quit-prompt)   - Quit the prompt and exit
```