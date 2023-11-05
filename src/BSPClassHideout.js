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
exports.BSPClassHideout = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
let BSPClassHideout = class BSPClassHideout {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    // static
    hideoutModules(settingsHideout, eftDatabaseHideout) {
        // generator speed without fuel
        eftDatabaseHideout.settings.generatorSpeedWithoutFuel = settingsHideout.areas.modules.generatorSpeedWithoutFuel;
        // generator fuel flow rate
        eftDatabaseHideout.settings.generatorFuelFlowRate = settingsHideout.areas.modules.generatorFuelFlowRate;
        // air filter unit flow rate
        eftDatabaseHideout.settings.airFilterUnitFlowRate = settingsHideout.areas.modules.airFilterUnitFlowRate;
        // gpu boost rate
        eftDatabaseHideout.settings.gpuBoostRate = settingsHideout.areas.modules.gpuBoostRate;
    }
    // static
    hideoutConstruction(settingsHideout, bspClassHelpers, eftDatabaseHideout) {
        // hideout contruction time multiplier
        const constructionMultiplier = settingsHideout.areas.constructionTimeMultiplier;
        for (const data in eftDatabaseHideout.areas) {
            const areaData = eftDatabaseHideout.areas[data];
            if (bspClassHelpers.hasItemId([areaData._id]) === false) {
                for (const i in areaData.stages) {
                    if (areaData.stages[i].constructionTime > 0) {
                        areaData.stages[i].constructionTime = areaData.stages[i].constructionTime * constructionMultiplier;
                    }
                }
            }
        }
    }
    // static
    hideoutProduction(settingsHideout, bspClassHelpers, eftDatabaseHideout) {
        // hideout production time multiplier
        const productionMultiplier = settingsHideout.areas.productionTimeMultiplier;
        for (const data in eftDatabaseHideout.production) {
            const productionData = eftDatabaseHideout.production[data];
            if (bspClassHelpers.hasItemId([productionData._id]) === false) {
                if (!productionData.continuous && productionData.productionTime > 1) {
                    productionData.productionTime = productionData.productionTime * productionMultiplier;
                }
            }
        }
    }
    // static
    hideoutScavCase(settingsHideout, bspClassHelpers, eftDatabaseHideout, sptConfigsScavcase) {
        // scav case production time multiplier
        const productionMultiplier = settingsHideout.scavCase.productionTimeMultiplier;
        for (const data in eftDatabaseHideout.scavcase) {
            const scavcaseData = eftDatabaseHideout.scavcase[data];
            if (bspClassHelpers.hasItemId([scavcaseData._id]) === false) {
                if (scavcaseData.ProductionTime > 1) {
                    scavcaseData.ProductionTime = scavcaseData.ProductionTime * productionMultiplier;
                }
            }
        }
        // scav case ammo reward minimum stack size
        sptConfigsScavcase.ammoRewards.minStackSize = settingsHideout.scavCase.rewards.ammo.minStackSize;
        // scav case ammo reward chance percent
        sptConfigsScavcase.ammoRewards.ammoRewardChancePercent = settingsHideout.scavCase.rewards.ammo.chancePercent;
        // scav case money reward chance percent
        sptConfigsScavcase.moneyRewards.moneyRewardChancePercent = settingsHideout.scavCase.rewards.money.chancePercent;
        // allow multiple ammo rewards per rarity
        settingsHideout.scavCase.rewards.ammo.multiplePerRarity = sptConfigsScavcase.allowMultipleAmmoRewardsPerRarity;
        // allow multiple money rewards per rarity
        settingsHideout.scavCase.rewards.money.multiplePerRarity = sptConfigsScavcase.allowMultipleMoneyRewardsPerRarity;
        // allow boss items for scav case rewards
        sptConfigsScavcase.allowBossItemsAsRewards = settingsHideout.scavCase.rewards.allowBossItems;
        // remove scav case rewards blacklist
        if (settingsHideout.scavCase.rewards.removeItemBlacklist) {
            sptConfigsScavcase.rewardItemParentBlacklist = [
                "5e997f0b86f7741ac73993e2"
            ];
            sptConfigsScavcase.rewardItemBlacklist = [
                "5cde8864d7f00c0010373be1",
                "5d2f2ab648f03550091993ca",
                "6241c2c2117ad530666a5108",
                "6241c316234b593b5676b637",
                "5d70e500a4b9364de70d38ce"
            ];
        }
    }
};
exports.BSPClassHideout = BSPClassHideout;
exports.BSPClassHideout = BSPClassHideout = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassHideout);
