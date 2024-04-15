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
export class BSPClassHideout {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    // static
    public hideoutModules(settingsHideout: any, eftDatabaseHideout: any): any {
        // generator speed without fuel
        eftDatabaseHideout.settings.generatorSpeedWithoutFuel = settingsHideout.areas.moduleSettings.generator.speedWithoutFuel;

        // generator fuel flow rate
        eftDatabaseHideout.settings.generatorFuelFlowRate = settingsHideout.areas.moduleSettings.generator.fuelFlowRate;

        // air filter unit flow rate
        eftDatabaseHideout.settings.airFilterUnitFlowRate = settingsHideout.areas.moduleSettings.airFilterUnit.flowRate;

        // gpu boost rate
        eftDatabaseHideout.settings.gpuBoostRate = settingsHideout.areas.moduleSettings.gpu.boostRate;
    }

    // static
    public hideoutConstruction(settingsHideout: any, bspClassHelpers: any, eftDatabaseHideout: any): any {
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
    public hideoutProduction(settingsHideout: any, bspClassHelpers: any, eftDatabaseHideout: any): any {
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
    public hideoutScavCase(settingsHideout: any, bspClassHelpers: any, eftDatabaseHideout: any, sptConfigsScavcase: any): any {
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
        sptConfigsScavcase.allowMultipleAmmoRewardsPerRarity = settingsHideout.scavCase.rewards.ammo.allowMultiplePerRarity;
        
        // allow multiple money rewards per rarity
        sptConfigsScavcase.allowMultipleMoneyRewardsPerRarity = settingsHideout.scavCase.rewards.money.allowMultiplePerRarity;

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
}
