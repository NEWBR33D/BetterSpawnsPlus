/* 
 * BetterSpawnsPlus v2.0.3
 * MIT License
 * Copyright (c) 2024 PreyToLive
 */

/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

import { inject, injectable, DependencyContainer } from "tsyringe";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { AltLocationNames } from "../enums/BSPEnumLocations";

@injectable()
export class BSPClassItems {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    private altLocationNames: string[] = Object.values(AltLocationNames);

    // static
    public itemDurability(settingsItems: any, bspClassHelpers: any, container: DependencyContainer, eftDatabaseGlobals: any, eftDatabaseItems: any): any {
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

    public itemInsurance(settingsItems: any, bspClassHelpers: any, container: DependencyContainer, eftDatabaseItems: any, eftDatabaseLocations: any): any {
        // allow insurance on all locations
        if (settingsItems.allowInsuranceOnAllLocations) {
            this.altLocationNames.forEach(function(location) {
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

    public itemLabsKeycard(settingsItems: any, eftDatabaseItems: any, eftDatabaseLocations: any): any {
        // remove labs access keycard requirement
        if (settingsItems.keys.labsAccessKeycard.removeLabsRequirement) {
            eftDatabaseLocations.laboratory.base.AccessKeys = [];
        }

        // max number of uses for labs access keycard
        const labsAccessKeycard = eftDatabaseItems["5c94bbff86f7747ee735c08f"];
        
        labsAccessKeycard._props.MaximumNumberOfUsage = settingsItems.keys.labsAccessKeycard.maxNumberOfUses;
    }

    public itemLoot(settingsItems: any, bspClassHelpers: any, container: DependencyContainer, eftDatabaseItems: any): any {
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
}
