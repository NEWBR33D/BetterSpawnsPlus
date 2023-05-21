/* 
 * BetterSpawnsPlus v1.1.2
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

/* eslint-disable @typescript-eslint/no-var-requires */

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
//import { WildSpawnTypeNumber as sptTypes } from "@spt-aki/models/enums/WildSpawnTypeNumber";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import * as path from "path";
import * as fs from "fs";
import pkg from "../package.json"
import configPresetManager from "../config/configPresetManager.json";
import pmcDogTags from "../db/bots/pmcs/pmcDogTags.json";

class BetterSpawnsPlus implements IPostDBLoadMod, IPostAkiLoadMod
{
    private configFile = configPresetManager.configFilePreset;
    private config = require(`../config/presets/${this.configFile}.json`);
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
    private brainTypeArray = ["bossKilla","bossKnight","bossGluhar","bossSanitar","bossTagilla","followerGluharAssault","followerBully","followerBigPipe","followerSanitar","assault","cursedAssault","exUsec","pmcBot"];
    private bossTypeArray = ["bossBully","bossKilla","bossKojaniy","bossGluhar","bossSanitar","bossTagilla","bossKnight","bossZryachiy"];
    private enemyTypeArray = ["assault","cursedassault","pmcbot","exusec"];
    private botDifficultyArray = ["easy","normal","hard","impossible"];
    private pmcTypeArray = ["bear","usec"];

    public preAkiLoad(container: DependencyContainer): void
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        function generateRandomInteger(min: number, max: number)
        {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function generateRandomNumberFromSequence(array: number[])
        {
            let random = array[Math.floor(Math.random() * array.length)];

            if (random > 0)
            {
                random = random - 1;
            }
            else
            {
                random = 0;
            }
            
            return random.toString();
        }

        function generateWeightArray(object: object)
        {
            const array: string[] = [];

            for (let [key, value] of Object.entries(object))
            {
                if (value > 5)
                {
                    value = 5;
                }

                if (value == 1)
                {
                    array.push(key);
                }
                else if (value == 2)
                {
                    array.push(key);
                    array.push(key);
                }
                else if (value == 3)
                {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                }
                else if (value == 4)
                {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                }
                else if (value == 5)
                {
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                    array.push(key);
                }
            }

            return array;
        }

        function removeElementFromWeightArray(array: string[])
        {
            const element = (Math.random() * array.length) | 0;
            return array.splice(element, 1)[0];
        }

        function checkProperties(object: any)
        {
            let count = 0;

            for (const key in object)
            {
                if (object[key] == 0)
                {
                    count++;
                }
            }

            if (count == Object.keys(object).length)
            {
                return false;
            }
            else
            {
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
                            Object.keys(require.cache).forEach(function(key)
                            {
                                delete require.cache[key]
                            });

                            this.config = require(`../config/presets/${this.configFile}.json`);
                            
                            const databaseLocations = this.databaseServer.getTables().locations;
                            const configsAirdrops = container.resolve<ConfigServer>("ConfigServer").getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
                            const configsBots = container.resolve<ConfigServer>("ConfigServer").getConfig<IBotConfig>(ConfigTypes.BOT);
                            const configsInraids = container.resolve<ConfigServer>("ConfigServer").getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);

                            // other options
                            if (this.config.otherOptions.enabled)
                            {
                                if (this.config.otherOptions.consoleLogs)
                                {
                                    this.logger.log(`Mod: ${pkg.name}: continuing...`, this.logSuccess);
                                    this.logger.log("> [other options]: logs", this.logInfo)
                                }

                                // bots
                                if (this.config.otherOptions.bots.enabled)
                                {
                                    if (this.config.otherOptions.consoleLogs)
                                    {
                                        this.logger.log(" > [bots]", this.logInfo);
                                    }

                                    // pmc brain type
                                    if (this.config.otherOptions.bots.pmc.brainType.enabled)
                                    {
                                        // randomize brain type
                                        if (this.config.otherOptions.bots.pmc.brainType.randomize)
                                        {
                                            for (const brainType of this.brainTypeArray)
                                            {
                                                this.config.otherOptions.bots.pmc.brainType.bear[brainType] = generateRandomInteger(1, 5);
                                                this.config.otherOptions.bots.pmc.brainType.usec[brainType] = generateRandomInteger(1, 5);
                                            }
                                        }

                                        for (const altLocation of this.altLocationArray)
                                        {
                                            configsBots.pmc.pmcType.sptbear[altLocation] = this.config.otherOptions.bots.pmc.brainType.bear;
                                            configsBots.pmc.pmcType.sptusec[altLocation] = this.config.otherOptions.bots.pmc.brainType.usec;
                                        }

                                        if (this.config.otherOptions.consoleLogs)
                                        {
                                            this.logger.log("  > pmc:", this.logInfo);
                                            this.logger.log(`   > bear brain type: ${JSON.stringify(this.config.otherOptions.bots.pmc.brainType.bear, null, 6)}`, this.logInfo);
                                            this.logger.log(`   > usec brain type: ${JSON.stringify(this.config.otherOptions.bots.pmc.brainType.usec, null, 6)}`, this.logInfo);
                                        }
                                    }
                                }

                                // max bots cap
                                if (this.config.otherOptions.maxBotCap.enabled)
                                {
                                    if (this.config.otherOptions.consoleLogs)
                                    {
                                        this.logger.log(" > [max bot cap]", this.logInfo);
                                    }

                                    for (const locations in this.locationArray)
                                    {
                                        const location = this.locationArray[locations];
                                        const randomBotCap = generateRandomInteger(this.config.otherOptions.maxBotCap[location].min, this.config.otherOptions.maxBotCap[location].max);

                                        if (location == "customs")
                                        {
                                            configsBots.maxBotCap.bigmap = randomBotCap;
                                        }
                                        
                                        if (location == "factory")
                                        {
                                            configsBots.maxBotCap.factory4_day = randomBotCap;
                                            configsBots.maxBotCap.factory4_night = randomBotCap;
                                        }

                                        if (location == "interchange" || location == "lighthouse" || location == "shoreline" || location == "woods")
                                        {
                                            configsBots.maxBotCap[location] = randomBotCap;
                                        }

                                        if (location == "labs")
                                        {
                                            configsBots.maxBotCap.laboratory = randomBotCap;
                                        }

                                        if (location == "reserve")
                                        {
                                            configsBots.maxBotCap.rezervbase = randomBotCap;
                                        }

                                        if (location == "streets")
                                        {
                                            configsBots.maxBotCap.tarkovstreets = randomBotCap;
                                        }

                                        if (this.config.otherOptions.consoleLogs)
                                        {
                                            this.logger.log(`  > ${location}: ${randomBotCap}`, this.logInfo);
                                        }
                                    }
                                }

                                // raid timer
                                if (this.config.otherOptions.raidTimer.enabled)
                                {
                                    if (this.config.otherOptions.consoleLogs)
                                    {
                                        this.logger.log(" > [raid timer]", this.logInfo);
                                    }

                                    for (const locations in this.locationArray)
                                    {
                                        const location = this.locationArray[locations];
                                        const randomRaidTimer = generateRandomInteger(this.config.otherOptions.raidTimer[location].min, this.config.otherOptions.raidTimer[location].max);

                                        if (location == "customs")
                                        {
                                            databaseLocations.bigmap.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.bigmap.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.maxBotCap.enabled)
                                            {
                                                databaseLocations.bigmap.base.AirdropParameters["PlaneAirdropEnd"] = randomRaidTimer * 60 * 0.75;
                                            }

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "factory")
                                        {
                                            databaseLocations.factory4_day.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.factory4_night.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.factory4_day.base.EscapeTimeLimit = randomRaidTimer;
                                            databaseLocations.factory4_night.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "interchange")
                                        {
                                            databaseLocations.interchange.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.interchange.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "labs")
                                        {
                                            databaseLocations.laboratory.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.laboratory.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "lighthouse")
                                        {
                                            databaseLocations.lighthouse.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.lighthouse.base.EscapeTimeLimit = randomRaidTimer;

                                            for (const exfil in databaseLocations.lighthouse.base.exits)
                                            {
                                                if (databaseLocations.lighthouse.base.exits[exfil].Name == "EXFIL_Train")
                                                {
                                                    databaseLocations.lighthouse.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                                    databaseLocations.lighthouse.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                                                }
                                            }

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "reserve")
                                        {
                                            databaseLocations.rezervbase.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.rezervbase.base.EscapeTimeLimit = randomRaidTimer;

                                            for (const exfil in databaseLocations.rezervbase.base.exits)
                                            {
                                                if (databaseLocations.rezervbase.base.exits[exfil].Name == "EXFIL_Train")
                                                {
                                                    databaseLocations.rezervbase.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                                    databaseLocations.rezervbase.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                                                }
                                            }

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "shoreline")
                                        {
                                            databaseLocations.shoreline.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.shoreline.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "streets")
                                        {
                                            databaseLocations.tarkovstreets.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.tarkovstreets.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }

                                        if (location == "woods")
                                        {
                                            databaseLocations.woods.base.exit_access_time = randomRaidTimer + 20;
                                            databaseLocations.woods.base.EscapeTimeLimit = randomRaidTimer;

                                            if (this.config.otherOptions.consoleLogs)
                                            {
                                                this.logger.log(`  > ${location}: ${randomRaidTimer} minutes`, this.logInfo);
                                            }
                                        }
                                    }
                                }

                                // airdrops
                                if (this.config.otherOptions.airdrops.enabled)
                                {
                                    // plane start time
                                    if (this.config.otherOptions.airdrops.startTime.min < 0 || this.config.otherOptions.airdrops.startTime.min > this.config.otherOptions.airdrops.startTime.max)
                                    {
                                        this.config.otherOptions.airdrops.startTime.min = 0;
                                    }

                                    const randomPlaneStartTime = generateRandomInteger(this.config.otherOptions.airdrops.startTime.min, this.config.otherOptions.airdrops.startTime.max);
                                    configsAirdrops.airdropMinStartTimeSeconds = randomPlaneStartTime * 60;
                                    configsAirdrops.airdropMaxStartTimeSeconds = randomPlaneStartTime * 60;

                                    // plane speed
                                    if (this.config.otherOptions.airdrops.plane.speed.min < 50)
                                    {
                                        this.config.otherOptions.airdrops.plane.speed.min = 50;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.speed.max > 120)
                                    {
                                        this.config.otherOptions.airdrops.plane.speed.max = 120;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.speed.min > this.config.otherOptions.airdrops.plane.speed.max)
                                    {
                                        this.config.otherOptions.airdrops.plane.speed.min = 50;
                                        this.config.otherOptions.airdrops.plane.speed.max = 120;
                                    }

                                    const randomPlaneSpeed = generateRandomInteger(this.config.otherOptions.airdrops.plane.speed.min, this.config.otherOptions.airdrops.plane.speed.max);
                                    configsAirdrops.planeSpeed = randomPlaneSpeed;

                                    // plane height
                                    if (this.config.otherOptions.airdrops.plane.height.min < 200)
                                    {
                                        this.config.otherOptions.airdrops.plane.height.min = 200;
                                    }
                                    
                                    if (this.config.otherOptions.airdrops.plane.height.max > 600)
                                    {
                                        this.config.otherOptions.airdrops.plane.height.max = 600;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.height.min > this.config.otherOptions.airdrops.plane.height.max)
                                    {
                                        this.config.otherOptions.airdrops.plane.height.min = 200;
                                        this.config.otherOptions.airdrops.plane.height.max = 600;
                                    }

                                    const randomPlaneHeight = generateRandomInteger(this.config.otherOptions.airdrops.plane.height.min, this.config.otherOptions.airdrops.plane.height.max);
                                    configsAirdrops.planeMinFlyHeight = randomPlaneHeight;
                                    configsAirdrops.planeMaxFlyHeight = randomPlaneHeight;

                                    // plane volume
                                    if (this.config.otherOptions.airdrops.plane.volume.min < 0 || this.config.otherOptions.airdrops.plane.volume.min > this.config.otherOptions.airdrops.plane.volume.max)
                                    {
                                        this.config.otherOptions.airdrops.plane.volume.min = 0;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.volume.max > 100)
                                    {
                                        this.config.otherOptions.airdrops.plane.volume.max = 100;
                                    }

                                    const randomPlaneVolume = generateRandomInteger(this.config.otherOptions.airdrops.plane.volume.min, this.config.otherOptions.airdrops.plane.volume.max);
                                    configsAirdrops.planeVolume = randomPlaneVolume * 0.01;

                                    // crate speed
                                    if (this.config.otherOptions.airdrops.plane.crate.speed.min < 1)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.speed.min = 1;
                                    }
                                    
                                    if (this.config.otherOptions.airdrops.plane.crate.speed.max > 10)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.speed.max = 10;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.crate.speed.min > this.config.otherOptions.airdrops.plane.crate.speed.max)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.speed.min = 1;
                                        this.config.otherOptions.airdrops.plane.crate.speed.max = 10;
                                    }

