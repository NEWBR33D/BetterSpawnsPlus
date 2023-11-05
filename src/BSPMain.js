"use strict";
/*
 * BetterSpawnsPlus v2.0.0
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("@spt-aki/models/enums/ConfigTypes");
const BSPClassBots_1 = require("./BSPClassBots");
const BSPClassHelpers_1 = require("./BSPClassHelpers");
const BSPClassHideout_1 = require("./BSPClassHideout");
const BSPClassItems_1 = require("./BSPClassItems");
const BSPClassLocations_1 = require("./BSPClassLocations");
const BSPClassLoot_1 = require("./BSPClassLoot");
const BSPClassPlayer_1 = require("./BSPClassPlayer");
const BSPClassRaids_1 = require("./BSPClassRaids");
const BSPClassTraders_1 = require("./BSPClassTraders");
const BSPEnumLocations_1 = require("../enums/BSPEnumLocations");
const BSPEnumLogger_1 = require("../enums/BSPEnumLogger");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const package_json_1 = __importDefault(require("../package.json"));
const settingsManager_json_1 = __importDefault(require("../config/settingsManager.json"));
class BSPMain {
    databaseServer;
    logger;
    locationNames = Object.values(BSPEnumLocations_1.LocationNames);
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.databaseServer = container.resolve("DatabaseServer");
        container.register("BSPClassBots", BSPClassBots_1.BSPClassBots);
        container.register("BSPClassHelpers", BSPClassHelpers_1.BSPClassHelpers);
        container.register("BSPClassLocations", BSPClassLocations_1.BSPClassLocations);
        container.register("BSPClassRaids", BSPClassRaids_1.BSPClassRaids);
        const bspClassBots = container.resolve("BSPClassBots");
        const bspClassHelpers = container.resolve("BSPClassHelpers");
        const bspClassLocations = container.resolve("BSPClassLocations");
        const bspClassRaids = container.resolve("BSPClassRaids");
        const staticRouterModService = container.resolve("StaticRouterModService");
        staticRouterModService.registerStaticRouter("BetterSpawnsPlus", [
            {
                url: "/client/items",
                action: (url, info, sessionID, output) => {
                    try {
                        Object.keys(require.cache).forEach(function (key) {
                            delete require.cache[key];
                        });
                        const eftDatabaseLocations = this.databaseServer.getTables().locations;
                        const sptConfigsAirdrop = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.AIRDROP);
                        const sptConfigsBot = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.BOT);
                        const sptConfigsInRaid = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.IN_RAID);
                        const sptConfigsLocation = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
                        const sptConfigsPmc = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.PMC);
                        const loadSettings = (filename) => require(path.resolve(__dirname, `../config/${settingsManager_json_1.default.settingsFolder}/${filename}.json`));
                        const settingsBots = loadSettings("bots");
                        const settingsLocations = loadSettings("locations");
                        const settingsRaids = loadSettings("raids");
                        const tryCatchWrapper = (fn, methodName) => {
                            try {
                                fn();
                            }
                            catch (err) {
                                this.logger.error(`Error in ${methodName}: ${err.message}`);
                            }
                        };
                        if (settingsManager_json_1.default.modEnabled) {
                            // BOTS SETTINGS
                            if (settingsBots.enabled)
                                try {
                                    bspClassBots.botBrainType(settingsBots, bspClassHelpers, sptConfigsBot, sptConfigsPmc);
                                }
                                catch (err) {
                                    this.logger.error(`Error in bots settings: ${err.message}`);
                                }
                            // RAIDS SETTINGS
                            if (settingsRaids.enabled)
                                try {
                                    bspClassRaids.raidMaxBots(settingsRaids, bspClassHelpers, sptConfigsBot);
                                    bspClassRaids.raidTimer(settingsRaids, bspClassHelpers, eftDatabaseLocations);
                                    bspClassRaids.raidAirdrops(settingsRaids, bspClassHelpers, eftDatabaseLocations, sptConfigsAirdrop);
                                }
                                catch (err) {
                                    this.logger.error(`Error in raids settings: ${err.message}`);
                                }
                            // LOCATIONS SETTINGS
                            if (settingsLocations.enabled) {
                                const importInitJson = require("../db/locations/init.json");
                                bspClassLocations.spawnPatches(eftDatabaseLocations, sptConfigsInRaid, sptConfigsLocation);
                                bspClassLocations.allOpenZones(eftDatabaseLocations);
                                bspClassLocations.botConversionRates(sptConfigsPmc);
                                for (const locations in this.locationNames) {
                                    const location = this.locationNames[locations];
                                    const logsDirName = path.basename(path.dirname(__dirname.split('/').pop()));
                                    const logsFilePath = `${container.resolve("PreAkiModLoader").getModPath(logsDirName)}logs/logs_${location}.json`;
                                    const logsData = JSON.parse(fs.readFileSync(logsFilePath, "utf-8"));
                                    logsData.mainPreset = logsData.sgPreset = "disabled";
                                    Object.keys(logsData.total).forEach((key) => {
                                        logsData.total[key] = 0;
                                    });
                                    let initJson = importInitJson[location];
                                    const generatorSpawnSystemArray = bspClassHelpers.generateWeightArray(settingsLocations[location].spawnGenerator.presets);
                                    const randomGeneratorPreset = Math.floor(Math.random() * generatorSpawnSystemArray.length);
                                    let countRandomChanceToDisableMainPreset = 0;
                                    bspClassLocations.initSpawns(eftDatabaseLocations, initJson, location);
                                    // SPAWN GENERATOR SPAWN WAVES
                                    if (settingsLocations[location].spawnGenerator.enabled) {
                                        if (generatorSpawnSystemArray.length !== 0) {
                                            const presetJsonName = generatorSpawnSystemArray[randomGeneratorPreset];
                                            const importPresetJson = require(`../db/locations/${location}/spawnGenerator/presets/${presetJsonName}.json`);
                                            let chanceToDisable = 0;
                                            if (!importPresetJson.enableMainPresets && settingsLocations[location].main.enabled) {
                                                chanceToDisable = bspClassHelpers.generateRandomInteger(1, 2);
                                            }
                                            if (chanceToDisable === 1) {
                                                countRandomChanceToDisableMainPreset++;
                                            }
                                            else {
                                                if (chanceToDisable === 2) {
                                                    countRandomChanceToDisableMainPreset += 2;
                                                }
                                                logsData.sgPreset = presetJsonName;
                                                tryCatchWrapper(() => bspClassLocations.generatePmcs(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] pmcs`);
                                                tryCatchWrapper(() => bspClassLocations.generateScavs(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] scavs`);
                                                tryCatchWrapper(() => bspClassLocations.generateSniperScavs(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] sniperscavs`);
                                                tryCatchWrapper(() => bspClassLocations.generateBosses(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] bosses`);
                                                tryCatchWrapper(() => bspClassLocations.generateCultists(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] cultists`);
                                                tryCatchWrapper(() => bspClassLocations.generateBloodhounds(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] bloodhounds`);
                                                tryCatchWrapper(() => bspClassLocations.generateRaiders(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] raiders`);
                                                tryCatchWrapper(() => bspClassLocations.generateRogues(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] rogues`);
                                                tryCatchWrapper(() => bspClassLocations.generateWeirdScavs(bspClassHelpers, presetJsonName, initJson, location, importPresetJson), `generating [${presetJsonName}.json] weirdscavs`);
                                            }
                                        }
                                        else {
                                            this.logger.log(`Mod: ${package_json_1.default.name}: failed to load a spawn generator preset for ${location}`, BSPEnumLogger_1.LoggerTypes.ERROR);
                                            this.logger.log(`Mod: ${package_json_1.default.name}: no key-value pair provided for ${location} in location settings`, BSPEnumLogger_1.LoggerTypes.ERROR);
                                        }
                                    }
                                    // MAIN SPAWN WAVES
                                    if (settingsLocations[location].main.enabled) {
                                        tryCatchWrapper(() => bspClassLocations.mainSpawnSystem(bspClassHelpers, initJson, location, settingsLocations, countRandomChanceToDisableMainPreset, logsData), "generating bots in main preset");
                                    }
                                    // GLOBAL OVERRIDES
                                    if (settingsManager_json_1.default.globalOverrides.enabled) {
                                        tryCatchWrapper(() => bspClassLocations.botChanceDifficultyOverrides(settingsManager_json_1.default, initJson), "bot chance and difficulty global override");
                                        tryCatchWrapper(() => bspClassLocations.forceStopSpawnWaves(settingsManager_json_1.default, initJson, location), "force stop spawn waves global override");
                                    }
                                    initJson = initJson.filter(obj => obj !== null);
                                    initJson.sort((a, b) => a["Time"] - b["Time"]);
                                    bspClassRaids.raidLogs(eftDatabaseLocations, sptConfigsBot, location, logsData);
                                    bspClassLocations.countSpawnWaves(initJson, logsData);
                                    logsData.spawnWaves = initJson;
                                    fs.writeFileSync(logsFilePath, JSON.stringify(logsData, null, 4));
                                }
                                this.logger.log(`Mod: ${package_json_1.default.name}: successfully loaded spawn waves for each location`, BSPEnumLogger_1.LoggerTypes.SUCCESS);
                                this.logger.log(`Mod: ${package_json_1.default.name}: check "user/mods/PreyToLive-BetterSpawnsPlus/logs/" for raid details`, BSPEnumLogger_1.LoggerTypes.SUCCESS);
                            }
                        }
                    }
                    catch (err) {
                        this.logger.error(`Error in preAkiLoad: ${err.message}`);
                    }
                    return output;
                }
            }
        ], "aki");
    }
    postDBLoad(container) {
        const eftDatabaseBots = container.resolve("DatabaseServer").getTables().bots;
        const eftDatabaseCustomization = container.resolve("DatabaseServer").getTables().templates.customization;
        const eftDatabaseGlobals = container.resolve("DatabaseServer").getTables().globals;
        const eftDatabaseHideout = container.resolve("DatabaseServer").getTables().hideout;
        const eftDatabaseItems = container.resolve("DatabaseServer").getTables().templates.items;
        const eftDatabaseLocations = container.resolve("DatabaseServer").getTables().locations;
        const eftDatabaseTraders = container.resolve("DatabaseServer").getTables().traders;
        const sptConfigsInRaid = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.IN_RAID);
        const sptConfigsInsurance = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.INSURANCE);
        const sptConfigsTrader = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const sptConfigsLocation = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        const sptConfigsLostOnDeath = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.LOST_ON_DEATH);
        const sptConfigsPmc = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.PMC);
        const sptConfigsRepair = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.REPAIR);
        const sptConfigsScavcase = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.SCAVCASE);
        const sptConfigsWeather = container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
        const loadSettings = (filename) => require(path.resolve(__dirname, `../config/${settingsManager_json_1.default.settingsFolder}/${filename}.json`));
        const settingsBots = loadSettings("bots");
        const settingsHideout = loadSettings("hideout");
        const settingsItems = loadSettings("items");
        const settingsLoot = loadSettings("loot");
        const settingsPlayer = loadSettings("player");
        const settingsRaids = loadSettings("raids");
        const settingsTraders = loadSettings("traders");
        container.register("BSPClassBots", BSPClassBots_1.BSPClassBots);
        container.register("BSPClassHelpers", BSPClassHelpers_1.BSPClassHelpers);
        container.register("BSPClassHideout", BSPClassHideout_1.BSPClassHideout);
        container.register("BSPClassItems", BSPClassItems_1.BSPClassItems);
        container.register("BSPClassLoot", BSPClassLoot_1.BSPClassLoot);
        container.register("BSPClassPlayer", BSPClassPlayer_1.BSPClassPlayer);
        container.register("BSPClassRaids", BSPClassRaids_1.BSPClassRaids);
        container.register("BSPClassTraders", BSPClassTraders_1.BSPClassTraders);
        const bspClassHelpers = container.resolve("BSPClassHelpers");
        const bspClassRaids = container.resolve("BSPClassRaids");
        const bspClassBots = container.resolve("BSPClassBots");
        const bspClassTraders = container.resolve("BSPClassTraders");
        const bspClassHideout = container.resolve("BSPClassHideout");
        const bspClassItems = container.resolve("BSPClassItems");
        const bspClassLoot = container.resolve("BSPClassLoot");
        const bspClassPlayer = container.resolve("BSPClassPlayer");
        // OTHER OPTIONS
        if (settingsManager_json_1.default.modEnabled) {
            // BOTS SETTINGS
            if (settingsBots.enabled)
                try {
                    bspClassBots.pmcDogTags(settingsBots, eftDatabaseBots);
                    bspClassBots.pmcHostility(settingsBots, sptConfigsPmc);
                    bspClassBots.pmcRelativeLevel(settingsBots, sptConfigsPmc);
                    bspClassBots.pmcTalkRate(settingsBots, eftDatabaseBots);
                }
                catch (err) {
                    this.logger.error(`Error in bots settings: ${err.message}`);
                }
            // HIDEOUT SETTINGS
            if (settingsHideout.enabled)
                try {
                    bspClassHideout.hideoutModules(settingsHideout, eftDatabaseHideout);
                    bspClassHideout.hideoutConstruction(settingsHideout, bspClassHelpers, eftDatabaseHideout);
                    bspClassHideout.hideoutProduction(settingsHideout, bspClassHelpers, eftDatabaseHideout);
                    bspClassHideout.hideoutScavCase(settingsHideout, bspClassHelpers, eftDatabaseHideout, sptConfigsScavcase);
                }
                catch (err) {
                    this.logger.error(`Error in hideout settings: ${err.message}`);
                }
            // ITEMS SETTINGS
            if (settingsItems.enabled)
                try {
                    bspClassItems.itemDurability(settingsItems, bspClassHelpers, container, eftDatabaseGlobals, eftDatabaseItems);
                    bspClassItems.itemInsurance(settingsItems, bspClassHelpers, container, eftDatabaseItems, eftDatabaseLocations);
                    bspClassItems.itemLabsKeycard(settingsItems, eftDatabaseItems, eftDatabaseLocations);
                    bspClassItems.itemLoot(settingsItems, bspClassHelpers, container, eftDatabaseItems);
                }
                catch (err) {
                    this.logger.error(`Error in items settings: ${err.message}`);
                }
            // LOOT SETTINGS
            if (settingsLoot.enabled)
                try {
                    bspClassLoot.lootMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation);
                    bspClassLoot.containerMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation);
                }
                catch (err) {
                    this.logger.error(`Error in loot settings: ${err.message}`);
                }
            // PLAYER SETTINGS
            if (settingsPlayer.enabled)
                try {
                    bspClassPlayer.playerHealth(settingsPlayer, eftDatabaseGlobals);
                    bspClassPlayer.playerScav(settingsPlayer, eftDatabaseGlobals);
                }
                catch (err) {
                    this.logger.error(`Error in player settings: ${err.message}`);
                }
            // RAIDS SETTINGS
            if (settingsRaids.enabled)
                try {
                    bspClassRaids.raidExtractions(settingsRaids, eftDatabaseLocations);
                    bspClassRaids.raidEnd(settingsRaids, sptConfigsInRaid, sptConfigsLostOnDeath);
                    bspClassRaids.raidWeather(settingsRaids, sptConfigsWeather);
                }
                catch (err) {
                    this.logger.error(`Error in raids settings: ${err.message}`);
                }
            // TRADERS SETTINGS
            if (settingsTraders.enabled)
                try {
                    bspClassTraders.traderInsurance(settingsTraders, eftDatabaseTraders, sptConfigsInsurance);
                    bspClassTraders.traderStock(settingsTraders, sptConfigsTrader);
                    bspClassTraders.traderServices(settingsTraders, bspClassHelpers, eftDatabaseCustomization, eftDatabaseTraders);
                    bspClassTraders.traderRepairs(settingsTraders, eftDatabaseTraders, sptConfigsRepair);
                }
                catch (err) {
                    this.logger.error(`Error in traders settings: ${err.message}`);
                }
        }
        if (settingsManager_json_1.default.modEnabled) {
            this.logger.log(`Mod: ${package_json_1.default.name}: enabled`, BSPEnumLogger_1.LoggerTypes.SUCCESS);
            this.logger.log(`Mod: ${package_json_1.default.name}: loaded settings from "${settingsManager_json_1.default.settingsFolder}" folder`, BSPEnumLogger_1.LoggerTypes.SUCCESS);
        }
        else {
            this.logger.log(`Mod: ${package_json_1.default.name}: disabled`, BSPEnumLogger_1.LoggerTypes.DISABLE);
        }
    }
    postAkiLoad(container) {
        try {
            const loadSettings = (filename) => require(path.resolve(__dirname, `../config/${settingsManager_json_1.default.settingsFolder}/${filename}.json`));
            const settingsTraders = loadSettings("traders");
            const settingsMisc = loadSettings("misc");
            const preAkiModLoader = container.resolve("PreAkiModLoader");
            const imageRouter = container.resolve("ImageRouter");
            const modPath = path.basename(path.dirname(__dirname.split('/').pop()));
            const traderPath = `${preAkiModLoader.getModPath(modPath)}res/traders`;
            const launcherPath = `${preAkiModLoader.getModPath(modPath)}res/launchers`;
            // replace trader profile images
            if (settingsTraders.enabled && settingsTraders.traderProfileImages.replace) {
                fs.readdir(traderPath, (err, files) => {
                    files.forEach(file => {
                        const imageId = file.split('/').pop().split('.').shift();
                        imageRouter.addRoute(`/files/trader/avatar/${imageId}`, `${traderPath}/${imageId}.jpg`);
                    });
                });
            }
            // replace launcher background images
            if (settingsMisc.enabled && settingsMisc.launcherBackground.replace) {
                const imageArray = settingsMisc.launcherBackground.images;
                fs.readdir(launcherPath, (err, files) => {
                    files.forEach(file => {
                        const imageId = file.split('/').pop().split('.').shift();
                        const random = Math.floor(Math.random() * imageArray.length);
                        imageRouter.addRoute(`/files/launcher/${imageId}`, `${launcherPath}/${imageArray[random]}.jpg`);
                    });
                });
            }
        }
        catch (err) {
            this.logger.error(`Error in postAkiLoad: ${err.message}`);
        }
    }
}
module.exports = { mod: new BSPMain() };
