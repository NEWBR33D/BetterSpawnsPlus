/* 
 * BetterSpawnsPlus v1.1.4
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/

import { DependencyContainer } from "tsyringe";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { IInRaidConfig } from "@spt-aki/models/spt/config/IInRaidConfig";
import { IInsuranceConfig } from "@spt-aki/models/spt/config/IInsuranceConfig";
import { ILocationConfig } from "@spt-aki/models/spt/config/ILocationConfig";
import { IRepairConfig } from "@spt-aki/models/spt/config/IRepairConfig";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { Traders as eftTraders } from "@spt-aki/models/enums/Traders";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import * as path from "path";
import * as fs from "fs";
import pkg from "../package.json";
import presetManager from "../config/presetManager.json";
import pmcDogTags from "../db/bots/pmcs/pmcDogTags.json";

class BetterSpawnsPlus implements IPostDBLoadMod, IPostAkiLoadMod {
    private configFileToUseInGame = presetManager.configFileToUseInGame;
    private globalOverrides = presetManager.globalOverrides;
    private config = require(`../config/presets/${this.configFileToUseInGame}.json`);
    private logger: ILogger;
    private databaseServer: DatabaseServer;
    private logSuccess = "green";
    private logInfo = "cyan";
    private logDisable = "gray";
    private logWarning = "yellow";
    private logError = "red";
    private openZones = {
        "bigmap": "ZoneBlockPost,ZoneBlockPostSniper,ZoneBlockPostSniper3,ZoneBrige,ZoneCrossRoad,ZoneCustoms,ZoneDormitory,ZoneFactoryCenter,ZoneFactorySide,ZoneGasStation,ZoneOldAZS,ZoneScavBase,ZoneSnipeBrige,ZoneSnipeFactory,ZoneSnipeTower,ZoneTankSquare,ZoneWade",
        "interchange": "ZoneCenter,ZoneCenterBot,ZoneGoshan,ZoneIDEA,ZoneIDEAPark,ZoneOLI,ZoneOLIPark,ZonePowerStation,ZoneRoad,ZoneTrucks",
        "laboratory": "BotZoneBasement,BotZoneFloor1,BotZoneFloor2,BotZoneGate1,BotZoneGate2",
        "lighthouse": "Zone_Blockpost,Zone_Bridge,Zone_Chalet,Zone_Containers,Zone_DestroyedHouse,Zone_Hellicopter,Zone_Island,Zone_LongRoad,Zone_OldHouse,Zone_Rocks,Zone_RoofBeach,Zone_RoofContainers,Zone_RoofRocks,Zone_SniperPeak,Zone_TreatmentBeach,Zone_TreatmentContainers,Zone_TreatmentRocks,Zone_Village",
        "rezervbase": "ZoneBarrack,ZoneBunkerStorage,ZonePTOR1,ZonePTOR2,ZoneRailStrorage,ZoneSubCommand,ZoneSubStorage",
        "shoreline": "ZoneBunker,ZoneBunkeSniper,ZoneBusStation,ZoneForestGasStation,ZoneForestSpawn,ZoneForestTruck,ZoneGasStation,ZoneGreenHouses,ZoneIsland,ZoneMeteoStation,ZonePassClose,ZonePassFar,ZonePort,ZonePowerStation,ZonePowerStationSniper,ZoneRailWays,ZoneSanatorium1,ZoneSanatorium2,ZoneTunnel,ZoneStartVillage",
        "tarkovstreets": "ZoneCarShowroom,ZoneCinema,ZoneColumn,ZoneConcordia_1,ZoneConcordia_2,ZoneConcordiaParking,ZoneConstruction,ZoneFactory,ZoneHotel_1,ZoneHotel_2,ZoneSnipeBuilding,ZoneSnipeCarShowroom,ZoneSnipeCinema,ZoneSnipeSW01,ZoneSW01",
        "woods": "ZoneBigRocks,ZoneBrokenVill,ZoneClearVill,ZoneHighRocks,ZoneHouse,ZoneMiniHouse,ZoneRedHouse,ZoneRoad,ZoneScavBase2,ZoneWoodCutter"
    }
    private altLocationArray = ["bigmap","factory4_day","factory4_night","interchange","laboratory","lighthouse","rezervbase","shoreline","tarkovstreets","woods"];
    private locationArray = ["customs","factory","interchange","labs","lighthouse","reserve","shoreline","streets","woods"];
    private brainTypeArray = ["bossKilla","bossKnight","bossGluhar","bossSanitar","bossTagilla","followerGluharAssault","followerBully","followerBigPipe","followerSanitar","assault","cursedAssault","exUsec","arenafighter","arenafighterevent","crazyassaultevent","pmcBot"];
    private bossTypeArray = ["bossBully","bossKilla","bossKojaniy","bossGluhar","bossSanitar","bossTagilla","bossKnight","bossZryachiy"];
    private enemyTypeArray = ["assault","cursedassault","pmcbot","exusec","arenafighter","arenafighterevent","crazyassaultevent"];
    private botDifficultyArray = ["easy","normal","hard","impossible"];
    private pmcTypeArray = ["bear","usec"];

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        function generateRandomInteger(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function generateRandomNumberFromSequence(array: number[]) {
            let random = array[Math.floor(Math.random() * array.length)];

            if (random > 0) {
                random = random - 1;
            } else {
                random = 0;
            }
            
            return random.toString();
        }

        function generateWeightArray(object: object) {
            const array: string[] = [];

            for (let [key, value] of Object.entries(object)) {
                if (value > 5) {
                    value = 5;
                }

                if (value == 1) {
                    array.push(key);
                } else if (value == 2) {
                    array.push(key);
                    array.push(key);
                } else if (value == 3) {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                } else if (value == 4) {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                } else if (value == 5) {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                }
            }

            return array;
        }

        function removeElementFromWeightArray(array: string[]) {
            const element = (Math.random() * array.length) | 0;
            return array.splice(element, 1)[0];
        }

        function checkProperties(object: any) {
            let count = 0;

            for (const key in object) {
                if (object[key] == 0) {
                    count++;
                }
            }

            if (count == Object.keys(object).length) {
                return false;
            }
            else {
                return true;
            }
        }

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

                            this.config = require(`../config/presets/${this.configFileToUseInGame}.json`);
                            const otherOptions = this.config.otherOptions;

                            const databaseLocations = this.databaseServer.getTables().locations;
                            const configsAirdrops = container.resolve<ConfigServer>("ConfigServer").getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
                            const configsBots = container.resolve<ConfigServer>("ConfigServer").getConfig<IBotConfig>(ConfigTypes.BOT);
                            const configsInraids = container.resolve<ConfigServer>("ConfigServer").getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);
                            const configsLocations = container.resolve<ConfigServer>("ConfigServer").getConfig<ILocationConfig>(ConfigTypes.LOCATION);

                            // other options
                            if (otherOptions.enabled) {
                                if (otherOptions.consoleLogs) {
                                    this.logger.log(`Mod: ${pkg.name}: continuing...`, this.logSuccess);
                                    this.logger.log("> [other options]: logs", this.logInfo)
                                }

                                // bots
                                if (otherOptions.bots.enabled) {
                                    if (otherOptions.consoleLogs) {
                                        this.logger.log(" > [bots]", this.logInfo);
                                    }

                                    // pmc brain type
                                    if (otherOptions.bots.pmc.brainType.enabled) {
                                        // randomize brain type
                                        if (otherOptions.bots.pmc.brainType.randomize) {
                                            for (const brainType of this.brainTypeArray) {
                                                otherOptions.bots.pmc.brainType.bear[brainType] = generateRandomInteger(1, 5);
                                                otherOptions.bots.pmc.brainType.usec[brainType] = generateRandomInteger(1, 5);
                                            }
                                        }

                                        for (const altLocation of this.altLocationArray) {
                                            configsBots.pmc.pmcType.sptbear[altLocation] = otherOptions.bots.pmc.brainType.bear;
                                            configsBots.pmc.pmcType.sptusec[altLocation] = otherOptions.bots.pmc.brainType.usec;
                                        }

                                        if (otherOptions.consoleLogs) {
                                            this.logger.log("  > pmc:", this.logInfo);
                                            this.logger.log(`   > bear brain type: ${JSON.stringify(otherOptions.bots.pmc.brainType.bear, null, 6)}`, this.logInfo);
                                            this.logger.log(`   > usec brain type: ${JSON.stringify(otherOptions.bots.pmc.brainType.usec, null, 6)}`, this.logInfo);
                                        }
                                    }
                                }

                                // max bots cap
                                if (otherOptions.maxBotCap.enabled) {
                                    if (otherOptions.consoleLogs) {
                                        this.logger.log(" > [max bot cap]", this.logInfo);
                                    }

                                    for (const location of this.locationArray) {
                                        const randomBotCap = generateRandomInteger(otherOptions.maxBotCap[location].min, otherOptions.maxBotCap[location].max);

                                        switch (location) {
                                            case "customs":
                                                configsBots.maxBotCap.bigmap = randomBotCap;
                                                break;
                                            case "factory":
                                                configsBots.maxBotCap.factory4_day = randomBotCap;
                                                configsBots.maxBotCap.factory4_night = randomBotCap;
                                                break;
                                            case "interchange":
                                            case "lighthouse":
                                            case "shoreline":
                                            case "woods":
                                                configsBots.maxBotCap[location] = randomBotCap;
                                                break;
                                            case "labs":
                                                configsBots.maxBotCap.laboratory = randomBotCap;
                                                break;
                                            case "reserve":
                                                configsBots.maxBotCap.rezervbase = randomBotCap;
                                                break;
                                            case "streets":
                                                configsBots.maxBotCap.tarkovstreets = randomBotCap;
                                                break;
                                        }

                                        if (otherOptions.consoleLogs) {
                                            this.logger.log(`  > ${location}: ${randomBotCap}`, this.logInfo);
                                        }
                                    }
                                }

                                // raid timer
                                if (otherOptions.raidTimer.enabled) {
                                    if (otherOptions.consoleLogs) {
                                        this.logger.log(" > [raid timer]", this.logInfo);
                                    }

                                    for (const location of this.locationArray) {
                                        const randomRaidTimer = generateRandomInteger(otherOptions.raidTimer[location].min, otherOptions.raidTimer[location].max);

                                        if (location == "customs") {
                                            databaseLocations.bigmap.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.bigmap.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.maxBotCap.enabled) {
                                                databaseLocations.bigmap.base.AirdropParameters["PlaneAirdropEnd"] = randomRaidTimer * 60 * 0.75;
                                            }

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "factory") {
                                            databaseLocations.factory4_day.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.factory4_night.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.factory4_day.base.EscapeTimeLimit = randomRaidTimer;
                                            databaseLocations.factory4_night.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "interchange") {
                                            databaseLocations.interchange.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.interchange.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "labs") {
                                            databaseLocations.laboratory.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.laboratory.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "lighthouse") {
                                            databaseLocations.lighthouse.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.lighthouse.base.EscapeTimeLimit = randomRaidTimer;

                                            for (const exfil in databaseLocations.lighthouse.base.exits) {
                                                if (databaseLocations.lighthouse.base.exits[exfil].Name == "EXFIL_Train") {
                                                    databaseLocations.lighthouse.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                                    databaseLocations.lighthouse.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                                                }
                                            }

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "reserve") {
                                            databaseLocations.rezervbase.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.rezervbase.base.EscapeTimeLimit = randomRaidTimer;

                                            for (const exfil in databaseLocations.rezervbase.base.exits) {
                                                if (databaseLocations.rezervbase.base.exits[exfil].Name == "EXFIL_Train") {
                                                    databaseLocations.rezervbase.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                                    databaseLocations.rezervbase.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                                                }
                                            }

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "shoreline") {
                                            databaseLocations.shoreline.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.shoreline.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "streets") {
                                            databaseLocations.tarkovstreets.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.tarkovstreets.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "woods") {
                                            databaseLocations.woods.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.woods.base.EscapeTimeLimit = randomRaidTimer;

                                            if (otherOptions.consoleLogs) {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }
                                    }
                                }

                                // airdrops
                                if (otherOptions.airdrops.enabled) {
                                    // plane start time
                                    if (otherOptions.airdrops.startTime.min < 0 || otherOptions.airdrops.startTime.min > otherOptions.airdrops.startTime.max) {
                                        otherOptions.airdrops.startTime.min = 0;
                                    }

                                    const randomPlaneStartTime = generateRandomInteger(otherOptions.airdrops.startTime.min, otherOptions.airdrops.startTime.max);
                                    configsAirdrops.airdropMinStartTimeSeconds = randomPlaneStartTime * 60;
                                    configsAirdrops.airdropMaxStartTimeSeconds = randomPlaneStartTime * 60;

                                    // plane speed
                                    if (otherOptions.airdrops.plane.speed.min < 50) {
                                        otherOptions.airdrops.plane.speed.min = 50;
                                    }

                                    if (otherOptions.airdrops.plane.speed.max > 120) {
                                        otherOptions.airdrops.plane.speed.max = 120;
                                    }

                                    if (otherOptions.airdrops.plane.speed.min > otherOptions.airdrops.plane.speed.max) {
                                        otherOptions.airdrops.plane.speed.min = 50;
                                        otherOptions.airdrops.plane.speed.max = 120;
                                    }

                                    const randomPlaneSpeed = generateRandomInteger(otherOptions.airdrops.plane.speed.min, otherOptions.airdrops.plane.speed.max);
                                    configsAirdrops.planeSpeed = randomPlaneSpeed;

                                    // plane height
                                    if (otherOptions.airdrops.plane.height.min < 200) {
                                        otherOptions.airdrops.plane.height.min = 200;
                                    }
                                    
                                    if (otherOptions.airdrops.plane.height.max > 600) {
                                        otherOptions.airdrops.plane.height.max = 600;
                                    }

                                    if (otherOptions.airdrops.plane.height.min > otherOptions.airdrops.plane.height.max) {
                                        otherOptions.airdrops.plane.height.min = 200;
                                        otherOptions.airdrops.plane.height.max = 600;
                                    }

                                    const randomPlaneHeight = generateRandomInteger(otherOptions.airdrops.plane.height.min, otherOptions.airdrops.plane.height.max);
                                    configsAirdrops.planeMinFlyHeight = randomPlaneHeight;
                                    configsAirdrops.planeMaxFlyHeight = randomPlaneHeight;

                                    // plane volume
                                    if (otherOptions.airdrops.plane.volume.min < 0 || otherOptions.airdrops.plane.volume.min > otherOptions.airdrops.plane.volume.max) {
                                        otherOptions.airdrops.plane.volume.min = 0;
                                    }

                                    if (otherOptions.airdrops.plane.volume.max > 100) {
                                        otherOptions.airdrops.plane.volume.max = 100;
                                    }

                                    const randomPlaneVolume = generateRandomInteger(otherOptions.airdrops.plane.volume.min, otherOptions.airdrops.plane.volume.max);
                                    configsAirdrops.planeVolume = randomPlaneVolume * 0.01;

                                    // crate speed
                                    if (otherOptions.airdrops.plane.crate.speed.min < 1) {
                                        otherOptions.airdrops.plane.crate.speed.min = 1;
                                    }
                                    
                                    if (otherOptions.airdrops.plane.crate.speed.max > 10) {
                                        otherOptions.airdrops.plane.crate.speed.max = 10;
                                    }

                                    if (otherOptions.airdrops.plane.crate.speed.min > otherOptions.airdrops.plane.crate.speed.max) {
                                        otherOptions.airdrops.plane.crate.speed.min = 1;
                                        otherOptions.airdrops.plane.crate.speed.max = 10;
                                    }

                                    const randomCrateSpeed = generateRandomInteger(otherOptions.airdrops.plane.crate.speed.min, otherOptions.airdrops.plane.crate.speed.max);
                                    configsAirdrops.crateFallSpeed = randomCrateSpeed;

                                    // crate item count
                                    if (otherOptions.airdrops.plane.crate.items.min < 0) {
                                        otherOptions.airdrops.plane.crate.items.min = 0;
                                    }
                                    
                                    if (otherOptions.airdrops.plane.crate.items.max > 35) {
                                        otherOptions.airdrops.plane.crate.items.max = 35;
                                    }

                                    if (otherOptions.airdrops.plane.crate.items.min > otherOptions.airdrops.plane.crate.items.max) {
                                        otherOptions.airdrops.plane.crate.items.min = 0;
                                        otherOptions.airdrops.plane.crate.items.max = 35;
                                    }

                                    const randomCrateItemCount = generateRandomInteger(otherOptions.airdrops.plane.crate.items.min, otherOptions.airdrops.plane.crate.items.max);
                                    configsAirdrops.loot.mixed.itemCount.min = randomCrateItemCount;
                                    configsAirdrops.loot.mixed.itemCount.max = randomCrateItemCount;

                                    // dynamic planes
                                    if (otherOptions.airdrops.plane.dynamic) {
                                        const planeHeightMaxMin25 = (otherOptions.airdrops.plane.height.min + ((otherOptions.airdrops.plane.height.max - otherOptions.airdrops.plane.height.min) * 0.25));
                                        const planeHeightMaxMin50 = (otherOptions.airdrops.plane.height.min + ((otherOptions.airdrops.plane.height.max - otherOptions.airdrops.plane.height.min) * 0.5));
                                        const planeHeightMaxMin75 = (otherOptions.airdrops.plane.height.min + ((otherOptions.airdrops.plane.height.max - otherOptions.airdrops.plane.height.min) * 0.75));
                                        const planeVolumeMaxMin25 = (otherOptions.airdrops.plane.volume.min + ((otherOptions.airdrops.plane.volume.max - otherOptions.airdrops.plane.volume.min) * 0.25));
                                        const planeVolumeMaxMin50 = (otherOptions.airdrops.plane.volume.min + ((otherOptions.airdrops.plane.volume.max - otherOptions.airdrops.plane.volume.min) * 0.5));
                                        const planeVolumeMaxMin75 = (otherOptions.airdrops.plane.volume.min + ((otherOptions.airdrops.plane.volume.max - otherOptions.airdrops.plane.volume.min) * 0.75));
                                        const planeSpeedMaxMin25 = (otherOptions.airdrops.plane.speed.min + ((otherOptions.airdrops.plane.speed.max - otherOptions.airdrops.plane.speed.min) * 0.25));
                                        const planeSpeedMaxMin50 = (otherOptions.airdrops.plane.speed.min + ((otherOptions.airdrops.plane.speed.max - otherOptions.airdrops.plane.speed.min) * 0.5));
                                        const planeSpeedMaxMin75 = (otherOptions.airdrops.plane.speed.min + ((otherOptions.airdrops.plane.speed.max - otherOptions.airdrops.plane.speed.min) * 0.75));
                                        const planeCrateSpeedMaxMin25 = (otherOptions.airdrops.plane.crate.speed.min + ((otherOptions.airdrops.plane.crate.speed.max - otherOptions.airdrops.plane.crate.speed.min) * 0.25));
                                        const planeCrateSpeedMaxMin50 = (otherOptions.airdrops.plane.crate.speed.min + ((otherOptions.airdrops.plane.crate.speed.max - otherOptions.airdrops.plane.crate.speed.min) * 0.5));
                                        const planeCrateSpeedMaxMin75 = (otherOptions.airdrops.plane.crate.speed.min + ((otherOptions.airdrops.plane.crate.speed.max - otherOptions.airdrops.plane.crate.speed.min) * 0.75));
                                        const planeCrateItemCountMaxMin25 = (otherOptions.airdrops.plane.crate.items.min + ((otherOptions.airdrops.plane.crate.items.max - otherOptions.airdrops.plane.crate.items.min) * 0.25));
                                        const planeCrateItemCountMaxMin50 = (otherOptions.airdrops.plane.crate.items.min + ((otherOptions.airdrops.plane.crate.items.max - otherOptions.airdrops.plane.crate.items.min) * 0.5));
                                        const planeCrateItemCountMaxMin75 = (otherOptions.airdrops.plane.crate.items.min + ((otherOptions.airdrops.plane.crate.items.max - otherOptions.airdrops.plane.crate.items.min) * 0.75));

                                        if (randomPlaneHeight >= otherOptions.airdrops.plane.height.min && randomPlaneHeight <= planeHeightMaxMin25) {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin75, otherOptions.airdrops.plane.volume.max)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin75, otherOptions.airdrops.plane.speed.max));
                                        }
                                        
                                        if (randomPlaneHeight > planeHeightMaxMin25 && randomPlaneHeight <= planeHeightMaxMin50) {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin50, planeVolumeMaxMin75)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin50, planeSpeedMaxMin75));
                                        }
                                        
                                        if (randomPlaneHeight > planeHeightMaxMin50 && randomPlaneHeight <= planeHeightMaxMin75) {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin25, planeVolumeMaxMin50)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin25, planeSpeedMaxMin50));
                                        }

                                        if (randomPlaneHeight > planeHeightMaxMin75 && randomPlaneHeight <= otherOptions.airdrops.plane.height.max) {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(otherOptions.airdrops.plane.volume.min, planeVolumeMaxMin25)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(otherOptions.airdrops.plane.volume.min, planeSpeedMaxMin25));
                                        }

                                        if (randomCrateItemCount >= otherOptions.airdrops.plane.crate.items.min && randomCrateItemCount <= planeCrateItemCountMaxMin25) {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(otherOptions.airdrops.plane.crate.speed.min, planeCrateSpeedMaxMin25));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin25 && randomCrateItemCount <= planeCrateItemCountMaxMin50) {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin25, planeCrateSpeedMaxMin50));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin50 && randomCrateItemCount <= planeCrateItemCountMaxMin75) {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin50, planeCrateSpeedMaxMin75));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin75 && randomCrateItemCount <= otherOptions.airdrops.plane.crate.items.max) {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin75, otherOptions.airdrops.plane.crate.speed.max));
                                        }
                                    }

                                    // airdrop chance
                                    for (const locations in this.locationArray) {
                                        const location = this.locationArray[locations];

                                        if (location == "customs") {
                                            configsAirdrops.airdropChancePercent.bigmap = otherOptions.airdrops.chance[location];
                                        }
                                        
                                        if (location == "streets") {
                                            configsAirdrops.airdropChancePercent.tarkovStreets = otherOptions.airdrops.chance[location];
                                        }

                                        if (location == "interchange" || location == "lighthouse" || location == "reserve" || location == "shoreline" || location == "woods") {
                                            configsAirdrops.airdropChancePercent[location] = otherOptions.airdrops.chance[location];
                                        }
                                    }

                                    // extend plane airdrop end time based on the raid timer
                                    if (otherOptions.raidTimer.enabled) {
                                        for (const altLocations in this.altLocationArray) {
                                            const altLocation = this.altLocationArray[altLocations];

                                            if (altLocation != "factory4_day" && altLocation != "factory4_night" && altLocation != "laboratory") {
                                                databaseLocations[altLocation].base.AirdropParameters["PlaneAirdropEnd"] = databaseLocations[altLocation].base.EscapeTimeLimit * 60 * 0.75;
                                            }
                                        }
                                    }

                                    if (otherOptions.consoleLogs) {
                                        this.logger.log(" > [airdrops]", this.logInfo);
                                        this.logger.log(`  > start time: ${configsAirdrops.airdropMinStartTimeSeconds / 60} minutes`, this.logInfo);

                                        if (otherOptions.airdrops.plane.dynamic) {
                                            this.logger.log("  > dynamic airdrops enabled", this.logInfo);
                                        } else {
                                            this.logger.log("  > dynamic airdrops disabled", this.logDisable);
                                        }

                                        this.logger.log("  > plane:", this.logInfo);
                                        this.logger.log(`   > speed: ${configsAirdrops.planeSpeed} m/s`, this.logInfo);
                                        this.logger.log(`   > height: ${configsAirdrops.planeMaxFlyHeight} m`, this.logInfo);
                                        this.logger.log(`   > volume: ${Math.round(configsAirdrops.planeVolume * 100)}%`, this.logInfo);
                                        this.logger.log(`   > crate speed: ${configsAirdrops.crateFallSpeed} m/s`, this.logInfo);
                                        this.logger.log(`   > crate items: ${configsAirdrops.loot.mixed.itemCount.max}`, this.logInfo);
                                        this.logger.log("  > chance:", this.logInfo);
                                        this.logger.log(`   > customs: ${configsAirdrops.airdropChancePercent.bigmap}%`, this.logInfo);
                                        this.logger.log(`   > interchange: ${configsAirdrops.airdropChancePercent.interchange}%`, this.logInfo);
                                        this.logger.log(`   > lighthouse: ${configsAirdrops.airdropChancePercent.lighthouse}%`, this.logInfo);
                                        this.logger.log(`   > reserve: ${configsAirdrops.airdropChancePercent.reserve}%`, this.logInfo);
                                        this.logger.log(`   > shoreline: ${configsAirdrops.airdropChancePercent.shoreline}%`, this.logInfo);
                                        this.logger.log(`   > streets: ${configsAirdrops.airdropChancePercent.tarkovStreets}%`, this.logInfo);
                                        this.logger.log(`   > woods: ${configsAirdrops.airdropChancePercent.woods}%`, this.logInfo);
                                    }
                                }
                            }
                            
                            // better spawns plus
                            if (this.config.betterSpawnsPlus.enabled) {
                                for (const locations in this.locationArray) {
                                    const location = this.locationArray[locations];
                                    if (this.config.betterSpawnsPlus.locations[location].consoleLogs) {
                                        this.logger.log("> [better spawns plus]: logs", this.logInfo);
                                        break;
                                    }
                                }

                                const importInitFile = require("../db/locations/init.json");

                                configsInraids.raidMenuSettings.bossEnabled = true;
                                configsLocations.splitWaveIntoSingleSpawnsSettings.enabled = false;
                                configsLocations.rogueLighthouseSpawnTimeSettings.enabled = false;
                                configsLocations.fixEmptyBotWavesSettings.enabled = false;
                                configsLocations.addOpenZonesToAllMaps = false;
                                configsLocations.addCustomBotWavesToMaps = false;
                                configsLocations.enableBotTypeLimits = false;

                                for (const zone in this.openZones) {
                                    databaseLocations[zone].base.OpenZones = this.openZones[zone];
                                }

                                this.enemyTypeArray.forEach(function(type) {
                                    configsBots.pmc.convertIntoPmcChance[type].min = 0;
                                    configsBots.pmc.convertIntoPmcChance[type].max = 0;
                                });

                                for (const locations in this.locationArray) {
                                    const location = this.locationArray[locations];
                                    const initSpawns = importInitFile[location];
                                    const mainSpawnSystemArray = generateWeightArray(this.config.betterSpawnsPlus.locations[location].main.presets);
                                    const generatorSpawnSystemArray = generateWeightArray(this.config.betterSpawnsPlus.locations[location].spawnGenerator.presets);
                                    const randomMainPreset = Math.floor(Math.random() * mainSpawnSystemArray.length);
                                    const randomGeneratorPreset = Math.floor(Math.random() * generatorSpawnSystemArray.length);
                                    let countBears = 0, countUsecs = 0, countScavs = 0, countSniperScavs = 0;
                                    let countBosses = 0, countCultists = 0, countRaiders = 0, countRogues = 0;
                                    let countBloodhounds = 0, countWeirdScavs = 0;
                                    let countAddBear = 0, countAddUsec = 0, countAddScav = 0, countAddSniperScav = 0;
                                    let countAddBoss = 0, countAddCultist = 0, countAddRaider = 0, countAddRogue = 0;
                                    let countAddBloodhound = 0, countAddWeirdScav = 0;
                                    let countRandomChanceToDisableMainPreset = 0;

                                    if (location == "customs") {
                                        databaseLocations.bigmap.base.waves = [];
                                        databaseLocations.bigmap.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "factory") {
                                        databaseLocations.factory4_day.base.waves = [];
                                        databaseLocations.factory4_night.base.waves = [];
                                        databaseLocations.factory4_day.base.BossLocationSpawn = initSpawns;
                                        databaseLocations.factory4_night.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "interchange" || location == "lighthouse" || location == "shoreline" || location == "woods") {
                                        databaseLocations[location].base.waves = [];
                                        databaseLocations[location].base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "labs") {
                                        databaseLocations.laboratory.base.waves = [];
                                        databaseLocations.laboratory.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "reserve") {
                                        databaseLocations.rezervbase.base.waves = [];
                                        databaseLocations.rezervbase.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "streets") {
                                        databaseLocations.tarkovstreets.base.waves = [];
                                        databaseLocations.tarkovstreets.base.BossLocationSpawn = initSpawns;
                                    }

                                    // generator spawn system
                                    if (this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled) {
                                        if (generatorSpawnSystemArray.length != 0) {
                                            const importPresetFile = require(`../db/locations/${location}/spawnGenerator/presets/${generatorSpawnSystemArray[randomGeneratorPreset]}.${"json"}`);
                                            const addPmcs = importPresetFile[location].pmcs;
                                            const addScavs = importPresetFile[location].scavs;
                                            const addSniperScavs = importPresetFile[location].sniperScavs;
                                            const addBosses = importPresetFile[location].bosses;
                                            const addCultists = importPresetFile[location].cultists;
                                            const addRaiders = importPresetFile[location].raiders;
                                            const addRogues = importPresetFile[location].rogues;
                                            const addBloodhounds = importPresetFile[location].bloodhounds;
                                            const addWeirdScavs = importPresetFile[location].weirdScavs;
                                            let chanceToDisable = 0;
                                            
                                            if (!importPresetFile.enableMainPresets && this.config.betterSpawnsPlus.locations[location].main.enabled) {
                                                chanceToDisable = generateRandomInteger(1,2);
                                            }

                                            if (chanceToDisable == 1) {
                                                countRandomChanceToDisableMainPreset++;
                                            } else {
                                                if (chanceToDisable == 2) {
                                                    countRandomChanceToDisableMainPreset++;
                                                    countRandomChanceToDisableMainPreset++;
                                                }

                                                // pmcs
                                                if (addPmcs.enabled && checkProperties(addPmcs.botType) && checkProperties(addPmcs.botDifficulty) && checkProperties(addPmcs.botChance) && (addPmcs.spawnWaves.initial.waves !== 0 || addPmcs.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addPmcs.openZones)) {
                                                        for (const zone in addPmcs.openZones) {
                                                            addPmcs.openZones[zone] = 1;
                                                        }
                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for pmcs on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for pmcs on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addPmcs.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addPmcs.openZones);
                                                    let typeArray = generateWeightArray(addPmcs.botType);
                                                    let difficultyArray = generateWeightArray(addPmcs.botDifficulty);

                                                    for (let i = 0; i < addPmcs.spawnWaves.initial.waves + addPmcs.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addPmcs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addPmcs.spawnWaves.spawnDelay.min, addPmcs.spawnWaves.spawnDelay.max);

                                                        if (addPmcs.botChance.min < 0 || addPmcs.botChance.min > 100) {
                                                            addPmcs.botChance.min = 0;
                                                        } else if (addPmcs.botChance.max < 0 || addPmcs.botChance.max > 100) {
                                                            addPmcs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addPmcs.botChance.min, addPmcs.botChance.max);
                                                        
                                                        if (i < Math.abs(addPmcs.spawnWaves.initial.waves - addPmcs.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addPmcs.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addPmcs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addPmcs.botDifficulty);
                                                        }

                                                        if (typeArray.length == 0) {
                                                            typeArray = generateWeightArray(addPmcs.botType);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        let randomType = removeElementFromWeightArray(typeArray);

                                                        if (randomType == "bear") {
                                                            randomType = "sptBear";
                                                            countAddBear++;
                                                        } else {
                                                            randomType = "sptUsec";
                                                            countAddUsec++;
                                                        }
                                                        
                                                        if (location == "labs") {
                                                            initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, -1, null, "", "", randomTime + timeInterval));
                                                        } else {
                                                            initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                        }

                                                        if (countInterval == addPmcs.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // scavs
                                                if (addScavs.enabled && checkProperties(addScavs.botDifficulty) && checkProperties(addScavs.botChance) && (addScavs.spawnWaves.initial.waves !== 0 || addScavs.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addScavs.openZones)) {
                                                        for (const zone in addScavs.openZones) {
                                                            addScavs.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for scavs on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for scavs on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addScavs.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addScavs.openZones);
                                                    let difficultyArray = generateWeightArray(addScavs.botDifficulty);

                                                    for (let i = 0; i < addScavs.spawnWaves.initial.waves + addScavs.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addScavs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addScavs.spawnWaves.spawnDelay.min, addScavs.spawnWaves.spawnDelay.max);

                                                        if (addScavs.botChance.min < 0 || addScavs.botChance.min > 100) {
                                                            addScavs.botChance.min = 0;
                                                        } else if (addScavs.botChance.max < 0 || addScavs.botChance.max > 100) {
                                                            addScavs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addScavs.botChance.min, addScavs.botChance.max);
                                                        
                                                        if (i < Math.abs(addScavs.spawnWaves.initial.waves - addScavs.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addScavs.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addScavs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addScavs.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddScav++;
                                                        initSpawns.push(this.generateBot("assault", randomChance, randomZone, randomDifficulty, "assault", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addScavs.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // sniper scavs
                                                if (addSniperScavs.enabled && checkProperties(addSniperScavs.botDifficulty) && checkProperties(addSniperScavs.botChance) && (addSniperScavs.spawnWaves.initial.waves !== 0 || addSniperScavs.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addSniperScavs.openZones)) {
                                                        for (const zone in addSniperScavs.openZones) {
                                                            addSniperScavs.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for sniper scavs on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for sniper scavs on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addSniperScavs.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addSniperScavs.openZones);
                                                    let difficultyArray = generateWeightArray(addSniperScavs.botDifficulty);

                                                    for (let i = 0; i < addSniperScavs.spawnWaves.initial.waves + addSniperScavs.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addSniperScavs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addSniperScavs.spawnWaves.spawnDelay.min, addSniperScavs.spawnWaves.spawnDelay.max);

                                                        if (addSniperScavs.botChance.min < 0 || addSniperScavs.botChance.min > 100) {
                                                            addSniperScavs.botChance.min = 0;
                                                        } else if (addSniperScavs.botChance.max < 0 || addSniperScavs.botChance.max > 100) {
                                                            addSniperScavs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addSniperScavs.botChance.min, addSniperScavs.botChance.max);
                                                        
                                                        if (i < Math.abs(addSniperScavs.spawnWaves.initial.waves - addSniperScavs.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addSniperScavs.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addSniperScavs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addSniperScavs.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddSniperScav++;
                                                        initSpawns.push(this.generateBot("marksman", randomChance, randomZone, randomDifficulty, "marksman", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addSniperScavs.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // bosses
                                                if (addBosses.enabled && checkProperties(addBosses.botType) && checkProperties(addBosses.botDifficulty) && checkProperties(addBosses.botChance) && (addBosses.spawnWaves.initial.waves !== 0 || addBosses.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addBosses.openZones)) {
                                                        for (const zone in addBosses.openZones) {
                                                            addBosses.openZones[zone] = 1;
                                                        }

                                                        if (!addBosses.onlyVanillaOpenZones) {
                                                            this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for bosses on location [${location}]`, this.logError);
                                                            this.logger.log(`> reverted to all open zones being available for bosses on [${location}]`, this.logError);
                                                        }
                                                    }

                                                    let timeInterval = addBosses.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let supportAmount = "";
                                                    let supportType = "";
                                                    let supports: any[] | null = null;
                                                    let typeArray = generateWeightArray(addBosses.botType);
                                                    let difficultyArray = generateWeightArray(addBosses.botDifficulty);
                                                    let zoneArray = generateWeightArray(addBosses.openZones);

                                                    for (let i = 0; i < addBosses.spawnWaves.initial.waves + addBosses.spawnWaves.interval.waves; i++) {
                                                        let randomTime = generateRandomInteger(addBosses.spawnWaves.spawnDelay.min, addBosses.spawnWaves.spawnDelay.max);

                                                        if (addBosses.botChance.min < 0 || addBosses.botChance.min > 100) {
                                                            addBosses.botChance.min = 0;
                                                        } else if (addBosses.botChance.max < 0 || addBosses.botChance.max > 100) {
                                                            addBosses.botChance.max = 100;
                                                        }

                                                        let randomChance = generateRandomInteger(addBosses.botChance.min, addBosses.botChance.max);
                                                        
                                                        if (i < Math.abs(addBosses.spawnWaves.initial.waves - addBosses.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addBosses.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime == 0) {
                                                            randomTime = -1;
                                                        } else if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addBosses.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addBosses.botDifficulty);
                                                        }

                                                        if (typeArray.length == 0) {
                                                            typeArray = generateWeightArray(addBosses.botType);
                                                        }

                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        let randomZone = removeElementFromWeightArray(zoneArray);
                                                        let randomType = removeElementFromWeightArray(typeArray);

                                                        if (randomType == "glukhar") {
                                                            randomType = "bossGluhar";
                                                            supportType = "followerGluharAssault";
                                                            supportAmount = "0";
                                                            supports = [
                                                                {
                                                                    "BossEscortType": "followerGluharAssault",
                                                                    "BossEscortDifficult": [randomDifficulty],
                                                                    "BossEscortAmount": "2"
                                                                },
                                                                {
                                                                    "BossEscortType": "followerGluharSecurity",
                                                                    "BossEscortDifficult": [randomDifficulty],
                                                                    "BossEscortAmount": "2"
                                                                },
                                                                {
                                                                    "BossEscortType": "followerGluharScout",
                                                                    "BossEscortDifficult": [randomDifficulty],
                                                                    "BossEscortAmount": "2"
                                                                }
                                                            ];

                                                            if (addBosses.onlyVanillaOpenZones && location == "reserve") {
                                                                const glukharOpenZones = ["ZoneRailStrorage","ZoneRailStrorage","ZoneRailStrorage","ZonePTOR1","ZonePTOR2","ZoneBarrack","ZoneBarrack","ZoneBarrack","ZoneSubStorage"];
                                                                const randomGlukharZone = glukharOpenZones[Math.floor(Math.random() * glukharOpenZones.length)];
                                                                randomZone = randomGlukharZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "streets") {
                                                                randomZone = "ZoneCarShowroom";
                                                                supports[2].BossEscortAmount = "1";
                                                            }
                                                        } else if (randomType == "killa") {
                                                            randomType = "bossKilla";
                                                            supportType = "followerTagilla";
                                                            supportAmount = "0";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "interchange") {
                                                                const killaOpenZones = ["ZoneCenterBot","ZoneCenter","ZoneOLI","ZoneIDEA","ZoneGoshan","ZoneIDEAPark","ZoneOLIPark"];
                                                                const randomKillaZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                                                                randomZone = randomKillaZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "streets") {
                                                                const killaOpenZones = ["ZoneHotel_1","ZoneHotel_2"];
                                                                const randomKillaZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                                                                randomZone = randomKillaZone;
                                                            }
                                                        } else if (randomType == "knight") {
                                                            randomType = "bossKnight";
                                                            supportType = "exUsec";
                                                            supportAmount = "2";
                                                            supports = [
                                                                {
                                                                    "BossEscortType": "followerBigPipe",
                                                                    "BossEscortDifficult": [randomDifficulty],
                                                                    "BossEscortAmount": "1"
                                                                },
                                                                {
                                                                    "BossEscortType": "followerBirdEye",
                                                                    "BossEscortDifficult": [randomDifficulty],
                                                                    "BossEscortAmount": "1"
                                                                }
                                                            ];

                                                            if (addBosses.onlyVanillaOpenZones && location == "customs") {
                                                                randomZone = "ZoneScavBase";
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "lighthouse") {
                                                                const knightOpenZones = ["Zone_TreatmentContainers","Zone_Chalet"];
                                                                const randomKnightZone = knightOpenZones[Math.floor(Math.random() * knightOpenZones.length)];
                                                                randomZone = randomKnightZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "shoreline") {
                                                                randomZone = "ZoneMeteoStation";
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "woods") {
                                                                randomZone = "ZoneScavBase2";
                                                            }
                                                        } else if (randomType == "reshala") {
                                                            randomType = "bossBully";
                                                            supportType = "followerBully";
                                                            supportAmount = "4";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "customs") {
                                                                const reshalaOpenZones = ["ZoneDormitory","ZoneGasStation"];
                                                                const randomReshalaZone = reshalaOpenZones[Math.floor(Math.random() * reshalaOpenZones.length)];
                                                                randomZone = randomReshalaZone;
                                                            }
                                                        } else if (randomType == "sanitar") {
                                                            randomType = "bossSanitar";
                                                            supportType = "followerSanitar";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "shoreline") {
                                                                const sanitarOpenZones = ["ZonePort","ZoneGreenHouses","ZoneSanatorium1","ZoneGreenHouses","ZoneSanatorium2"];
                                                                const randomSanitarZone = sanitarOpenZones[Math.floor(Math.random() * sanitarOpenZones.length)];
                                                                randomZone = randomSanitarZone;
                                                            }
                                                        } else if (randomType == "shturman") {
                                                            randomType = "bossKojaniy";
                                                            supportType = "followerKojaniy";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "woods") {
                                                                randomZone = "ZoneWoodCutter";
                                                            }
                                                        } else if (randomType == "tagilla") {
                                                            randomType = "bossTagilla";
                                                            supportType = "followerBully";
                                                            supportAmount = "0";
                                                            supports = null;
                                                        } else if (randomType == "zryachiy") {
                                                            randomType = "bossZryachiy";
                                                            supportType = "followerZryachiy";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "lighthouse") {
                                                                randomZone = "Zone_Island";
                                                                randomChance = 100;
                                                            }
                                                        }

                                                        countAddBoss++;
                                                        initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, supportType, supportAmount, randomTime + timeInterval, supports, "", "", 0));

                                                        if (countInterval == addBosses.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // cultists
                                                if (addCultists.enabled && checkProperties(addCultists.botDifficulty) && checkProperties(addCultists.botChance) && (addCultists.spawnWaves.initial.waves !== 0 || addCultists.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addCultists.openZones)) {
                                                        for (const zone in addCultists.openZones) {
                                                            addCultists.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for cultists on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for cultists on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addCultists.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addCultists.openZones);
                                                    let difficultyArray = generateWeightArray(addCultists.botDifficulty);
                                                    let countOpenZone1 = 0;
                                                    let countOpenZone2 = 0;

                                                    for (let i = 0; i < addCultists.spawnWaves.initial.waves + addCultists.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addCultists.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addCultists.spawnWaves.spawnDelay.min, addCultists.spawnWaves.spawnDelay.max);

                                                        if (addCultists.botChance.min < 0 || addCultists.botChance.min > 100) {
                                                            addCultists.botChance.min = 0;
                                                        } else if (addCultists.botChance.max < 0 || addCultists.botChance.max > 100) {
                                                            addCultists.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addCultists.botChance.min, addCultists.botChance.max);
                                                        
                                                        if (i < Math.abs(addCultists.spawnWaves.initial.waves - addCultists.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addCultists.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addCultists.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addCultists.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddCultist++;

                                                        if (location == "shoreline") {
                                                            if (addCultists.onlyVanillaOpenZones) {
                                                                const zoneArr1 = ["ZoneSanatorium1","ZoneSanatorium2"];
                                                                const newZone1 = zoneArr1[Math.floor(Math.random() * zoneArr1.length)];

                                                                const zoneArr2 = ["ZoneForestGasStation","ZoneForestSpawn"];
                                                                const newZone2 = zoneArr2[Math.floor(Math.random() * zoneArr2.length)];

                                                                if (randomZone == "ZoneForestGasStation" || randomZone == "ZoneForestSpawn") {
                                                                    if (countOpenZone1 > 0) {
                                                                        countOpenZone1--;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, newZone1, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    } else {
                                                                        countOpenZone1++;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                } else {
                                                                    if (countOpenZone2 > 0) {
                                                                        countOpenZone2--;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, newZone2, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    } else {
                                                                        countOpenZone2++;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                }
                                                            }
                                                        } else {
                                                            initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                        }

                                                        if (countInterval == addCultists.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // raiders
                                                if (addRaiders.enabled && checkProperties(addRaiders.botDifficulty) && checkProperties(addRaiders.botChance) && (addRaiders.spawnWaves.initial.waves !== 0 || addRaiders.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addRaiders.openZones)) {
                                                        for (const zone in addRaiders.openZones) {
                                                            addRaiders.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for raiders on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for raiders on [${location}]`, this.logError);
                                                    }

                                                    if (location == "labs") {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                        const triggerIdArray = generateWeightArray(addRaiders.triggers);
                                                        let triggerName = "interactObject";
                                                        let countTriggerZoneGate1 = 0;
                                                        let countTriggerZoneGate2 = 0;

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++) {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);
                                                            let delayTime = randomTime + timeInterval;

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100) {
                                                                addRaiders.botChance.min = 0;
                                                            } else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100) {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval)) {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            } else {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0) {
                                                                randomTime = 0;
                                                                delayTime = 0;
                                                            }

                                                            if (zoneArray.length == 0) {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0) {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            let randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            let randomTrigger = removeElementFromWeightArray(triggerIdArray);

                                                            countAddRaider++;

                                                            if (addRaiders.onlyVanillaOpenZones) {
                                                                const newArr = ["BotZoneBasement","BotZoneFloor1","BotZoneFloor2"];
                                                                const newRand = newArr[Math.floor(Math.random() * newArr.length)];

                                                                if (randomTrigger == "autoId_00008_EXFIL" || randomTrigger == "autoId_00010_EXFIL") {
                                                                    randomZone = "BotZoneBasement";
                                                                }
                                                                
                                                                if (randomZone == "BotZoneGate1") {
                                                                    if (countTriggerZoneGate1 >= 1) {
                                                                        randomZone = newRand;
                                                                    } else {
                                                                        delete addRaiders.openZones["BotZoneGate1"];
                                                                        randomTrigger = "autoId_00632_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 8;
                                                                    }

                                                                    countTriggerZoneGate1++;
                                                                }
                                                                
                                                                if (randomZone == "BotZoneGate2") {
                                                                    if (countTriggerZoneGate2 >= 1) {
                                                                        randomZone = newRand;
                                                                    } else {
                                                                        delete addRaiders.openZones["BotZoneGate2"];
                                                                        randomTrigger = "autoId_00014_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 8;
                                                                    }

                                                                    countTriggerZoneGate2++;
                                                                }

                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, delayTime));
                                                            } else {
                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, 0));
                                                            }

                                                            if (triggerIdArray.length == 0) {
                                                                randomTrigger = "";
                                                                triggerName = "";
                                                            }

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval) {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        }
                                                    }

                                                    if (location == "reserve") {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                        const triggerIdArray = generateWeightArray(addRaiders.triggers);
                                                        let triggerName = "interactObject";
                                                        let countTriggerZone1 = 0;
                                                        let countTriggerZone2 = 0;

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++) {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);
                                                            let delayTime = randomTime + timeInterval;

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100) {
                                                                addRaiders.botChance.min = 0;
                                                            } else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100) {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval)) {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            } else {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0) {
                                                                randomTime = 0;
                                                                delayTime = 0;
                                                            }

                                                            if (zoneArray.length == 0) {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0) {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            const randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            let randomTrigger = removeElementFromWeightArray(triggerIdArray);

                                                            countAddRaider++;

                                                            if (addRaiders.onlyVanillaOpenZones) {
                                                                if (randomZone == "ZoneRailStrorage") {
                                                                    if (countTriggerZone1 == 0) {
                                                                        randomTrigger = "autoId_00632_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                        countTriggerZone1++;
                                                                    } else {
                                                                        randomTrigger = "";
                                                                        triggerName = "";
                                                                        randomTime = addRaiders.spawnWaves.interval.time + randomTime;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                    }
                                                                }
                                                                
                                                                if (randomZone == "ZoneSubCommand") {
                                                                    if (countTriggerZone2 == 0) {
                                                                        randomTrigger = "autoId_00000_D2_LEVER";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                        countTriggerZone2++;
                                                                    } else {
                                                                        randomTrigger = "raider_simple_patroling";
                                                                        randomTime = 3;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                    }
                                                                }

                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, delayTime));
                                                            } else {
                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, 0));
                                                            }

                                                            if (triggerIdArray.length == 0) {
                                                                randomTrigger = "";
                                                                triggerName = "";
                                                            }

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval) {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        }
                                                    }
                                                    
                                                    if (location != "labs" && location != "reserve") {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++) {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100) {
                                                                addRaiders.botChance.min = 0;
                                                            } else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100) {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval)) {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            } else {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0) {
                                                                randomTime = 0;
                                                            }

                                                            if (zoneArray.length == 0) {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0) {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            const randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            
                                                            countAddRaider++;
                                                            initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval) {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        } 
                                                    }
                                                }
                                                
                                                // rogues
                                                if (addRogues.enabled && checkProperties(addRogues.botDifficulty) && checkProperties(addRogues.botChance) && (addRogues.spawnWaves.initial.waves !== 0 || addRogues.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addRogues.openZones)) {
                                                        for (const zone in addRogues.openZones) {
                                                            addRogues.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for rogues on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for rogues on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addRogues.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addRogues.openZones);
                                                    let difficultyArray = generateWeightArray(addRogues.botDifficulty);

                                                    for (let i = 0; i < addRogues.spawnWaves.initial.waves + addRogues.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addRogues.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addRogues.spawnWaves.spawnDelay.min, addRogues.spawnWaves.spawnDelay.max);

                                                        if (addRogues.botChance.min < 0 || addRogues.botChance.min > 100) {
                                                            addRogues.botChance.min = 0;
                                                        } else if (addRogues.botChance.max < 0 || addRogues.botChance.max > 100) {
                                                            addRogues.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addRogues.botChance.min, addRogues.botChance.max);
                                                        
                                                        if (i < Math.abs(addRogues.spawnWaves.initial.waves - addRogues.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addRogues.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addRogues.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addRogues.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddRogue++;
                                                        initSpawns.push(this.generateBot("exUsec", randomChance, randomZone, randomDifficulty, "exUsec", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addRogues.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // bloodhounds
                                                if (addBloodhounds.enabled && checkProperties(addBloodhounds.botDifficulty) && checkProperties(addBloodhounds.botChance) && (addBloodhounds.spawnWaves.initial.waves !== 0 || addBloodhounds.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addBloodhounds.openZones)) {
                                                        for (const zone in addBloodhounds.openZones) {
                                                            addBloodhounds.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for bloodhounds on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for bloodhounds on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addBloodhounds.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addBloodhounds.openZones);
                                                    let difficultyArray = generateWeightArray(addBloodhounds.botDifficulty);

                                                    for (let i = 0; i < addBloodhounds.spawnWaves.initial.waves + addBloodhounds.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addBloodhounds.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addBloodhounds.spawnWaves.spawnDelay.min, addBloodhounds.spawnWaves.spawnDelay.max);

                                                        if (addBloodhounds.botChance.min < 0 || addBloodhounds.botChance.min > 100) {
                                                            addBloodhounds.botChance.min = 0;
                                                        } else if (addBloodhounds.botChance.max < 0 || addBloodhounds.botChance.max > 100) {
                                                            addBloodhounds.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addBloodhounds.botChance.min, addBloodhounds.botChance.max);
                                                        
                                                        if (i < Math.abs(addBloodhounds.spawnWaves.initial.waves - addBloodhounds.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addBloodhounds.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addBloodhounds.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addBloodhounds.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddBloodhound++;
                                                        initSpawns.push(this.generateBot("arenaFighterEvent", randomChance, randomZone, randomDifficulty, "arenaFighterEvent", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addBloodhounds.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // weird scavs
                                                if (addWeirdScavs.enabled && checkProperties(addWeirdScavs.botDifficulty) && checkProperties(addWeirdScavs.botChance) && (addWeirdScavs.spawnWaves.initial.waves !== 0 || addWeirdScavs.spawnWaves.interval.waves !== 0)) {
                                                    if (!checkProperties(addWeirdScavs.openZones)) {
                                                        for (const zone in addWeirdScavs.openZones) {
                                                            addWeirdScavs.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for weird scavs on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for weird scavs on [${location}]`, this.logError);
                                                    }

                                                    let timeInterval = addWeirdScavs.spawnWaves.interval.time;
                                                    const addTimeInterval = timeInterval;
                                                    let countInterval = 0;
                                                    let zoneArray = generateWeightArray(addWeirdScavs.openZones);
                                                    let difficultyArray = generateWeightArray(addWeirdScavs.botDifficulty);

                                                    for (let i = 0; i < addWeirdScavs.spawnWaves.initial.waves + addWeirdScavs.spawnWaves.interval.waves; i++) {
                                                        const randomAmount = generateRandomNumberFromSequence(addWeirdScavs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addWeirdScavs.spawnWaves.spawnDelay.min, addWeirdScavs.spawnWaves.spawnDelay.max);

                                                        if (addWeirdScavs.botChance.min < 0 || addWeirdScavs.botChance.min > 100) {
                                                            addWeirdScavs.botChance.min = 0;
                                                        } else if (addWeirdScavs.botChance.max < 0 || addWeirdScavs.botChance.max > 100) {
                                                            addWeirdScavs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addWeirdScavs.botChance.min, addWeirdScavs.botChance.max);
                                                        
                                                        if (i < Math.abs(addWeirdScavs.spawnWaves.initial.waves - addWeirdScavs.spawnWaves.interval.wavesPerInterval)) {
                                                            timeInterval = addWeirdScavs.spawnWaves.initial.time;
                                                        } else {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0) {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0) {
                                                            zoneArray = generateWeightArray(addWeirdScavs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0) {
                                                            difficultyArray = generateWeightArray(addWeirdScavs.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddWeirdScav++;
                                                        initSpawns.push(this.generateBot("crazyAssaultEvent", randomChance, randomZone, randomDifficulty, "crazyAssaultEvent", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addWeirdScavs.spawnWaves.interval.wavesPerInterval) {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            this.logger.log(`Mod: ${pkg.name} failed to load a spawn preset from "config.json" for location [${location}]`, this.logError);
                                            this.logger.log(`> reverted location [${location}] to default sp-tarkov spawn waves`, this.logError);
                                        }
                                    }

                                    // main spawn system
                                    if (mainSpawnSystemArray.length != 0) {
                                        const importMainFile = require(`../db/locations/${location}/main/presets/${mainSpawnSystemArray[randomMainPreset]}.${"json"}`);
                                        
                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && countRandomChanceToDisableMainPreset <= 1) {
                                            if (location != "labs") {
                                                for (const pmc in importMainFile.pmcs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.pmcs.difficulty);
                                                        importMainFile.pmcs[pmc].Time = importMainFile.pmcs[pmc].Time + generateRandomInteger(importMainFile.randomize.pmcs.spawnDelay.min, importMainFile.randomize.pmcs.spawnDelay.max);
                                                        importMainFile.pmcs[pmc].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.pmcs[pmc].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.pmcs[pmc].Time < 0 && importMainFile.pmcs[pmc].Time != -1) {
                                                            importMainFile.pmcs[pmc].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.pmcs[pmc]);
                                                }

                                                for (const scav in importMainFile.scavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.scavs.difficulty);
                                                        importMainFile.scavs[scav].Time = importMainFile.scavs[scav].Time + generateRandomInteger(importMainFile.randomize.scavs.spawnDelay.min, importMainFile.randomize.scavs.spawnDelay.max);
                                                        importMainFile.scavs[scav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.scavs[scav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.scavs[scav].Time < 0 && importMainFile.scavs[scav].Time != -1) {
                                                            importMainFile.scavs[scav].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.scavs[scav]);
                                                }

                                                for (const sniperScav in importMainFile.sniperScavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.sniperScavs.difficulty);
                                                        importMainFile.sniperScavs[sniperScav].Time = importMainFile.sniperScavs[sniperScav].Time + generateRandomInteger(importMainFile.randomize.sniperScavs.spawnDelay.min, importMainFile.randomize.sniperScavs.spawnDelay.max);
                                                        importMainFile.sniperScavs[sniperScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.sniperScavs[sniperScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.sniperScavs[sniperScav].Time < 0 && importMainFile.sniperScavs[sniperScav].Time != -1) {
                                                            importMainFile.sniperScavs[sniperScav].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.sniperScavs[sniperScav]);
                                                }

                                                for (const boss in importMainFile.bosses) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bosses.difficulty);
                                                        importMainFile.bosses[boss].Time = importMainFile.bosses[boss].Time + generateRandomInteger(importMainFile.randomize.bosses.spawnDelay.min, importMainFile.randomize.bosses.spawnDelay.max);
                                                        importMainFile.bosses[boss].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bosses[boss].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bosses[boss].Time < 0 && importMainFile.bosses[boss].Time != -1) {
                                                            importMainFile.bosses[boss].Time = 0;
                                                        }
                                                    }
                                                    
                                                    if (this.config.betterSpawnsPlus.locations[location].main.enableBosses) {
                                                        initSpawns.push(importMainFile.bosses[boss]);
                                                    }
                                                }

                                                for (const cultist in importMainFile.cultists) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.cultists.difficulty);
                                                        importMainFile.cultists[cultist].Time = importMainFile.cultists[cultist].Time + generateRandomInteger(importMainFile.randomize.cultists.spawnDelay.min, importMainFile.randomize.cultists.spawnDelay.max);
                                                        importMainFile.cultists[cultist].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.cultists[cultist].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.cultists[cultist].Time < 0 && importMainFile.cultists[cultist].Time != -1) {
                                                            importMainFile.cultists[cultist].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.cultists[cultist]);
                                                }

                                                for (const raider in importMainFile.raiders) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.raiders.difficulty);
                                                        importMainFile.raiders[raider].Time = importMainFile.raiders[raider].Time + generateRandomInteger(importMainFile.randomize.raiders.spawnDelay.min, importMainFile.randomize.raiders.spawnDelay.max);
                                                        importMainFile.raiders[raider].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.raiders[raider].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.raiders[raider].Time < 0 && importMainFile.raiders[raider].Time != -1) {
                                                            importMainFile.raiders[raider].Time = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.raiders[raider]);
                                                }

                                                for (const rogue in importMainFile.rogues) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.rogues.difficulty);
                                                        importMainFile.rogues[rogue].Time = importMainFile.rogues[rogue].Time + generateRandomInteger(importMainFile.randomize.rogues.spawnDelay.min, importMainFile.randomize.rogues.spawnDelay.max);
                                                        importMainFile.rogues[rogue].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.rogues[rogue].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.rogues[rogue].Time < 0 && importMainFile.rogues[rogue].Time != -1) {
                                                            importMainFile.rogues[rogue].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.rogues[rogue]);
                                                }

                                                for (const bloodhound in importMainFile.bloodhounds) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bloodhounds.difficulty);
                                                        importMainFile.bloodhounds[bloodhound].Time = importMainFile.bloodhounds[bloodhound].Time + generateRandomInteger(importMainFile.randomize.bloodhounds.spawnDelay.min, importMainFile.randomize.bloodhounds.spawnDelay.max);
                                                        importMainFile.bloodhounds[bloodhound].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bloodhounds[bloodhound].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bloodhounds[bloodhound].Time < 0 && importMainFile.bloodhounds[bloodhound].Time != -1) {
                                                            importMainFile.bloodhounds[bloodhound].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.bloodhounds[bloodhound]);
                                                }

                                                for (const weirdScav in importMainFile.weirdScavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.weirdScavs.difficulty);
                                                        importMainFile.weirdScavs[weirdScav].Time = importMainFile.weirdScavs[weirdScav].Time + generateRandomInteger(importMainFile.randomize.weirdScavs.spawnDelay.min, importMainFile.randomize.weirdScavs.spawnDelay.max);
                                                        importMainFile.weirdScavs[weirdScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.weirdScavs[weirdScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.weirdScavs[weirdScav].Time < 0 && importMainFile.weirdScavs[weirdScav].Time != -1) {
                                                            importMainFile.weirdScavs[weirdScav].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.weirdScavs[weirdScav]);
                                                }
                                            } else {
                                                for (const pmc in importMainFile.pmcs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.pmcs.difficulty);
                                                        importMainFile.pmcs[pmc].Delay = importMainFile.pmcs[pmc].Delay + generateRandomInteger(importMainFile.randomize.pmcs.spawnDelay.min, importMainFile.randomize.pmcs.spawnDelay.max);
                                                        importMainFile.pmcs[pmc].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.pmcs[pmc].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.pmcs[pmc].Delay < 0 && importMainFile.pmcs[pmc].Delay != -1) {
                                                            importMainFile.pmcs[pmc].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.pmcs[pmc]);
                                                }

                                                for (const scav in importMainFile.scavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.scavs.difficulty);
                                                        importMainFile.scavs[scav].Delay = importMainFile.scavs[scav].Delay + generateRandomInteger(importMainFile.randomize.scavs.spawnDelay.min, importMainFile.randomize.scavs.spawnDelay.max);
                                                        importMainFile.scavs[scav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.scavs[scav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.scavs[scav].Delay < 0 && importMainFile.scavs[scav].Delay != -1) {
                                                            importMainFile.scavs[scav].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.scavs[scav]);
                                                }

                                                for (const sniperScav in importMainFile.sniperScavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.sniperScavs.difficulty);
                                                        importMainFile.sniperScavs[sniperScav].Delay = importMainFile.sniperScavs[sniperScav].Delay + generateRandomInteger(importMainFile.randomize.sniperScavs.spawnDelay.min, importMainFile.randomize.sniperScavs.spawnDelay.max);
                                                        importMainFile.sniperScavs[sniperScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.sniperScavs[sniperScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.sniperScavs[sniperScav].Delay < 0 && importMainFile.sniperScavs[sniperScav].Delay != -1) {
                                                            importMainFile.sniperScavs[sniperScav].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.sniperScavs[sniperScav]);
                                                }

                                                for (const boss in importMainFile.bosses) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bosses.difficulty);
                                                        importMainFile.bosses[boss].Delay = importMainFile.bosses[boss].Delay + generateRandomInteger(importMainFile.randomize.bosses.spawnDelay.min, importMainFile.randomize.bosses.spawnDelay.max);
                                                        importMainFile.bosses[boss].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bosses[boss].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bosses[boss].Delay < 0 && importMainFile.bosses[boss].Delay != -1) {
                                                            importMainFile.bosses[boss].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    if (this.config.betterSpawnsPlus.locations[location].main.enableBosses) {
                                                        initSpawns.push(importMainFile.bosses[boss]);
                                                    }
                                                }

                                                for (const cultist in importMainFile.cultists) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.cultists.difficulty);
                                                        importMainFile.cultists[cultist].Delay = importMainFile.cultists[cultist].Delay + generateRandomInteger(importMainFile.randomize.cultists.spawnDelay.min, importMainFile.randomize.cultists.spawnDelay.max);
                                                        importMainFile.cultists[cultist].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.cultists[cultist].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.cultists[cultist].Delay < 0 && importMainFile.cultists[cultist].Delay != -1) {
                                                            importMainFile.cultists[cultist].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.cultists[cultist]);
                                                }

                                                for (const raider in importMainFile.raiders) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.raiders.difficulty);
                                                        importMainFile.raiders[raider].Delay = importMainFile.raiders[raider].Delay + generateRandomInteger(importMainFile.randomize.raiders.spawnDelay.min, importMainFile.randomize.raiders.spawnDelay.max);
                                                        importMainFile.raiders[raider].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.raiders[raider].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.raiders[raider].Delay < 0 && importMainFile.raiders[raider].Delay != -1) {
                                                            importMainFile.raiders[raider].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.raiders[raider]);
                                                }

                                                for (const rogue in importMainFile.rogues) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.rogues.difficulty);
                                                        importMainFile.rogues[rogue].Delay = importMainFile.rogues[rogue].Delay + generateRandomInteger(importMainFile.randomize.rogues.spawnDelay.min, importMainFile.randomize.rogues.spawnDelay.max);
                                                        importMainFile.rogues[rogue].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.rogues[rogue].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.rogues[rogue].Delay < 0 && importMainFile.rogues[rogue].Delay != -1) {
                                                            importMainFile.rogues[rogue].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.rogues[rogue]);
                                                }

                                                for (const bloodhound in importMainFile.bloodhounds) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bloodhounds.difficulty);
                                                        importMainFile.bloodhounds[bloodhound].Delay = importMainFile.bloodhounds[bloodhound].Delay + generateRandomInteger(importMainFile.randomize.bloodhounds.spawnDelay.min, importMainFile.randomize.bloodhounds.spawnDelay.max);
                                                        importMainFile.bloodhounds[bloodhound].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bloodhounds[bloodhound].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bloodhounds[bloodhound].Delay < 0 && importMainFile.bloodhounds[bloodhound].Delay != -1) {
                                                            importMainFile.bloodhounds[bloodhound].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.bloodhounds[bloodhound]);
                                                }

                                                for (const weirdScav in importMainFile.weirdScavs) {
                                                    if (importMainFile.randomize.enabled) {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.weirdScavs.difficulty);
                                                        importMainFile.weirdScavs[weirdScav].Delay = importMainFile.weirdScavs[weirdScav].Delay + generateRandomInteger(importMainFile.randomize.weirdScavs.spawnDelay.min, importMainFile.randomize.weirdScavs.spawnDelay.max);
                                                        importMainFile.weirdScavs[weirdScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.weirdScavs[weirdScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.weirdScavs[weirdScav].Delay < 0 && importMainFile.weirdScavs[weirdScav].Delay != -1) {
                                                            importMainFile.weirdScavs[weirdScav].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.weirdScavs[weirdScav]);
                                                }
                                            }
                                        }
                                    } else {
                                        this.logger.log(`Mod: ${pkg.name} failed to load a spawn preset from "config.json" for location [${location}]`, this.logError);
                                        this.logger.log(`> reverted location [${location}] to default sp-tarkov spawn waves`, this.logError);
                                    }

                                    if (this.config.betterSpawnsPlus.consoleLogs) {
                                        for (const spawn in initSpawns) {
                                            const bossName = initSpawns[spawn].BossName;
                                            if (bossName == "sptBear") {
                                                countBears++;
                                            } else if (bossName == "sptUsec") {
                                                countUsecs++;
                                            } else if (bossName == "assault") {
                                                countScavs++;
                                            } else if (bossName == "marksman") {
                                                countSniperScavs++;
                                            } else if (this.bossTypeArray.includes(bossName)) {
                                                countBosses++;
                                            } else if (bossName == "sectantPriest") {
                                                countCultists++;
                                            } else if (bossName == "pmcBot") {
                                                countRaiders++;
                                            } else if (bossName == "exUsec") {
                                                countRogues++;
                                            } else if (bossName == "arenaFighterEvent") {
                                                countBloodhounds++;
                                            } else if (bossName == "crazyAssaultEvent") {
                                                countWeirdScavs++;
                                            }
                                        }

                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && !this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled) {
                                            this.logger.log(` > [${location}]`, this.logInfo);
                                            this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                            this.logger.log("  > total spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countBears}, usecs: ${countUsecs}, scavs: ${countScavs}, sniper scavs: ${countSniperScavs}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countBosses}, cultists: ${countCultists}, raiders: ${countRaiders}, rogues: ${countRogues}`, this.logInfo);
                                            this.logger.log(`   > bloodhounds: ${countBloodhounds}, weird scavs: ${countWeirdScavs}`, this.logInfo);
                                        }

                                        if (!this.config.betterSpawnsPlus.locations[location].main.enabled && this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled) {
                                            this.logger.log(` > [${location}]`, this.logInfo);
                                            this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);
                                            this.logger.log("  > added spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countAddBear}, usecs: ${countAddUsec}, scavs: ${countAddScav}, sniper scavs: ${countAddSniperScav}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countAddBoss}, cultists: ${countAddCultist}, raiders: ${countAddRaider}, rogues: ${countAddRogue}`, this.logInfo);
                                            this.logger.log(`   > bloodhounds: ${countAddBloodhound}, weird scavs: ${countWeirdScavs}`, this.logInfo);
                                        }

                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled) {
                                            this.logger.log(` > [${location}]`, this.logInfo);

                                            if (countRandomChanceToDisableMainPreset == 0) {
                                                this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                                this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);
                                            } else if (countRandomChanceToDisableMainPreset == 1) {
                                                this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                                this.logger.log(`  > disabled spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logDisable);
                                            } else if (countRandomChanceToDisableMainPreset == 2) {
                                                this.logger.log(`  > disabled main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logDisable);
                                                this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);   
                                            }

                                            this.logger.log("  > added spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countAddBear}, usecs: ${countAddUsec}, scavs: ${countAddScav}, sniper scavs: ${countAddSniperScav}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countAddBoss}, cultists: ${countAddCultist}, raiders: ${countAddRaider}, rogues: ${countAddRogue}`, this.logInfo);
                                            this.logger.log(`   > bloodhounds: ${countAddBloodhound}, weird scavs: ${countAddWeirdScav}`, this.logInfo);
                                            this.logger.log("  > total spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countBears}, usecs: ${countUsecs}, scavs: ${countScavs}, sniper scavs: ${countSniperScavs}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countBosses}, cultists: ${countCultists}, raiders: ${countRaiders}, rogues: ${countRogues}`, this.logInfo);
                                            this.logger.log(`   > bloodhounds: ${countBloodhounds}, weird scavs: ${countWeirdScavs}`, this.logInfo);
                                        }
                                    }

                                    if (this.globalOverrides.enabled) {
                                        for (const spawn in initSpawns) {
                                            const difficultyOverride = this.globalOverrides.botDifficulty;
                                            const chanceOverride = this.globalOverrides.botChance;
                                        
                                            switch (initSpawns[spawn].BossName) {
                                                case "sptBear":
                                                case "sptUsec":
                                                    if (difficultyOverride.pmcs.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.pmcs.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.pmcs.difficulty;
                                                    }
                                                    if (chanceOverride.pmcs.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.pmcs.chance;
                                                    }
                                                    break;
                                                case "assault":
                                                    if (difficultyOverride.scavs.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.scavs.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.scavs.difficulty;
                                                    }
                                                    if (chanceOverride.scavs.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.scavs.chance;
                                                    }
                                                    break;
                                                case "marksman":
                                                    if (difficultyOverride.sniperScavs.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.sniperScavs.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.sniperScavs.difficulty;
                                                    }
                                                    if (chanceOverride.sniperScavs.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.sniperScavs.chance;
                                                    }
                                                    break;
                                                case "sectantPriest":
                                                    if (difficultyOverride.cultists.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.cultists.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.cultists.difficulty;
                                                    }
                                                    if (chanceOverride.cultists.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.cultists.chance;
                                                    }
                                                    break;
                                                case "pmcBot":
                                                    if (difficultyOverride.raiders.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.raiders.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.raiders.difficulty;
                                                    }
                                                    if (chanceOverride.raiders.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.raiders.chance;
                                                    }
                                                    break;
                                                case "exUsec":
                                                    if (difficultyOverride.rogues.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.rogues.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.rogues.difficulty;
                                                    }
                                                    if (chanceOverride.rogues.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.rogues.chance;
                                                    }
                                                    break;
                                                case "arenaFighterEvent":
                                                    if (difficultyOverride.bloodhounds.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.bloodhounds.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.bloodhounds.difficulty;
                                                    }
                                                    if (chanceOverride.bloodhounds.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.bloodhounds.chance;
                                                    }
                                                    break;
                                                case "crazyAssaultEvent":
                                                    if (difficultyOverride.weirdScavs.enabled) {
                                                        initSpawns[spawn].BossDifficult = difficultyOverride.weirdScavs.difficulty;
                                                        initSpawns[spawn].BossEscortDifficult = difficultyOverride.weirdScavs.difficulty;
                                                    }
                                                    if (chanceOverride.weirdScavs.enabled) {
                                                        initSpawns[spawn].BossChance = chanceOverride.weirdScavs.chance;
                                                    }
                                                    break;
                                                default:
                                                    if (difficultyOverride.bosses.enabled) {
                                                        if (this.bossTypeArray.includes(initSpawns[spawn].BossName)) {
                                                            initSpawns[spawn].BossDifficult = difficultyOverride.bosses.difficulty;
                                                            initSpawns[spawn].BossEscortDifficult = difficultyOverride.bosses.difficulty;
                                                        }
                                                    }
                                                    if (chanceOverride.bosses.enabled) {
                                                        if (this.bossTypeArray.includes(initSpawns[spawn].BossName)) {
                                                            initSpawns[spawn].BossChance = chanceOverride.bosses.chance;
                                                        }
                                                    }
                                            }
                                        }
                                    }

                                    const fileName = path.basename(path.dirname(__dirname.split('/').pop()));
                                    const spawnWavesFilePath = `${container.resolve<PreAkiModLoader>("PreAkiModLoader").getModPath(fileName)}info/consoleOutput/spawnWaves/extended_logs_${location}_spawn_waves.json`;
                                    
                                    fs.writeFileSync(spawnWavesFilePath, '');
                                    fs.appendFileSync(spawnWavesFilePath, JSON.stringify(initSpawns, null, 4));
                                }

                                this.logger.log(`Mod: ${pkg.name}: successfully loaded`, this.logSuccess);
                            }
                        }
                        catch (error) {
                            this.logger.error(error.message);
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
    }

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const configsBots = container.resolve<ConfigServer>("ConfigServer").getConfig<IBotConfig>(ConfigTypes.BOT);
        const configsInsurance = container.resolve<ConfigServer>("ConfigServer").getConfig<IInsuranceConfig>(ConfigTypes.INSURANCE);
        const configsLocations = container.resolve<ConfigServer>("ConfigServer").getConfig<ILocationConfig>(ConfigTypes.LOCATION);
        const configsRepairs = container.resolve<ConfigServer>("ConfigServer").getConfig<IRepairConfig>(ConfigTypes.REPAIR);
        const databaseBots = container.resolve<DatabaseServer>("DatabaseServer").getTables().bots;
        const databaseCustomization = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.customization;
        const databaseGlobals = container.resolve<DatabaseServer>("DatabaseServer").getTables().globals;
        const databaseHideout = container.resolve<DatabaseServer>("DatabaseServer").getTables().hideout;
        const databaseItems = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
        const databaseLocations = container.resolve<DatabaseServer>("DatabaseServer").getTables().locations;
        const databaseTraders = container.resolve<DatabaseServer>("DatabaseServer").getTables().traders;
        const otherOptions = this.config.otherOptions;

        if (this.config.betterSpawnsPlus.enabled && otherOptions.enabled) {
            logger.log(`Mod: ${pkg.name}: spawn changes and other options enabled`, this.logSuccess);
        } else if (this.config.betterSpawnsPlus.enabled && !otherOptions.enabled) {
            logger.log(`Mod: ${pkg.name}: only spawn changes enabled`, this.logSuccess);
        } else if (!this.config.betterSpawnsPlus.enabled && otherOptions.enabled) {
            logger.log(`Mod: ${pkg.name}: only other options enabled`, this.logSuccess);
        } else {
            logger.log(`Mod: ${pkg.name}: disabled`, this.logDisable);
        }

        // other options
        if (otherOptions.enabled) {
            if (otherOptions.consoleLogs) {
                this.logger.log("> [other options]: logs", this.logInfo)

                if (otherOptions.misc.replaceTradersProfilePics || otherOptions.misc.replaceLauncherBackground) {
                    this.logger.log(" > [misc]", this.logInfo)
                }

                if (otherOptions.misc.replaceLauncherBackground) {
                    this.logger.log("  > replace launcher backgrounds: enabled", this.logInfo)
                }

                if (otherOptions.misc.replaceTradersProfilePics) { 
                    this.logger.log("  > replace traders profile pics: enabled", this.logInfo)
                }
            }

            // extractions
            if (otherOptions.extractions.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [extractions]", this.logInfo)
                }

                // make all exfils open regardless of entry point
                if (otherOptions.extractions.openAllExfilsRegardlessOfEntryPoint) {
                    for (const location in databaseLocations) {
                        switch (location) {
                            case "base":
                                break;
                            case "bigmap":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Customs,Boiler Tanks";
                                }
                                break;
                            case "interchange":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "MallSE,MallNW";
                                }
                                break;
                            case "lighthouse":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Tunnel,North";
                                }
                                break;
                            case "shoreline":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Village,Riverside";
                                }
                                break;
                            case "tarkovstreets":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "E1_2,E2_3,E3_4,E4_5,E5_6,E6_1";
                                }
                                break;
                            case "woods":
                                for (const exfil in databaseLocations[location].base.exits) {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "House,Old Station";
                                }
                                break;
                            default:
                                break;
                        }
                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log("  > make all exfils open regardless of entry point: enabled", this.logInfo);
                    }
                }

                for (const i in databaseLocations) {
                    if (i !== "base") {
                        for (const x in databaseLocations[i].base.exits) {
                            // remove extraction restrictions
                            if (otherOptions.extractions.removeExtractionRestrictions) {
                                if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train" && !databaseLocations[i].base.exits[x].Name.includes("lab") || databaseLocations[i].base.exits[x].Name === "lab_Vent") {
                                    if (databaseLocations[i].base.exits[x].RequiredSlot) {
                                        delete databaseLocations[i].base.exits[x].RequiredSlot;
                                    }
                                    databaseLocations[i].base.exits[x].PassageRequirement = "None";
                                    databaseLocations[i].base.exits[x].ExfiltrationType = "Individual";
                                    databaseLocations[i].base.exits[x].Id = "";
                                    databaseLocations[i].base.exits[x].Count = 0;
                                    databaseLocations[i].base.exits[x].RequirementTip = "";
                                }
                            }

                            // make all extractions always available
                            if (otherOptions.extractions.allExtractionsAlwaysAvailable) {
                                if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train") {
                                    databaseLocations[i].base.exits[x].Chance = 100;
                                }
                            }
                        }
                    }
                }

                if (otherOptions.consoleLogs && otherOptions.extractions.removeExtractionRestrictions) {
                    this.logger.log("  > remove extraction restrictions: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs && otherOptions.extractions.allExtractionsAlwaysAvailable) {
                    this.logger.log("  > make all extractions always available: enabled", this.logInfo);
                }
            }

            // loot
            if (otherOptions.loot.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [loot]", this.logInfo)
                }

                for (const location of this.locationArray) {
                    if (location == "customs") {
                        databaseLocations.bigmap.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.bigmap = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.bigmap = otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "factory") {
                        databaseLocations.factory4_day.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        databaseLocations.factory4_night.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.factory4_day = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.looseLootMultiplier.factory4_night = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.factory4_day = otherOptions.loot[location].staticLootMultiplier;
                        configsLocations.staticLootMultiplier.factory4_night = otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "interchange" || location == "lighthouse" || location == "shoreline" || location == "woods") {
                        databaseLocations[location].base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier[location] = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier[location] = otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "labs") {
                        databaseLocations.laboratory.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.laboratory = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.laboratory = otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "reserve") {
                        databaseLocations.rezervbase.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.rezervbase = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.rezervbase = otherOptions.loot[location].staticLootMultiplier;

                    }

                    if (location == "streets") {
                        databaseLocations.tarkovstreets.base.GlobalLootChanceModifier = otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.tarkovstreets = otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.tarkovstreets = otherOptions.loot[location].staticLootMultiplier;

                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log(`  > ${location}`, this.logInfo)
                        this.logger.log(`   > globalLootModifier: ${otherOptions.loot[location].globalLootChanceModifier}`, this.logInfo)
                        this.logger.log(`   > looseLootMultiplier: ${otherOptions.loot[location].looseLootMultiplier}`, this.logInfo)
                        this.logger.log(`   > staticLootMultiplier: ${otherOptions.loot[location].staticLootMultiplier}`, this.logInfo)
                    }
                }
            }

            // items
            if (otherOptions.items.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [items]", this.logInfo);
                }

                if (otherOptions.consoleLogs && (otherOptions.items.repairs.removeArmorDegradationFromRepairs || otherOptions.items.repairs.removeWeaponDegradationFromRepairs)) {
                    this.logger.log("  > repairs", this.logInfo);
                }

                // remove armor degradation from repairs
                if (otherOptions.items.repairs.removeArmorDegradationFromRepairs) {
                    for (const armor in databaseGlobals.config.ArmorMaterials) {
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairKitDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairKitDegradation = 0;
                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log("   > remove armor degradation from repairs: enabled", this.logInfo);
                    }
                }

                // remove weapon degradation from repairs
                if (otherOptions.items.repairs.removeWeaponDegradationFromRepairs) {
                    for (const weapon in databaseItems) {
                        if (databaseItems[weapon]._props.MaxRepairDegradation !== undefined && databaseItems[weapon]._props.MaxRepairKitDegradation !== undefined) {
                            this.itemData(container, weapon, "MinRepairDegradation", 0);
                            this.itemData(container, weapon, "MaxRepairDegradation", 0);
                            this.itemData(container, weapon, "MinRepairKitDegradation", 0);
                            this.itemData(container, weapon, "MaxRepairKitDegradation", 0);
                        }
                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log("   > remove weapon degradation from repairs: enabled", this.logInfo);
                    }
                }

                if (otherOptions.consoleLogs && (otherOptions.items.insurance.insuranceAllowedOnAllLocations || otherOptions.items.insurance.insuranceAllowedForAllItems)) {
                    this.logger.log("  > insurance", this.logInfo);
                }

                // allow insurance on all locations
                if (otherOptions.items.insurance.insuranceAllowedOnAllLocations) {
                    this.altLocationArray.forEach(function(location) {
                        databaseLocations[location].base.Insurance = true;
                    });

                    if (otherOptions.consoleLogs) {
                        this.logger.log("   > allow insurance on all locations: enabled", this.logInfo);
                    }
                }

                for (const id in databaseItems) {
                    if (!this.getId([id])) {
                        const base = databaseItems[id];

                        // allow insurance for all items
                        if (otherOptions.items.insurance.insuranceAllowedForAllItems && base._props.IsAlwaysAvailableForInsurance !== undefined) {
                            this.itemData(container, id, "IsAlwaysAvailableForInsurance", true);
                        }

                        // remove weapon durability burn
                        if (otherOptions.items.gear.removeWeaponDurabilityBurn && base._props.DurabilityBurnModificator) {
                            this.itemData(container, id, "DurabilityBurnModificator", 0);
                        }

                        // remove weapon deterioration from bullets
                        if (otherOptions.items.gear.removeWeaponDeteriorationFromBullets && base._props.Deterioration) {
                            this.itemData(container, id, "Deterioration", 0);
                        }

                        // allow all items to be lootable
                        if (otherOptions.items.allowAllItemsToBelootable && base._props.Unlootable !== undefined) {
                            this.itemData(container, id, "Unlootable", false);
                        }

                        // make all items unexamined by default
                        if (otherOptions.items.allItemsUnexaminedByDefault && base._props.ExaminedByDefault !== undefined) {
                            this.itemData(container, id, "ExaminedByDefault", false);
                        }
                    }
                }

                if (otherOptions.consoleLogs && otherOptions.items.insurance.insuranceAllowedForAllItems) {
                    this.logger.log("   > allow insurance for all items: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs && (otherOptions.items.gear.removeWeaponDurabilityBurn || otherOptions.items.allowAllItemsToBelootable)) {
                    this.logger.log("  > gear", this.logInfo);
                }

                if (otherOptions.consoleLogs && otherOptions.items.gear.removeWeaponDurabilityBurn) {
                    this.logger.log("   > remove weapon durability burn: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs && otherOptions.items.gear.removeWeaponDeteriorationFromBullets) {
                    this.logger.log("   > remove weapon deterioration from bullets: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs && otherOptions.items.allowAllItemsToBelootable) {
                    this.logger.log("  > allow all items to be lootable: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs && otherOptions.items.allItemsUnexaminedByDefault) {
                    this.logger.log("  > make all items unexamined by default: enabled", this.logInfo);
                }

                if (otherOptions.consoleLogs) {
                    this.logger.log("  > keys", this.logInfo);
                    this.logger.log("   > labs access keycard", this.logInfo);
                }

                // remove labs access keycard requirement
                if (otherOptions.items.keys.labsAccessKeycard.removeLabsReq) {
                    databaseLocations.laboratory.base.AccessKeys = [];

                    if (otherOptions.consoleLogs) {
                        this.logger.log("    > remove labs access keycard requirement: enabled", this.logInfo);
                    }
                }

                // set max number of uses for labs access keycard
                const labsAccessKeycard = databaseItems["5c94bbff86f7747ee735c08f"];
                labsAccessKeycard._props.MaximumNumberOfUsage = otherOptions.items.keys.labsAccessKeycard.maxNumberOfUses;

                if (otherOptions.consoleLogs) {
                    this.logger.log(`    > max number of uses for labs access keycard: ${labsAccessKeycard._props.MaximumNumberOfUsage}`, this.logInfo);
                }
            }

            // player
            if (otherOptions.player.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [player]", this.logInfo);
                }

                // scav cooldown timer
                databaseGlobals.config.SavagePlayCooldown = otherOptions.player.scavCooldownTimer * 60;

                if (otherOptions.consoleLogs) {
                    this.logger.log(`  > scav cooldown timer: ${databaseGlobals.config.SavagePlayCooldown / 60} minutes`, this.logInfo);
                }

                // health in-raid
                if (otherOptions.player.healthInRaid.enabled) {
                    databaseGlobals.config.Health.Effects.Existence.EnergyLoopTime = otherOptions.player.healthInRaid.energyLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.EnergyDamage = otherOptions.player.healthInRaid.energyDecreasePerLoopTime;
                    databaseGlobals.config.Health.Effects.Existence.HydrationLoopTime = otherOptions.player.healthInRaid.hydrationLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.HydrationDamage = otherOptions.player.healthInRaid.hydrationDecreasePerLoopTime;

                    if (otherOptions.consoleLogs) {
                        this.logger.log("  > health in-raid:", this.logInfo);
                        this.logger.log(`   > energy loop time: ${databaseGlobals.config.Health.Effects.Existence.EnergyLoopTime} seconds`, this.logInfo);
                        this.logger.log(`   > energy damage: ${databaseGlobals.config.Health.Effects.Existence.EnergyDamage}`, this.logInfo);
                        this.logger.log(`   > hydration loop time: ${databaseGlobals.config.Health.Effects.Existence.HydrationLoopTime} seconds`, this.logInfo);
                        this.logger.log(`   > hydration damage: ${databaseGlobals.config.Health.Effects.Existence.HydrationDamage}`, this.logInfo);
                    }
                }

                // health in-hideout
                if (otherOptions.player.healthInHideout.enabled) {
                    databaseGlobals.config.Health.Effects.Regeneration.Energy = otherOptions.player.healthInHideout.energyRegenerationLoopTime;
                    databaseGlobals.config.Health.Effects.Regeneration.Hydration = otherOptions.player.healthInHideout.hydrationRegenerationLoopTime;

                    const bodyHealth = databaseGlobals.config.Health.Effects.Regeneration.BodyHealth;
                    const regenerationMultiplier = otherOptions.player.healthInHideout.healthRegenerationMultiplier;
                    bodyHealth.Chest.Value = bodyHealth.Chest.Value * regenerationMultiplier;
                    bodyHealth.Head.Value = bodyHealth.Head.Value * regenerationMultiplier;
                    bodyHealth.LeftArm.Value = bodyHealth.LeftArm.Value * regenerationMultiplier;
                    bodyHealth.LeftLeg.Value = bodyHealth.LeftLeg.Value * regenerationMultiplier;
                    bodyHealth.RightArm.Value = bodyHealth.RightArm.Value * regenerationMultiplier;
                    bodyHealth.RightLeg.Value = bodyHealth.RightLeg.Value * regenerationMultiplier;
                    bodyHealth.Stomach.Value = bodyHealth.Stomach.Value * regenerationMultiplier;

                    if (otherOptions.consoleLogs) {
                        this.logger.log("  > health in-hideout:", this.logInfo);
                        this.logger.log(`   > energy regeneration time: ${databaseGlobals.config.Health.Effects.Regeneration.Energy} minutes`, this.logInfo);
                        this.logger.log(`   > hydration regeneration time: ${databaseGlobals.config.Health.Effects.Regeneration.Hydration} minutes`, this.logInfo);
                        this.logger.log(`   > health regeneration multiplier: ${regenerationMultiplier}`, this.logInfo);
                    }
                    
                    // remove free heals and trial levels
                    if (otherOptions.player.healthInHideout.removeFreeHealTrialLevelsAndRaids) {   
                        databaseGlobals.config.Health.HealPrice.TrialLevels = 0;
                        databaseGlobals.config.Health.HealPrice.TrialRaids = 0;

                        if (otherOptions.consoleLogs) {
                            this.logger.log("   > remove free heals and trial levels: enabled", this.logInfo);
                        }
                    }
                }
            }

            // allow all tactical clothing for both factions
            if (otherOptions.player.tacticalClothing.allowAllTacticalClothingForBothFactions) {
                for (const customization in databaseCustomization) {
                    const customizationData = databaseCustomization[customization];
                    if (customizationData._parent === "5cd944d01388ce000a659df9" || customizationData._parent === "5cd944ca1388ce03a44dc2a4") {
                        customizationData._props.Side = ["Usec", "Bear"];
                    }
                }

                if (otherOptions.consoleLogs) {
                    this.logger.log("   > allow all tactical clothing for both factions: enabled", this.logInfo);
                }
            }

            // unlock all tactical clothing for free
            if (otherOptions.player.tacticalClothing.unlockAllTacticalClothingForFree) {
                for (const trader in databaseTraders) {
                    if (this.getId([trader]) === false && databaseTraders[trader].suits) {
                        for (const suit in databaseTraders[trader].suits) {
                            const suitId = databaseTraders[trader].suits[suit];
                            suitId.requirements.loyaltyLevel = 1;
                            suitId.requirements.profileLevel = 1;
                            suitId.requirements.standing = 0;
                            suitId.requirements.skillRequirements = [];
                            suitId.requirements.questRequirements = [];
                            suitId.requirements.itemRequirements = [];
                        }
                    }
                }

                if (otherOptions.consoleLogs) {
                    this.logger.log("   > unlock all tactical clothing for free: enabled", this.logInfo);
                }
            }

            // hideout
            if (otherOptions.hideout.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [hideout]", this.logInfo);
                }

                const constructionMultiplier = otherOptions.hideout.constructionTimeMultiplier;
                const productionMultiplier = otherOptions.hideout.productionTimeMultiplier;

                // construction multiplier
                for (const data in databaseHideout.areas) {
                    const areaData = databaseHideout.areas[data];

                    if (this.getId([areaData._id]) === false) {
                        for (const i in areaData.stages) {
                            if (areaData.stages[i].constructionTime > 0) {
                                areaData.stages[i].constructionTime = areaData.stages[i].constructionTime * constructionMultiplier;
                            }
                        }
                    }
                }

                if (otherOptions.consoleLogs) {
                    this.logger.log(`  > construction multiplier: ${constructionMultiplier}`, this.logInfo);
                }

                // production multiplier
                for (const data in databaseHideout.production) {
                    const productionData = databaseHideout.production[data];

                    if (this.getId([productionData._id]) === false) {
                        if (!productionData.continuous && productionData.productionTime > 1) {
                            productionData.productionTime = productionData.productionTime * productionMultiplier;
                        }
                    }
                }

                for (const data in databaseHideout.scavcase) {
                    const scavcaseData = databaseHideout.scavcase[data];

                    if (this.getId([scavcaseData._id]) === false) {
                        if (scavcaseData.ProductionTime > 1) {
                            scavcaseData.ProductionTime = scavcaseData.ProductionTime * productionMultiplier;
                        }
                    }
                }

                if (otherOptions.consoleLogs) {
                    this.logger.log(`  > production multiplier: ${productionMultiplier}`, this.logInfo);
                }
            }

            // traders
            if (otherOptions.traders.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [traders]", this.logInfo);
                }

                // repair cost multiplier for all traders
                configsRepairs.priceMultiplier = otherOptions.traders.repairCostMultiplierForAllTraders;

                if (otherOptions.consoleLogs) {
                    this.logger.log(`  > repair cost multiplier for all traders: ${configsRepairs.priceMultiplier}`, this.logInfo);
                }

                // prapor insurance
                configsInsurance.insuranceMultiplier[eftTraders.PRAPOR] = otherOptions.traders.prapor.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.PRAPOR] = otherOptions.traders.prapor.insurance.returnChancePercent;
                databaseTraders[eftTraders.PRAPOR].base.insurance.min_return_hour = otherOptions.traders.prapor.insurance.minReturnTime;
                databaseTraders[eftTraders.PRAPOR].base.insurance.max_return_hour = otherOptions.traders.prapor.insurance.maxReturnTime;

                if (otherOptions.consoleLogs) {
                    this.logger.log("  > prapor insurance", this.logInfo);
                    this.logger.log(`   > multiplier: ${configsInsurance.insuranceMultiplier[eftTraders.PRAPOR]}`, this.logInfo);
                    this.logger.log(`   > return chance: ${configsInsurance.returnChancePercent[eftTraders.PRAPOR]}%`, this.logInfo);
                    this.logger.log(`   > min return time: ${databaseTraders[eftTraders.PRAPOR].base.insurance.min_return_hour} hours`, this.logInfo);
                    this.logger.log(`   > max return time: ${databaseTraders[eftTraders.PRAPOR].base.insurance.max_return_hour} hours`, this.logInfo);
                }

                // therapist insurance
                configsInsurance.insuranceMultiplier[eftTraders.THERAPIST] = otherOptions.traders.therapist.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.THERAPIST] = otherOptions.traders.therapist.insurance.returnChancePercent;
                databaseTraders[eftTraders.THERAPIST].base.insurance.min_return_hour = otherOptions.traders.therapist.insurance.minReturnTime;
                databaseTraders[eftTraders.THERAPIST].base.insurance.max_return_hour = otherOptions.traders.therapist.insurance.maxReturnTime;
                
                if (otherOptions.consoleLogs) {
                    this.logger.log("  > therapist insurance", this.logInfo);
                    this.logger.log(`   > multiplier: ${configsInsurance.insuranceMultiplier[eftTraders.THERAPIST]}`, this.logInfo);
                    this.logger.log(`   > return chance: ${configsInsurance.returnChancePercent[eftTraders.THERAPIST]}%`, this.logInfo);
                    this.logger.log(`   > min return time: ${databaseTraders[eftTraders.THERAPIST].base.insurance.min_return_hour} hours`, this.logInfo);
                    this.logger.log(`   > max return time: ${databaseTraders[eftTraders.THERAPIST].base.insurance.max_return_hour} hours`, this.logInfo);
                }

                // trader repair quality
                databaseTraders[eftTraders.MECHANIC].base.repair.quality = otherOptions.traders.mechanic.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.PRAPOR].base.repair.quality = otherOptions.traders.prapor.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.SKIER].base.repair.quality = otherOptions.traders.skier.repairs.repairQualityDegradation;

                if (otherOptions.consoleLogs) {
                    this.logger.log(`  > mechanic repair quality degradation: ${databaseTraders[eftTraders.MECHANIC].base.repair.quality}`, this.logInfo);
                    this.logger.log(`  > prapor repair quality degradation: ${databaseTraders[eftTraders.PRAPOR].base.repair.quality}`, this.logInfo);
                    this.logger.log(`  > skier repair quality degradation: ${databaseTraders[eftTraders.SKIER].base.repair.quality}`, this.logInfo);
                }
            }

            // bots
            if (otherOptions.bots.enabled) {
                if (otherOptions.consoleLogs) {
                    this.logger.log(" > [bots]", this.logInfo);
                }

                // bot level relative to player level
                configsBots.pmc.botRelativeLevelDeltaMax = otherOptions.bots.pmc.botLevelRelativeToPlayerLevel;

                // chance same side is hostile
                configsBots.pmc.chanceSameSideIsHostilePercent = otherOptions.bots.pmc.chanceSameFactionIsHostile;

                if (otherOptions.consoleLogs) {
                    this.logger.log("  > pmc:", this.logInfo);
                    this.logger.log(`   > bot level relative to player level: ${configsBots.pmc.botRelativeLevelDeltaMax}`, this.logInfo);
                    this.logger.log(`   > chance same side is hostile: ${configsBots.pmc.chanceSameSideIsHostilePercent}%`, this.logInfo);
                }

                // custom pmc dog tags
                if (otherOptions.bots.pmc.customPmcDogTags) {
                    for (const types in this.pmcTypeArray) {
                        const type = this.pmcTypeArray[types];
                        databaseBots.types[type].firstName = pmcDogTags.usernames;
                        databaseBots.types[type].lastName = [];
                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log("   > custom pmc dog tags: enabled", this.logInfo);
                    }
                }

                // make pmcs not randomly talk
                if (otherOptions.bots.pmc.makePmcsNotRandomlyTalk) {
                    for (const types in this.pmcTypeArray) {
                        const type = this.pmcTypeArray[types];
                        this.botDifficultyArray.forEach(function(difficulty) {
                            databaseBots.types[type].difficulty[difficulty].Grenade.CHANCE_TO_NOTIFY_ENEMY_GR_100 = 0;
                            databaseBots.types[type].difficulty[difficulty].Mind.CAN_TALK = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.CAN_THROW_REQUESTS = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.TALK_WITH_QUERY = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.MIN_TALK_DELAY = 100;
                            databaseBots.types[type].difficulty[difficulty].Patrol.TALK_DELAY = 50;
                            databaseBots.types[type].difficulty[difficulty].Patrol.TALK_DELAY_BIG = 50.1;
                            databaseBots.types[type].difficulty[difficulty].Patrol.MIN_DIST_TO_CLOSE_TALK = 100;
                            databaseBots.types[type].difficulty[difficulty].Patrol.MIN_DIST_TO_CLOSE_TALK_SQR = 10000;
                        });
                    }

                    if (otherOptions.consoleLogs) {
                        this.logger.log("   > make pmcs not randomly talk: enabled", this.logInfo);
                    }
                }
            }

            if (otherOptions.consoleLogs) {
                this.logger.log(`Mod: ${pkg.name}: waiting for launcher to start...`, this.logSuccess);
            }
        } else {
            return;
        }
    }

    public postAkiLoad(container: DependencyContainer): void {
        const fileName = path.basename(path.dirname(__dirname.split('/').pop()));
        const filePath = `${container.resolve<PreAkiModLoader>("PreAkiModLoader").getModPath(fileName)}res/`;
        const otherOptions = this.config.otherOptions;

        fs.readdir(filePath, (err, files) => {
            files.forEach(file => {
                if (otherOptions.enabled) {
                    const imageId = file.split('/').pop().split('.').shift();

                    if (otherOptions.misc.replaceTradersProfilePics) {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/trader/avatar/${imageId}`,`${filePath}${imageId}.${"jpg"}`);
                    }

                    const imageArray = [
                        "eft00","eft01","eft02","eft03","eft04","eft05","eft06","eft07","eft08","eft09","eft10","eft11","eft12","eft13",
                        "eft14","eft15","eft16","eft17","eft18","eft19","eft20","eft21","eft22","eft23","eft24","eft25","eft26","eft27"
                    ];
                    const random = Math.floor(Math.random() * imageArray.length);
                    
                    if (otherOptions.misc.replaceLauncherBackground) {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/launcher/${imageId}`,`${filePath}${imageArray[random]}.${"jpg"}`);
                    }
                }
            });
        });
    }

    private itemData(container: DependencyContainer, id: string, data: string, value: any): void {
        const databaseItems = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
        databaseItems[id]._props[data] = value;
    }

    private idArray = [];

    private getId(id: string[]): boolean {
        if (this.idArray.length > 0) {
            for (const isId in this.idArray) {
                if (id.includes(this.idArray[isId])) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    private generateBot(type: string, chance: number, zones: string, difficulty: string, supportType: string, sequence: string, time: number, supports: any, triggerId: string, triggerName: string, delay: number) {
        return {
            "BossName": type,
            "BossChance": chance,
            "BossZone": zones,
            "BossPlayer": false,
            "BossDifficult": difficulty,
            "BossEscortType":supportType,
            "BossEscortDifficult": difficulty,
            "BossEscortAmount": sequence,
            "Time": time,
            "Supports": supports,
            "TriggerId": triggerId,
            "TriggerName": triggerName,
            "Delay": delay,
            "RandomTimeSpawn": false
        }
    }
}

module.exports = { mod: new BetterSpawnsPlus() };