/* 
 * BetterSpawnsPlus v2.0.3
 * MIT License
 * Copyright (c) 2024 PreyToLive
 */

/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

import { DependencyContainer } from "tsyringe";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { IInRaidConfig } from "@spt-aki/models/spt/config/IInRaidConfig";
import { IInsuranceConfig } from "@spt-aki/models/spt/config/IInsuranceConfig";
import { ILocationConfig } from "@spt-aki/models/spt/config/ILocationConfig";
import { ILostOnDeathConfig } from "@spt-aki/models/spt/config/ILostOnDeathConfig";
import { IPmcConfig } from "@spt-aki/models/spt/config/IPmcConfig";
import { IRepairConfig } from "@spt-aki/models/spt/config/IRepairConfig";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IScavCaseConfig } from "@spt-aki/models/spt/config/IScavCaseConfig";
import { IWeatherConfig } from "@spt-aki/models/spt/config/IWeatherConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { BSPClassBots } from "./BSPClassBots";
import { BSPClassHelpers } from "./BSPClassHelpers";
import { BSPClassHideout } from "./BSPClassHideout";
import { BSPClassItems } from "./BSPClassItems";
import { BSPClassLocations } from "./BSPClassLocations";
import { BSPClassLoot } from "./BSPClassLoot";
import { BSPClassPlayer } from "./BSPClassPlayer";
import { BSPClassRaids } from "./BSPClassRaids";
import { BSPClassTraders } from "./BSPClassTraders";
import { LocationNames } from "../enums/BSPEnumLocations";
import { LoggerTypes } from "../enums/BSPEnumLogger";
import * as path from "path";
import * as fs from "fs";
import pkg from "../package.json";
import settingsManager from "../config/settingsManager.json";

class BSPMain implements IPostDBLoadMod {
    private databaseServer: DatabaseServer;
    private logger: ILogger;

    private locationNames: string[] = Object.values(LocationNames);

