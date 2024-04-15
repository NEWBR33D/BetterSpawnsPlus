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

@injectable()
export class BSPClassLoot {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    private mapNames = {
        customs: "bigmap",
        factory: "factory4_day",
        groundzero: "sandbox",
        interchange: "interchange",
        lighthouse: "lighthouse",
        shoreline: "shoreline",
        woods: "woods",
        labs: "laboratory",
        reserve: "rezervbase",
        streets: "tarkovstreets"
    };

    // static
    public lootMultipliers(settingsLoot: any, eftDatabaseLocations: any, sptConfigsLocation: any): any {
        for (const mapName in this.mapNames) {
            // global loot chance modifier
            eftDatabaseLocations[this.mapNames[mapName]].base.GlobalLootChanceModifier = settingsLoot[mapName].loot.globalLootChanceModifier;
            
            // loose loot multiplier
            sptConfigsLocation.looseLootMultiplier[this.mapNames[mapName]] = settingsLoot[mapName].loot.looseLootMultiplier;
            
            // static loot multiplier
            sptConfigsLocation.staticLootMultiplier[this.mapNames[mapName]] = settingsLoot[mapName].loot.staticLootMultiplier;
            
            if (mapName === "factory") {
                eftDatabaseLocations.factory4_night.base.GlobalLootChanceModifier = settingsLoot[mapName].loot.globalLootChanceModifier;
                sptConfigsLocation.looseLootMultiplier.factory4_night = settingsLoot[mapName].loot.looseLootMultiplier;
                sptConfigsLocation.staticLootMultiplier.factory4_night = settingsLoot[mapName].loot.staticLootMultiplier;
            }
        }
    }

    // static
    public containerMultipliers(settingsLoot: any, eftDatabaseLocations: any, sptConfigsLocation: any): any {
        for (const mapName in this.mapNames) {
            // global container chance modifier
            eftDatabaseLocations[this.mapNames[mapName]].base.GlobalContainerChanceModifier = settingsLoot[mapName].containers.globalContainerChanceModifier;
            
            // container randomization
            sptConfigsLocation.containerRandomisationSettings.maps[this.mapNames[mapName]] = settingsLoot[mapName].containers.containerRandomization;
        
            if (mapName === "factory") {
                eftDatabaseLocations.factory4_night.base.GlobalContainerChanceModifier = settingsLoot[mapName].containers.globalContainerChanceModifier;
                sptConfigsLocation.containerRandomisationSettings.maps.factory4_night = settingsLoot[mapName].containers.containerRandomization;    
            }
        }
    }
}
