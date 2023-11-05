"use strict";
/*
 * BetterSpawnsPlus v2.0.0
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSPClassLoot = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
let BSPClassLoot = class BSPClassLoot {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    mapNames = {
        customs: "bigmap",
        factory: "factory4_day",
        interchange: "interchange",
        lighthouse: "lighthouse",
        shoreline: "shoreline",
        woods: "woods",
        labs: "laboratory",
        reserve: "rezervbase",
        streets: "tarkovstreets"
    };
    // static
    lootMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation) {
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
    containerMultipliers(settingsLoot, eftDatabaseLocations, sptConfigsLocation) {
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
};
exports.BSPClassLoot = BSPClassLoot;
exports.BSPClassLoot = BSPClassLoot = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassLoot);
