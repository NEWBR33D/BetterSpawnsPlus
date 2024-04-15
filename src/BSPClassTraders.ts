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
import { TraderIds } from "../enums/BSPEnumTraders";

@injectable()
export class BSPClassTraders {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    private traderIds: string[] = Object.values(TraderIds);

    // static
    public traderInsurance(settingsTraders: any, eftDatabaseTraders: any, sptConfigsInsurance: any): any {
        const traderArray = ["prapor", "therapist"];
        
        traderArray.forEach((trader) => {
            const traderKey = TraderIds[trader.toUpperCase()];

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
    public traderStock(settingsTraders: any, sptConfigsTrader: any): any {  
        function getKeyByValue(value: string): string | undefined {
            for (const key in TraderIds) {
                if (TraderIds[key] === value) {
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
                stockUpdateTime.seconds.min = settingsTraders[traderKey].stockUpdateInMinutes.min * 60;
                stockUpdateTime.seconds.max = settingsTraders[traderKey].stockUpdateInMinutes.max * 60;
            }
        });

        // make all trader purchases "found in-raid"
        sptConfigsTrader.purchasesAreFoundInRaid = settingsTraders.traderPurchasesFiR;

        // trader purchase price multiplier
        sptConfigsTrader.traderPriceMultiplier = settingsTraders.traderPurchasesMultiplier;

        // fence item amount
        sptConfigsTrader.fence.assortSize = settingsTraders.fence.itemAmount;

        // fence weapon durability percent min/max
        sptConfigsTrader.fence.weaponDurabilityPercentMinMax.current.min = settingsTraders.fence.weaponDurabilityPercent.min;
        sptConfigsTrader.fence.weaponDurabilityPercentMinMax.current.max = settingsTraders.fence.weaponDurabilityPercent.max;

        // fence armor durability percent min/max
        sptConfigsTrader.fence.armorMaxDurabilityPercentMinMax.current.min = settingsTraders.fence.armorDurabilityPercent.min;
        sptConfigsTrader.fence.armorMaxDurabilityPercentMinMax.current.max = settingsTraders.fence.armorDurabilityPercent.max;

        // disable fence seasonal items blacklist
        sptConfigsTrader.fence.blacklistSeasonalItems = settingsTraders.fence.blacklistSeasonalItems;
    }

    // static
    public traderServices(settingsTraders: any, bspClassHelpers: any, eftDatabaseCustomization: any, eftDatabaseTraders: any): any {
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
                if (bspClassHelpers.hasItemId([trader]) === false && eftDatabaseTraders[trader].suits) {
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
    public traderRepairs(settingsTraders: any, eftDatabaseTraders: any, sptConfigsRepair: any): any {
        // trader repair quality degradation multiplier
        const traderArray = ["prapor", "skier", "mechanic"];

        traderArray.forEach((trader) => {
            const traderKey = TraderIds[trader.toUpperCase()];
            eftDatabaseTraders[traderKey].base.repair.quality = settingsTraders[trader].repairs.qualityDegradation;
        });

        // trader repair random durability loss
        sptConfigsRepair.applyRandomizeDurabilityLoss = settingsTraders.traderRepairRandomDurabilityLoss;

        // trader repair price multiplier
        sptConfigsRepair.priceMultiplier = settingsTraders.traderRepairPriceMultiplier;
    }
}
