/* 
 * BetterSpawnsPlus v1.0.7
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

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
import { WildSpawnTypeNumber as sptTypes } from "@spt-aki/models/enums/WildSpawnTypeNumber";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import * as path from "path";
import * as fs from "fs";
import pkg from "../package.json"
import presetManager from "../config/presetManager.json";
import botSpawnsCustoms from "../db/locations/customs/botSpawns.json";
import botSpawnsFactory from "../db/locations/factory/botSpawns.json";
import botSpawnsInterchange from "../db/locations/interchange/botSpawns.json";
import botSpawnsLabs from "../db/locations/labs/botSpawns.json";
import botSpawnsLighthouse from "../db/locations/lighthouse/botSpawns.json";
import botSpawnsReserve from "../db/locations/reserve/botSpawns.json";
import botSpawnsShoreline from "../db/locations/shoreline/botSpawns.json";
import botSpawnsStreets from "../db/locations/streets/botSpawns.json";
import botSpawnsWoods from "../db/locations/woods/botSpawns.json";
import pmcDogTags from "../db/bots/pmc/pmcDogTags.json";
import randomCultistEncounters from "../db/experimental/randomCultistEncounters.json";
import randomRaiderEncounters from "../db/experimental/randomRaiderEncounters.json";
import randomRogueEncounters from "../db/experimental/randomRogueEncounters.json";

class BetterSpawnsPlus implements IPostDBLoadMod, IPostAkiLoadMod
{
    private configFileName = presetManager.presetFileName;
    private config = require("../config/presets/" + `${this.configFileName}` + ".json");

    public postDBLoad(container: DependencyContainer): void
    {
        const config = this.config;
        const logger = container.resolve<ILogger>("WinstonLogger");
        const configsAirdrops = container.resolve<ConfigServer>("ConfigServer").getConfig<IAirdropConfig>(ConfigTypes.AIRDROP);
        const configsBots = container.resolve<ConfigServer>("ConfigServer").getConfig<IBotConfig>(ConfigTypes.BOT);
        const configsInraids = container.resolve<ConfigServer>("ConfigServer").getConfig<IInRaidConfig>(ConfigTypes.IN_RAID);
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

        if (config.betterSpawnsPlus)
        {
            logger.log("Mod: " + `${pkg.name}` + " preset: \"" + `${this.configFileName}` + "\" loaded", "cyan");

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // RAIDS                                                                                                                                       //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            if (config.raids.locations.enabled)
            {
                // enable bosses in-game by default
                const bossEnabled = true;
                configsInraids.raidMenuSettings.bossEnabled = bossEnabled;

                // LOCATIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const locations = {
                    "bigmap": "ZoneBlockPost,ZoneBlockPostSniper,ZoneBlockPostSniper3,ZoneBrige,ZoneCrossRoad,ZoneCustoms,ZoneDormitory,ZoneFactoryCenter,ZoneFactorySide,ZoneGasStation,ZoneOldAZS,ZoneScavBase,ZoneSnipeBrige,ZoneSnipeFactory,ZoneSnipeTower,ZoneTankSquare,ZoneWade",
                    "interchange": "ZoneCenter,ZoneCenterBot,ZoneGoshan,ZoneIDEA,ZoneIDEAPark,ZoneOLI,ZoneOLIPark,ZonePowerStation,ZoneRoad,ZoneTrucks",
                    "laboratory": "BotZoneBasement,BotZoneFloor1,BotZoneFloor2,BotZoneGate1,BotZoneGate2",
                    "lighthouse": "Zone_Blockpost,Zone_Bridge,Zone_Chalet,Zone_Containers,Zone_DestroyedHouse,Zone_Hellicopter,Zone_Island,Zone_LongRoad,Zone_OldHouse,Zone_Rocks,Zone_RoofBeach,Zone_RoofContainers,Zone_RoofRocks,Zone_SniperPeak,Zone_TreatmentBeach,Zone_TreatmentContainers,Zone_TreatmentRocks,Zone_Village",
                    "rezervbase": "ZoneBarrack,ZoneBunkerStorage,ZonePTOR1,ZonePTOR2,ZoneRailStrorage,ZoneSubCommand,ZoneSubStorage",
                    "shoreline": "ZoneBunker,ZoneBunkeSniper,ZoneBusStation,ZoneForestGasStation,ZoneForestSpawn,ZoneForestTruck,ZoneGasStation,ZoneGreenHouses,ZoneIsland,ZoneMeteoStation,ZonePassClose,ZonePassFar,ZonePort,ZonePowerStation,ZonePowerStationSniper,ZoneRailWays,ZoneSanatorium1,ZoneSanatorium2,ZoneTunnel,ZoneStartVillage",
                    "tarkovstreets": "ZoneCarShowroom,ZoneCinema,ZoneColumn,ZoneConcordia_1,ZoneConcordia_2,ZoneConcordiaParking,ZoneConstruction,ZoneFactory,ZoneHotel_1,ZoneHotel_2,ZoneSnipeBuilding,ZoneSnipeCarShowroom,ZoneSnipeCinema,ZoneSnipeSW01,ZoneSW01",
                    "woods": "ZoneBigRocks,ZoneBrokenVill,ZoneClearVill,ZoneHighRocks,ZoneHouse,ZoneMiniHouse,ZoneRedHouse,ZoneRoad,ZoneScavBase2,ZoneWoodCutter"
                }

                // all open zones
                for (const location in locations)
                {
                    databaseLocations[location].base.OpenZones = locations[location];
                }

                // CUSTOMS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const customs = config.raids.locations.customs;

                // better spawns
                if (customs.betterSpawns.enabled)
                {
                    // pmcs and scav spawns
                    const baseCustoms = botSpawnsCustoms.baseSpawns;

                    databaseLocations.bigmap.base.waves = [];
                    databaseLocations.bigmap.base.BossLocationSpawn = baseCustoms;

                    // boss spawns
                    if (customs.betterSpawns.bosses.enabled)
                    {
                        const bossesCustoms = botSpawnsCustoms.bossSpawns;

                        bossesCustoms[0].BossChance = customs.betterSpawns.bosses.chance.knight;
                        bossesCustoms[1].BossChance = customs.betterSpawns.bosses.chance.reshala;

                        for (const boss in bossesCustoms)
                        {
                            baseCustoms.push(bossesCustoms[boss]);
                        }
                    }

                    // cultist spawns
                    if (customs.betterSpawns.cultists.enabled)
                    {
                        const cultistsCustoms = botSpawnsCustoms.cultistSpawns;

                        cultistsCustoms[0].BossChance = customs.betterSpawns.cultists.chance;

                        for (const cultist in cultistsCustoms)
                        {
                            baseCustoms.push(cultistsCustoms[cultist]);
                        }
                    }

                    // sniper spawns
                    if (!customs.betterSpawns.snipers.enabled)
                    {
                        for (const x in baseCustoms)
                        {
                            if (baseCustoms[x].BossName == "marksman")
                            {
                                baseCustoms[x].BossChance = 0;
                            }
                        }
                    }
                }

                // raid settings
                if (customs.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.bigmap.base.exit_access_time = customs.settings.escapeTimeLimit + 20;
                    databaseLocations.bigmap.base.EscapeTimeLimit = customs.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.customs = customs.settings.maxBotCap;
                }

                // airdrops
                if (customs.airdrops.enabled)
                {        
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.bigmap = customs.airdrops.airdropChance;
                    
                    // airdrop end time
                    if (customs.settings.enabled)
                    {
                        databaseLocations.bigmap.base.AirdropParameters["PlaneAirdropEnd"] = customs.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.bigmap.base.AirdropParameters["PlaneAirdropMax"] = customs.airdrops.airdropsPerRaid;
                }

                // loot
                if (customs.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.bigmap.base.GlobalLootChanceModifier = customs.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.bigmap = customs.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.bigmap = customs.loot.staticLootMultiplier;
                }

                // FACTORY //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const factory = config.raids.locations.factory;

                // better spawns
                if (factory.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseFactory = botSpawnsFactory.baseSpawns;

                    databaseLocations.factory4_day.base.waves = [];
                    databaseLocations.factory4_night.base.waves = [];
                    databaseLocations.factory4_day.base.BossLocationSpawn = baseFactory;
                    databaseLocations.factory4_night.base.BossLocationSpawn = baseFactory;

                    // boss spawns
                    if (factory.betterSpawns.bosses.enabled)
                    {
                        const bossesFactory = botSpawnsFactory.bossSpawns;

                        bossesFactory[0].BossChance = factory.betterSpawns.bosses.chance.tagilla;

                        for (const i in bossesFactory)
                        {
                            baseFactory.push(bossesFactory[i]);
                        }
                    }

                    // cultist spawns
                    if (factory.betterSpawns.cultists.enabled)
                    {
                        const cultistsFactory = botSpawnsFactory.cultistSpawns;

                        cultistsFactory[0].BossChance = factory.betterSpawns.cultists.chance;

                        for (const cultist in cultistsFactory)
                        {
                            baseFactory.push(cultistsFactory[cultist]);
                        }
                    }
                }

                // raid settings
                if (factory.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.factory4_day.base.exit_access_time = factory.settings.escapeTimeLimit + 20;
                    databaseLocations.factory4_night.base.exit_access_time = factory.settings.escapeTimeLimit + 20;
                    databaseLocations.factory4_day.base.EscapeTimeLimit = factory.settings.escapeTimeLimit;
                    databaseLocations.factory4_night.base.EscapeTimeLimit = factory.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.factory = factory.settings.maxBotCap;
                }

                // loot
                if (factory.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.factory4_day.base.GlobalLootChanceModifier = factory.loot.globalLootChanceModifier;
                    databaseLocations.factory4_night.base.GlobalLootChanceModifier = factory.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.factory4_day = factory.loot.looseLootMultiplier;
                    configsLocations.looseLootMultiplier.factory4_night = factory.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.factory4_day = factory.loot.staticLootMultiplier;
                    configsLocations.staticLootMultiplier.factory4_night = factory.loot.staticLootMultiplier;
                }

                // INTERCHANGE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const interchange = config.raids.locations.interchange;

                // better spawns
                if (interchange.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseInterchange = botSpawnsInterchange.baseSpawns;

                    databaseLocations.interchange.base.waves = [];
                    databaseLocations.interchange.base.BossLocationSpawn = baseInterchange;

                    // boss spawns
                    if (interchange.betterSpawns.bosses.enabled)
                    {
                        const bossesInterchange = botSpawnsInterchange.bossSpawns;

                        bossesInterchange[0].BossChance = interchange.betterSpawns.bosses.chance.killa;

                        for (const boss in bossesInterchange)
                        {
                            baseInterchange.push(bossesInterchange[boss]);
                        }
                    }
                }

                // raid settings
                if (interchange.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.interchange.base.exit_access_time = interchange.settings.escapeTimeLimit + 20;
                    databaseLocations.interchange.base.EscapeTimeLimit = interchange.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.interchange = interchange.settings.maxBotCap;
                }

                // airdrops
                if (interchange.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.interchange = interchange.airdrops.airdropChance;

                    // airdrop end time
                    if (interchange.settings.enabled)
                    {
                        databaseLocations.interchange.base.AirdropParameters["PlaneAirdropEnd"] = interchange.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.interchange.base.AirdropParameters["PlaneAirdropMax"] = interchange.airdrops.airdropsPerRaid;
                }

                // loot
                if (interchange.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.interchange.base.GlobalLootChanceModifier = interchange.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.interchange = interchange.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.interchange = interchange.loot.staticLootMultiplier;
                }

                // THE LAB //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const labs = config.raids.locations.labs;

                // better spawns
                if (labs.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseLabs = botSpawnsLabs.baseSpawns;

                    databaseLocations.laboratory.base.waves = [];
                    databaseLocations.laboratory.base.BossLocationSpawn = baseLabs;

                    // raider spawns
                    const raidersLabs = botSpawnsLabs.raiderSpawns;
                    for (const raider in raidersLabs)
                    {
                        baseLabs.push(raidersLabs[raider]);
                    }
                }

                // raid settings
                if (labs.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.laboratory.base.exit_access_time = labs.settings.escapeTimeLimit + 20;
                    databaseLocations.laboratory.base.EscapeTimeLimit = labs.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.laboratory = labs.settings.maxBotCap;
                }

                // loot
                if (labs.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.laboratory.base.GlobalLootChanceModifier = labs.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.laboratory = labs.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.laboratory = labs.loot.staticLootMultiplier;
                }

                // LIGHTHOUSE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const lighthouse = config.raids.locations.lighthouse;

                // better spawns
                if (lighthouse.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseLighthouse = botSpawnsLighthouse.baseSpawns;

                    databaseLocations.lighthouse.base.waves = [];
                    databaseLocations.lighthouse.base.BossLocationSpawn = baseLighthouse;

                    // boss spawns
                    if (lighthouse.betterSpawns.bosses.enabled)
                    {
                        const bossesLighthouse = botSpawnsLighthouse.bossSpawns;

                        bossesLighthouse[0].BossChance = lighthouse.betterSpawns.bosses.chance.knight;
                        bossesLighthouse[1].BossChance = lighthouse.betterSpawns.bosses.chance.zryachiy;

                        for (const boss in bossesLighthouse)
                        {
                            baseLighthouse.push(bossesLighthouse[boss]);
                        }
                    }

                    // rogue spawns
                    const roguesLighthouse = botSpawnsLighthouse.rogueSpawns;
                    for (const rogue in roguesLighthouse)
                    {
                        baseLighthouse.push(roguesLighthouse[rogue]);
                    }

                    // sniper spawns
                    if (!lighthouse.betterSpawns.snipers.enabled)
                    {
                        for (const x in baseLighthouse)
                        {
                            if (baseLighthouse[x].BossName == "marksman")
                            {
                                baseLighthouse[x].BossChance = 0;
                            }
                        }
                    }
                }

                // raid settings
                if (lighthouse.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.lighthouse.base.exit_access_time = lighthouse.settings.escapeTimeLimit + 20;
                    databaseLocations.lighthouse.base.EscapeTimeLimit = lighthouse.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.lighthouse = lighthouse.settings.maxBotCap;
                }

                // airdrops
                if (lighthouse.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.lighthouse = lighthouse.airdrops.airdropChance;

                    // airdrop end time
                    if (lighthouse.settings.enabled)
                    {
                        databaseLocations.lighthouse.base.AirdropParameters["PlaneAirdropEnd"] = lighthouse.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.lighthouse.base.AirdropParameters["PlaneAirdropMax"] = lighthouse.airdrops.airdropsPerRaid;
                }

                // armored train exit time
                for (const exfil in databaseLocations.lighthouse.base.exits)
                {
                    if (databaseLocations.lighthouse.base.exits[exfil].Name == "EXFIL_Train")
                    {
                        databaseLocations.lighthouse.base.exits[exfil].MinTime = lighthouse.settings.escapeTimeLimit * 60 * 0.5;
                        databaseLocations.lighthouse.base.exits[exfil].MaxTime = (lighthouse.settings.escapeTimeLimit * 60) - 300;
                    }
                }

                // loot
                if (lighthouse.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.lighthouse.base.GlobalLootChanceModifier = lighthouse.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.lighthouse = lighthouse.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.lighthouse = lighthouse.loot.staticLootMultiplier;
                }

                // RESERVE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const reserve = config.raids.locations.reserve;

                // better spawns
                if (reserve.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseReserve = botSpawnsReserve.baseSpawns;

                    databaseLocations.rezervbase.base.waves = [];
                    databaseLocations.rezervbase.base.BossLocationSpawn = baseReserve;

                    // boss spawns
                    if (reserve.betterSpawns.bosses.enabled)
                    {
                        const bossesReserve = botSpawnsReserve.bossSpawns;

                        bossesReserve[0].BossChance = reserve.betterSpawns.bosses.chance.glukhar;

                        for (const boss in bossesReserve)
                        {
                            baseReserve.push(bossesReserve[boss]);
                        }
                    }

                    // raider spawns
                    const raidersReserve = botSpawnsReserve.raiderSpawns;
                    for (const raider in raidersReserve)
                    {
                        baseReserve.push(raidersReserve[raider]);
                    }
                }

                // raid settings
                if (reserve.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.rezervbase.base.exit_access_time = reserve.settings.escapeTimeLimit + 20;
                    databaseLocations.rezervbase.base.EscapeTimeLimit = reserve.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.rezervbase = reserve.settings.maxBotCap;
                }

                // airdrops
                if (reserve.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.reserve = reserve.airdrops.airdropChance;

                    // airdrop end time
                    if (reserve.settings.enabled)
                    {
                        databaseLocations.rezervbase.base.AirdropParameters["PlaneAirdropEnd"] = reserve.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.rezervbase.base.AirdropParameters["PlaneAirdropMax"] = reserve.airdrops.airdropsPerRaid;
                }

                // armored train exit time
                for (const exfil in databaseLocations.rezervbase.base.exits)
                {
                    if (databaseLocations.rezervbase.base.exits[exfil].Name == "EXFIL_Train")
                    {
                        databaseLocations.rezervbase.base.exits[exfil].MinTime = reserve.settings.escapeTimeLimit * 60 * 0.5;
                        databaseLocations.rezervbase.base.exits[exfil].MaxTime = (reserve.settings.escapeTimeLimit * 60) - 300;
                    }
                }

                // loot
                if (reserve.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.rezervbase.base.GlobalLootChanceModifier = reserve.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.rezervbase = reserve.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.rezervbase = reserve.loot.staticLootMultiplier;
                }

                // SHORELINE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const shoreline = config.raids.locations.shoreline;

                // better spawns
                if (shoreline.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseShoreline = botSpawnsShoreline.baseSpawns;

                    databaseLocations.shoreline.base.waves = [];
                    databaseLocations.shoreline.base.BossLocationSpawn = baseShoreline;

                    // boss spawns
                    if (shoreline.betterSpawns.bosses.enabled)
                    {
                        const bossesShoreline = botSpawnsShoreline.bossSpawns;

                        bossesShoreline[0].BossChance = shoreline.betterSpawns.bosses.chance.knight;
                        bossesShoreline[1].BossChance = shoreline.betterSpawns.bosses.chance.sanitar;

                        for (const boss in bossesShoreline)
                        {
                            baseShoreline.push(bossesShoreline[boss]);
                        }
                    }

                    // cultist spawns
                    if (shoreline.betterSpawns.cultists.enabled)
                    {
                        const cultistsShoreline = botSpawnsShoreline.cultistSpawns;

                        cultistsShoreline[0].BossChance = shoreline.betterSpawns.cultists.chance;
                        cultistsShoreline[1].BossChance = shoreline.betterSpawns.cultists.chance;

                        for (const cultist in cultistsShoreline)
                        {
                            baseShoreline.push(cultistsShoreline[cultist]);
                        }
                    }

                    // sniper spawns
                    if (!shoreline.betterSpawns.snipers.enabled)
                    {
                        for (const x in baseShoreline)
                        {
                            if (baseShoreline[x].BossName == "marksman")
                            {
                                baseShoreline[x].BossChance = 0;
                            }
                        }
                    }
                }

                // raid settings
                if (shoreline.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.shoreline.base.exit_access_time = shoreline.settings.escapeTimeLimit + 20;
                    databaseLocations.shoreline.base.EscapeTimeLimit = shoreline.settings.escapeTimeLimit;

                    // max amount of bots
                    configsBots.maxBotCap.shoreline = shoreline.settings.maxBotCap;
                }

                // airdrops
                if (shoreline.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.shoreline = shoreline.airdrops.airdropChance;

                    // airdrop end time
                    if (shoreline.settings.enabled)
                    {
                        databaseLocations.shoreline.base.AirdropParameters["PlaneAirdropEnd"] = shoreline.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.shoreline.base.AirdropParameters["PlaneAirdropMax"] = shoreline.airdrops.airdropsPerRaid;
                }

                // loot
                if (shoreline.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.shoreline.base.GlobalLootChanceModifier = shoreline.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.shoreline = shoreline.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.shoreline = shoreline.loot.staticLootMultiplier;
                }

                // STREETS OF TARKOV ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                
                const streets = config.raids.locations.streets;

                // better spawns
                if (streets.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseStreets = botSpawnsStreets.baseSpawns;

                    databaseLocations.tarkovstreets.base.waves = [];
                    databaseLocations.tarkovstreets.base.BossLocationSpawn = baseStreets;

                    // boss spawns
                    if (streets.betterSpawns.bosses.enabled)
                    {
                        const bossesStreets = botSpawnsStreets.bossSpawns;

                        bossesStreets[0].BossChance = streets.betterSpawns.bosses.chance.glukhar;
                        bossesStreets[1].BossChance = streets.betterSpawns.bosses.chance.killa;

                        for (const boss in bossesStreets)
                        {
                            baseStreets.push(bossesStreets[boss]);
                        }
                    }

                    // sniper spawns
                    if (!streets.betterSpawns.snipers.enabled)
                    {
                        for (const x in baseStreets)
                        {
                            if (baseStreets[x].BossName == "marksman")
                            {
                                baseStreets[x].BossChance = 0;
                            }
                        }
                    }
                }

                // raid settings
                if (streets.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.tarkovstreets.base.exit_access_time = streets.settings.escapeTimeLimit + 20;
                    databaseLocations.tarkovstreets.base.EscapeTimeLimit = streets.settings.escapeTimeLimit;
                    
                    // max amount of bots
                    configsBots.maxBotCap["streets of tarkov"] = streets.settings.maxBotCap;
                }

                // airdrops
                if (streets.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.tarkovStreets = streets.airdrops.airdropChance;

                    // airdrop end time
                    if (streets.settings.enabled)
                    {
                        databaseLocations.tarkovstreets.base.AirdropParameters["PlaneAirdropEnd"] = streets.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.tarkovstreets.base.AirdropParameters["PlaneAirdropMax"] = streets.airdrops.airdropsPerRaid;
                }

                // loot
                if (streets.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.tarkovstreets.base.GlobalLootChanceModifier = streets.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.tarkovstreets = streets.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.tarkovstreets = streets.loot.staticLootMultiplier;
                }

                // WOODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const woods = config.raids.locations.woods;

                // better spawns
                if (woods.betterSpawns.enabled)
                {
                    // pmc and scav spawns
                    const baseWoods = botSpawnsWoods.baseSpawns;

                    databaseLocations.woods.base.waves = [];
                    databaseLocations.woods.base.BossLocationSpawn = baseWoods;

                    // boss spawns
                    if (woods.betterSpawns.bosses.enabled)
                    {
                        const bossesWoods = botSpawnsWoods.bossSpawns;

                        bossesWoods[0].BossChance = woods.betterSpawns.bosses.chance.knight;
                        bossesWoods[1].BossChance = woods.betterSpawns.bosses.chance.shturman;

                        for (const boss in bossesWoods)
                        {
                            baseWoods.push(bossesWoods[boss]);
                        }
                    }

                    // cultist spawns
                    if (woods.betterSpawns.cultists.enabled)
                    {
                        const cultistsWoods = botSpawnsWoods.cultistSpawns;

                        cultistsWoods[0].BossChance = woods.betterSpawns.cultists.chance;

                        for (const cultist in cultistsWoods)
                        {
                            baseWoods.push(cultistsWoods[cultist]);
                        }
                    }

                    // sniper spawns
                    if (!woods.betterSpawns.snipers.enabled)
                    {
                        for (const x in baseWoods)
                        {
                            if (baseWoods[x].BossName == "marksman")
                            {
                                baseWoods[x].BossChance = 0;
                            }
                        }
                    }
                }

                // raid settings
                if (woods.settings.enabled)
                {
                    // raid time limit
                    databaseLocations.woods.base.exit_access_time = woods.settings.escapeTimeLimit + 20;
                    databaseLocations.woods.base.EscapeTimeLimit = woods.settings.escapeTimeLimit;
                    
                    // max amount of bots
                    configsBots.maxBotCap.woods = woods.settings.maxBotCap;
                }

                // airdrops
                if (woods.airdrops.enabled)
                {
                    // airdrop chance
                    configsAirdrops.airdropChancePercent.woods = woods.airdrops.airdropChance;

                    // airdrop end time
                    if (woods.settings.enabled)
                    {
                        databaseLocations.woods.base.AirdropParameters["PlaneAirdropEnd"] = woods.settings.escapeTimeLimit * 60 * 0.75;
                    }

                    // max airdrops
                    databaseLocations.woods.base.AirdropParameters["PlaneAirdropMax"] = woods.airdrops.airdropsPerRaid;
                }

                // loot
                if (woods.loot.enabled)
                {
                    // global loot chance modifier
                    databaseLocations.woods.base.GlobalLootChanceModifier = woods.loot.globalLootChanceModifier;

                    // loose loot multiplier
                    configsLocations.looseLootMultiplier.woods = woods.loot.looseLootMultiplier;

                    // static loot multiplier
                    configsLocations.staticLootMultiplier.woods = woods.loot.staticLootMultiplier;
                }

                // EXTRACTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (config.raids.extractions.enabled)
                {
                    // make all exfil locations available regardless of player entry points
                    if (config.raids.extractions.openAllExfilsRegardlessOfEntryPoint)
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
                    }

                    for (const i in databaseLocations)
                    {
                        if (i !== "base")
                        {
                            for (const x in databaseLocations[i].base.exits)
                            {
                                // remove extraction restrictions
                                if (config.raids.extractions.removeExtractionRestrictions)
                                {
                                    if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train" && 
                                    !databaseLocations[i].base.exits[x].Name.includes("lab") || 
                                    databaseLocations[i].base.exits[x].Name === "lab_Vent")
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

                                // make all exfil locations always available
                                if (config.raids.extractions.allExtractionsAlwaysAvailable)
                                {
                                    if (databaseLocations[i].base.exits[x].Name !== "EXFIL_Train")
                                    {
                                        databaseLocations[i].base.exits[x].Chance = 100;
                                    }
                                }
                            }
                        }
                    }
                }

                // AIRDROPS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (config.raids.airdrops.enabled)
                {                    
                    configsAirdrops.airdropMinStartTimeSeconds = config.raids.airdrops.airdropMinStartTime * 60;
                    configsAirdrops.airdropMaxStartTimeSeconds = config.raids.airdrops.airdropMaxStartTime * 60;
                    configsAirdrops.planeMinFlyHeight = 550;
                    configsAirdrops.planeMaxFlyHeight = 600;
                    configsAirdrops.planeVolume = config.raids.airdrops.planeVolume * 0.01;
                }

                // EXPERIMENTAL /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // random cultist encounters
                if (config.raids.experimental.randomCultistEncounters.enabled)
                {
                    // chance of random cultist encounters
                    randomCultistEncounters.randomCultistsCustoms[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsInterchange[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsLighthouse[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsReserve[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsShoreline[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsStreets[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;
                    randomCultistEncounters.randomCultistsWoods[0].BossChance = config.raids.experimental.randomCultistEncounters.chance;

                    // amount of cultists in each encounter
                    randomCultistEncounters.randomCultistsCustoms[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsInterchange[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsLighthouse[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsReserve[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsShoreline[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsStreets[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;
                    randomCultistEncounters.randomCultistsWoods[0].BossEscortAmount = config.raids.experimental.randomCultistEncounters.botAmount;

                    // add encounters to each location
                    botSpawnsCustoms.baseSpawns.push(randomCultistEncounters.randomCultistsCustoms[0]);
                    botSpawnsInterchange.baseSpawns.push(randomCultistEncounters.randomCultistsInterchange[0]);
                    botSpawnsLighthouse.baseSpawns.push(randomCultistEncounters.randomCultistsLighthouse[0]);
                    botSpawnsReserve.baseSpawns.push(randomCultistEncounters.randomCultistsReserve[0]);
                    botSpawnsShoreline.baseSpawns.push(randomCultistEncounters.randomCultistsShoreline[0]);
                    botSpawnsStreets.baseSpawns.push(randomCultistEncounters.randomCultistsStreets[0]);
                    botSpawnsWoods.baseSpawns.push(randomCultistEncounters.randomCultistsWoods[0]);
                }

                // random raider encounters
                if (config.raids.experimental.randomRaiderEncounters.enabled)
                {
                    // chance of random raider encounters
                    randomRaiderEncounters.randomRaidersCustoms[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersInterchange[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersLighthouse[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersReserve[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersShoreline[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersStreets[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;
                    randomRaiderEncounters.randomRaidersWoods[0].BossChance = config.raids.experimental.randomRaiderEncounters.chance;

                    // amount of raiders in each encounter
                    randomRaiderEncounters.randomRaidersCustoms[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersInterchange[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersLighthouse[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersReserve[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersShoreline[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersStreets[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;
                    randomRaiderEncounters.randomRaidersWoods[0].BossEscortAmount = config.raids.experimental.randomRaiderEncounters.botAmount;

                    // add encounters to each location
                    botSpawnsCustoms.baseSpawns.push(randomRaiderEncounters.randomRaidersCustoms[0]);
                    botSpawnsInterchange.baseSpawns.push(randomRaiderEncounters.randomRaidersInterchange[0]);
                    botSpawnsLighthouse.baseSpawns.push(randomRaiderEncounters.randomRaidersLighthouse[0]);
                    botSpawnsReserve.baseSpawns.push(randomRaiderEncounters.randomRaidersReserve[0]);
                    botSpawnsShoreline.baseSpawns.push(randomRaiderEncounters.randomRaidersShoreline[0]);
                    botSpawnsStreets.baseSpawns.push(randomRaiderEncounters.randomRaidersStreets[0]);
                    botSpawnsWoods.baseSpawns.push(randomRaiderEncounters.randomRaidersWoods[0]);
                }

                // random rogue encounters
                if (config.raids.experimental.randomRogueEncounters.enabled)
                {
                    // chance of random rogue encounters
                    randomRogueEncounters.randomRogueCustoms[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueInterchange[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueLighthouse[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueReserve[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueShoreline[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueStreets[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;
                    randomRogueEncounters.randomRogueWoods[0].BossChance = config.raids.experimental.randomRogueEncounters.chance;

                    // amount of rogue in each encounter
                    randomRogueEncounters.randomRogueCustoms[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueInterchange[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueLighthouse[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueReserve[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueShoreline[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueStreets[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;
                    randomRogueEncounters.randomRogueWoods[0].BossEscortAmount = config.raids.experimental.randomRogueEncounters.botAmount;

                    // add encounters to each location
                    botSpawnsCustoms.baseSpawns.push(randomRogueEncounters.randomRogueCustoms[0]);
                    botSpawnsInterchange.baseSpawns.push(randomRogueEncounters.randomRogueInterchange[0]);
                    botSpawnsLighthouse.baseSpawns.push(randomRogueEncounters.randomRogueLighthouse[0]);
                    botSpawnsReserve.baseSpawns.push(randomRogueEncounters.randomRogueReserve[0]);
                    botSpawnsShoreline.baseSpawns.push(randomRogueEncounters.randomRogueShoreline[0]);
                    botSpawnsStreets.baseSpawns.push(randomRogueEncounters.randomRogueStreets[0]);
                    botSpawnsWoods.baseSpawns.push(randomRogueEncounters.randomRogueWoods[0]);
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // BOTS                                                                                                                                        //
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const pmcConvertChance = {
                    "convertIntoPmcChance": {
                        "assault": {
                            "min": 0,
                            "max": 0
                        },
                        "cursedassault": {
                            "min": 0,
                            "max": 0
                        },
                        "pmcbot": {
                            "min": 0,
                            "max": 0
                        },
                        "exusec": {
                            "min": 0,
                            "max": 0
                        }
                    }  
                }

                const botTypes = [
                    "assault",
                    "cursedassault",
                    "pmcbot",
                    "exusec"
                ];

                // chance that a scav, cursed scav, raider, or rogue spawns as a PMC
                botTypes.forEach(function(botType)
                {
                    configsBots.pmc.convertIntoPmcChance[botType].min = pmcConvertChance.convertIntoPmcChance[botType].min;
                    configsBots.pmc.convertIntoPmcChance[botType].max = pmcConvertChance.convertIntoPmcChance[botType].max;
                });

                const bearTypeChance = {
                    "pmcBotType": {
                        "bossKilla": 4,
                        "bossKnight": 3,
                        "bossGluhar": 1,
                        "bossSanitar": 5,
                        "bossTagilla": 1,
                        "followerGluharAssault": 1,
                        "followerBully": 1,
                        "followerBigPipe": 4,
                        "followerSanitar": 1,
                        "assault": 4,
                        "cursedAssault": 2,
                        "exUsec": 2,
                        "pmcBot": 5
                    }
                }

                const usecTypeChance = {
                    "pmcBotType": {
                        "bossKilla": 4,
                        "bossKnight": 3,
                        "bossGluhar": 1,
                        "bossSanitar": 5,
                        "bossTagilla": 1,
                        "followerGluharAssault": 1,
                        "followerBully": 1,
                        "followerBigPipe": 4,
                        "followerSanitar": 1,
                        "assault": 4,
                        "cursedAssault": 2,
                        "exUsec": 2,
                        "pmcBot": 5
                    }
                }

                const maps = [
                    "bigmap",
                    "factory4_day",
                    "factory4_night",
                    "interchange",
                    "laboratory",
                    "lighthouse",
                    "rezervbase",
                    "shoreline",
                    "tarkovstreets",
                    "woods"
                ];
                
                // chance that a PMC will spawn with a different bot brain type
                maps.forEach(function(map)
                {
                    configsBots.pmc.pmcType.sptbear[map] = bearTypeChance.pmcBotType;
                    configsBots.pmc.pmcType.sptusec[map] = usecTypeChance.pmcBotType;
                });

                // generate a larger number of preset batches for usec and bear
                configsBots.presetBatch[sptTypes.SPTUSEC] = 40;
                configsBots.presetBatch[sptTypes.SPTBEAR] = 40;
                configsBots.botGenerationBatchSizePerType = 20;
            }

            // PMC //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (config.bots.enabled)
            {
                // bot level relative to player level
                configsBots.pmc.botRelativeLevelDeltaMax = config.bots.pmc.botLevelRelativeToPlayerLevel;

                // chance that a PMC of the same faction will be hostile to player
                configsBots.pmc.chanceSameSideIsHostilePercent = config.bots.pmc.chanceSameFactionIsHostile;

                // custom dog tags
                if (config.bots.pmc.customPmcDogTags)
                {
                    databaseBots.types.usec.firstName = pmcDogTags.firstName;
                    databaseBots.types.usec.lastName = [];
                    databaseBots.types.bear.firstName = pmcDogTags.firstName;
                    databaseBots.types.bear.lastName = [];
                }

                const botDifficulty = [
                    "easy",
                    "normal",
                    "hard",
                    "impossible"
                ];

                // make pmcs not randomly talk
                if (config.bots.pmc.makePmcsNotRandomlyTalk)
                {
                    botDifficulty.forEach(function(difficulty)
                    {
                        databaseBots.types.bear.difficulty[difficulty].Mind.CAN_TALK = false;
                        databaseBots.types.bear.difficulty[difficulty].Mind.CAN_THROW_REQUESTS = false;
                        databaseBots.types.bear.difficulty[difficulty].Mind.TALK_WITH_QUERY = false;
                        databaseBots.types.usec.difficulty[difficulty].Mind.CAN_TALK = false;
                        databaseBots.types.usec.difficulty[difficulty].Mind.CAN_THROW_REQUESTS = false;
                        databaseBots.types.usec.difficulty[difficulty].Mind.TALK_WITH_QUERY = false;
                    });
                }
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // ITEMS                                                                                                                                       //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (config.items.enabled)
            {
                // REPAIRS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                
                // remove armor degradation from repairs
                if (config.items.repairs.removeArmorDegradationFromRepairs)
                {
                    for (const armor in databaseGlobals.config.ArmorMaterials)
                    {
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MinRepairKitDegradation = 0;
                        databaseGlobals.config.ArmorMaterials[armor].MaxRepairKitDegradation = 0;
                    }
                }

                // remove weapon degradation from repairs
                if (config.items.repairs.removeWeaponDegradationFromRepairs)
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
                }

                // INSURANCE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                const maps = [
                    "bigmap",
                    "factory4_day",
                    "factory4_night",
                    "interchange",
                    "laboratory",
                    "lighthouse",
                    "rezervbase",
                    "shoreline",
                    "tarkovstreets",
                    "woods"
                ];

                // allow insurance for all locations
                if (config.items.insurance.insuranceAllowedOnAllLocations)
                {
                    maps.forEach(function(map)
                    {
                        databaseLocations[map].base.Insurance = true;
                    });
                }

                for (const id in databaseItems)
                {
                    const base = databaseItems[id];

                    if (!this.getId([id]))
                    {
                        // allow insurance for all items
                        if (config.items.insurance.insuranceAllowedForAllItems && base._props.IsAlwaysAvailableForInsurance !== undefined) 
                        {
                            const insure = true;
                            this.itemData(container, id, "IsAlwaysAvailableForInsurance", insure);
                        }

                        // GEAR /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        // remove durability burn for all gear
                        if (config.items.gear.removeWeaponDurabilityBurn && base._props.DurabilityBurnModificator)
                        {
                            const durabilityBurnMod = 0;
                            this.itemData(container, id, "DurabilityBurnModificator", durabilityBurnMod);
                        }

                        // remove weapon deterioration from bullets
                        if (config.items.gear.removeWeaponDeteriorationFromBullets && base._props.Deterioration)
                        {
                            const deteriorationMod = 0;
                            this.itemData(container, id, "Deterioration", deteriorationMod);
                        }

                        // allow all items to be lootable
                        if (config.items.allowAllItemsToBelootable && base._props.Unlootable !== undefined)
                        {
                            const unlootable = false;
                            this.itemData(container, id, "Unlootable", unlootable);
                        }

                        // all items unexamined by default
                        if (config.items.allItemsUnexaminedByDefault && base._props.ExaminedByDefault !== undefined)
                        {
                            const examined = false;
                            this.itemData(container, id, "ExaminedByDefault", examined);
                        }
                    }
                }

                // KEYS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // remove keycard access requirement for labs
                if (config.items.keys.labsAccessKeycard.removeLabsReq)
                {
                    databaseLocations.laboratory.base.AccessKeys = [];
                }

                // change the max number of uses allowed for the lab access keycard
                const labsAccessKeycard = databaseItems["5c94bbff86f7747ee735c08f"];
                labsAccessKeycard._props.MaximumNumberOfUsage = config.items.keys.labsAccessKeycard.maxNumberOfUses;
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // PLAYER                                                                                                                                      //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (config.player.enabled)
            {
                // scav cooldown timer
                databaseGlobals.config.SavagePlayCooldown = config.player.scavCooldownTimer * 60;

                // HEALTH IN RAID ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////             

                if (config.player.healthInRaid.enabled)
                {
                    // energy/hydration damage and looptime
                    databaseGlobals.config.Health.Effects.Existence.EnergyLoopTime = config.player.healthInRaid.energyLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.EnergyDamage = config.player.healthInRaid.energyDecreasePerLoopTime;
                    databaseGlobals.config.Health.Effects.Existence.HydrationLoopTime = config.player.healthInRaid.hydrationLoopTime * 60;
                    databaseGlobals.config.Health.Effects.Existence.HydrationDamage = config.player.healthInRaid.hydrationDecreasePerLoopTime;
                }

                // HEALTH IN HIDEOUT ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (config.player.healthInHideout.enabled)
                {
                    // energy/hydration looptime
                    databaseGlobals.config.Health.Effects.Regeneration.Energy = config.player.healthInHideout.energyRegenerationLoopTime;
                    databaseGlobals.config.Health.Effects.Regeneration.Hydration = config.player.healthInHideout.hydrationRegenerationLoopTime;

                    // health regeneration multiplier
                    const bodyHealth = databaseGlobals.config.Health.Effects.Regeneration.BodyHealth;
                    const regenerationMultiplier = config.player.healthInHideout.healthRegenerationMultiplier;
                    bodyHealth.Chest.Value = bodyHealth.Chest.Value * regenerationMultiplier;
                    bodyHealth.Head.Value = bodyHealth.Head.Value * regenerationMultiplier;
                    bodyHealth.LeftArm.Value = bodyHealth.LeftArm.Value * regenerationMultiplier;
                    bodyHealth.LeftLeg.Value = bodyHealth.LeftLeg.Value * regenerationMultiplier;
                    bodyHealth.RightArm.Value = bodyHealth.RightArm.Value * regenerationMultiplier;
                    bodyHealth.RightLeg.Value = bodyHealth.RightLeg.Value * regenerationMultiplier;
                    bodyHealth.Stomach.Value = bodyHealth.Stomach.Value * regenerationMultiplier;
                    
                    // remove free heals after raids for trial levels
                    if (config.player.healthInHideout.removeFreeHealTrialLevelsAndRaids)
                    {   
                        databaseGlobals.config.Health.HealPrice.TrialLevels = 0;
                        databaseGlobals.config.Health.HealPrice.TrialRaids = 0;
                    }
                }
            }

            // TACTICAL CLOTHING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // allow all tactical clothing for both usec and bear
            if (config.player.tacticalClothing.allowAllTacticalClothingForBothFactions)
            {
                for (const customization in databaseCustomization)
                {
                    const customizationData = databaseCustomization[customization]
                    if (customizationData._parent === "5cd944d01388ce000a659df9" || customizationData._parent === "5cd944ca1388ce03a44dc2a4")
                    {
                        customizationData._props.Side = ["Usec", "Bear"];
                    }
                }
            }

            // unlock all tactical clothing for free
            if (config.player.tacticalClothing.unlockAllTacticalClothingForFree)
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
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // HIDEOUT                                                                                                                                     //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (config.hideout.enabled)
            {
                // construction time multiplier
                const constructionMultiplier = config.hideout.constructionTimeMultiplier;

                for (const data in databaseHideout.areas)
                {
                    const areaData = databaseHideout.areas[data];

                    if (this.getId([areaData._id]) === false)
                    {
                        for (const i in areaData.stages)
                        {
                            if (areaData.stages[i].constructionTime > 0)
                            {
                                areaData.stages[i].constructionTime = areaData.stages[i].constructionTime*constructionMultiplier;
                            }
                        }
                    }
                }

                // production time multiplier
                const productionMultiplier = config.hideout.productionTimeMultiplier;

                for (const data in databaseHideout.production)
                {
                    const productionData = databaseHideout.production[data];

                    if (this.getId([productionData._id]) === false)
                    {
                        if (!productionData.continuous && productionData.productionTime > 1)
                        {
                            productionData.productionTime = productionData.productionTime*productionMultiplier;
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
                            scavcaseData.ProductionTime = scavcaseData.ProductionTime*productionMultiplier;
                        }
                    }
                }
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // TRADERS                                                                                                                                     //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (config.traders.enabled)
            {
                // trader repair cost mulitiplier
                configsRepairs.priceMultiplier = config.traders.repairCostMultiplierForAllTraders;

                // change insurance for prapor
                configsInsurance.insuranceMultiplier[eftTraders.PRAPOR] = config.traders.prapor.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.PRAPOR] = config.traders.prapor.insurance.returnChancePercent;
                databaseTraders[eftTraders.PRAPOR].base.insurance.min_return_hour = config.traders.prapor.insurance.minReturnTime;
                databaseTraders[eftTraders.PRAPOR].base.insurance.max_return_hour = config.traders.prapor.insurance.maxReturnTime;

                // change insurance for therapist
                configsInsurance.insuranceMultiplier[eftTraders.THERAPIST] = config.traders.therapist.insurance.insuranceMultiplier;
                configsInsurance.returnChancePercent[eftTraders.THERAPIST] = config.traders.therapist.insurance.returnChancePercent;
                databaseTraders[eftTraders.THERAPIST].base.insurance.min_return_hour = config.traders.therapist.insurance.minReturnTime;
                databaseTraders[eftTraders.THERAPIST].base.insurance.max_return_hour = config.traders.therapist.insurance.maxReturnTime;

                // trader item degradation from repairs modifiers
                databaseTraders[eftTraders.MECHANIC].base.repair.quality = config.traders.mechanic.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.PRAPOR].base.repair.quality = config.traders.prapor.repairs.repairQualityDegradation;
                databaseTraders[eftTraders.SKIER].base.repair.quality = config.traders.skier.repairs.repairQualityDegradation;
            }
        }
        else
        {
            logger.log("Mod: " + `${pkg.name}` + ": disabled", "yellow");
            return;
        }
    }

    public postAkiLoad(container: DependencyContainer): void
    {
        const config = this.config;
        const filename = path.basename(path.dirname(__dirname.split('/').pop()));
        const filepath = `${container.resolve<PreAkiModLoader>("PreAkiModLoader").getModPath(filename)}res/`;

        fs.readdir(filepath, (err, files) => 
        {
            files.forEach(file => 
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // MISC                                                                                                                                        //
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                if (config.betterSpawnsPlus)
                {
                    // replace trader profile pictures
                    const imageId = file.split('/').pop().split('.').shift();

                    if (config.misc.replaceTradersProfilePics)
                    {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/trader/avatar/${imageId}`,`${filepath}${imageId}.${"jpg"}`);
                    }

                    // replace original launcher background with a random background
                    const imageArray = [
                        "eft00","eft01","eft02","eft03","eft04","eft05","eft06","eft07","eft08","eft09","eft10","eft11","eft12","eft13",
                        "eft14","eft15","eft16","eft17","eft18","eft19","eft20","eft21","eft22","eft23","eft24","eft25","eft26","eft27"
                    ];
                    const random = Math.floor(Math.random() * imageArray.length);
                    
                    if (config.misc.replaceLauncherBackground)
                    {  
                        container.resolve<ImageRouter>("ImageRouter").addRoute(`/files/launcher/${imageId}`,`${filepath}${imageArray[random]}.${"jpg"}`);
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
}

module.exports = { mod: new BetterSpawnsPlus() };