    public preAkiLoad(container: DependencyContainer): void { 
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.logger = container.resolve<ILogger>("WinstonLogger");

        container.register<BSPClassBots>("BSPClassBots", BSPClassBots);
        container.register<BSPClassHelpers>("BSPClassHelpers", BSPClassHelpers);
        container.register<BSPClassLocations>("BSPClassLocations", BSPClassLocations);
        container.register<BSPClassRaids>("BSPClassRaids", BSPClassRaids);

        const bspClassBots: BSPClassBots = container.resolve<BSPClassBots>("BSPClassBots");
        const bspClassHelpers: BSPClassHelpers = container.resolve<BSPClassHelpers>("BSPClassHelpers");
        const bspClassLocations: BSPClassLocations = container.resolve<BSPClassLocations>("BSPClassLocations");
        const bspClassRaids: BSPClassRaids = container.resolve<BSPClassRaids>("BSPClassRaids");
        
        const staticRouterModService: StaticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        
        staticRouterModService.registerStaticRouter(
            "BetterSpawnsPlus",
            [
                {
                    url: "/client/items",
                    action: (url, info, sessionID, output) =>
                    {
                        try
                        {
                            Object.keys(require.cache).forEach(function(key) {
                                delete require.cache[key]
                            });

                            const eftDatabaseLocations = this.databaseServer.getTables().locations;

                            const sptConfigsAirdrop: IAirdropConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
                            const sptConfigsBot: IBotConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IBotConfig>(ConfigTypes.BOT);
                            const sptConfigsInRaid: IInRaidConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);
                            const sptConfigsLocation: ILocationConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<ILocationConfig>(ConfigTypes.LOCATION);
                            const sptConfigsPmc: IPmcConfig = container.resolve<ConfigServer>("ConfigServer").getConfig<IPmcConfig>(ConfigTypes.PMC);

                            const loadSettings = (filename) => require(path.resolve(__dirname, `../config/${settingsManager.settingsFolder}/${filename}.json`));
                            const settingsBots = loadSettings("bots");
                            const settingsLocations = loadSettings("locations");
                            const settingsRaids = loadSettings("raids");

                            const tryCatchWrapper = (fn, methodName) => {
                                try {
                                    fn();
                                } catch (err) {
                                    this.logger.error(`Error in ${methodName}: ${err.message}`);
                                }
                            };

                            if (settingsManager.modEnabled) {
                                // BOTS SETTINGS
                                if (settingsBots.enabled) try {
                                    bspClassBots.botBrainType(settingsBots, bspClassHelpers, sptConfigsBot, sptConfigsPmc);
                                } catch (err) {
                                    this.logger.error(`Error in bots settings: ${err.message}`);
                                }

                                // RAIDS SETTINGS
                                if (settingsRaids.enabled) try {
                                    bspClassRaids.raidMaxBots(settingsRaids, bspClassHelpers, sptConfigsBot);
                                    bspClassRaids.raidTimer(settingsRaids, bspClassHelpers, eftDatabaseLocations);
                                    bspClassRaids.raidAirdrops(settingsRaids, bspClassHelpers, eftDatabaseLocations, sptConfigsAirdrop);
                                } catch (err) {
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
                                        const logsFilePath = `${container.resolve<PreAkiModLoader>("PreAkiModLoader").getModPath(logsDirName)}logs/logs_${location}.json`;
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

                                        // SPAWN WAVE GENERATOR
                                        if (settingsLocations[location].spawnGenerator.enabled) {
                                            if (generatorSpawnSystemArray.length !== 0) {
                                                const presetJsonName = generatorSpawnSystemArray[randomGeneratorPreset];
                                                const importPresetJson = require(`../db/locations/${location}/spawnGenerator/presets/${presetJsonName}.json`);
                                                let chanceToDisable = 0;
                                                
                                                if (!importPresetJson.enableMainPresets && settingsLocations[location].main.enabled) {
                                                    chanceToDisable = bspClassHelpers.generateRandomInteger(1,2);
                                                }

                                                if (chanceToDisable === 1) {
                                                    countRandomChanceToDisableMainPreset++;
                                                } else {
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
                                            } else {
                                                this.logger.log(`Mod: ${pkg.name}: failed to load a spawn generator preset for ${location}`, LoggerTypes.ERROR);
                                                this.logger.log(`Mod: ${pkg.name}: no key-value pair provided for ${location} in location settings`, LoggerTypes.ERROR);
                                            }
                                        }

                                        // MAIN SPAWN WAVES
                                        if (settingsLocations[location].main.enabled) {
                                            tryCatchWrapper(() => bspClassLocations.mainSpawnSystem(bspClassHelpers, initJson, location, settingsLocations, countRandomChanceToDisableMainPreset, logsData), "generating bots in main preset");
                                        }
                                        
                                        // GLOBAL OVERRIDES
                                        if (settingsManager.globalOverrides.enabled) {
                                            tryCatchWrapper(() => bspClassLocations.forceStopSpawnWaves(settingsManager, initJson, location), "force stop spawn waves global override");
                                            tryCatchWrapper(() => bspClassLocations.spawnWaveChanceMultiplier(settingsManager, initJson), "spawn wave chance multiplier global override");
                                            tryCatchWrapper(() => bspClassLocations.forceBotChanceDifficultyOverrides(settingsManager, initJson), "force bot chance and force difficulty global overrides");
                                        }

                                        initJson = initJson.filter(obj => obj !== null);
                                        initJson.sort((a, b) => a["Time"] - b["Time"]);

                                        bspClassRaids.raidLogs(eftDatabaseLocations, sptConfigsBot, location, logsData);
                                        bspClassLocations.countSpawnWaves(initJson, logsData);
                                        
                                        logsData.spawnWaves = initJson;

                                        fs.writeFileSync(logsFilePath, JSON.stringify(logsData, null, 4));
                                    }

                                    this.logger.log(`Mod: ${pkg.name}: successfully loaded spawn waves for each location`, LoggerTypes.SUCCESS);
                                    this.logger.log(`Mod: ${pkg.name}: check "user/mods/PreyToLive-BetterSpawnsPlus/logs/" for raid details`, LoggerTypes.SUCCESS);
                                }
                            }
                        }
                        catch (err) {
                            this.logger.error(`Error in preAkiLoad: ${err.message}`);
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
    }

    public postDBLoad(container: DependencyContainer): void {
        const eftDatabaseBots = container.resolve<DatabaseServer>("DatabaseServer").getTables().bots;
        const eftDatabaseCustomization = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.customization;
        const eftDatabaseGlobals = container.resolve<DatabaseServer>("DatabaseServer").getTables().globals;
        const eftDatabaseHideout = container.resolve<DatabaseServer>("DatabaseServer").getTables().hideout;
        const eftDatabaseItems = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
        const eftDatabaseLocations = container.resolve<DatabaseServer>("DatabaseServer").getTables().locations;
        const eftDatabaseTraders = container.resolve<DatabaseServer>("DatabaseServer").getTables().traders;

        const sptConfigsInRaid = container.resolve<ConfigServer>("ConfigServer").getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);
        const sptConfigsInsurance = container.resolve<ConfigServer>("ConfigServer").getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE);
        const sptConfigsTrader = container.resolve<ConfigServer>("ConfigServer").getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const sptConfigsLocation = container.resolve<ConfigServer>("ConfigServer").getConfig<ILocationConfig>(ConfigTypes.LOCATION);
        const sptConfigsLostOnDeath = container.resolve<ConfigServer>("ConfigServer").getConfig<ILostOnDeathConfig>(ConfigTypes.LOST_ON_DEATH);
        const sptConfigsPmc = container.resolve<ConfigServer>("ConfigServer").getConfig<IPmcConfig>(ConfigTypes.PMC);
        const sptConfigsRepair = container.resolve<ConfigServer>("ConfigServer").getConfig<IRepairConfig>(ConfigTypes.REPAIR);
        const sptConfigsScavcase = container.resolve<ConfigServer>("ConfigServer").getConfig<IScavCaseConfig>(ConfigTypes.SCAVCASE);
        const sptConfigsWeather = container.resolve<ConfigServer>("ConfigServer").getConfig<IWeatherConfig>(ConfigTypes.WEATHER);

        const loadSettings = (filename) => require(path.resolve(__dirname, `../config/${settingsManager.settingsFolder}/${filename}.json`));
        const settingsBots = loadSettings("bots");
        const settingsHideout = loadSettings("hideout");
        const settingsItems = loadSettings("items");
        const settingsLoot = loadSettings("loot");
        const settingsPlayer = loadSettings("player");
        const settingsRaids = loadSettings("raids");
        const settingsTraders = loadSettings("traders");

        container.register<BSPClassBots>("BSPClassBots", BSPClassBots);
        container.register<BSPClassHelpers>("BSPClassHelpers", BSPClassHelpers);
        container.register<BSPClassHideout>("BSPClassHideout", BSPClassHideout);
        container.register<BSPClassItems>("BSPClassItems", BSPClassItems);
        container.register<BSPClassLoot>("BSPClassLoot", BSPClassLoot);
        container.register<BSPClassPlayer>("BSPClassPlayer", BSPClassPlayer);
        container.register<BSPClassRaids>("BSPClassRaids", BSPClassRaids);
        container.register<BSPClassTraders>("BSPClassTraders", BSPClassTraders);

        const bspClassHelpers: BSPClassHelpers = container.resolve<BSPClassHelpers>("BSPClassHelpers");
        const bspClassRaids: BSPClassRaids = container.resolve<BSPClassRaids>("BSPClassRaids");
        const bspClassBots: BSPClassBots = container.resolve<BSPClassBots>("BSPClassBots");
        const bspClassTraders: BSPClassTraders = container.resolve<BSPClassTraders>("BSPClassTraders");
        const bspClassHideout: BSPClassHideout = container.resolve<BSPClassHideout>("BSPClassHideout");
        const bspClassItems: BSPClassItems = container.resolve<BSPClassItems>("BSPClassItems");
        const bspClassLoot: BSPClassLoot = container.resolve<BSPClassLoot>("BSPClassLoot");
        const bspClassPlayer: BSPClassPlayer = container.resolve<BSPClassPlayer>("BSPClassPlayer");

        // OTHER OPTIONS
        if (settingsManager.modEnabled) {
            // BOTS SETTINGS
            if (settingsBots.enabled) try {
                bspClassBots.pmcDogTags(settingsBots, eftDatabaseBots);
                bspClassBots.pmcHostility(settingsBots, sptConfigsPmc);
                bspClassBots.pmcRelativeLevel(settingsBots, sptConfigsPmc);
                bspClassBots.pmcTalkRate(settingsBots, eftDatabaseBots);
            } catch (err) {
                this.logger.error(`Error in bots settings: ${err.message}`);
            }

            // HIDEOUT SETTINGS
            if (settingsHideout.enabled) try {
                bspClassHideout.hideoutModules(settingsHideout, eftDatabaseHideout);
                bspClassHideout.hideoutConstruction(settingsHideout, bspClassHelpers, eftDatabaseHideout);
                bspClassHideout.hideoutProduction(settingsHideout, bspClassHelpers, eftDatabaseHideout);
                bspClassHideout.hideoutScavCase(settingsHideout, bspClassHelpers, eftDatabaseHideout, sptConfigsScavcase);
            } catch (err) {
                this.logger.error(`Error in hideout settings: ${err.message}`);
            }

            // ITEMS SETTINGS
            if (settingsItems.enabled) try {
                bspClassItems.itemDurability(settingsItems, bspClassHelpers, container, eftDatabaseGlobals, eftDatabaseItems);
                bspClassItems.itemInsurance(settingsItems, bspClassHelpers, container, eftDatabaseItems, eftDatabaseLocations);
                bspClassItems.itemLabsKeycard(settingsItems, eftDatabaseItems, eftDatabaseLocations);
                bspClassItems.itemLoot(settingsItems, bspClassHelpers, container, eftDatabaseItems);
            } catch (err) {
                this.logger.error(`Error in items settings: ${err.message}`);
            }

            // LOOT SETTINGS
            if (settingsLoot.enabled) try {
                bspClassLoot.lootMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation);
                bspClassLoot.containerMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation);
            } catch (err) {
                this.logger.error(`Error in loot settings: ${err.message}`);
            }

            // PLAYER SETTINGS
            if (settingsPlayer.enabled) try {
                bspClassPlayer.playerHealth(settingsPlayer, eftDatabaseGlobals);
                bspClassPlayer.playerScav(settingsPlayer, eftDatabaseGlobals);
            } catch (err) {
                this.logger.error(`Error in player settings: ${err.message}`);
            }

            // RAIDS SETTINGS
            if (settingsRaids.enabled) try {
                bspClassRaids.raidExtractions(settingsRaids, eftDatabaseLocations);
                bspClassRaids.raidEnd(settingsRaids, sptConfigsInRaid, sptConfigsLostOnDeath);
                bspClassRaids.raidWeather(settingsRaids, sptConfigsWeather);
            } catch (err) {
                this.logger.error(`Error in raids settings: ${err.message}`);
            }

            // TRADERS SETTINGS
            if (settingsTraders.enabled) try {
                bspClassTraders.traderInsurance(settingsTraders, eftDatabaseTraders, sptConfigsInsurance);
                bspClassTraders.traderStock(settingsTraders, sptConfigsTrader);
                bspClassTraders.traderServices(settingsTraders, bspClassHelpers, eftDatabaseCustomization, eftDatabaseTraders);
                bspClassTraders.traderRepairs(settingsTraders, eftDatabaseTraders, sptConfigsRepair);
            } catch (err) {
                this.logger.error(`Error in traders settings: ${err.message}`);
            }
        }

        if (settingsManager.modEnabled) {
            this.logger.log(`Mod: ${pkg.name}: enabled`, LoggerTypes.SUCCESS);
            this.logger.log(`Mod: ${pkg.name}: loaded settings from "${settingsManager.settingsFolder}" folder`, LoggerTypes.SUCCESS);
        } else {
            this.logger.log(`Mod: ${pkg.name}: disabled`, LoggerTypes.DISABLE);
        }
    }
}

module.exports = { mod: new BSPMain() };