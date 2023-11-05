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
exports.BSPClassItems = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
const BSPEnumLocations_1 = require("../enums/BSPEnumLocations");
let BSPClassItems = class BSPClassItems {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    altLocationNames = Object.values(BSPEnumLocations_1.AltLocationNames);
    // static
    itemDurability(settingsItems, bspClassHelpers, container, eftDatabaseGlobals, eftDatabaseItems) {
        // prevent armor degradation from repairs
        if (settingsItems.armor.preventArmorDegradationFromRepairs) {
            for (const armor in eftDatabaseGlobals.config.ArmorMaterials) {
                eftDatabaseGlobals.config.ArmorMaterials[armor].MinRepairDegradation = 0;
                eftDatabaseGlobals.config.ArmorMaterials[armor].MaxRepairDegradation = 0;
                eftDatabaseGlobals.config.ArmorMaterials[armor].MinRepairKitDegradation = 0;
                eftDatabaseGlobals.config.ArmorMaterials[armor].MaxRepairKitDegradation = 0;
            }
        }
        // prevent weapon degradation from repairs
        if (settingsItems.weapons.preventWeaponDegradationFromRepairs) {
            for (const weapon in eftDatabaseItems) {
                if (eftDatabaseItems[weapon]._props.MaxRepairDegradation !== undefined && eftDatabaseItems[weapon]._props.MaxRepairKitDegradation !== undefined) {
                    bspClassHelpers.itemData(container, weapon, "MinRepairDegradation", 0);
                    bspClassHelpers.itemData(container, weapon, "MaxRepairDegradation", 0);
                    bspClassHelpers.itemData(container, weapon, "MinRepairKitDegradation", 0);
                    bspClassHelpers.itemData(container, weapon, "MaxRepairKitDegradation", 0);
                }
            }
        }
        for (const id in eftDatabaseItems) {
            if (!bspClassHelpers.hasItemId([id])) {
                const base = eftDatabaseItems[id];
                // prevent weapon durability burn
                if (settingsItems.weapons.preventWeaponDurabilityBurn && base._props.DurabilityBurnModificator) {
                    bspClassHelpers.itemData(container, id, "DurabilityBurnModificator", 0);
                }
                // prevent weapon deterioration from bullets
                if (settingsItems.weapons.preventWeaponDeteriorationFromBullets && base._props.Deterioration) {
                    bspClassHelpers.itemData(container, id, "Deterioration", 0);
                }
            }
        }
    }
    itemInsurance(settingsItems, bspClassHelpers, container, eftDatabaseItems, eftDatabaseLocations) {
        // allow insurance on all locations
        if (settingsItems.allowInsuranceOnAllLocations) {
            this.altLocationNames.forEach(function (location) {
                eftDatabaseLocations[location].base.Insurance = true;
            });
        }
        // allow insurance for all items
        for (const id in eftDatabaseItems) {
            if (!bspClassHelpers.hasItemId([id])) {
                const base = eftDatabaseItems[id];
                if (settingsItems.allowInsuranceForAllItems && base._props.IsAlwaysAvailableForInsurance !== undefined) {
                    bspClassHelpers.itemData(container, id, "IsAlwaysAvailableForInsurance", true);
                }
            }
        }
    }
    itemLabsKeycard(settingsItems, eftDatabaseItems, eftDatabaseLocations) {
        // remove labs access keycard requirement
        if (settingsItems.keys.labsAccessKeycard.removeLabsRequirement) {
            eftDatabaseLocations.laboratory.base.AccessKeys = [];
        }
        // max number of uses for labs access keycard
        const labsAccessKeycard = eftDatabaseItems["5c94bbff86f7747ee735c08f"];
        labsAccessKeycard._props.MaximumNumberOfUsage = settingsItems.keys.labsAccessKeycard.maxNumberOfUses;
    }
    itemLoot(settingsItems, bspClassHelpers, container, eftDatabaseItems) {
        for (const id in eftDatabaseItems) {
            if (!bspClassHelpers.hasItemId([id])) {
                const base = eftDatabaseItems[id];
                // allow all items to be lootable
                if (settingsItems.allowAllItemsToBelootable && base._props.Unlootable !== undefined) {
                    bspClassHelpers.itemData(container, id, "Unlootable", false);
                }
                // all items unexamined by default
                if (settingsItems.allItemsUnexaminedByDefault && base._props.ExaminedByDefault !== undefined) {
                    bspClassHelpers.itemData(container, id, "ExaminedByDefault", false);
                }
            }
        }
    }
};
exports.BSPClassItems = BSPClassItems;
exports.BSPClassItems = BSPClassItems = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassItems);
