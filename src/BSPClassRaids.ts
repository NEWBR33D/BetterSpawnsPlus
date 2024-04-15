/* 
 * BetterSpawnsPlus v2.0.3
 * MIT License
 * Copyright (c) 2024 PreyToLive
 */

/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

import { inject, injectable } from "tsyringe";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { AltLocationNames, LocationNames } from "../enums/BSPEnumLocations";

@injectable()
export class BSPClassRaids {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    private altLocationNames: string[] = Object.values(AltLocationNames);
    private locationNames: string[] = Object.values(LocationNames);

    // dynamic
    public raidLogs(eftDatabaseLocations: any, sptConfigsBot: any, location: any, logsData: any): any {
        switch (location) {
            case "customs":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.bigmap;
                logsData.raidTimer = eftDatabaseLocations.bigmap.base.EscapeTimeLimit;
                break;
            case "factory":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.factory4_day;
                logsData.raidTimer = eftDatabaseLocations.factory4_day.base.EscapeTimeLimit;
                break;
            case "groundzero":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.sandbox;
                logsData.raidTimer = eftDatabaseLocations.sandbox.base.EscapeTimeLimit;
                break;
            case "interchange":
            case "lighthouse":
            case "shoreline":
            case "woods":
                logsData.maxBotCap = sptConfigsBot.maxBotCap[location];
                logsData.raidTimer = eftDatabaseLocations[location].base.EscapeTimeLimit;
                break;
            case "labs":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.laboratory;
                logsData.raidTimer = eftDatabaseLocations.laboratory.base.EscapeTimeLimit;
                break;
            case "reserve":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.rezervbase;
                logsData.raidTimer = eftDatabaseLocations.rezervbase.base.EscapeTimeLimit;
                break;
            case "streets":
                logsData.maxBotCap = sptConfigsBot.maxBotCap.tarkovstreets;
                logsData.raidTimer = eftDatabaseLocations.tarkovstreets.base.EscapeTimeLimit;
                break;
            default:
                break;
        }
    }

