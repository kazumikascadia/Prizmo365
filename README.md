# Prizmo365
<img alt="Prizmo365 white logo" src="https://github.com/kazumikascadia/Prizmo365/assets/70727046/d29624c1-82af-4703-9961-32368ec21ef2" width="250">

**An Open-Source, Multipurpose Discord Bot**

## What is Prizmo
> [!WARNING]
> This bot is currently in a beta build. Use at your own discretion.

Prizmo is a work in progress Discord bot built with a multipurpose mindset. This is a completely free and entirely open-source project. You can find all of Prizmo’s code in this Github repository, and you are completely free to use all of it. There are no current plans for monetization, nor are there any open ways to donate to the bot.

### Features
Prizmo is currently a work in progress, though is still packed of a variety of features. All of Prizmo's current features can be found below.

- An 8 ball command which can provide an 8 ball response to any statement.
- A command to split apart all of the letters in a sentence and list out how many letters of the alphabet are used, excluding anything that does not fall between A-Z.
- A full dice rolling command complete with the ability to select the amount and size of the dice (and return 10 of the rolls within that amount).
- A command to generate a random hex color code and display it in an embed.
- A rock paper scissors command so that you can play rock paper scissors against Prizmo.
- A command to convert from one unit type to another, with units falling into time, measurements, square areas, and volume.
- A full info command to discover info on the server of location or on any user in that server.
- The ability to send starred messages to a starboard channel.
- Multiple commands related to suggesting information to the server.
- A fully fledged levelling system, featuring rewards per level and leaderboards (up to 20 members displayed).
- With server customization using the /set command!
- ... and more to come soon!

### Using Prizmo
Using Prizmo365 is as easy as any other Discord bot. To get started, you can add it to your server using this [link](https://discord.com/api/oauth2/authorize?client_id=734214062627356683&permissions=8&scope=bot+applications.commands) and set it up just like any other bot! Prizmo has a built-in settings command named "/set", which will allow you to set up levels, guild information, suggestions, and more. More information will be provided for this with the release of the wiki.

Alternatively, you can create a separate branch of the bot. Follow this step by step process:
1. Set up your own Discord bot at the Discord Developer Portal. For more information, visit [Discordjs.guide's](https://discordjs.guide/preparations/setting-up-a-bot-application.html#token-leak-scenario) information.
2. Download the latest release and rename the sample files.
   - Directory `sampledata` should be named `data`.
   - `sampledata/sstarboarddata.json` should be `data/starboarddata.json`
   - `sampledata/ssuggestdata.json` should be `data/suggestdata.json`
   - `sampledata/sguilddata.json` should be `data/guilddata.json`
   - `sampleconfig.json` should be `config.json`
   - `sampleleveldata.json` should be `leveldata.json`
3. Add the appropriate information to config.json (as stated in the config).
4. Open your console and run `npm i` to install all of the files located in `package.json`.
5. Once the files are installed, you should be able to add the bot to your own server and run `npm run start` to run the bot.
   - Even though you have created this bot, it will not run forever! If there is any crash, or if your computer is no longer logged in, it will stop running. If you want it to run for a longer time you should set up a server.

A wiki will be coming soon to elaborate more on all of this information.

### Namesake
In case you're curious, the name "Prizmo365" is a creation from long ago, when I was originally extremely interested in starting my own business (which I would have called Prism). As such, Prizmo comes from a name I used at the time online, as well as a name for an idea of a security bot for the company's Discord server. In August of 2020, I decided to begin the original Prizmo project, under the title "Prizmo365" - under the idea that it would be usable 365 days a year, 24/7. With time and change, the name stuck, and here we are.

## Contributions
Because Prizmo365 is an open-source Discord bot created by one developer, contributions are absolutely accepted and are even extremely useful. If you would like to contribute, you can request features and report bugs or vulnerabilities. Programming contributions will also be accepted; submit a pull request and it will most likely be accepted if it is a working and good change. You can also DM @kazumikascadia on Discord for more suggestions.

### Feature Requests
If you would like to request any features for this bot, please DM @kazumikascadia on Discord. My message requests are currently open and will remain that way. With this, please send a beginner message detailing who you are, or else I will likely not respond due to privacy concerns.

### Bug Reports
If, in your own personal testing, you find any bugs with the code in this repository, please post them to the Issues section or DM @kazumikascadia on Discord. I will do my best to solve any bugs that may occur, and they will be published to this repository with a new release.

When providing bug reports, please provide exactly how you found the bug, where the bug is / may be located, and the release in which they occurred. If the release is not the most current, they may have been solved in a recent release; if they have not been, they should be solved by the next release.

## Security
For security issues, please refer to the SECURITY.md file.

## Legal Rights
Under the MIT License, you are free to use Prizmo's code as you wish. Please review the LICENSE.md file for more information.
### Usage Requests
As a request, please credit @kazumikascadia if you are to use this code, and please do not call your project "Prizmo365", "Prizmo", or any other derivative, since the imagery and other such information of Prizmo is not provided to you within these files. If you are to modify this code, it is still within this request that you mention @kazumikascadia as the original creator. 

## Sources and Libraries
Prizmo365 uses a variety of sources as its foundation. Since much of the code in this repository relies on these libraries, it is ABSOLUTELY RECOMMEND that you ensure full installation to your project, since it may not function without. You are liable for your own usage of these items and should follow their legal guides on your own accord.

1. Nodejs
    - The entire foundational library uponwhich this project is built.
    - Found at [Node.js Website](https://nodejs.org/en)
2. Discord.js v14
   - Another foundational library uponwhich this project is built, and is required as a wrapper for the Discord API.
   - Foundational code derived from [Discord.js Guide](https://discordjs.guide/)
   - Found at [Discord.js Website](https://discord.js.org/#/)
4. Napi-RS/Canvas
   - Used to create certain images within the codebase (currently only the random color image).
   - Found at [Napi-RS/Canvas NPM](https://www.npmjs.com/package/@napi-rs/canvas)
5. Chalk
   - Used for console formatting and prettifying; not necessary and can be removed from the code.
   - Found at [Chalk NPM](https://www.npmjs.com/package/chalk)
6. Dayjs
   - Used to provide timestamps throughout the majority of the codebase.
   - Found at [Dayjs NPM](https://www.npmjs.com/package/dayjs)
7. MS
    - Used to create timestamps in some commands.
    - Found at [MS NPM](https://www.npmjs.com/package/ms)
8. Mathjs
    - Used in the majority of the unitconvert.js file.
    - Found at [Mathjs NPM](https://www.npmjs.com/package/mathjs)
9. ESLint
    - A handy file for project efficiency and ensuring there are minimal issues with any writing.
    - Found at [ESLint Website](https://eslint.org/)
10. Momentjs
    - A library utilized in the info command for displaying time periods in a nice manner.
    - Found at [Momentjs NPM](https://www.npmjs.com/package/moment)
