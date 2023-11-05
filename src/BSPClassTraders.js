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
exports.BSPClassTraders = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
const BSPEnumTraders_1 = require("../enums/BSPEnumTraders");
let BSPClassTraders = class BSPClassTraders {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    traderIds = Object.values(BSPEnumTraders_1.TraderIds);
    // static
    traderInsurance(settingsTraders, eftDatabaseTraders, sptConfigsInsurance) {
        const traderArray = ["prapor", "therapist"];
        traderArray.forEach((trader) => {
            const traderKey = BSPEnumTraders_1.TraderIds[trader.toUpperCase()];
            // trader insurance return time in hours min/max
            eftDatabaseTraders[traderKey].base.insurance.min_return_hour = settingsTraders[trader].insurance.returnTimeInHours.min;
            eftDatabaseTraders[traderKey].base.insurance.max_return_hour = settingsTraders[trader].insurance.returnTimeInHours.max;
            // trader insurance storage time in hours
            eftDatabaseTraders[traderKey].base.insurance.max_storage_time = settingsTraders[trader].insurance.storageTimeInHours;
            // trader insurance price multiplier
            sptConfigsInsurance.insuranceMultiplier[traderKey] = settingsTraders[trader].insurance.priceMultiplier;
            // trader insurance return chance percent
            sptConfigsInsurance.returnChancePercent[traderKey] = settingsTraders[trader].insurance.returnChancePercent;
        });
    }
    // static
    traderStock(settingsTraders, sptConfigsTrader) {
        function getKeyByValue(value) {
            for (const key in BSPEnumTraders_1.TraderIds) {
                if (BSPEnumTraders_1.TraderIds[key] === value) {
                    return key.toLowerCase();
                }
            }
            return undefined;
        }
        // trader stock time in minutes
        this.traderIds.forEach((trader) => {
            const stockUpdateTime = sptConfigsTrader.updateTime.find(obj => obj.traderId === trader);
            const traderKey = getKeyByValue(trader);
            if (stockUpdateTime) {
                stockUpdateTime.seconds = settingsTraders[traderKey].stockUpdateInMinutes * 60;
            }
        });
        // make all trader purchases "found in-raid"
        sptConfigsTrader.purchasesAreFoundInRaid = settingsTraders.traderPurchasesFiR;
        // trader purchase price multiplier
        sptConfigsTrader.traderPriceMultiplier = settingsTraders.traderPurchasesMultiplier;
        // fence item amount
        sptConfigsTrader.fence.assortSize = settingsTraders.itemAmount;
        // fence weapon durability percent min/max
        sptConfigsTrader.fence.presetMaxDurabilityPercentMinMax.min = settingsTraders.fence.weaponDurabilityPercent.min;
        sptConfigsTrader.fence.presetMaxDurabilityPercentMinMax.max = settingsTraders.fence.weaponDurabilityPercent.max;
        // fence armor durability percent min/max
        sptConfigsTrader.fence.armorMaxDurabilityPercentMinMax.min = settingsTraders.fence.armorDurabilityPercent.min;
        sptConfigsTrader.fence.armorMaxDurabilityPercentMinMax.max = settingsTraders.fence.armorDurabilityPercent.max;
        // disable fence blacklist
        if (settingsTraders.fence.disableBlacklist) {
            sptConfigsTrader.fence.blacklistSeasonalItems = false;
            sptConfigsTrader.fence.blacklist = [];
        }
    }
    // static
    traderServices(settingsTraders, bspClassHelpers, eftDatabaseCustomization, eftDatabaseTraders) {
        // unlock for player all usec and bear clothing for purchase
        if (settingsTraders.ragman.services.unlockAllClothingForBothFactions) {
            for (const obj in eftDatabaseCustomization) {
                const objData = eftDatabaseCustomization[obj];
                const lowerClothingId = "5cd944d01388ce000a659df9";
                const upperClothingId = "5cd944ca1388ce03a44dc2a4";
                if (objData._parent === lowerClothingId || objData._parent === upperClothingId) {
                    objData._props.Side = ["Usec", "Bear"];
                }
            }
        }
        // unlock all clothing for free
        if (settingsTraders.ragman.services.unlockAllClothingForFree) {
            for (const trader in eftDatabaseTraders) {
                if (bspClassHelpers.getId([trader]) === false && eftDatabaseTraders[trader].suits) {
                    for (const suit in eftDatabaseTraders[trader].suits) {
                        const suitId = eftDatabaseTraders[trader].suits[suit];
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
    }
    // static
    traderRepairs(settingsTraders, eftDatabaseTraders, sptConfigsRepair) {
        // trader repair quality degradation multiplier
        const traderArray = ["prapor", "skier", "mechanic"];
        traderArray.forEach((trader) => {
            const traderKey = BSPEnumTraders_1.TraderIds[trader.toUpperCase()];
            eftDatabaseTraders[traderKey].base.repair.quality = settingsTraders[trader].repairs.qualityDegradation;
        });
        // trader repair random durability loss
        sptConfigsRepair.applyRandomizeDurabilityLoss = settingsTraders.traderRepairRandomDurabilityLoss;
        // trader repair price multiplier
        sptConfigsRepair.priceMultiplier = settingsTraders.traderRepairPriceMultiplier;
    }
};
exports.BSPClassTraders = BSPClassTraders;
exports.BSPClassTraders = BSPClassTraders = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassTraders);
