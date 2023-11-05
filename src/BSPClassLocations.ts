/* 
 * BetterSpawnsPlus v2.0.0
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/

import { inject, injectable } from "tsyringe";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { AltLocationNames } from "../enums/BSPEnumLocations";
import { AllBotTypes, ConversionBotTypes } from "../enums/BSPEnumBots";
import { LoggerTypes } from "../enums/BSPEnumLogger";
import pkg from "../package.json";

@injectable()
export class BSPClassLocations {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}
    
    private altLocationNames: string[] = Object.values(AltLocationNames);
    private conversionBotTypes: string[] = Object.values(ConversionBotTypes);

    private openZonesMap = {
        "bigmap": "ZoneBlockPost,ZoneBlockPostSniper,ZoneBlockPostSniper3,ZoneBrige,ZoneCrossRoad,ZoneCustoms,ZoneDormitory,ZoneFactoryCenter,ZoneFactorySide,ZoneGasStation,ZoneOldAZS,ZoneScavBase,ZoneSnipeBrige,ZoneSnipeFactory,ZoneSnipeTower,ZoneTankSquare,ZoneWade",
        "interchange": "ZoneCenter,ZoneCenterBot,ZoneGoshan,ZoneIDEA,ZoneIDEAPark,ZoneOLI,ZoneOLIPark,ZonePowerStation,ZoneRoad,ZoneTrucks",
        "laboratory": "BotZoneBasement,BotZoneFloor1,BotZoneFloor2,BotZoneGate1,BotZoneGate2",
        "lighthouse": "Zone_Blockpost,Zone_Bridge,Zone_Chalet,Zone_Containers,Zone_DestroyedHouse,Zone_Hellicopter,Zone_Island,Zone_LongRoad,Zone_OldHouse,Zone_Rocks,Zone_RoofBeach,Zone_RoofContainers,Zone_RoofRocks,Zone_SniperPeak,Zone_TreatmentBeach,Zone_TreatmentContainers,Zone_TreatmentRocks,Zone_Village",
        "rezervbase": "ZoneBarrack,ZoneBunkerStorage,ZonePTOR1,ZonePTOR2,ZoneRailStrorage,ZoneSubCommand,ZoneSubStorage",
        "shoreline": "ZoneBunker,ZoneBunkeSniper,ZoneBusStation,ZoneForestGasStation,ZoneForestSpawn,ZoneForestTruck,ZoneGasStation,ZoneGreenHouses,ZoneIsland,ZoneMeteoStation,ZonePassClose,ZonePassFar,ZonePort,ZonePowerStation,ZonePowerStationSniper,ZoneRailWays,ZoneSanatorium1,ZoneSanatorium2,ZoneTunnel,ZoneStartVillage",
        "tarkovstreets": "ZoneCard1,ZoneCarShowroom,ZoneCarShowroom_main_roof,ZoneCinema,ZoneColumn,ZoneConcordia_1,ZoneConcordia_2,ZoneConcordiaParking,ZoneConstruction,ZoneFactory,ZoneHotel_1,ZoneHotel_2,ZoneSnipeBuilding,ZoneSnipeCarShowroom,ZoneSnipeCinema,ZoneSnipeSW01,ZoneStilo,ZoneSW00,ZoneSW01",
        "woods": "ZoneBigRocks,ZoneBrokenVill,ZoneClearVill,ZoneHighRocks,ZoneHouse,ZoneMiniHouse,ZoneRedHouse,ZoneRoad,ZoneScavBase2,ZoneWoodCutter"
    }

    public allOpenZones(eftDatabaseLocations: any): any {
        for (const location in this.openZonesMap) {
            eftDatabaseLocations[location].base.OpenZones = this.openZonesMap[location];
        }
    }

    public botConversionRates(sptConfigsPmc: any): any {
        this.conversionBotTypes.forEach(function(type) {
            sptConfigsPmc.convertIntoPmcChance[type].min = 0;
            sptConfigsPmc.convertIntoPmcChance[type].max = 0;
        });
    }

    public spawnPatches(eftDatabaseLocations: any, sptConfigsInRaid: any, sptConfigsLocation: any): any {
        sptConfigsInRaid.raidMenuSettings.bossEnabled = true;
        sptConfigsLocation.splitWaveIntoSingleSpawnsSettings.enabled = false;
        sptConfigsLocation.rogueLighthouseSpawnTimeSettings.enabled = false;
        sptConfigsLocation.fixEmptyBotWavesSettings.enabled = false;
        sptConfigsLocation.addOpenZonesToAllMaps = false;
        sptConfigsLocation.addCustomBotWavesToMaps = false;
        sptConfigsLocation.enableBotTypeLimits = false;

        for (const altLocation of this.altLocationNames) {
            eftDatabaseLocations[altLocation].base.NewSpawn = false;
            eftDatabaseLocations[altLocation].base.OldSpawn = true;
            eftDatabaseLocations[altLocation].base.OfflineNewSpawn = false;
            eftDatabaseLocations[altLocation].base.OfflineOldSpawn = true;
        }
    }

    public initSpawns(eftDatabaseLocations: any, initJson: any, location: any): any {
        const initSpawnArray = (locationKey: string): void => {
            eftDatabaseLocations[locationKey].base.waves = [];
            eftDatabaseLocations[locationKey].base.BossLocationSpawn = initJson;
        };

        switch (location) {
            case "customs":
                initSpawnArray(AltLocationNames.CUSTOMS);
                break;
            case "factory":
                initSpawnArray(AltLocationNames.FACTORY_DAY);
                initSpawnArray(AltLocationNames.FACTORY_NIGHT);
                break;
            case "interchange":
            case "lighthouse":
            case "shoreline":
            case "woods":
                initSpawnArray(location);
                break;
            case "labs":
                initSpawnArray(AltLocationNames.LABORATORY);
                break;
            case "reserve":
                initSpawnArray(AltLocationNames.RESERVE);
                break;
            case "streets":
                initSpawnArray(AltLocationNames.STREETS);
                break;
            default:
                break;
        }
    }

    public countSpawnWaves(initJson: any, logsData: any): any {
        for (const spawnWave in initJson) {
            switch (initJson[spawnWave].BossName) {
                case AllBotTypes.BEAR:
                    logsData.total.bear = logsData.total.bear + 1;
                    break;
                case AllBotTypes.USEC:
                    logsData.total.usec = logsData.total.usec + 1;
                    break;
                case AllBotTypes.SCAV:
                    logsData.total.scav = logsData.total.scav + 1;
                    break;
                case AllBotTypes.SNIPERSCAV:
                    logsData.total.sniperScav = logsData.total.sniperScav + 1;
                    break;
                case AllBotTypes.CULTIST_PRIEST:
                    logsData.total.cultist = logsData.total.cultist + 1;
                    break;
                case AllBotTypes.RAIDER:
                    logsData.total.raider = logsData.total.raider + 1;
                    break;
                case AllBotTypes.ROGUE:
                    logsData.total.rogue = logsData.total.rogue + 1;
                    break;
                case AllBotTypes.BLOODHOUND:
                    logsData.total.bloodhound = logsData.total.bloodhound + 1;
                    break;
                case AllBotTypes.WEIRD_SCAV:
                    logsData.total.weirdScav = logsData.total.weirdScav + 1;
                    break;
                default:
                    logsData.total.boss = logsData.total.boss + 1;
                    break;
            }
        }

    }

    public forceStopSpawnWaves(settingsManager: any, initJson: any, location: any): any {
        if (settingsManager.globalOverrides.forceStopSpawnWaves.enabled) {
            for (const spawnWave in initJson) {
                switch (initJson[spawnWave].BossName) {
                    case AllBotTypes.BEAR:
                    case AllBotTypes.USEC:
                        if (initJson[spawnWave].Time > settingsManager.globalOverrides.forceStopSpawnWaves.pmcs.timeInMinutes[location] * 60) {
                            delete initJson[spawnWave];
                        }
                        break;
                    case AllBotTypes.SCAV:
                    case AllBotTypes.SNIPERSCAV:
                        if (initJson[spawnWave].Time > settingsManager.globalOverrides.forceStopSpawnWaves.scavs.timeInMinutes[location] * 60) {
                            delete initJson[spawnWave];
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    public botChanceDifficultyOverrides(settingsManager: any, initJson: any): any {
        function updateSpawnData(spawnWave, difficultyOverride, chanceOverride, logger) {
            if (difficultyOverride.enabled) {
                if ((difficultyOverride.difficulty === "easy" || difficultyOverride.difficulty === "normal" || difficultyOverride.difficulty === "hard" || difficultyOverride.difficulty === "impossible")) {
                    initJson[spawnWave].BossDifficult = difficultyOverride.difficulty;
                    initJson[spawnWave].BossEscortDifficult = difficultyOverride.difficulty;
                } else {
                    logger.log(`Mod: ${pkg.name} error: Cannot identify global override value for bot difficulty`, LoggerTypes.ERROR);
                    logger.log("> bypassing global override", LoggerTypes.ERROR);
                }
            }

            if (chanceOverride.enabled) {
                if (chanceOverride.chance >= 0 && chanceOverride.chance <= 100) {
                    initJson[spawnWave].BossChance = chanceOverride.chance;
                } else {
                    logger.log(`Mod: ${pkg.name} error: Global override value for bot chance is not between 0-100`, LoggerTypes.ERROR);
                    logger.log("> bypassing global override", LoggerTypes.ERROR);
                }
            }
        }

        const bossTypeMapping = {
            glukhar: AllBotTypes.GLUKHAR,
            kaban: AllBotTypes.KABAN,
            killa: AllBotTypes.KILLA,
            knight: AllBotTypes.KNIGHT,
            reshala: AllBotTypes.RESHALA,
            sanitar: AllBotTypes.SANITAR,
            shturman: AllBotTypes.SHTURMAN,
            tagilla: AllBotTypes.TAGILLA,
            zryachiy: AllBotTypes.ZRYACHIY
        }

        for (const spawnWave in initJson) {
            switch (initJson[spawnWave].BossName) {
                case AllBotTypes.BEAR:
                case AllBotTypes.USEC:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.pmcs, settingsManager.globalOverrides.botChance.pmcs, this.logger);
                    break;
                case AllBotTypes.SCAV:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.scavs, settingsManager.globalOverrides.botChance.scavs, this.logger);
                    break;
                case AllBotTypes.SNIPERSCAV:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.sniperScavs, settingsManager.globalOverrides.botChance.sniperScavs, this.logger);
                    break;
                case AllBotTypes.CULTIST_PRIEST:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.cultists, settingsManager.globalOverrides.botChance.cultists, this.logger);
                    break;
                case AllBotTypes.RAIDER:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.raiders, settingsManager.globalOverrides.botChance.raiders, this.logger);
                    break;
                case AllBotTypes.ROGUE:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.rogues, settingsManager.globalOverrides.botChance.rogues, this.logger);
                    break;
                case AllBotTypes.BLOODHOUND:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.bloodhounds, settingsManager.globalOverrides.botChance.bloodhounds, this.logger);
                    break;
                case AllBotTypes.WEIRD_SCAV:
                    updateSpawnData(spawnWave, settingsManager.globalOverrides.botDifficulty.weirdScavs, settingsManager.globalOverrides.botChance.weirdScavs, this.logger);
                    break;
                default:
                    for (const bossTypeKey in bossTypeMapping) {
                        const bossTypeValue = bossTypeMapping[bossTypeKey];
                        if (initJson[spawnWave].BossName === bossTypeValue) {
                            if (settingsManager.globalOverrides.botDifficulty.bosses.enabled) {
                                const bossDifficulty = settingsManager.globalOverrides.botDifficulty.bosses.difficulty[bossTypeKey];
                                if (bossDifficulty === "easy" || bossDifficulty === "normal" || bossDifficulty === "hard" || bossDifficulty === "impossible") {
                                    initJson[spawnWave].BossDifficult = bossDifficulty;
                                    initJson[spawnWave].BossEscortDifficult = bossDifficulty;
                                } else {
                                    this.logger.log(`Mod: ${pkg.name} error: Cannot identify global override value for bot difficulty`, LoggerTypes.ERROR);
                                    this.logger.log("> bypassing global override", LoggerTypes.ERROR);
                                }
                            }

                            if (settingsManager.globalOverrides.botChance.bosses.enabled) {
                                const bossChance = settingsManager.globalOverrides.botChance.bosses.chance[bossTypeKey];
                                if (bossChance >= 0 && bossChance <= 100) {
                                    initJson[spawnWave].BossChance = bossChance;
                                } else {
                                    this.logger.log(`Mod: ${pkg.name} error: Global override value for bot chance is not between 0-100`, LoggerTypes.ERROR);
                                    this.logger.log("> bypassing global override", LoggerTypes.ERROR);
                                }
                            }
                        }
                    }
                    break;
            }
        }
    }

    public generatePmcs(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botType, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].pmcs;
        
        if (enabled && bspClassHelpers.checkProperties(botType, botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {

            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for pmcs on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for pmcs on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let typeArray = bspClassHelpers.generateWeightArray(botType);
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));

                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);
                
                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                typeArray = typeArray.length === 0 ? bspClassHelpers.generateWeightArray(botType) : typeArray;
                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                let randomType = bspClassHelpers.removeElementFromWeightArray(typeArray);
                randomType = (randomType === "bear") ? AllBotTypes.BEAR : AllBotTypes.USEC;
                
                if (location === "labs") {
                    initJson.push(bspClassHelpers.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, -1, null, "", "", randomTime + timeInterval));
                } else {
                    initJson.push(bspClassHelpers.generateBot(randomType, randomChance, randomZone, randomDifficulty, randomType, randomAmount, randomTime + timeInterval, null, "", "", 0));
                }

                if (countInterval === spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateScavs(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].scavs;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for scavs on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for scavs on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);

                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                initJson.push(bspClassHelpers.generateBot(AllBotTypes.SCAV, randomChance, randomZone, randomDifficulty, AllBotTypes.SCAV, randomAmount, randomTime + timeInterval, null, "", "", 0));

                if (countInterval == spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateSniperScavs(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].sniperScavs;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for sniper scavs on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for sniper scavs on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);

                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                initJson.push(bspClassHelpers.generateBot(AllBotTypes.SNIPERSCAV, randomChance, randomZone, randomDifficulty, AllBotTypes.SNIPERSCAV, randomAmount, randomTime + timeInterval, null, "", "", 0));

                if (countInterval == spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateBosses(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botType, botDifficulty, botChance, spawnWaves, onlyVanillaOpenZones, openZones } = importPresetJson[location].bosses;

        if (enabled && bspClassHelpers.checkProperties(botType, botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }

                if (!onlyVanillaOpenZones) {
                    this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for bosses on location [${location}]`, LoggerTypes.ERROR);
                    this.logger.log(`> reverted to all open zones being available for bosses on [${location}]`, LoggerTypes.ERROR);
                }
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let supportAmount = "";
            let supportType = "";
            let supports: any[] | null = null;
            let typeArray = bspClassHelpers.generateWeightArray(botType);
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));

                let randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                
                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = (randomTime === 0) ? -1 : Math.max(0, randomTime + timeInterval);

                typeArray = typeArray.length === 0 ? bspClassHelpers.generateWeightArray(botType) : typeArray;
                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                let randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);
                let randomType = bspClassHelpers.removeElementFromWeightArray(typeArray);

                if (randomType === "glukhar") {
                    randomType = AllBotTypes.GLUKHAR;
                    supportType = AllBotTypes.GLUKHAR_ASSAULT_FOLLOWER;
                    supportAmount = "0";
                    supports = [
                        AllBotTypes.GLUKHAR_ASSAULT_FOLLOWER,
                        AllBotTypes.GLUKHAR_SECURITY_FOLLOWER,
                        AllBotTypes.GLUKHAR_SCOUT_FOLLOWER
                    ].map(bossEscortType => ({
                        BossEscortType: bossEscortType,
                        BossEscortDifficult: [randomDifficulty],
                        BossEscortAmount: "2"
                    }));

                    if (onlyVanillaOpenZones) {
                        if (location === "reserve") {
                            //const glukharOpenZones = ["ZoneRailStrorage", "ZoneRailStrorage", "ZoneRailStrorage", "ZonePTOR1", "ZonePTOR2", "ZoneBarrack", "ZoneBarrack", "ZoneBarrack", "ZoneSubStorage"];
                            //randomZone = glukharOpenZones[Math.floor(Math.random() * glukharOpenZones.length)];
                            randomZone = "ZoneRailStrorage";
                        }
                    }
                } else if (randomType === "kaban") {
                    randomType = AllBotTypes.KABAN;
                    supportType = AllBotTypes.KABAN_GUARD_FOLLOWER;
                    supportAmount = "6";
                    supports = null;

                    if (location === "streets") {
                        const kabanSniperAmount = JSON.stringify(bspClassHelpers.generateRandomInteger(1, 2));
                        initJson.push(bspClassHelpers.generateBot(AllBotTypes.KABAN_SNIPER_FOLLOWER, 100, "ZoneCarShowroom_main_roof", randomDifficulty, AllBotTypes.KABAN_SNIPER_FOLLOWER, kabanSniperAmount, 9999, null, "BossBoarBorn", "botEvent", 0));
                        
                        if (onlyVanillaOpenZones) {
                            randomZone = "ZoneCarShowroom";
                        }
                    }
                } else if (randomType === "killa") {
                    randomType = AllBotTypes.KILLA;
                    supportType = AllBotTypes.RAIDER;
                    supportAmount = "0";
                    supports = null;

                    if (onlyVanillaOpenZones) {
                        if (location === "interchange") {
                            //const killaOpenZones = ["ZoneCenterBot", "ZoneCenter", "ZoneOLI", "ZoneIDEA", "ZoneGoshan", "ZoneIDEAPark", "ZoneOLIPark"];
                            //randomZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                            randomZone = "ZoneCenter";
                        } else if (location === "streets") {
                            const killaOpenZones = ["ZoneHotel_1", "ZoneHotel_2"];
                            randomZone = killaOpenZones[Math.floor(Math.random() * killaOpenZones.length)];
                        }
                    }
                } else if (randomType === "knight") {
                    randomType = AllBotTypes.KNIGHT;
                    supportType = AllBotTypes.ROGUE;
                    supportAmount = "2";
                    supports = [
                        AllBotTypes.BIGPIPE,
                        AllBotTypes.BIRDEYE
                    ].map(bossEscortType => ({
                        BossEscortType: bossEscortType,
                        BossEscortDifficult: [randomDifficulty],
                        BossEscortAmount: "1"
                    }));

                    if (onlyVanillaOpenZones) {
                        if (location === "customs") {
                            randomZone = "ZoneScavBase";
                        } else if (location === "lighthouse") {
                            const knightOpenZones = ["Zone_TreatmentContainers","Zone_Chalet"];
                            randomZone = knightOpenZones[Math.floor(Math.random() * knightOpenZones.length)];
                        } else if (location === "shoreline") {
                            randomZone = "ZoneMeteoStation";
                        } else if (location === "woods") {
                            randomZone = "ZoneScavBase2";
                        }
                    }
                } else if (randomType === "reshala") {
                    randomType = AllBotTypes.RESHALA;
                    supportType = AllBotTypes.RESHALA_FOLLOWER;
                    supportAmount = "4";
                    supports = null;

                    if (onlyVanillaOpenZones && location === "customs") {
                        const reshalaOpenZones = ["ZoneDormitory","ZoneGasStation"];
                        randomZone = reshalaOpenZones[Math.floor(Math.random() * reshalaOpenZones.length)];
                    }
                } else if (randomType === "sanitar") {
                    randomType = AllBotTypes.SANITAR;
                    supportType = AllBotTypes.SANITAR_FOLLOWER;
                    supportAmount = "2";
                    supports = null;

                    if (onlyVanillaOpenZones && location === "shoreline") {
                        const sanitarOpenZones = ["ZonePort","ZoneGreenHouses","ZoneSanatorium1","ZoneGreenHouses","ZoneSanatorium2"];
                        randomZone = sanitarOpenZones[Math.floor(Math.random() * sanitarOpenZones.length)];
                        supportAmount = JSON.stringify(bspClassHelpers.generateRandomInteger(2, 3));
                    }
                } else if (randomType === "shturman") {
                    randomType = AllBotTypes.SHTURMAN;
                    supportType = AllBotTypes.SHTURMAN_FOLLOWER;
                    supportAmount = "2";
                    supports = null;

                    if (onlyVanillaOpenZones && location === "woods") {
                        randomZone = "ZoneWoodCutter";
                    }
                } else if (randomType === "tagilla") {
                    randomType = AllBotTypes.TAGILLA;
                    supportType = AllBotTypes.RESHALA_FOLLOWER;
                    supportAmount = "0";
                    supports = null;
                } else if (randomType === "zryachiy") {
                    randomType = AllBotTypes.ZRYACHIY;
                    supportType = AllBotTypes.ZRYACHIY_FOLLOWER;
                    supportAmount = "2";
                    supports = null;

                    if (onlyVanillaOpenZones && location === "lighthouse") {
                        randomZone = "Zone_Island";
                        randomChance = 100;
                    }
                }

                initJson.push(bspClassHelpers.generateBot(randomType, randomChance, randomZone, randomDifficulty, supportType, supportAmount, randomTime + timeInterval, supports, "", "", 0));

                if (countInterval === spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateCultists(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, onlyVanillaOpenZones, openZones } = importPresetJson[location].cultists;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && bspClassHelpers.checkProperties(botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for cultists on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for cultists on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);
            let countOpenZone1 = 0;
            //let countOpenZone2 = 0;

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);
                
                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;
                
                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                if (onlyVanillaOpenZones && location === "shoreline") {
                    const zoneArr1 = ["ZoneForestGasStation","ZoneForestSpawn"];
                    const newZone1 = zoneArr1[Math.floor(Math.random() * zoneArr1.length)];

                    if (randomZone === "ZoneForestGasStation" || randomZone === "ZoneForestSpawn") {
                        if (countOpenZone1 > 0) {
                            countOpenZone1--;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, newZone1, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        } else {
                            countOpenZone1++;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, randomZone, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        }
                    }
                    /*
                    const zoneArr1 = ["ZoneSanatorium1","ZoneSanatorium2"];
                    const newZone1 = zoneArr1[Math.floor(Math.random() * zoneArr1.length)];

                    const zoneArr2 = ["ZoneForestGasStation","ZoneForestSpawn"];
                    const newZone2 = zoneArr2[Math.floor(Math.random() * zoneArr2.length)];

                    if (randomZone === "ZoneForestGasStation" || randomZone === "ZoneForestSpawn") {
                        if (countOpenZone1 > 0) {
                            countOpenZone1--;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, newZone1, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        } else {
                            countOpenZone1++;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, randomZone, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        }
                    } else {
                        if (countOpenZone2 > 0) {
                            countOpenZone2--;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, newZone2, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        } else {
                            countOpenZone2++;
                            initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, randomZone, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                        }
                    }
                    */
                } else {
                    initJson.push(bspClassHelpers.generateBot(AllBotTypes.CULTIST_PRIEST, randomChance, randomZone, randomDifficulty, AllBotTypes.CULTIST_WARRIOR, randomAmount, randomTime + timeInterval, null, "", "", 0));
                }

                if (countInterval === spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateRaiders(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, triggers, onlyVanillaOpenZones, openZones } = importPresetJson[location].raiders;
        
        if (enabled && bspClassHelpers.checkProperties(botDifficulty) && bspClassHelpers.checkProperties(botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0))
        {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for raiders on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for raiders on [${location}]`, LoggerTypes.ERROR);
            }

            if (location === "labs" || location === "reserve") {
                let timeInterval = spawnWaves.interval.time;
                let countInterval = 0;
                let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
                let zoneArray = bspClassHelpers.generateWeightArray(openZones);
                const triggerIdArray = bspClassHelpers.generateWeightArray(triggers);
                let triggerName = "interactObject";
                let countTriggerZone1 = 0;
                let countTriggerZone2 = 0;

                for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                    botChance.min = Math.max(0, Math.min(botChance.min, 100));
                    botChance.max = Math.max(0, Math.min(botChance.max, 100));
                    
                    const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                    const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);
                    
                    let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                    let delayTime = 0;
                    //let delayTime = randomTime + timeInterval;

                    if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                        timeInterval = spawnWaves.initial.time;
                    } else {
                        countInterval++;
                    }

                    randomTime = (randomTime + timeInterval < 0) ? 0 : randomTime;
                    //delayTime = (randomTime + timeInterval < 0) ? 0 : delayTime;

                    difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                    zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;    

                    const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                    let randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);
                    let randomTrigger = bspClassHelpers.removeElementFromWeightArray(triggerIdArray);

                    if (onlyVanillaOpenZones) {
                        if (location === "labs") {
                            const newArr = ["BotZoneBasement","BotZoneFloor1","BotZoneFloor2"];
                            const newRand = newArr[Math.floor(Math.random() * newArr.length)];

                            if (randomTrigger == "autoId_00008_EXFIL" || randomTrigger == "autoId_00010_EXFIL") {
                                randomZone = "BotZoneBasement";
                            }
                            
                            if (randomZone === "BotZoneGate1") {
                                if (countTriggerZone1 >= 1) {
                                    randomZone = newRand;
                                } else {
                                    delete openZones["BotZoneGate1"];
                                    randomTrigger = "autoId_00632_EXFIL";
                                    randomTime = -1;
                                    timeInterval = 0;
                                    delayTime = 8;
                                }

                                countTriggerZone1++;
                            }
                            
                            if (randomZone === "BotZoneGate2") {
                                if (countTriggerZone2 >= 1) {
                                    randomZone = newRand;
                                } else {
                                    delete openZones["BotZoneGate2"];
                                    randomTrigger = "autoId_00014_EXFIL";
                                    randomTime = -1;
                                    timeInterval = 0;
                                    delayTime = 8;
                                }

                                countTriggerZone2++;
                            }
                        } else if (location === "reserve") {
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
                                    randomTime = spawnWaves.interval.time + randomTime;
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
                        }

                        initJson.push(bspClassHelpers.generateBot(AllBotTypes.RAIDER, randomChance, randomZone, randomDifficulty, AllBotTypes.RAIDER, randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, delayTime));
                    } else {
                        initJson.push(bspClassHelpers.generateBot(AllBotTypes.RAIDER, randomChance, randomZone, randomDifficulty, AllBotTypes.RAIDER, randomAmount, randomTime + timeInterval, null, randomTrigger, triggerName, 0));
                    }

                    if (triggerIdArray.length === 0) {
                        randomTrigger = "";
                        triggerName = "";
                    }

                    if (countInterval === spawnWaves.interval.wavesPerInterval) {
                        timeInterval += spawnWaves.interval.time;
                        countInterval = 0;
                    }
                }
            } else {
                let timeInterval = spawnWaves.interval.time;
                let countInterval = 0;
                let zoneArray = bspClassHelpers.generateWeightArray(openZones);
                let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);

                for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                    botChance.min = Math.max(0, Math.min(botChance.min, 100));
                    botChance.max = Math.max(0, Math.min(botChance.max, 100));
                    
                    const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                    const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);
    
                    if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                        timeInterval = spawnWaves.initial.time;
                    } else {
                        countInterval++;
                    }
    
                    let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                    randomTime = Math.max(0, randomTime + timeInterval);
    
                    difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                    zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;
    
                    const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                    const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);
    
                    initJson.push(bspClassHelpers.generateBot(AllBotTypes.RAIDER, randomChance, randomZone, randomDifficulty, AllBotTypes.RAIDER, randomAmount, randomTime + timeInterval, null, "", "", 0));
    
                    if (countInterval == spawnWaves.interval.wavesPerInterval) {
                        timeInterval += spawnWaves.interval.time;
                        countInterval = 0;
                    }
                }
            }
        }
    }

    public generateRogues(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].rogues;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for rogues on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for rogues on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);

                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                initJson.push(bspClassHelpers.generateBot(AllBotTypes.ROGUE, randomChance, randomZone, randomDifficulty, AllBotTypes.ROGUE, randomAmount, randomTime + timeInterval, null, "", "", 0));

                if (countInterval == spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }
    
    public generateBloodhounds(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].bloodhounds;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for bloodhounds on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for bloodhounds on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);

                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                initJson.push(bspClassHelpers.generateBot(AllBotTypes.BLOODHOUND, randomChance, randomZone, randomDifficulty, AllBotTypes.BLOODHOUND, randomAmount, randomTime + timeInterval, null, "", "", 0));

                if (countInterval == spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public generateWeirdScavs(bspClassHelpers: any, presetJsonName: any, initJson: any, location: any, importPresetJson: any): any {
        const { enabled, botDifficulty, botChance, botAmountPerSpawnWave, spawnWaves, openZones } = importPresetJson[location].weirdScavs;

        if (enabled && bspClassHelpers.checkProperties(botDifficulty, botChance) && (spawnWaves.initial.waves !== 0 || spawnWaves.interval.waves !== 0)) {
            if (!bspClassHelpers.checkProperties(openZones)) {
                for (const zone in openZones) {
                    openZones[zone] = 1;
                }
                this.logger.log(`Mod: ${pkg.name} error: failed to load an open zone from "${presetJsonName}" for weird scavs on location [${location}]`, LoggerTypes.ERROR);
                this.logger.log(`> reverted to all open zones being available for weird scavs on [${location}]`, LoggerTypes.ERROR);
            }

            let timeInterval = spawnWaves.interval.time;
            let countInterval = 0;
            let difficultyArray = bspClassHelpers.generateWeightArray(botDifficulty);
            let zoneArray = bspClassHelpers.generateWeightArray(openZones);

            for (let i = 0; i < spawnWaves.initial.waves + spawnWaves.interval.waves; i++) {
                botChance.min = Math.max(0, Math.min(botChance.min, 100));
                botChance.max = Math.max(0, Math.min(botChance.max, 100));
                
                const randomChance = bspClassHelpers.generateRandomInteger(botChance.min, botChance.max);
                const randomAmount = bspClassHelpers.generateRandomNumberFromSequence(botAmountPerSpawnWave);

                if (i < Math.abs(spawnWaves.initial.waves - spawnWaves.interval.wavesPerInterval)) {
                    timeInterval = spawnWaves.initial.time;
                } else {
                    countInterval++;
                }

                let randomTime = bspClassHelpers.generateRandomInteger(spawnWaves.spawnDelay.min, spawnWaves.spawnDelay.max);
                randomTime = Math.max(0, randomTime + timeInterval);

                difficultyArray = difficultyArray.length === 0 ? bspClassHelpers.generateWeightArray(botDifficulty) : difficultyArray;
                zoneArray = zoneArray.length === 0 ? bspClassHelpers.generateWeightArray(openZones) : zoneArray;

                const randomDifficulty = bspClassHelpers.removeElementFromWeightArray(difficultyArray);
                const randomZone = bspClassHelpers.removeElementFromWeightArray(zoneArray);

                initJson.push(bspClassHelpers.generateBot(AllBotTypes.WEIRD_SCAV, randomChance, randomZone, randomDifficulty, AllBotTypes.WEIRD_SCAV, randomAmount, randomTime + timeInterval, null, "", "", 0));

                if (countInterval == spawnWaves.interval.wavesPerInterval) {
                    timeInterval += spawnWaves.interval.time;
                    countInterval = 0;
                }
            }
        }
    }

    public mainSpawnSystem(bspClassHelpers: any, initSpawns: any, location: any, settingsLocations: any, countRandomChanceToDisableMainPreset: any, logsData: any): any {
        const mainSpawnSystemArray = bspClassHelpers.generateWeightArray(settingsLocations[location].main.presets);
        const randomMainPreset = Math.floor(Math.random() * mainSpawnSystemArray.length);

        function processBots(bots, botType, randomizeConfig, location) {
            for (const bot in bots) {
                let timeDelay = "";

                timeDelay = (location === "labs") ? "Delay" : "Time";

                if (randomizeConfig.enabled) {
                    const randomDifficulty = bspClassHelpers.generateWeightArray(randomizeConfig[botType].difficulty);
                    bots[bot][timeDelay] = bots[bot][timeDelay] + bspClassHelpers.generateRandomInteger(randomizeConfig[botType].spawnDelay.min, randomizeConfig[botType].spawnDelay.max);
                    bots[bot].BossDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
                    bots[bot].BossEscortDifficult = randomDifficulty[Math.floor(Math.random() * randomDifficulty.length)];
        
                    if (bots[bot][timeDelay] < 0 && bots[bot][timeDelay] != -1) {
                        bots[bot][timeDelay] = 0;
                    }
                }
        
                if (botType === "bosses") {
                    if (settingsLocations[location].main.enableBosses) {
                        initSpawns.push(bots[bot]);
                    }
                } else {
                    initSpawns.push(bots[bot]);
                }
            }
        }

        if (mainSpawnSystemArray.length != 0) {
            const importMainFile = require(`../db/locations/${location}/main/presets/${mainSpawnSystemArray[randomMainPreset]}.json`);

            if (countRandomChanceToDisableMainPreset <= 1) {
                processBots(importMainFile.pmcs, "pmcs", importMainFile.randomize, location);
                processBots(importMainFile.scavs, "scavs", importMainFile.randomize, location);
                processBots(importMainFile.sniperScavs, "sniperScavs", importMainFile.randomize, location);
                processBots(importMainFile.bosses, "bosses", importMainFile.randomize, location);
                processBots(importMainFile.cultists, "cultists", importMainFile.randomize, location);
                processBots(importMainFile.raiders, "raiders", importMainFile.randomize, location);
                processBots(importMainFile.rogues, "rogues", importMainFile.randomize, location);
                processBots(importMainFile.bloodhounds, "bloodhounds", importMainFile.randomize, location);
                processBots(importMainFile.weirdScavs, "weirdScavs", importMainFile.randomize, location);

                logsData.mainPreset = mainSpawnSystemArray[randomMainPreset];
            }
        }
    }
}