    // dynamic
    public raidMaxBots(settingsRaids: any, bspClassHelpers: any, sptConfigsBot: any): any {
        if (settingsRaids.maxBotCap.enabled) {
            for (const location of this.locationNames) {
                const randomBotCap: number = bspClassHelpers.generateRandomInteger(
                    settingsRaids.maxBotCap[location].min, 
                    settingsRaids.maxBotCap[location].max
                );

                switch (location) {
                    case "customs":
                        sptConfigsBot.maxBotCap.bigmap = randomBotCap;
                        break;
                    case "factory":
                        sptConfigsBot.maxBotCap.factory4_day = randomBotCap;
                        sptConfigsBot.maxBotCap.factory4_night = randomBotCap;
                        break;
                    case "groundzero":
                        sptConfigsBot.maxBotCap.sandbox = randomBotCap;
                        break;
                    case "interchange":
                    case "lighthouse":
                    case "shoreline":
                    case "woods":
                        sptConfigsBot.maxBotCap[location] = randomBotCap;
                        break;
                    case "labs":
                        sptConfigsBot.maxBotCap.laboratory = randomBotCap;
                        break;
                    case "reserve":
                        sptConfigsBot.maxBotCap.rezervbase = randomBotCap;
                        break;
                    case "streets":
                        sptConfigsBot.maxBotCap.tarkovstreets = randomBotCap;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // dynamic
    public raidTimer(settingsRaids: any, bspClassHelpers: any, eftDatabaseLocations: any): any {
        if (settingsRaids.raidTimer.enabled) {
            for (const location of this.locationNames) {
                const randomRaidTimer = bspClassHelpers.generateRandomInteger(
                    settingsRaids.raidTimer[location].min, 
                    settingsRaids.raidTimer[location].max
                );
                
                switch (location) {
                    case "customs":
                        eftDatabaseLocations.bigmap.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.bigmap.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "factory":
                        eftDatabaseLocations.factory4_day.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.factory4_night.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.factory4_day.base.EscapeTimeLimit = randomRaidTimer;
                        eftDatabaseLocations.factory4_night.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "groundzero":
                        eftDatabaseLocations.sandbox.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.sandbox.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "interchange":
                        eftDatabaseLocations.interchange.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.interchange.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "labs":
                        eftDatabaseLocations.laboratory.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.laboratory.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "lighthouse":
                        eftDatabaseLocations.lighthouse.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.lighthouse.base.EscapeTimeLimit = randomRaidTimer;
    
                        for (const exfil in eftDatabaseLocations.lighthouse.base.exits) {
                            if (eftDatabaseLocations.lighthouse.base.exits[exfil].Name == "EXFIL_Train") {
                                eftDatabaseLocations.lighthouse.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                eftDatabaseLocations.lighthouse.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                            }
                        }
                        break;
                    case "reserve":
                        eftDatabaseLocations.rezervbase.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.rezervbase.base.EscapeTimeLimit = randomRaidTimer;
    
                        for (const exfil in eftDatabaseLocations.rezervbase.base.exits) {
                            if (eftDatabaseLocations.rezervbase.base.exits[exfil].Name == "EXFIL_Train") {
                                eftDatabaseLocations.rezervbase.base.exits[exfil].MinTime = randomRaidTimer * 60 * 0.5;
                                eftDatabaseLocations.rezervbase.base.exits[exfil].MaxTime = (randomRaidTimer * 60) - 300;
                            }
                        }
                        break;
                    case "shoreline":
                        eftDatabaseLocations.shoreline.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.shoreline.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "streets":
                        eftDatabaseLocations.tarkovstreets.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.tarkovstreets.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    case "woods":
                        eftDatabaseLocations.woods.base.exit_access_time = randomRaidTimer + 20;
                        eftDatabaseLocations.woods.base.EscapeTimeLimit = randomRaidTimer;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    // dynamic
    public raidAirdrops(settingsRaids: any, bspClassHelpers: any, eftDatabaseLocations: any, sptConfigsAirdrop: any): any {
        if (settingsRaids.airdrops.enabled) {
            // plane start time
            if (settingsRaids.airdrops.startTime.min < 0 || settingsRaids.airdrops.startTime.min > settingsRaids.airdrops.startTime.max) {
                settingsRaids.airdrops.startTime.min = 0;
            }

            const randomPlaneStartTime = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.startTime.min, settingsRaids.airdrops.startTime.max);
            sptConfigsAirdrop.airdropMinStartTimeSeconds = randomPlaneStartTime * 60;
            sptConfigsAirdrop.airdropMaxStartTimeSeconds = randomPlaneStartTime * 60;

            // plane speed
            if (settingsRaids.airdrops.plane.speed.min < 50) {
                settingsRaids.airdrops.plane.speed.min = 50;
            }

            if (settingsRaids.airdrops.plane.speed.max > 120) {
                settingsRaids.airdrops.plane.speed.max = 120;
            }

            if (settingsRaids.airdrops.plane.speed.min > settingsRaids.airdrops.plane.speed.max) {
                settingsRaids.airdrops.plane.speed.min = 50;
                settingsRaids.airdrops.plane.speed.max = 120;
            }

            const randomPlaneSpeed = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.speed.min, settingsRaids.airdrops.plane.speed.max);
            sptConfigsAirdrop.planeSpeed = randomPlaneSpeed;

            // plane height
            if (settingsRaids.airdrops.plane.height.min < 200) {
                settingsRaids.airdrops.plane.height.min = 200;
            }
            
            if (settingsRaids.airdrops.plane.height.max > 600) {
                settingsRaids.airdrops.plane.height.max = 600;
            }

            if (settingsRaids.airdrops.plane.height.min > settingsRaids.airdrops.plane.height.max) {
                settingsRaids.airdrops.plane.height.min = 200;
                settingsRaids.airdrops.plane.height.max = 600;
            }

            const randomPlaneHeight = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.height.min, settingsRaids.airdrops.plane.height.max);
            sptConfigsAirdrop.planeMinFlyHeight = randomPlaneHeight;
            sptConfigsAirdrop.planeMaxFlyHeight = randomPlaneHeight;

            // plane volume
            if (settingsRaids.airdrops.plane.volume.min < 0 || settingsRaids.airdrops.plane.volume.min > settingsRaids.airdrops.plane.volume.max) {
                settingsRaids.airdrops.plane.volume.min = 0;
            }

            if (settingsRaids.airdrops.plane.volume.max > 100) {
                settingsRaids.airdrops.plane.volume.max = 100;
            }

            const randomPlaneVolume = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.volume.min, settingsRaids.airdrops.plane.volume.max);
            sptConfigsAirdrop.planeVolume = randomPlaneVolume * 0.01;

            // crate speed
            if (settingsRaids.airdrops.plane.crate.speed.min < 1) {
                settingsRaids.airdrops.plane.crate.speed.min = 1;
            }
            
            if (settingsRaids.airdrops.plane.crate.speed.max > 10) {
                settingsRaids.airdrops.plane.crate.speed.max = 10;
            }

            if (settingsRaids.airdrops.plane.crate.speed.min > settingsRaids.airdrops.plane.crate.speed.max) {
                settingsRaids.airdrops.plane.crate.speed.min = 1;
                settingsRaids.airdrops.plane.crate.speed.max = 10;
            }

            const randomCrateSpeed = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.crate.speed.min, settingsRaids.airdrops.plane.crate.speed.max);
            sptConfigsAirdrop.crateFallSpeed = randomCrateSpeed;

            // crate item count
            if (settingsRaids.airdrops.plane.crate.items.min < 0) {
                settingsRaids.airdrops.plane.crate.items.min = 0;
            }
            
            if (settingsRaids.airdrops.plane.crate.items.max > 35) {
                settingsRaids.airdrops.plane.crate.items.max = 35;
            }

            if (settingsRaids.airdrops.plane.crate.items.min > settingsRaids.airdrops.plane.crate.items.max) {
                settingsRaids.airdrops.plane.crate.items.min = 0;
                settingsRaids.airdrops.plane.crate.items.max = 35;
            }

            const randomCrateItemCount = bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.crate.items.min, settingsRaids.airdrops.plane.crate.items.max);
            sptConfigsAirdrop.loot.mixed.itemCount.min = randomCrateItemCount;
            sptConfigsAirdrop.loot.mixed.itemCount.max = randomCrateItemCount;

            // dynamic planes
            if (settingsRaids.airdrops.plane.dynamic) {
                const planeHeightMaxMin25 = (settingsRaids.airdrops.plane.height.min + ((settingsRaids.airdrops.plane.height.max - settingsRaids.airdrops.plane.height.min) * 0.25));
                const planeHeightMaxMin50 = (settingsRaids.airdrops.plane.height.min + ((settingsRaids.airdrops.plane.height.max - settingsRaids.airdrops.plane.height.min) * 0.5));
                const planeHeightMaxMin75 = (settingsRaids.airdrops.plane.height.min + ((settingsRaids.airdrops.plane.height.max - settingsRaids.airdrops.plane.height.min) * 0.75));
                const planeVolumeMaxMin25 = (settingsRaids.airdrops.plane.volume.min + ((settingsRaids.airdrops.plane.volume.max - settingsRaids.airdrops.plane.volume.min) * 0.25));
                const planeVolumeMaxMin50 = (settingsRaids.airdrops.plane.volume.min + ((settingsRaids.airdrops.plane.volume.max - settingsRaids.airdrops.plane.volume.min) * 0.5));
                const planeVolumeMaxMin75 = (settingsRaids.airdrops.plane.volume.min + ((settingsRaids.airdrops.plane.volume.max - settingsRaids.airdrops.plane.volume.min) * 0.75));
                const planeSpeedMaxMin25 = (settingsRaids.airdrops.plane.speed.min + ((settingsRaids.airdrops.plane.speed.max - settingsRaids.airdrops.plane.speed.min) * 0.25));
                const planeSpeedMaxMin50 = (settingsRaids.airdrops.plane.speed.min + ((settingsRaids.airdrops.plane.speed.max - settingsRaids.airdrops.plane.speed.min) * 0.5));
                const planeSpeedMaxMin75 = (settingsRaids.airdrops.plane.speed.min + ((settingsRaids.airdrops.plane.speed.max - settingsRaids.airdrops.plane.speed.min) * 0.75));
                const planeCrateSpeedMaxMin25 = (settingsRaids.airdrops.plane.crate.speed.min + ((settingsRaids.airdrops.plane.crate.speed.max - settingsRaids.airdrops.plane.crate.speed.min) * 0.25));
                const planeCrateSpeedMaxMin50 = (settingsRaids.airdrops.plane.crate.speed.min + ((settingsRaids.airdrops.plane.crate.speed.max - settingsRaids.airdrops.plane.crate.speed.min) * 0.5));
                const planeCrateSpeedMaxMin75 = (settingsRaids.airdrops.plane.crate.speed.min + ((settingsRaids.airdrops.plane.crate.speed.max - settingsRaids.airdrops.plane.crate.speed.min) * 0.75));
                const planeCrateItemCountMaxMin25 = (settingsRaids.airdrops.plane.crate.items.min + ((settingsRaids.airdrops.plane.crate.items.max - settingsRaids.airdrops.plane.crate.items.min) * 0.25));
                const planeCrateItemCountMaxMin50 = (settingsRaids.airdrops.plane.crate.items.min + ((settingsRaids.airdrops.plane.crate.items.max - settingsRaids.airdrops.plane.crate.items.min) * 0.5));
                const planeCrateItemCountMaxMin75 = (settingsRaids.airdrops.plane.crate.items.min + ((settingsRaids.airdrops.plane.crate.items.max - settingsRaids.airdrops.plane.crate.items.min) * 0.75));

                if (randomPlaneHeight >= settingsRaids.airdrops.plane.height.min && randomPlaneHeight <= planeHeightMaxMin25) {
                    sptConfigsAirdrop.planeVolume = Math.round(bspClassHelpers.generateRandomInteger(planeVolumeMaxMin75, settingsRaids.airdrops.plane.volume.max)) * 0.01;
                    sptConfigsAirdrop.planeSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeSpeedMaxMin75, settingsRaids.airdrops.plane.speed.max));
                }
                
                if (randomPlaneHeight > planeHeightMaxMin25 && randomPlaneHeight <= planeHeightMaxMin50) {
                    sptConfigsAirdrop.planeVolume = Math.round(bspClassHelpers.generateRandomInteger(planeVolumeMaxMin50, planeVolumeMaxMin75)) * 0.01;
                    sptConfigsAirdrop.planeSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeSpeedMaxMin50, planeSpeedMaxMin75));
                }
                
                if (randomPlaneHeight > planeHeightMaxMin50 && randomPlaneHeight <= planeHeightMaxMin75) {
                    sptConfigsAirdrop.planeVolume = Math.round(bspClassHelpers.generateRandomInteger(planeVolumeMaxMin25, planeVolumeMaxMin50)) * 0.01;
                    sptConfigsAirdrop.planeSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeSpeedMaxMin25, planeSpeedMaxMin50));
                }

                if (randomPlaneHeight > planeHeightMaxMin75 && randomPlaneHeight <= settingsRaids.airdrops.plane.height.max) {
                    sptConfigsAirdrop.planeVolume = Math.round(bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.volume.min, planeVolumeMaxMin25)) * 0.01;
                    sptConfigsAirdrop.planeSpeed = Math.round(bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.volume.min, planeSpeedMaxMin25));
                }

                if (randomCrateItemCount >= settingsRaids.airdrops.plane.crate.items.min && randomCrateItemCount <= planeCrateItemCountMaxMin25) {
                    sptConfigsAirdrop.crateFallSpeed = Math.round(bspClassHelpers.generateRandomInteger(settingsRaids.airdrops.plane.crate.speed.min, planeCrateSpeedMaxMin25));
                }

                if (randomCrateItemCount > planeCrateItemCountMaxMin25 && randomCrateItemCount <= planeCrateItemCountMaxMin50) {
                    sptConfigsAirdrop.crateFallSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeCrateSpeedMaxMin25, planeCrateSpeedMaxMin50));
                }

                if (randomCrateItemCount > planeCrateItemCountMaxMin50 && randomCrateItemCount <= planeCrateItemCountMaxMin75) {
                    sptConfigsAirdrop.crateFallSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeCrateSpeedMaxMin50, planeCrateSpeedMaxMin75));
                }

                if (randomCrateItemCount > planeCrateItemCountMaxMin75 && randomCrateItemCount <= settingsRaids.airdrops.plane.crate.items.max) {
                    sptConfigsAirdrop.crateFallSpeed = Math.round(bspClassHelpers.generateRandomInteger(planeCrateSpeedMaxMin75, settingsRaids.airdrops.plane.crate.speed.max));
                }
            }

            // airdrop chance
            for (const locations in this.locationNames) {
                const location = this.locationNames[locations];

                if (location == "customs") {
                    sptConfigsAirdrop.airdropChancePercent.bigmap = settingsRaids.airdrops.chance[location];
                }

                if (location == "groundzero") {
                    sptConfigsAirdrop.airdropChancePercent.sandbox = settingsRaids.airdrops.chance[location];
                }
                
                if (location == "streets") {
                    sptConfigsAirdrop.airdropChancePercent.tarkovStreets = settingsRaids.airdrops.chance[location];
                }

                if (location == "interchange" || location == "lighthouse" || location == "reserve" || location == "shoreline" || location == "woods") {
                    sptConfigsAirdrop.airdropChancePercent[location] = settingsRaids.airdrops.chance[location];
                }
            }

            // extend plane airdrop end time based on the raid timer
            if (settingsRaids.raidTimer.enabled) {
                for (const altLocations in this.altLocationNames) {
                    const altLocation = this.altLocationNames[altLocations];

                    if (altLocation != "factory4_day" && altLocation != "factory4_night" && altLocation != "laboratory") {
                        eftDatabaseLocations[altLocation].base.AirdropParameters["PlaneAirdropEnd"] = eftDatabaseLocations[altLocation].base.EscapeTimeLimit * 60 * 0.75;
                    }
                }
            }
        }
    }

    // static
    public raidExtractions(settingsRaids: any, eftDatabaseLocations: any): any {
        // make all extractions open regardless of spawn side
        if (settingsRaids.extractions.openAllRegardlessOfSpawnSide) {
            for (const location in eftDatabaseLocations) {
                switch (location) {
                    case "base":
                        break;
                    case "bigmap":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "Customs,Boiler Tanks";
                        }
                        break;
                    case "interchange":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "MallSE,MallNW";
                        }
                        break;
                    case "lighthouse":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "Tunnel,North";
                        }
                        break;
                    case "sandbox":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "west,east";
                        }
                        break;
                    case "shoreline":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "Village,Riverside";
                        }
                        break;
                    case "tarkovstreets":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "E1_2,E2_3,E3_4,E4_5,E5_6,E6_1";
                        }
                        break;
                    case "woods":
                        for (const exfil in eftDatabaseLocations[location].base.exits) {
                            eftDatabaseLocations[location].base.exits[exfil].EntryPoints = "House,Old Station";
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        for (const i in eftDatabaseLocations) {
            if (i !== "base") {
                for (const x in eftDatabaseLocations[i].base.exits) {
                    // remove extraction restrictions
                    if (settingsRaids.extractions.removeRestrictions) {
                        if (eftDatabaseLocations[i].base.exits[x].Name !== "EXFIL_Train" && !eftDatabaseLocations[i].base.exits[x].Name.includes("lab") || eftDatabaseLocations[i].base.exits[x].Name === "lab_Vent") {
                            if (eftDatabaseLocations[i].base.exits[x].RequiredSlot) {
                                delete eftDatabaseLocations[i].base.exits[x].RequiredSlot;
                            }

                            eftDatabaseLocations[i].base.exits[x].PassageRequirement = "None";
                            eftDatabaseLocations[i].base.exits[x].ExfiltrationType = "Individual";
                            eftDatabaseLocations[i].base.exits[x].Id = "";
                            eftDatabaseLocations[i].base.exits[x].Count = 0;
                            eftDatabaseLocations[i].base.exits[x].RequirementTip = "";
                        }
                    }

                    // make all extractions always available
                    if (settingsRaids.extractions.allAlwaysAvailable) {
                        if (eftDatabaseLocations[i].base.exits[x].Name !== "EXFIL_Train") {
                            eftDatabaseLocations[i].base.exits[x].Chance = 100;
                        }
                    }
                }
            }
        }
    }

    // static
    public raidEnd(settingsRaids: any, sptConfigsInRaid: any, sptConfigsLostOnDeath: any): any {
        sptConfigsInRaid.MIAOnRaidEnd = settingsRaids.MIAOnRaidEnd;
        sptConfigsInRaid.keepFiRSecureContainerOnDeath = settingsRaids.keepFiRSecureContainerOnDeath;
        sptConfigsLostOnDeath.equipment.ArmBand = settingsRaids.lostOnDeath.equipment.ArmBand;
        sptConfigsLostOnDeath.equipment.Compass = settingsRaids.lostOnDeath.equipment.Compass;
        sptConfigsLostOnDeath.equipment.Headwear = settingsRaids.lostOnDeath.equipment.Headwear;
        sptConfigsLostOnDeath.equipment.Earpiece = settingsRaids.lostOnDeath.equipment.Earpiece;
        sptConfigsLostOnDeath.equipment.FaceCover = settingsRaids.lostOnDeath.equipment.FaceCover;
        sptConfigsLostOnDeath.equipment.ArmorVest = settingsRaids.lostOnDeath.equipment.ArmorVest;
        sptConfigsLostOnDeath.equipment.Eyewear = settingsRaids.lostOnDeath.equipment.Eyewear;
        sptConfigsLostOnDeath.equipment.TacticalVest = settingsRaids.lostOnDeath.equipment.TacticalVest;
        sptConfigsLostOnDeath.equipment.PocketItems = settingsRaids.lostOnDeath.equipment.PocketItems;
        sptConfigsLostOnDeath.equipment.Backpack = settingsRaids.lostOnDeath.equipment.Backpack;
        sptConfigsLostOnDeath.equipment.Holster = settingsRaids.lostOnDeath.equipment.Holster;
        sptConfigsLostOnDeath.equipment.FirstPrimaryWeapon = settingsRaids.lostOnDeath.equipment.FirstPrimaryWeapon;
        sptConfigsLostOnDeath.equipment.SecondPrimaryWeapon = settingsRaids.lostOnDeath.equipment.SecondPrimaryWeapon;
        sptConfigsLostOnDeath.equipment.Scabbard = settingsRaids.lostOnDeath.equipment.Scabbard;
        sptConfigsLostOnDeath.equipment.SecuredContainer = settingsRaids.lostOnDeath.equipment.SecuredContainer;
        sptConfigsLostOnDeath.questItems = settingsRaids.lostOnDeath.questItems;
        sptConfigsLostOnDeath.specialSlotItems = settingsRaids.lostOnDeath.specialSlotItems;
    }

    // static
    public raidWeather(settingsRaids: any, sptConfigsWeather: any): any {
        sptConfigsWeather.acceleration = settingsRaids.weather.dayNightAcceleration;
        sptConfigsWeather.forceWinterEvent = settingsRaids.weather.forceSnowWeather;
    }
}