                                    const randomCrateSpeed = generateRandomInteger(this.config.otherOptions.airdrops.plane.crate.speed.min, this.config.otherOptions.airdrops.plane.crate.speed.max);
                                    configsAirdrops.crateFallSpeed = randomCrateSpeed;

                                    // crate item count
                                    if (this.config.otherOptions.airdrops.plane.crate.items.min < 0)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.items.min = 0;
                                    }
                                    
                                    if (this.config.otherOptions.airdrops.plane.crate.items.max > 35)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.items.max = 35;
                                    }

                                    if (this.config.otherOptions.airdrops.plane.crate.items.min > this.config.otherOptions.airdrops.plane.crate.items.max)
                                    {
                                        this.config.otherOptions.airdrops.plane.crate.items.min = 0;
                                        this.config.otherOptions.airdrops.plane.crate.items.max = 35;
                                    }

                                    const randomCrateItemCount = generateRandomInteger(this.config.otherOptions.airdrops.plane.crate.items.min, this.config.otherOptions.airdrops.plane.crate.items.max);
                                    configsAirdrops.loot.mixed.itemCount.min = randomCrateItemCount;
                                    configsAirdrops.loot.mixed.itemCount.max = randomCrateItemCount;

                                    // dynamic planes
                                    if (this.config.otherOptions.airdrops.plane.dynamic)
                                    {
                                        const planeHeightMaxMin25 = (this.config.otherOptions.airdrops.plane.height.min + ((this.config.otherOptions.airdrops.plane.height.max - this.config.otherOptions.airdrops.plane.height.min) * 0.25));
                                        const planeHeightMaxMin50 = (this.config.otherOptions.airdrops.plane.height.min + ((this.config.otherOptions.airdrops.plane.height.max - this.config.otherOptions.airdrops.plane.height.min) * 0.5));
                                        const planeHeightMaxMin75 = (this.config.otherOptions.airdrops.plane.height.min + ((this.config.otherOptions.airdrops.plane.height.max - this.config.otherOptions.airdrops.plane.height.min) * 0.75));
                                        const planeVolumeMaxMin25 = (this.config.otherOptions.airdrops.plane.volume.min + ((this.config.otherOptions.airdrops.plane.volume.max - this.config.otherOptions.airdrops.plane.volume.min) * 0.25));
                                        const planeVolumeMaxMin50 = (this.config.otherOptions.airdrops.plane.volume.min + ((this.config.otherOptions.airdrops.plane.volume.max - this.config.otherOptions.airdrops.plane.volume.min) * 0.5));
                                        const planeVolumeMaxMin75 = (this.config.otherOptions.airdrops.plane.volume.min + ((this.config.otherOptions.airdrops.plane.volume.max - this.config.otherOptions.airdrops.plane.volume.min) * 0.75));
                                        const planeSpeedMaxMin25 = (this.config.otherOptions.airdrops.plane.speed.min + ((this.config.otherOptions.airdrops.plane.speed.max - this.config.otherOptions.airdrops.plane.speed.min) * 0.25));
                                        const planeSpeedMaxMin50 = (this.config.otherOptions.airdrops.plane.speed.min + ((this.config.otherOptions.airdrops.plane.speed.max - this.config.otherOptions.airdrops.plane.speed.min) * 0.5));
                                        const planeSpeedMaxMin75 = (this.config.otherOptions.airdrops.plane.speed.min + ((this.config.otherOptions.airdrops.plane.speed.max - this.config.otherOptions.airdrops.plane.speed.min) * 0.75));
                                        const planeCrateSpeedMaxMin25 = (this.config.otherOptions.airdrops.plane.crate.speed.min + ((this.config.otherOptions.airdrops.plane.crate.speed.max - this.config.otherOptions.airdrops.plane.crate.speed.min) * 0.25));
                                        const planeCrateSpeedMaxMin50 = (this.config.otherOptions.airdrops.plane.crate.speed.min + ((this.config.otherOptions.airdrops.plane.crate.speed.max - this.config.otherOptions.airdrops.plane.crate.speed.min) * 0.5));
                                        const planeCrateSpeedMaxMin75 = (this.config.otherOptions.airdrops.plane.crate.speed.min + ((this.config.otherOptions.airdrops.plane.crate.speed.max - this.config.otherOptions.airdrops.plane.crate.speed.min) * 0.75));
                                        const planeCrateItemCountMaxMin25 = (this.config.otherOptions.airdrops.plane.crate.items.min + ((this.config.otherOptions.airdrops.plane.crate.items.max - this.config.otherOptions.airdrops.plane.crate.items.min) * 0.25));
                                        const planeCrateItemCountMaxMin50 = (this.config.otherOptions.airdrops.plane.crate.items.min + ((this.config.otherOptions.airdrops.plane.crate.items.max - this.config.otherOptions.airdrops.plane.crate.items.min) * 0.5));
                                        const planeCrateItemCountMaxMin75 = (this.config.otherOptions.airdrops.plane.crate.items.min + ((this.config.otherOptions.airdrops.plane.crate.items.max - this.config.otherOptions.airdrops.plane.crate.items.min) * 0.75));

                                        if (randomPlaneHeight >= this.config.otherOptions.airdrops.plane.height.min && randomPlaneHeight <= planeHeightMaxMin25)
                                        {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin75, this.config.otherOptions.airdrops.plane.volume.max)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin75, this.config.otherOptions.airdrops.plane.speed.max));
                                        }
                                        
                                        if (randomPlaneHeight > planeHeightMaxMin25 && randomPlaneHeight <= planeHeightMaxMin50)
                                        {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin50, planeVolumeMaxMin75)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin50, planeSpeedMaxMin75));
                                        }
                                        
                                        if (randomPlaneHeight > planeHeightMaxMin50 && randomPlaneHeight <= planeHeightMaxMin75)
                                        {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(planeVolumeMaxMin25, planeVolumeMaxMin50)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(planeSpeedMaxMin25, planeSpeedMaxMin50));
                                        }

                                        if (randomPlaneHeight > planeHeightMaxMin75 && randomPlaneHeight <= this.config.otherOptions.airdrops.plane.height.max)
                                        {
                                            configsAirdrops.planeVolume = Math.round(generateRandomInteger(this.config.otherOptions.airdrops.plane.volume.min, planeVolumeMaxMin25)) * 0.01;
                                            configsAirdrops.planeSpeed = Math.round(generateRandomInteger(this.config.otherOptions.airdrops.plane.volume.min, planeSpeedMaxMin25));
                                        }

                                        if (randomCrateItemCount >= this.config.otherOptions.airdrops.plane.crate.items.min && randomCrateItemCount <= planeCrateItemCountMaxMin25)
                                        {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(this.config.otherOptions.airdrops.plane.crate.speed.min, planeCrateSpeedMaxMin25));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin25 && randomCrateItemCount <= planeCrateItemCountMaxMin50)
                                        {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin25, planeCrateSpeedMaxMin50));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin50 && randomCrateItemCount <= planeCrateItemCountMaxMin75)
                                        {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin50, planeCrateSpeedMaxMin75));
                                        }

                                        if (randomCrateItemCount > planeCrateItemCountMaxMin75 && randomCrateItemCount <= this.config.otherOptions.airdrops.plane.crate.items.max)
                                        {
                                            configsAirdrops.crateFallSpeed = Math.round(generateRandomInteger(planeCrateSpeedMaxMin75, this.config.otherOptions.airdrops.plane.crate.speed.max));
                                        }
                                    }

                                    // airdrop chance
                                    for (const locations in this.locationArray)
                                    {
                                        const location = this.locationArray[locations];

                                        if (location == "customs")
                                        {
                                            configsAirdrops.airdropChancePercent.bigmap = this.config.otherOptions.airdrops.chance[location];
                                        }
                                        
                                        if (location == "streets")
                                        {
                                            configsAirdrops.airdropChancePercent.tarkovStreets = this.config.otherOptions.airdrops.chance[location];
                                        }

                                        if (location == "interchange" || location == "lighthouse" || location == "reserve" || location == "shoreline" || location == "woods")
                                        {
                                            configsAirdrops.airdropChancePercent[location] = this.config.otherOptions.airdrops.chance[location];
                                        }
                                    }

                                    // extend plane airdrop end time based on the raid timer
                                    if (this.config.otherOptions.raidTimer.enabled)
                                    {
                                        for (const altLocations in this.altLocationArray)
                                        {
                                            const altLocation = this.altLocationArray[altLocations];

                                            if (altLocation != "factory4_day" && altLocation != "factory4_night" && altLocation != "laboratory")
                                            {
                                                databaseLocations[altLocation].base.AirdropParameters["PlaneAirdropEnd"] = databaseLocations[altLocation].base.EscapeTimeLimit * 60 * 0.75;
                                            }
                                        }
                                    }

                                    if (this.config.otherOptions.consoleLogs)
                                    {
                                        this.logger.log(" > [airdrops]", this.logInfo);
                                        this.logger.log(`  > start time: ${configsAirdrops.airdropMinStartTimeSeconds / 60} minutes`, this.logInfo);

                                        if (this.config.otherOptions.airdrops.plane.dynamic)
                                        {
                                            this.logger.log("  > dynamic airdrops enabled", this.logInfo);
                                        }
                                        else
                                        {
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
                            if (this.config.betterSpawnsPlus.enabled)
                            {
                                for (const locations in this.locationArray)
                                {
                                    const location = this.locationArray[locations];
                                    if (this.config.betterSpawnsPlus.locations[location].consoleLogs)
                                    {
                                        this.logger.log("> [better spawns plus]: logs", this.logInfo);
                                        break;
                                    }
                                }

                                const importInitFile = require("../db/locations/init.json");

                                for (const zone in this.openZones)
                                {
                                    databaseLocations[zone].base.OpenZones = this.openZones[zone];
                                }

                                configsInraids.raidMenuSettings.bossEnabled = true;

                                this.enemyTypeArray.forEach(function(type)
                                {
                                    configsBots.pmc.convertIntoPmcChance[type].min = 0;
                                    configsBots.pmc.convertIntoPmcChance[type].max = 0;
                                });

                                for (const locations in this.locationArray)
                                {
                                    const location = this.locationArray[locations];
                                    const initSpawns = importInitFile[location];
                                    const mainSpawnSystemArray = generateWeightArray(this.config.betterSpawnsPlus.locations[location].main.presets);
                                    const generatorSpawnSystemArray = generateWeightArray(this.config.betterSpawnsPlus.locations[location].spawnGenerator.presets);
                                    const randomMainPreset = Math.floor(Math.random() * mainSpawnSystemArray.length);
                                    const randomGeneratorPreset = Math.floor(Math.random() * generatorSpawnSystemArray.length);
                                    let countBears = 0, countUsecs = 0, countScavs = 0, countSniperScavs = 0;
                                    let countBosses = 0, countCultists = 0, countRaiders = 0, countRogues = 0;
                                    let countAddBear = 0, countAddUsec = 0, countAddScav = 0, countAddSniperScav = 0;
                                    let countAddBoss = 0, countAddCultist = 0, countAddRaider = 0, countAddRogue = 0;
                                    let countRandomChanceToDisableMainPreset = 0;

                                    if (location == "customs")
                                    {
                                        databaseLocations.bigmap.base.waves = [];
                                        databaseLocations.bigmap.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "factory")
                                    {
                                        databaseLocations.factory4_day.base.waves = [];
                                        databaseLocations.factory4_night.base.waves = [];
                                        databaseLocations.factory4_day.base.BossLocationSpawn = initSpawns;
                                        databaseLocations.factory4_night.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "interchange" || location == "lighthouse" || location == "shoreline" || location == "woods")
                                    {
                                        databaseLocations[location].base.waves = [];
                                        databaseLocations[location].base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "labs")
                                    {
                                        databaseLocations.laboratory.base.waves = [];
                                        databaseLocations.laboratory.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "reserve")
                                    {
                                        databaseLocations.rezervbase.base.waves = [];
                                        databaseLocations.rezervbase.base.BossLocationSpawn = initSpawns;
                                    }

                                    if (location == "streets")
                                    {
                                        databaseLocations.tarkovstreets.base.waves = [];
                                        databaseLocations.tarkovstreets.base.BossLocationSpawn = initSpawns;
                                    }

                                    // generator spawn system
                                    if (this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled)
                                    {
                                        if (generatorSpawnSystemArray.length != 0)
                                        {
                                            const importPresetFile = require(`../db/locations/${location}/spawnGenerator/presets/${generatorSpawnSystemArray[randomGeneratorPreset]}.${"json"}`);
                                            const addPmcs = importPresetFile[location].pmcs;
                                            const addScavs = importPresetFile[location].scavs;
                                            const addSniperScavs = importPresetFile[location].sniperScavs;
                                            const addBosses = importPresetFile[location].bosses;
                                            const addCultists = importPresetFile[location].cultists;
                                            const addRaiders = importPresetFile[location].raiders;
                                            const addRogues = importPresetFile[location].rogues;
                                            let chanceToDisable = 0;
                                            
                                            if (!importPresetFile.enableMainPresets && this.config.betterSpawnsPlus.locations[location].main.enabled)
                                            {
                                                chanceToDisable = generateRandomInteger(1,2);
                                            }

                                            if (chanceToDisable == 1)
                                            {
                                                countRandomChanceToDisableMainPreset++;
                                            }
                                            else
                                            {
                                                if (chanceToDisable == 2)
                                                {
                                                    countRandomChanceToDisableMainPreset++;
                                                    countRandomChanceToDisableMainPreset++;
                                                }

                                                // pmcs
                                                if (addPmcs.enabled && checkProperties(addPmcs.botType) && checkProperties(addPmcs.botDifficulty) && checkProperties(addPmcs.botChance) 
                                                && (addPmcs.spawnWaves.initial.waves !== 0 || addPmcs.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addPmcs.openZones))
                                                    {
                                                        for (const zone in addPmcs.openZones)
                                                        {
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

                                                    for (let i = 0; i < addPmcs.spawnWaves.initial.waves + addPmcs.spawnWaves.interval.waves; i++)
                                                    {
                                                        const randomAmount = generateRandomNumberFromSequence(addPmcs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addPmcs.spawnWaves.spawnDelay.min, addPmcs.spawnWaves.spawnDelay.max);

                                                        if (addPmcs.botChance.min < 0 || addPmcs.botChance.min > 100)
                                                        {
                                                            addPmcs.botChance.min = 0;
                                                        }
                                                        else if (addPmcs.botChance.max < 0 || addPmcs.botChance.max > 100)
                                                        {
                                                            addPmcs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addPmcs.botChance.min, addPmcs.botChance.max);
                                                        
                                                        if (i < Math.abs(addPmcs.spawnWaves.initial.waves - addPmcs.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addPmcs.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addPmcs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addPmcs.botDifficulty);
                                                        }

                                                        if (typeArray.length == 0)
                                                        {
                                                            typeArray = generateWeightArray(addPmcs.botType);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        let randomType = removeElementFromWeightArray(typeArray);

                                                        if (randomType == "bear")
                                                        {
                                                            randomType = "sptBear";
                                                            countAddBear++;
                                                        }
                                                        else
                                                        {
                                                            randomType = "sptUsec";
                                                            countAddUsec++;
                                                        }
                                                        
                                                        if (location == "labs")
                                                        {
                                                            initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, -1, null, "", "", randomTime + timeInterval));
                                                        }
                                                        else
                                                        {
                                                            initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                        }

                                                        if (countInterval == addPmcs.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // scavs
                                                if (addScavs.enabled && checkProperties(addScavs.botDifficulty) && checkProperties(addScavs.botChance) 
                                                && (addScavs.spawnWaves.initial.waves !== 0 || addScavs.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addScavs.openZones))
                                                    {
                                                        for (const zone in addScavs.openZones)
                                                        {
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

                                                    for (let i = 0; i < addScavs.spawnWaves.initial.waves + addScavs.spawnWaves.interval.waves; i++)
                                                    {
                                                        const randomAmount = generateRandomNumberFromSequence(addScavs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addScavs.spawnWaves.spawnDelay.min, addScavs.spawnWaves.spawnDelay.max);

                                                        if (addScavs.botChance.min < 0 || addScavs.botChance.min > 100)
                                                        {
                                                            addScavs.botChance.min = 0;
                                                        }
                                                        else if (addScavs.botChance.max < 0 || addScavs.botChance.max > 100)
                                                        {
                                                            addScavs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addScavs.botChance.min, addScavs.botChance.max);
                                                        
                                                        if (i < Math.abs(addScavs.spawnWaves.initial.waves - addScavs.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addScavs.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addScavs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addScavs.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddScav++;
                                                        initSpawns.push(this.generateBot("assault", randomChance, randomZone, randomDifficulty, "assault", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addScavs.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // sniper scavs
                                                if (addSniperScavs.enabled && checkProperties(addSniperScavs.botDifficulty) && checkProperties(addSniperScavs.botChance) 
                                                && (addSniperScavs.spawnWaves.initial.waves !== 0 || addSniperScavs.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addSniperScavs.openZones))
                                                    {
                                                        for (const zone in addSniperScavs.openZones)
                                                        {
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

                                                    for (let i = 0; i < addSniperScavs.spawnWaves.initial.waves + addSniperScavs.spawnWaves.interval.waves; i++)
                                                    {
                                                        const randomAmount = generateRandomNumberFromSequence(addSniperScavs.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addSniperScavs.spawnWaves.spawnDelay.min, addSniperScavs.spawnWaves.spawnDelay.max);

                                                        if (addSniperScavs.botChance.min < 0 || addSniperScavs.botChance.min > 100)
                                                        {
                                                            addSniperScavs.botChance.min = 0;
                                                        }
                                                        else if (addSniperScavs.botChance.max < 0 || addSniperScavs.botChance.max > 100)
                                                        {
                                                            addSniperScavs.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addSniperScavs.botChance.min, addSniperScavs.botChance.max);
                                                        
                                                        if (i < Math.abs(addSniperScavs.spawnWaves.initial.waves - addSniperScavs.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addSniperScavs.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addSniperScavs.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addSniperScavs.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddSniperScav++;
                                                        initSpawns.push(this.generateBot("marksman", randomChance, randomZone, randomDifficulty, "marksman", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addSniperScavs.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // bosses
                                                if (addBosses.enabled && checkProperties(addBosses.botType) && checkProperties(addBosses.botDifficulty) && checkProperties(addBosses.botChance) 
                                                && (addBosses.spawnWaves.initial.waves !== 0 || addBosses.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addBosses.openZones))
                                                    {
                                                        for (const zone in addBosses.openZones)
                                                        {
                                                            addBosses.openZones[zone] = 1;
                                                        }

                                                        if (!addBosses.onlyVanillaOpenZones)
                                                        {
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

                                                    for (let i = 0; i < addBosses.spawnWaves.initial.waves + addBosses.spawnWaves.interval.waves; i++)
                                                    {
                                                        let randomTime = generateRandomInteger(addBosses.spawnWaves.spawnDelay.min, addBosses.spawnWaves.spawnDelay.max);

                                                        if (addBosses.botChance.min < 0 || addBosses.botChance.min > 100)
                                                        {
                                                            addBosses.botChance.min = 0;
                                                        }
                                                        else if (addBosses.botChance.max < 0 || addBosses.botChance.max > 100)
                                                        {
                                                            addBosses.botChance.max = 100;
                                                        }

                                                        let randomChance = generateRandomInteger(addBosses.botChance.min, addBosses.botChance.max);
                                                        
                                                        if (i < Math.abs(addBosses.spawnWaves.initial.waves - addBosses.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addBosses.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime == 0)
                                                        {
                                                            randomTime = -1;
                                                        }
                                                        else if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addBosses.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addBosses.botDifficulty);
                                                        }

                                                        if (typeArray.length == 0)
                                                        {
                                                            typeArray = generateWeightArray(addBosses.botType);
                                                        }

                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        let randomZone = removeElementFromWeightArray(zoneArray);
                                                        let randomType = removeElementFromWeightArray(typeArray);

                                                        if (randomType == "glukhar")
                                                        {
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

                                                            if (addBosses.onlyVanillaOpenZones && location == "reserve")
                                                            {
                                                                const glukharOpenZones = ["ZoneRailStrorage","ZoneRailStrorage","ZoneRailStrorage","ZonePTOR1","ZonePTOR2","ZoneBarrack","ZoneBarrack","ZoneBarrack","ZoneSubStorage"];
                                                                const randomGlukharZone = glukharOpenZones[Math.floor(Math.random() * glukharOpenZones.length)];
                                                                randomZone = randomGlukharZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "streets")
                                                            {
                                                                randomZone = "ZoneCarShowroom";
                                                                supports[2].BossEscortAmount = "1";
                                                            }
                                                        }
                                                        else if (randomType == "killa")
                                                        {
                                                            randomType = "bossKilla";
                                                            supportType = "followerTagilla";
                                                            supportAmount = "0";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "interchange")
                                                            {
                                                                const killaOpenZones = ["ZoneCenterBot","ZoneCenter","ZoneOLI","ZoneIDEA","ZoneGoshan","ZoneIDEAPark","ZoneOLIPark"];
                                                                const randomKillaZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                                                                randomZone = randomKillaZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "streets")
                                                            {
                                                                const killaOpenZones = ["ZoneHotel_1","ZoneHotel_2"];
                                                                const randomKillaZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                                                                randomZone = randomKillaZone;
                                                            }
                                                        }
                                                        else if (randomType == "knight")
                                                        {
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

                                                            if (addBosses.onlyVanillaOpenZones && location == "customs")
                                                            {
                                                                randomZone = "ZoneScavBase";
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "lighthouse")
                                                            {
                                                                const knightOpenZones = ["Zone_TreatmentContainers","Zone_Chalet"];
                                                                const randomKnightZone = knightOpenZones[Math.floor(Math.random() * knightOpenZones.length)];
                                                                randomZone = randomKnightZone;
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "shoreline")
                                                            {
                                                                randomZone = "ZoneMeteoStation";
                                                            }

                                                            if (addBosses.onlyVanillaOpenZones && location == "woods")
                                                            {
                                                                randomZone = "ZoneScavBase2";
                                                            }
                                                        }
                                                        else if (randomType == "reshala")
                                                        {
                                                            randomType = "bossBully";
                                                            supportType = "followerBully";
                                                            supportAmount = "4";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "customs")
                                                            {
                                                                const reshalaOpenZones = ["ZoneDormitory","ZoneGasStation"];
                                                                const randomReshalaZone = reshalaOpenZones[Math.floor(Math.random() * reshalaOpenZones.length)];
                                                                randomZone = randomReshalaZone;
                                                            }
                                                        }
                                                        else if (randomType == "sanitar")
                                                        {
                                                            randomType = "bossSanitar";
                                                            supportType = "followerSanitar";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "shoreline")
                                                            {
                                                                const sanitarOpenZones = ["ZonePort","ZoneGreenHouses","ZoneSanatorium1","ZoneGreenHouses","ZoneSanatorium2"];
                                                                const randomSanitarZone = sanitarOpenZones[Math.floor(Math.random() * sanitarOpenZones.length)];
                                                                randomZone = randomSanitarZone;
                                                            }
                                                        }
                                                        else if (randomType == "shturman")
                                                        {
                                                            randomType = "bossKojaniy";
                                                            supportType = "followerKojaniy";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "woods")
                                                            {
                                                                randomZone = "ZoneWoodCutter";
                                                            }
                                                        }
                                                        else if (randomType == "tagilla")
                                                        {
                                                            randomType = "bossTagilla";
                                                            supportType = "followerBully";
                                                            supportAmount = "0";
                                                            supports = null;
                                                        }
                                                        else if (randomType == "zryachiy")
                                                        {
                                                            randomType = "bossZryachiy";
                                                            supportType = "followerZryachiy";
                                                            supportAmount = "2";
                                                            supports = null;

                                                            if (addBosses.onlyVanillaOpenZones && location == "lighthouse")
                                                            {
                                                                randomZone = "Zone_Island";
                                                                randomChance = 100;
                                                            }
                                                        }

                                                        countAddBoss++;
                                                        initSpawns.push(this.generateBot(randomType, randomChance, randomZone, randomDifficulty, supportType, supportAmount, randomTime + timeInterval, supports, "", "", 0));

                                                        if (countInterval == addBosses.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // cultists
                                                if (addCultists.enabled && checkProperties(addCultists.botDifficulty) && checkProperties(addCultists.botChance) 
                                                && (addCultists.spawnWaves.initial.waves !== 0 || addCultists.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addCultists.openZones))
                                                    {
                                                        for (const zone in addCultists.openZones)
                                                        {
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

                                                    for (let i = 0; i < addCultists.spawnWaves.initial.waves + addCultists.spawnWaves.interval.waves; i++)
                                                    {
                                                        const randomAmount = generateRandomNumberFromSequence(addCultists.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addCultists.spawnWaves.spawnDelay.min, addCultists.spawnWaves.spawnDelay.max);

                                                        if (addCultists.botChance.min < 0 || addCultists.botChance.min > 100)
                                                        {
                                                            addCultists.botChance.min = 0;
                                                        }
                                                        else if (addCultists.botChance.max < 0 || addCultists.botChance.max > 100)
                                                        {
                                                            addCultists.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addCultists.botChance.min, addCultists.botChance.max);
                                                        
                                                        if (i < Math.abs(addCultists.spawnWaves.initial.waves - addCultists.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addCultists.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addCultists.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addCultists.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddCultist++;

                                                        if (location == "shoreline")
                                                        {
                                                            if (addCultists.onlyVanillaOpenZones)
                                                            {
                                                                const zoneArr1 = ["ZoneSanatorium1","ZoneSanatorium2"];
                                                                const newZone1 = zoneArr1[Math.floor(Math.random() * zoneArr1.length)];

                                                                const zoneArr2 = ["ZoneForestGasStation","ZoneForestSpawn"];
                                                                const newZone2 = zoneArr2[Math.floor(Math.random() * zoneArr2.length)];

                                                                if (randomZone == "ZoneForestGasStation" || randomZone == "ZoneForestSpawn")
                                                                {
                                                                    if (countOpenZone1 > 0)
                                                                    {
                                                                        countOpenZone1--;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, newZone1, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                    else
                                                                    {
                                                                        countOpenZone1++;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    if (countOpenZone2 > 0)
                                                                    {
                                                                        countOpenZone2--;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, newZone2, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                    else
                                                                    {
                                                                        countOpenZone2++;
                                                                        initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        else
                                                        {
                                                            initSpawns.push(this.generateBot("sectantPriest", randomChance, randomZone, randomDifficulty, "sectantWarrior", randomAmount, randomTime + timeInterval, null, "", "", 0));
                                                        }

                                                        if (countInterval == addCultists.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }

                                                // raiders
                                                if (addRaiders.enabled && checkProperties(addRaiders.botDifficulty) && checkProperties(addRaiders.botChance) 
                                                && (addRaiders.spawnWaves.initial.waves !== 0 || addRaiders.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addRaiders.openZones))
                                                    {
                                                        for (const zone in addRaiders.openZones)
                                                        {
                                                            addRaiders.openZones[zone] = 1;
                                                        }

                                                        this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${generatorSpawnSystemArray[randomGeneratorPreset]}" for raiders on location [${location}]`, this.logError);
                                                        this.logger.log(`> reverted to all open zones being available for raiders on [${location}]`, this.logError);
                                                    }

                                                    if (location == "labs")
                                                    {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                        const triggerIdArray = generateWeightArray(addRaiders.triggers);
                                                        let triggerName = "interactObject";
                                                        let countTriggerZoneGate1 = 0;
                                                        let countTriggerZoneGate2 = 0;

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++)
                                                        {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);
                                                            let delayTime = randomTime + timeInterval;

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100)
                                                            {
                                                                addRaiders.botChance.min = 0;
                                                            }
                                                            else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100)
                                                            {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval))
                                                            {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            }
                                                            else
                                                            {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0)
                                                            {
                                                                randomTime = 0;
                                                                delayTime = 0;
                                                            }

                                                            if (zoneArray.length == 0)
                                                            {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0)
                                                            {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            let randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            let randomTrigger = removeElementFromWeightArray(triggerIdArray);

                                                            countAddRaider++;

                                                            if (addRaiders.onlyVanillaOpenZones)
                                                            {
                                                                const newArr = ["BotZoneBasement","BotZoneFloor1","BotZoneFloor2"];
                                                                const newRand = newArr[Math.floor(Math.random() * newArr.length)];

                                                                if (randomTrigger == "autoId_00008_EXFIL" || randomTrigger == "autoId_00010_EXFIL")
                                                                {
                                                                    randomZone = "BotZoneBasement";
                                                                }
                                                                
                                                                if (randomZone == "BotZoneGate1")
                                                                {
                                                                    if (countTriggerZoneGate1 >= 1)
                                                                    {
                                                                        randomZone = newRand;
                                                                    }
                                                                    else
                                                                    {
                                                                        delete addRaiders.openZones["BotZoneGate1"];
                                                                        randomTrigger = "autoId_00632_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 8;
                                                                    }

                                                                    countTriggerZoneGate1++;
                                                                }
                                                                
                                                                if (randomZone == "BotZoneGate2")
                                                                {
                                                                    if (countTriggerZoneGate2 >= 1)
                                                                    {
                                                                        randomZone = newRand;
                                                                    }
                                                                    else
                                                                    {
                                                                        delete addRaiders.openZones["BotZoneGate2"];
                                                                        randomTrigger = "autoId_00014_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 8;
                                                                    }

                                                                    countTriggerZoneGate2++;
                                                                }

                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, delayTime));
                                                            }
                                                            else
                                                            {
                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, 0));
                                                            }

                                                            if (triggerIdArray.length == 0)
                                                            {
                                                                randomTrigger = "";
                                                                triggerName = "";
                                                            }

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval)
                                                            {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        }
                                                    }

                                                    if (location == "reserve")
                                                    {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                        const triggerIdArray = generateWeightArray(addRaiders.triggers);
                                                        let triggerName = "interactObject";
                                                        let countTriggerZone1 = 0;
                                                        let countTriggerZone2 = 0;

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++)
                                                        {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);
                                                            let delayTime = randomTime + timeInterval;

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100)
                                                            {
                                                                addRaiders.botChance.min = 0;
                                                            }
                                                            else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100)
                                                            {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval))
                                                            {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            }
                                                            else
                                                            {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0)
                                                            {
                                                                randomTime = 0;
                                                                delayTime = 0;
                                                            }

                                                            if (zoneArray.length == 0)
                                                            {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0)
                                                            {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            const randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            let randomTrigger = removeElementFromWeightArray(triggerIdArray);

                                                            countAddRaider++;

                                                            if (addRaiders.onlyVanillaOpenZones)
                                                            {
                                                                if (randomZone == "ZoneRailStrorage")
                                                                {
                                                                    if (countTriggerZone1 == 0)
                                                                    {
                                                                        randomTrigger = "autoId_00632_EXFIL";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                        countTriggerZone1++;
                                                                    }
                                                                    else
                                                                    {
                                                                        randomTrigger = "";
                                                                        triggerName = "";
                                                                        randomTime = addRaiders.spawnWaves.interval.time + randomTime;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                    }
                                                                }
                                                                
                                                                if (randomZone == "ZoneSubCommand")
                                                                {
                                                                    if (countTriggerZone2 == 0)
                                                                    {
                                                                        randomTrigger = "autoId_00000_D2_LEVER";
                                                                        randomTime = -1;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                        countTriggerZone2++;
                                                                    }
                                                                    else
                                                                    {
                                                                        randomTrigger = "raider_simple_patroling";
                                                                        randomTime = 3;
                                                                        timeInterval = 0;
                                                                        delayTime = 0;
                                                                    }
                                                                }

                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, delayTime));
                                                            }
                                                            else
                                                            {
                                                                initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, 0));
                                                            }

                                                            if (triggerIdArray.length == 0)
                                                            {
                                                                randomTrigger = "";
                                                                triggerName = "";
                                                            }

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval)
                                                            {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        }
                                                    }
                                                    
                                                    if (location != "labs" && location != "reserve")
                                                    {
                                                        let timeInterval = addRaiders.spawnWaves.interval.time;
                                                        const addTimeInterval = timeInterval;
                                                        let countInterval = 0;
                                                        let zoneArray = generateWeightArray(addRaiders.openZones);
                                                        let difficultyArray = generateWeightArray(addRaiders.botDifficulty);

                                                        for (let i = 0; i < addRaiders.spawnWaves.initial.waves + addRaiders.spawnWaves.interval.waves; i++)
                                                        {
                                                            const randomAmount = generateRandomNumberFromSequence(addRaiders.botAmountPerSpawnWave);
                                                            let randomTime = generateRandomInteger(addRaiders.spawnWaves.spawnDelay.min, addRaiders.spawnWaves.spawnDelay.max);

                                                            if (addRaiders.botChance.min < 0 || addRaiders.botChance.min > 100)
                                                            {
                                                                addRaiders.botChance.min = 0;
                                                            }
                                                            else if (addRaiders.botChance.max < 0 || addRaiders.botChance.max > 100)
                                                            {
                                                                addRaiders.botChance.max = 100;
                                                            }

                                                            const randomChance = generateRandomInteger(addRaiders.botChance.min, addRaiders.botChance.max);
                                                            
                                                            if (i < Math.abs(addRaiders.spawnWaves.initial.waves - addRaiders.spawnWaves.interval.wavesPerInterval))
                                                            {
                                                                timeInterval = addRaiders.spawnWaves.initial.time;
                                                            }
                                                            else
                                                            {
                                                                countInterval++;
                                                            }

                                                            if (randomTime + timeInterval < 0)
                                                            {
                                                                randomTime = 0;
                                                            }

                                                            if (zoneArray.length == 0)
                                                            {
                                                                zoneArray = generateWeightArray(addRaiders.openZones);
                                                            }

                                                            if (difficultyArray.length == 0)
                                                            {
                                                                difficultyArray = generateWeightArray(addRaiders.botDifficulty);
                                                            }

                                                            const randomZone = removeElementFromWeightArray(zoneArray);
                                                            const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                            
                                                            countAddRaider++;
                                                            initSpawns.push(this.generateBot("pmcBot", randomChance, randomZone, randomDifficulty, "pmcBot", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                            if (countInterval == addRaiders.spawnWaves.interval.wavesPerInterval)
                                                            {
                                                                timeInterval += addTimeInterval;
                                                                countInterval = 0;
                                                            }
                                                        } 
                                                    }
                                                }
                                                
                                                // rogues
                                                if (addRogues.enabled && checkProperties(addRogues.botDifficulty) && checkProperties(addRogues.botChance) 
                                                && (addRogues.spawnWaves.initial.waves !== 0 || addRogues.spawnWaves.interval.waves !== 0))
                                                {
                                                    if (!checkProperties(addRogues.openZones))
                                                    {
                                                        for (const zone in addRogues.openZones)
                                                        {
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

                                                    for (let i = 0; i < addRogues.spawnWaves.initial.waves + addRogues.spawnWaves.interval.waves; i++)
                                                    {
                                                        const randomAmount = generateRandomNumberFromSequence(addRogues.botAmountPerSpawnWave);
                                                        let randomTime = generateRandomInteger(addRogues.spawnWaves.spawnDelay.min, addRogues.spawnWaves.spawnDelay.max);

                                                        if (addRogues.botChance.min < 0 || addRogues.botChance.min > 100)
                                                        {
                                                            addRogues.botChance.min = 0;
                                                        }
                                                        else if (addRogues.botChance.max < 0 || addRogues.botChance.max > 100)
                                                        {
                                                            addRogues.botChance.max = 100;
                                                        }

                                                        const randomChance = generateRandomInteger(addRogues.botChance.min, addRogues.botChance.max);
                                                        
                                                        if (i < Math.abs(addRogues.spawnWaves.initial.waves - addRogues.spawnWaves.interval.wavesPerInterval))
                                                        {
                                                            timeInterval = addRogues.spawnWaves.initial.time;
                                                        }
                                                        else
                                                        {
                                                            countInterval++;
                                                        }

                                                        if (randomTime + timeInterval < 0)
                                                        {
                                                            randomTime = 0;
                                                        }

                                                        if (zoneArray.length == 0)
                                                        {
                                                            zoneArray = generateWeightArray(addRogues.openZones);
                                                        }

                                                        if (difficultyArray.length == 0)
                                                        {
                                                            difficultyArray = generateWeightArray(addRogues.botDifficulty);
                                                        }

                                                        const randomZone = removeElementFromWeightArray(zoneArray);
                                                        const randomDifficulty = removeElementFromWeightArray(difficultyArray);
                                                        
                                                        countAddRogue++;
                                                        initSpawns.push(this.generateBot("exUsec", randomChance, randomZone, randomDifficulty, "exUsec", randomAmount, randomTime + timeInterval, null, "", "", 0));

                                                        if (countInterval == addRogues.spawnWaves.interval.wavesPerInterval)
                                                        {
                                                            timeInterval += addTimeInterval;
                                                            countInterval = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {
                                            this.logger.log(`Mod: ${pkg.name} failed to load a spawn preset from "config.json" for location [${location}]`, this.logError);
                                            this.logger.log(`> reverted location [${location}] to default sp-tarkov spawn waves`, this.logError);
                                        }
                                    }

                                    // main spawn system
                                    if (mainSpawnSystemArray.length != 0)
                                    {
                                        const importMainFile = require(`../db/locations/${location}/main/presets/${mainSpawnSystemArray[randomMainPreset]}.${"json"}`);
                                        
                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && countRandomChanceToDisableMainPreset <= 1)
                                        {
                                            if (location != "labs")
                                            {
                                                for (const pmc in importMainFile.pmcs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.pmcs.difficulty);
                                                        importMainFile.pmcs[pmc].Time = importMainFile.pmcs[pmc].Time + generateRandomInteger(importMainFile.randomize.pmcs.spawnDelay.min, importMainFile.randomize.pmcs.spawnDelay.max);
                                                        importMainFile.pmcs[pmc].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.pmcs[pmc].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.pmcs[pmc].Time < 0 && importMainFile.pmcs[pmc].Time != -1)
                                                        {
                                                            importMainFile.pmcs[pmc].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.pmcs[pmc]);
                                                }

                                                for (const scav in importMainFile.scavs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.scavs.difficulty);
                                                        importMainFile.scavs[scav].Time = importMainFile.scavs[scav].Time + generateRandomInteger(importMainFile.randomize.scavs.spawnDelay.min, importMainFile.randomize.scavs.spawnDelay.max);
                                                        importMainFile.scavs[scav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.scavs[scav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.scavs[scav].Time < 0 && importMainFile.scavs[scav].Time != -1)
                                                        {
                                                            importMainFile.scavs[scav].Time = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.scavs[scav]);
                                                }

                                                for (const sniperScav in importMainFile.sniperScavs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.sniperScavs.difficulty);
                                                        importMainFile.sniperScavs[sniperScav].Time = importMainFile.sniperScavs[sniperScav].Time + generateRandomInteger(importMainFile.randomize.sniperScavs.spawnDelay.min, importMainFile.randomize.sniperScavs.spawnDelay.max);
                                                        importMainFile.sniperScavs[sniperScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.sniperScavs[sniperScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.sniperScavs[sniperScav].Time < 0 && importMainFile.sniperScavs[sniperScav].Time != -1)
                                                        {
                                                            importMainFile.sniperScavs[sniperScav].Time = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.sniperScavs[sniperScav]);
                                                }

                                                for (const boss in importMainFile.bosses)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bosses.difficulty);
                                                        importMainFile.bosses[boss].Time = importMainFile.bosses[boss].Time + generateRandomInteger(importMainFile.randomize.bosses.spawnDelay.min, importMainFile.randomize.bosses.spawnDelay.max);
                                                        importMainFile.bosses[boss].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bosses[boss].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bosses[boss].Time < 0 && importMainFile.bosses[boss].Time != -1)
                                                        {
                                                            importMainFile.bosses[boss].Time = 0;
                                                        }
                                                    }
                                                    
                                                    if (this.config.betterSpawnsPlus.locations[location].main.enableBosses)
                                                    {
                                                        initSpawns.push(importMainFile.bosses[boss]);
                                                    }
                                                }

                                                for (const cultist in importMainFile.cultists)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.cultists.difficulty);
                                                        importMainFile.cultists[cultist].Time = importMainFile.cultists[cultist].Time + generateRandomInteger(importMainFile.randomize.cultists.spawnDelay.min, importMainFile.randomize.cultists.spawnDelay.max);
                                                        importMainFile.cultists[cultist].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.cultists[cultist].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.cultists[cultist].Time < 0 && importMainFile.cultists[cultist].Time != -1)
                                                        {
                                                            importMainFile.cultists[cultist].Time = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.cultists[cultist]);
                                                }

                                                for (const raider in importMainFile.raiders)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.raiders.difficulty);
                                                        importMainFile.raiders[raider].Time = importMainFile.raiders[raider].Time + generateRandomInteger(importMainFile.randomize.raiders.spawnDelay.min, importMainFile.randomize.raiders.spawnDelay.max);
                                                        importMainFile.raiders[raider].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.raiders[raider].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.raiders[raider].Time < 0 && importMainFile.raiders[raider].Time != -1)
                                                        {
                                                            importMainFile.raiders[raider].Time = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.raiders[raider]);
                                                }

                                                for (const rogue in importMainFile.rogues)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.rogues.difficulty);
                                                        importMainFile.rogues[rogue].Time = importMainFile.rogues[rogue].Time + generateRandomInteger(importMainFile.randomize.rogues.spawnDelay.min, importMainFile.randomize.rogues.spawnDelay.max);
                                                        importMainFile.rogues[rogue].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.rogues[rogue].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.rogues[rogue].Time < 0 && importMainFile.rogues[rogue].Time != -1)
                                                        {
                                                            importMainFile.rogues[rogue].Time = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.rogues[rogue]);
                                                }
                                            }
                                            else
                                            {
                                                for (const pmc in importMainFile.pmcs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.pmcs.difficulty);
                                                        importMainFile.pmcs[pmc].Delay = importMainFile.pmcs[pmc].Delay + generateRandomInteger(importMainFile.randomize.pmcs.spawnDelay.min, importMainFile.randomize.pmcs.spawnDelay.max);
                                                        importMainFile.pmcs[pmc].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.pmcs[pmc].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.pmcs[pmc].Delay < 0 && importMainFile.pmcs[pmc].Delay != -1)
                                                        {
                                                            importMainFile.pmcs[pmc].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.pmcs[pmc]);
                                                }

                                                for (const scav in importMainFile.scavs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.scavs.difficulty);
                                                        importMainFile.scavs[scav].Delay = importMainFile.scavs[scav].Delay + generateRandomInteger(importMainFile.randomize.scavs.spawnDelay.min, importMainFile.randomize.scavs.spawnDelay.max);
                                                        importMainFile.scavs[scav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.scavs[scav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.scavs[scav].Delay < 0 && importMainFile.scavs[scav].Delay != -1)
                                                        {
                                                            importMainFile.scavs[scav].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.scavs[scav]);
                                                }

                                                for (const sniperScav in importMainFile.sniperScavs)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.sniperScavs.difficulty);
                                                        importMainFile.sniperScavs[sniperScav].Delay = importMainFile.sniperScavs[sniperScav].Delay + generateRandomInteger(importMainFile.randomize.sniperScavs.spawnDelay.min, importMainFile.randomize.sniperScavs.spawnDelay.max);
                                                        importMainFile.sniperScavs[sniperScav].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.sniperScavs[sniperScav].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.sniperScavs[sniperScav].Delay < 0 && importMainFile.sniperScavs[sniperScav].Delay != -1)
                                                        {
                                                            importMainFile.sniperScavs[sniperScav].Delay = 0;
                                                        }
                                                    }

                                                    initSpawns.push(importMainFile.sniperScavs[sniperScav]);
                                                }

                                                for (const boss in importMainFile.bosses)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.bosses.difficulty);
                                                        importMainFile.bosses[boss].Delay = importMainFile.bosses[boss].Delay + generateRandomInteger(importMainFile.randomize.bosses.spawnDelay.min, importMainFile.randomize.bosses.spawnDelay.max);
                                                        importMainFile.bosses[boss].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.bosses[boss].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.bosses[boss].Delay < 0 && importMainFile.bosses[boss].Delay != -1)
                                                        {
                                                            importMainFile.bosses[boss].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    if (this.config.betterSpawnsPlus.locations[location].main.enableBosses)
                                                    {
                                                        initSpawns.push(importMainFile.bosses[boss]);
                                                    }
                                                }

                                                for (const cultist in importMainFile.cultists)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.cultists.difficulty);
                                                        importMainFile.cultists[cultist].Delay = importMainFile.cultists[cultist].Delay + generateRandomInteger(importMainFile.randomize.cultists.spawnDelay.min, importMainFile.randomize.cultists.spawnDelay.max);
                                                        importMainFile.cultists[cultist].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.cultists[cultist].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.cultists[cultist].Delay < 0 && importMainFile.cultists[cultist].Delay != -1)
                                                        {
                                                            importMainFile.cultists[cultist].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.cultists[cultist]);
                                                }

                                                for (const raider in importMainFile.raiders)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.raiders.difficulty);
                                                        importMainFile.raiders[raider].Delay = importMainFile.raiders[raider].Delay + generateRandomInteger(importMainFile.randomize.raiders.spawnDelay.min, importMainFile.randomize.raiders.spawnDelay.max);
                                                        importMainFile.raiders[raider].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.raiders[raider].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.raiders[raider].Delay < 0 && importMainFile.raiders[raider].Delay != -1)
                                                        {
                                                            importMainFile.raiders[raider].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.raiders[raider]);
                                                }

                                                for (const rogue in importMainFile.rogues)
                                                {
                                                    if (importMainFile.randomize.enabled)
                                                    {
                                                        const randomDifficulty = generateWeightArray(importMainFile.randomize.rogues.difficulty);
                                                        importMainFile.rogues[rogue].Delay = importMainFile.rogues[rogue].Delay + generateRandomInteger(importMainFile.randomize.rogues.spawnDelay.min, importMainFile.randomize.rogues.spawnDelay.max);
                                                        importMainFile.rogues[rogue].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                                                        importMainFile.rogues[rogue].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];

                                                        if (importMainFile.rogues[rogue].Delay < 0 && importMainFile.rogues[rogue].Delay != -1)
                                                        {
                                                            importMainFile.rogues[rogue].Delay = 0;
                                                        }
                                                    }
                                                    
                                                    initSpawns.push(importMainFile.rogues[rogue]);
                                                }  
                                            }
                                        }
                                    }
                                    else
                                    {
                                        this.logger.log(`Mod: ${pkg.name} failed to load a spawn preset from "config.json" for location [${location}]`, this.logError);
                                        this.logger.log(`> reverted location [${location}] to default sp-tarkov spawn waves`, this.logError);
                                    }

                                    if (this.config.betterSpawnsPlus.consoleLogs)
                                    {
                                        for (const spawn in initSpawns)
                                        {
                                            if (initSpawns[spawn].BossName == "sptBear")
                                            {
                                                countBears++;
                                            }
                                            else if (initSpawns[spawn].BossName == "sptUsec")
                                            {
                                                countUsecs++;
                                            }
                                            else if (initSpawns[spawn].BossName == "assault")
                                            {
                                                countScavs++;
                                            }
                                            else if (initSpawns[spawn].BossName == "marksman")
                                            {
                                                countSniperScavs++;
                                            }
                                            else if (this.bossTypeArray.includes(initSpawns[spawn].BossName))
                                            {
                                                countBosses++;
                                            }
                                            else if (initSpawns[spawn].BossName == "sectantPriest")
                                            {
                                                countCultists++;
                                            }
                                            else if (initSpawns[spawn].BossName == "pmcBot")
                                            {
                                                countRaiders++;
                                            }
                                            else if (initSpawns[spawn].BossName == "exUsec")
                                            {
                                                countRogues++;
                                            }
                                        }

                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && !this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled)
                                        {
                                            this.logger.log(` > [${location}]`, this.logInfo);
                                            this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                            this.logger.log("  > total spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countBears}, usecs: ${countUsecs}, scavs: ${countScavs}, sniper scavs: ${countSniperScavs}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countBosses}, cultists: ${countCultists}, raiders: ${countRaiders}, rogues: ${countRogues}`, this.logInfo);
                                        }

                                        if (!this.config.betterSpawnsPlus.locations[location].main.enabled && this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled)
                                        {
                                            this.logger.log(` > [${location}]`, this.logInfo);
                                            this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);
                                            this.logger.log("  > added spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countAddBear}, usecs: ${countAddUsec}, scavs: ${countAddScav}, sniper scavs: ${countAddSniperScav}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countAddBoss}, cultists: ${countAddCultist}, raiders: ${countAddRaider}, rogues: ${countAddRogue}`, this.logInfo);
                                        }

                                        if (this.config.betterSpawnsPlus.locations[location].main.enabled && this.config.betterSpawnsPlus.locations[location].spawnGenerator.enabled)
                                        {
                                            this.logger.log(` > [${location}]`, this.logInfo);

                                            if (countRandomChanceToDisableMainPreset == 0)
                                            {
                                                this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                                this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);
                                            }
                                            else if (countRandomChanceToDisableMainPreset == 1)
                                            {
                                                this.logger.log(`  > loaded main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logInfo);
                                                this.logger.log(`  > disabled spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logDisable);
                                            }
                                            else if (countRandomChanceToDisableMainPreset == 2)
                                            {
                                                this.logger.log(`  > disabled main preset file: "${mainSpawnSystemArray[randomMainPreset]}.json"`, this.logDisable);
                                                this.logger.log(`  > loaded spawn generator preset file: "${generatorSpawnSystemArray[randomGeneratorPreset]}.json"`, this.logInfo);   
                                            }

                                            this.logger.log("  > added spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countAddBear}, usecs: ${countAddUsec}, scavs: ${countAddScav}, sniper scavs: ${countAddSniperScav}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countAddBoss}, cultists: ${countAddCultist}, raiders: ${countAddRaider}, rogues: ${countAddRogue}`, this.logInfo);
                                            this.logger.log("  > total spawn waves:", this.logInfo);
                                            this.logger.log(`   > bears: ${countBears}, usecs: ${countUsecs}, scavs: ${countScavs}, sniper scavs: ${countSniperScavs}`, this.logInfo);
                                            this.logger.log(`   > bosses: ${countBosses}, cultists: ${countCultists}, raiders: ${countRaiders}, rogues: ${countRogues}`, this.logInfo);
                                        }

                                        if (this.config.betterSpawnsPlus.locations[location].extendedLogs)
                                        {
                                            for (const locations in this.locationArray)
                                            {
                                                const location = this.locationArray[locations];
                                                if (this.config.betterSpawnsPlus.locations[location].extendedLogs)
                                                {
                                                    this.logger.log("> [better spawns plus]: extended logs", this.logWarning);
                                                    break;
                                                }
                                            }
                                            this.logger.log(` > [${location}]`, this.logWarning);
                                            this.logger.log(`  ${JSON.stringify(initSpawns, null, 2)}`, this.logWarning);
                                        }
                                    }
                                }

                                this.logger.log(`Mod: ${pkg.name}: successfully loaded`, this.logSuccess);
                            }
                        }
                        catch (error)
                        {
                            this.logger.error(error.message);
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
    }

    public postDBLoad(container: DependencyContainer): void
    {
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

        if (this.config.betterSpawnsPlus.enabled && this.config.otherOptions.enabled)
        {
            logger.log(`Mod: ${pkg.name}: spawn changes and other options enabled`, this.logSuccess);
        }
        else if (this.config.betterSpawnsPlus.enabled && !this.config.otherOptions.enabled)
        {
            logger.log(`Mod: ${pkg.name}: only spawn changes enabled`, this.logSuccess);
        }
        else if (!this.config.betterSpawnsPlus.enabled && this.config.otherOptions.enabled)
        {
            logger.log(`Mod: ${pkg.name}: only other options enabled`, this.logSuccess);
        }
        else
        {
            logger.log(`Mod: ${pkg.name}: disabled`, this.logDisable);
        }

        /* increase preset batches and batch size for pmc bots
        if (this.config.betterSpawnsPlus.enabled)
        {
            configsBots.presetBatch[sptTypes.SPTUSEC] = 40;
            configsBots.presetBatch[sptTypes.SPTBEAR] = 40;
            configsBots.botGenerationBatchSizePerType = 20;
        }
        */

        // other options
        if (this.config.otherOptions.enabled)
        {
            if (this.config.otherOptions.consoleLogs)
            {
                this.logger.log("> [other options]: logs", this.logInfo)

                if (this.config.otherOptions.misc.replaceTradersProfilePics || this.config.otherOptions.misc.replaceLauncherBackground)
                {
                    this.logger.log(" > [misc]", this.logInfo)
                }

                if (this.config.otherOptions.misc.replaceLauncherBackground)
                {
                    this.logger.log("  > replace launcher backgrounds: enabled", this.logInfo)
                }

                if (this.config.otherOptions.misc.replaceTradersProfilePics)
                { 
                    this.logger.log("  > replace traders profile pics: enabled", this.logInfo)
                }
            }

            // extractions
            if (this.config.otherOptions.extractions.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [extractions]", this.logInfo)
                }

                // make all exfils open regardless of entry point
                if (this.config.otherOptions.extractions.openAllExfilsRegardlessOfEntryPoint)
                {
                    for (const location in databaseLocations)
                    {
                        switch (location) 
                        {
                            case "base":
                                break;
    
                            case "bigmap":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Customs,Boiler Tanks";
                                }
                                break;
    
                            case "interchange":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "MallSE,MallNW";
                                }
                                break;

                            case "lighthouse":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Tunnel,North";
                                }
                                break;
    
                            case "shoreline":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "Village,Riverside";
                                }
                                break;

                            case "tarkovstreets":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "E1_2,E2_3,E3_4,E4_5,E5_6,E6_1";
                                }
                                break;
    
                            case "woods":
                                for (const exfil in databaseLocations[location].base.exits)
                                {
                                    databaseLocations[location].base.exits[exfil].EntryPoints = "House,Old Station";
                                }
                                break;
                                
                            default:
                                break;
                        }
                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("  > make all exfils open regardless of entry point: enabled", this.logInfo);
                    }
                }

                for (const i in databaseLocations)
                {
                    if (i !== "base")
                    {
                        for (const x in databaseLocations[i].base.exits)
                        {
                            // remove extraction restrictions
                            if (this.config.otherOptions.extractions.removeExtractionRestrictions)
                            {
                                if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train" && !databaseLocations[i].base.exits[x].Name.includes("lab") 
                                || databaseLocations[i].base.exits[x].Name === "lab_Vent")
                                {
                                    if (databaseLocations[i].base.exits[x].RequiredSlot)
                                    {
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
                            if (this.config.otherOptions.extractions.allExtractionsAlwaysAvailable)
                            {
                                if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train")
                                {
                                    databaseLocations[i].base.exits[x].Chance = 100;
                                }
                            }
                        }
                    }
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.extractions.removeExtractionRestrictions)
                {
                    this.logger.log("  > remove extraction restrictions: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.extractions.allExtractionsAlwaysAvailable)
                {
                    this.logger.log("  > make all extractions always available: enabled", this.logInfo);
                }
            }

            // loot
            if (this.config.otherOptions.loot.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [loot]", this.logInfo)
                }

                for (const locations in this.locationArray)
                {
                    const location = this.locationArray[locations];
                    if (location == "customs")
                    {
                        databaseLocations.bigmap.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.bigmap = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.bigmap = this.config.otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "factory")
                    {
                        databaseLocations.factory4_day.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        databaseLocations.factory4_night.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.factory4_day = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.looseLootMultiplier.factory4_night = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.factory4_day = this.config.otherOptions.loot[location].staticLootMultiplier;
                        configsLocations.staticLootMultiplier.factory4_night = this.config.otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "interchange" || location == "lighthouse" || location == "shoreline" || location == "woods")
                    {
                        databaseLocations[location].base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier[location] = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier[location] = this.config.otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "labs")
                    {
                        databaseLocations.laboratory.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.laboratory = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.laboratory = this.config.otherOptions.loot[location].staticLootMultiplier;
                    }

                    if (location == "reserve")
                    {
                        databaseLocations.rezervbase.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.rezervbase = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.rezervbase = this.config.otherOptions.loot[location].staticLootMultiplier;

                    }

                    if (location == "streets")
                    {
                        databaseLocations.tarkovstreets.base.GlobalLootChanceModifier = this.config.otherOptions.loot[location].globalLootChanceModifier;
                        configsLocations.looseLootMultiplier.tarkovstreets = this.config.otherOptions.loot[location].looseLootMultiplier;
                        configsLocations.staticLootMultiplier.tarkovstreets = this.config.otherOptions.loot[location].staticLootMultiplier;

                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log(`  > ${location}`, this.logInfo)
                        this.logger.log(`   > globalLootModifier: ${this.config.otherOptions.loot[location].globalLootChanceModifier}`, this.logInfo)
                        this.logger.log(`   > looseLootMultiplier: ${this.config.otherOptions.loot[location].looseLootMultiplier}`, this.logInfo)
                        this.logger.log(`   > staticLootMultiplier: ${this.config.otherOptions.loot[location].staticLootMultiplier}`, this.logInfo)
                    }
                }
            }

            // items
            if (this.config.otherOptions.items.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [items]", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && (this.config.otherOptions.items.repairs.removeArmorDegradationFromRepairs 
                || this.config.otherOptions.items.repairs.removeWeaponDegradationFromRepairs))
                {
                    this.logger.log("  > repairs", this.logInfo);
                }

                // remove armor degradation from repairs
                if (this.config.otherOptions.items.repairs.removeArmorDegradationFromRepairs)
                {
                    for (const armor in databaseGlobals.config.ArmorMaterials)
                    {
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairKitDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairKitDegradation = 0;
                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("   > remove armor degradation from repairs: enabled", this.logInfo);
                    }
                }

                // remove weapon degradation from repairs
                if (this.config.otherOptions.items.repairs.removeWeaponDegradationFromRepairs)
                {
                    for (const weapon in databaseItems)
                    {
                        if (databaseItems[weapon]._props.MaxRepairDegradation !== undefined && 
                            databaseItems[weapon]._props.MaxRepairKitDegradation !== undefined)
                        {
                            this.itemData(container, weapon, "MinRepairDegradation", 0);
                            this.itemData(container, weapon, "MaxRepairDegradation", 0);
                            this.itemData(container, weapon, "MinRepairKitDegradation", 0);
                            this.itemData(container, weapon, "MaxRepairKitDegradation", 0);
                        }
                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("   > remove weapon degradation from repairs: enabled", this.logInfo);
                    }
                }

                if (this.config.otherOptions.consoleLogs && (this.config.otherOptions.items.insurance.insuranceAllowedOnAllLocations 
                || this.config.otherOptions.items.insurance.insuranceAllowedForAllItems))
                {
                    this.logger.log("  > insurance", this.logInfo);
                }

                // allow insurance on all locations
                if (this.config.otherOptions.items.insurance.insuranceAllowedOnAllLocations)
                {
                    this.altLocationArray.forEach(function(location)
                    {
                        databaseLocations[location].base.Insurance = true;
                    });

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("   > allow insurance on all locations: enabled", this.logInfo);
                    }
                }

                for (const id in databaseItems)
                {
                    const base = databaseItems[id];

                    if (!this.getId([id]))
                    {
                        // allow insurance for all items
                        if (this.config.otherOptions.items.insurance.insuranceAllowedForAllItems && base._props.IsAlwaysAvailableForInsurance !== undefined) 
                        {
                            const insure = true;
                            this.itemData(container, id, "IsAlwaysAvailableForInsurance", insure);
                        }

                        // remove weapon durability burn
                        if (this.config.otherOptions.items.gear.removeWeaponDurabilityBurn && base._props.DurabilityBurnModificator)
                        {
                            const durabilityBurnMod = 0;
                            this.itemData(container, id, "DurabilityBurnModificator", durabilityBurnMod);
                        }

                        // remove weapon deterioration from bullets
                        if (this.config.otherOptions.items.gear.removeWeaponDeteriorationFromBullets && base._props.Deterioration)
                        {
                            const deteriorationMod = 0;
                            this.itemData(container, id, "Deterioration", deteriorationMod);
                        }

                        // allow all items to be lootable
                        if (this.config.otherOptions.items.allowAllItemsToBelootable && base._props.Unlootable !== undefined)
                        {
                            const unlootable = false;
                            this.itemData(container, id, "Unlootable", unlootable);
                        }

                        // make all items unexamined by default
                        if (this.config.otherOptions.items.allItemsUnexaminedByDefault && base._props.ExaminedByDefault !== undefined)
                        {
                            const examined = false;
                            this.itemData(container, id, "ExaminedByDefault", examined);
                        }
                    }
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.items.insurance.insuranceAllowedForAllItems)
                {
                    this.logger.log("   > allow insurance for all items: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && (this.config.otherOptions.items.gear.removeWeaponDurabilityBurn 
                || this.config.otherOptions.items.allowAllItemsToBelootable))
                {
                    this.logger.log("  > gear", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.items.gear.removeWeaponDurabilityBurn)
                {
                    this.logger.log("   > remove weapon durability burn: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.items.gear.removeWeaponDeteriorationFromBullets)
                {
                    this.logger.log("   > remove weapon deterioration from bullets: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.items.allowAllItemsToBelootable)
                {
                    this.logger.log("  > allow all items to be lootable: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs && this.config.otherOptions.items.allItemsUnexaminedByDefault)
                {
                    this.logger.log("  > make all items unexamined by default: enabled", this.logInfo);
                }

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("  > keys", this.logInfo);
                    this.logger.log("   > labs access keycard", this.logInfo);
                }

                // remove labs access keycard requirement
                if (this.config.otherOptions.items.keys.labsAccessKeycard.removeLabsReq)
                {
                    databaseLocations.laboratory.base.AccessKeys = [];

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("    > remove labs access keycard requirement: enabled", this.logInfo);
                    }
                }

                // set max number of uses for labs access keycard
                const labsAccessKeycard = databaseItems["5c94bbff86f7747ee735c08f"];
                labsAccessKeycard._props.MaximumNumberOfUsage = this.config.otherOptions.items.keys.labsAccessKeycard.maxNumberOfUses;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`    > max number of uses for labs access keycard: ${labsAccessKeycard._props.MaximumNumberOfUsage}`, this.logInfo);
                }
            }

            // player
            if (this.config.otherOptions.player.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [player]", this.logInfo);
                }

                // scav cooldown timer
                databaseGlobals.config.SavagePlayCooldown = this.config.otherOptions.player.scavCooldownTimer * 60;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`  > scav cooldown timer: ${databaseGlobals.config.SavagePlayCooldown / 60} minutes`, this.logInfo);
                }

                // health in-raid
                if (this.config.otherOptions.player.healthInRaid.enabled)
                {
                    databaseGlobals.config.Health.Effects.Existence.EnergyLoopTime = this.config.otherOptions.player.healthInRaid.energyLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.EnergyDamage = this.config.otherOptions.player.healthInRaid.energyDecreasePerLoopTime;
                    databaseGlobals.config.Health.Effects.Existence.HydrationLoopTime = this.config.otherOptions.player.healthInRaid.hydrationLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.HydrationDamage = this.config.otherOptions.player.healthInRaid.hydrationDecreasePerLoopTime;

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("  > health in-raid:", this.logInfo);
                        this.logger.log(`   > energy loop time: ${databaseGlobals.config.Health.Effects.Existence.EnergyLoopTime} seconds`, this.logInfo);
                        this.logger.log(`   > energy damage: ${databaseGlobals.config.Health.Effects.Existence.EnergyDamage}`, this.logInfo);
                        this.logger.log(`   > hydration loop time: ${databaseGlobals.config.Health.Effects.Existence.HydrationLoopTime} seconds`, this.logInfo);
                        this.logger.log(`   > hydration damage: ${databaseGlobals.config.Health.Effects.Existence.HydrationDamage}`, this.logInfo);
                    }
                }

                // health in-hideout
                if (this.config.otherOptions.player.healthInHideout.enabled)
                {
                    databaseGlobals.config.Health.Effects.Regeneration.Energy = this.config.otherOptions.player.healthInHideout.energyRegenerationLoopTime;
                    databaseGlobals.config.Health.Effects.Regeneration.Hydration = this.config.otherOptions.player.healthInHideout.hydrationRegenerationLoopTime;

                    const bodyHealth = databaseGlobals.config.Health.Effects.Regeneration.BodyHealth;
                    const regenerationMultiplier = this.config.otherOptions.player.healthInHideout.healthRegenerationMultiplier;
                    bodyHealth.Chest.Value = bodyHealth.Chest.Value * regenerationMultiplier;
                    bodyHealth.Head.Value = bodyHealth.Head.Value * regenerationMultiplier;
                    bodyHealth.LeftArm.Value = bodyHealth.LeftArm.Value * regenerationMultiplier;
                    bodyHealth.LeftLeg.Value = bodyHealth.LeftLeg.Value * regenerationMultiplier;
                    bodyHealth.RightArm.Value = bodyHealth.RightArm.Value * regenerationMultiplier;
                    bodyHealth.RightLeg.Value = bodyHealth.RightLeg.Value * regenerationMultiplier;
                    bodyHealth.Stomach.Value = bodyHealth.Stomach.Value * regenerationMultiplier;

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("  > health in-hideout:", this.logInfo);
                        this.logger.log(`   > energy regeneration time: ${databaseGlobals.config.Health.Effects.Regeneration.Energy} minutes`, this.logInfo);
                        this.logger.log(`   > hydration regeneration time: ${databaseGlobals.config.Health.Effects.Regeneration.Hydration} minutes`, this.logInfo);
                        this.logger.log(`   > health regeneration multiplier: ${regenerationMultiplier}`, this.logInfo);
                    }
                    
                    // remove free heals and trial levels
                    if (this.config.otherOptions.player.healthInHideout.removeFreeHealTrialLevelsAndRaids)
                    {   
                        databaseGlobals.config.Health.HealPrice.TrialLevels = 0;
                        databaseGlobals.config.Health.HealPrice.TrialRaids = 0;

                        if (this.config.otherOptions.consoleLogs)
                        {
                            this.logger.log("   > remove free heals and trial levels: enabled", this.logInfo);
                        }
                    }
                }
            }

            // allow all tactical clothing for both factions
            if (this.config.otherOptions.player.tacticalClothing.allowAllTacticalClothingForBothFactions)
            {
                for (const customization in databaseCustomization)
                {
                    const customizationData = databaseCustomization[customization];
                    if (customizationData._parent === "5cd944d01388ce000a659df9" || customizationData._parent === "5cd944ca1388ce03a44dc2a4")
                    {
                        customizationData._props.Side = ["Usec", "Bear"];
                    }
                }

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("   > allow all tactical clothing for both factions: enabled", this.logInfo);
                }
            }

            // unlock all tactical clothing for free
            if (this.config.otherOptions.player.tacticalClothing.unlockAllTacticalClothingForFree)
            {
                for (const trader in databaseTraders)
                {
                    if (this.getId([trader]) === false && databaseTraders[trader].suits)
                    {
                        for (const suit in databaseTraders[trader].suits)
                        {
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

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("   > unlock all tactical clothing for free: enabled", this.logInfo);
                }
            }

            // hideout
            if (this.config.otherOptions.hideout.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [hideout]", this.logInfo);
                }

                const constructionMultiplier = this.config.otherOptions.hideout.constructionTimeMultiplier;
                const productionMultiplier = this.config.otherOptions.hideout.productionTimeMultiplier;

                // construction multiplier
                for (const data in databaseHideout.areas)
                {
                    const areaData = databaseHideout.areas[data];

                    if (this.getId([areaData._id]) === false)
                    {
                        for (const i in areaData.stages)
                        {
                            if (areaData.stages[i].constructionTime > 0)
                            {
                                areaData.stages[i].constructionTime = areaData.stages[i].constructionTime * constructionMultiplier;
                            }
                        }
                    }
                }

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`  > construction multiplier: ${constructionMultiplier}`, this.logInfo);
                }

                // production multiplier
                for (const data in databaseHideout.production)
                {
                    const productionData = databaseHideout.production[data];

                    if (this.getId([productionData._id]) === false)
                    {
                        if (!productionData.continuous && productionData.productionTime > 1)
                        {
                            productionData.productionTime = productionData.productionTime * productionMultiplier;
                        }
                    }
                }

                for (const data in databaseHideout.scavcase)
                {
                    const scavcaseData = databaseHideout.scavcase[data];

                    if (this.getId([scavcaseData._id]) === false)
                    {
                        if (scavcaseData.ProductionTime > 1)
                        {
                            scavcaseData.ProductionTime = scavcaseData.ProductionTime * productionMultiplier;
                        }
                    }
                }

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`  > production multiplier: ${productionMultiplier}`, this.logInfo);
                }
            }

            // traders
            if (this.config.otherOptions.traders.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [traders]", this.logInfo);
                }

                // repair cost multiplier for all traders
                configsRepairs.priceMultiplier = this.config.otherOptions.traders.repairCostMultiplierForAllTraders;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`  > repair cost multiplier for all traders: ${configsRepairs.priceMultiplier}`, this.logInfo);
                }

                // prapor insurance
                configsInsurance.insuranceMultiplier[eftTraders.PRAPOR] = this.config.otherOptions.traders.prapor.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.PRAPOR] = this.config.otherOptions.traders.prapor.insurance.returnChancePercent;
                databaseTraders[eftTraders.PRAPOR].base.insurance.min_return_hour = this.config.otherOptions.traders.prapor.insurance.minReturnTime;
                databaseTraders[eftTraders.PRAPOR].base.insurance.max_return_hour = this.config.otherOptions.traders.prapor.insurance.maxReturnTime;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("  > prapor insurance", this.logInfo);
                    this.logger.log(`   > multiplier: ${configsInsurance.insuranceMultiplier[eftTraders.PRAPOR]}`, this.logInfo);
                    this.logger.log(`   > return chance: ${configsInsurance.returnChancePercent[eftTraders.PRAPOR]}%`, this.logInfo);
                    this.logger.log(`   > min return time: ${databaseTraders[eftTraders.PRAPOR].base.insurance.min_return_hour} hours`, this.logInfo);
                    this.logger.log(`   > max return time: ${databaseTraders[eftTraders.PRAPOR].base.insurance.max_return_hour} hours`, this.logInfo);
                }

                // therapist insurance
                configsInsurance.insuranceMultiplier[eftTraders.THERAPIST] = this.config.otherOptions.traders.therapist.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.THERAPIST] = this.config.otherOptions.traders.therapist.insurance.returnChancePercent;
                databaseTraders[eftTraders.THERAPIST].base.insurance.min_return_hour = this.config.otherOptions.traders.therapist.insurance.minReturnTime;
                databaseTraders[eftTraders.THERAPIST].base.insurance.max_return_hour = this.config.otherOptions.traders.therapist.insurance.maxReturnTime;
                
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("  > therapist insurance", this.logInfo);
                    this.logger.log(`   > multiplier: ${configsInsurance.insuranceMultiplier[eftTraders.THERAPIST]}`, this.logInfo);
                    this.logger.log(`   > return chance: ${configsInsurance.returnChancePercent[eftTraders.THERAPIST]}%`, this.logInfo);
                    this.logger.log(`   > min return time: ${databaseTraders[eftTraders.THERAPIST].base.insurance.min_return_hour} hours`, this.logInfo);
                    this.logger.log(`   > max return time: ${databaseTraders[eftTraders.THERAPIST].base.insurance.max_return_hour} hours`, this.logInfo);
                }

                // trader repair quality
                databaseTraders[eftTraders.MECHANIC].base.repair.quality = this.config.otherOptions.traders.mechanic.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.PRAPOR].base.repair.quality = this.config.otherOptions.traders.prapor.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.SKIER].base.repair.quality = this.config.otherOptions.traders.skier.repairs.repairQualityDegradation;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(`  > mechanic repair quality degradation: ${databaseTraders[eftTraders.MECHANIC].base.repair.quality}`, this.logInfo);
                    this.logger.log(`  > prapor repair quality degradation: ${databaseTraders[eftTraders.PRAPOR].base.repair.quality}`, this.logInfo);
                    this.logger.log(`  > skier repair quality degradation: ${databaseTraders[eftTraders.SKIER].base.repair.quality}`, this.logInfo);
                }
            }

            // bots
            if (this.config.otherOptions.bots.enabled)
            {
                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log(" > [bots]", this.logInfo);
                }

                // bot level relative to player level
                configsBots.pmc.botRelativeLevelDeltaMax = this.config.otherOptions.bots.pmc.botLevelRelativeToPlayerLevel;

                // chance same side is hostile
                configsBots.pmc.chanceSameSideIsHostilePercent = this.config.otherOptions.bots.pmc.chanceSameFactionIsHostile;

                if (this.config.otherOptions.consoleLogs)
                {
                    this.logger.log("  > pmc:", this.logInfo);
                    this.logger.log(`   > bot level relative to player level: ${configsBots.pmc.botRelativeLevelDeltaMax}`, this.logInfo);
                    this.logger.log(`   > chance same side is hostile: ${configsBots.pmc.chanceSameSideIsHostilePercent}%`, this.logInfo);
                }

                // custom pmc dog tags
                if (this.config.otherOptions.bots.pmc.customPmcDogTags)
                {
                    for (const types in this.pmcTypeArray)
                    {
                        const type = this.pmcTypeArray[types];
                        databaseBots.types[type].firstName = pmcDogTags.firstName;
                        databaseBots.types[type].lastName = [];
                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("   > custom pmc dog tags: enabled", this.logInfo);
                    }
                }

                // make pmcs not randomly talk
                if (this.config.otherOptions.bots.pmc.makePmcsNotRandomlyTalk)
                {
                    for (const types in this.pmcTypeArray)
                    {
                        const type = this.pmcTypeArray[types];
                        this.botDifficultyArray.forEach(function(difficulty)
                        {
                            databaseBots.types[type].difficulty[difficulty].Mind.CAN_TALK = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.CAN_THROW_REQUESTS = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.CHANCE_TO_NOTIFY_ENEMY_GR_100 = 0;
                            databaseBots.types[type].difficulty[difficulty].Mind.TALK_DELAY = 50;
                            databaseBots.types[type].difficulty[difficulty].Mind.TALK_DELAY_BIG = 50.1;
                            databaseBots.types[type].difficulty[difficulty].Mind.TALK_WITH_QUERY = false;
                            databaseBots.types[type].difficulty[difficulty].Mind.MIN_DIST_TO_CLOSE_TALK = 100;
                            databaseBots.types[type].difficulty[difficulty].Mind.MIN_DIST_TO_CLOSE_TALK_SQR = 10000;
                            databaseBots.types[type].difficulty[difficulty].Mind.MIN_TALK_DELAY = 100;
                        });
                    }

                    if (this.config.otherOptions.consoleLogs)
                    {
                        this.logger.log("   > make pmcs not randomly talk: enabled", this.logInfo);
                    }
                }
            }

            if (this.config.otherOptions.consoleLogs)
            {
                this.logger.log(`Mod: ${pkg.name}: waiting for launcher to start before continuing...`, this.logSuccess);
            }
        }
        else
        {
            return;
        }
    }

    public postAkiLoad(container: DependencyContainer): void
    {
        const fileName = path.basename(path.dirname(__dirname.split('/').pop()));
        const filePath = `${container.resolve<PreAkiModLoader>("PreAkiModLoader").getModPath(fileName)}res/`;

        fs.readdir(filePath, (err, files) => 
        {
            files.forEach(file => 
            {
                if (this.config.otherOptions.enabled)
                {
                    const imageId = file.split('/').pop().split('.').shift();

                    if (this.config.otherOptions.misc.replaceTradersProfilePics)
                    {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/trader/avatar/${imageId}`,`${filePath}${imageId}.${"jpg"}`);
                    }

                    const imageArray = [
                        "eft00","eft01","eft02","eft03","eft04","eft05","eft06","eft07","eft08","eft09","eft10","eft11","eft12","eft13",
                        "eft14","eft15","eft16","eft17","eft18","eft19","eft20","eft21","eft22","eft23","eft24","eft25","eft26","eft27"
                    ];
                    const random = Math.floor(Math.random() * imageArray.length);
                    
                    if (this.config.otherOptions.misc.replaceLauncherBackground)
                    {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/launcher/${imageId}`,`${filePath}${imageArray[random]}.${"jpg"}`);
                    }
                }
            });
        });
    }

    private itemData(container: DependencyContainer, id: string, data: string, value: any): void
    {
        const databaseItems = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
        databaseItems[id]._props[data] = value;
    }

    private idArray = [];

    private getId(id: string[]): boolean
    {
        if (this.idArray.length > 0) 
        {
            for (const isId in this.idArray) 
            {
                if (id.includes(this.idArray[isId]))
                {
                    return true;
                } 
                else 
                {
                    return false;
                }
            }
        } 
        else 
        {
            return false;
        }
    }

    private generateBot(type: string, chance: number, zones: string, difficulty: string, supportType: string, sequence: string, time: number, supports: any, triggerId: string, triggerName: string, delay: number)
    {
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