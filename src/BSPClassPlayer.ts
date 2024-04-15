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
export class BSPClassPlayer {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    // static
    public playerHealth(settingsPlayer: any, eftDatabaseGlobals: any): any {
        // player health in-raid
        if (settingsPlayer.playerHealth.healthInRaid.enabled) {
            eftDatabaseGlobals.config.Health.Effects.Existence.EnergyLoopTime = settingsPlayer.playerHealth.healthInRaid.energyLoopTimeInMinutes * 60;
            eftDatabaseGlobals.config.Health.Effects.Existence.EnergyDamage = settingsPlayer.playerHealth.healthInRaid.energyDecreaseAmountPerLoopTime;
            eftDatabaseGlobals.config.Health.Effects.Existence.HydrationLoopTime = settingsPlayer.playerHealth.healthInRaid.hydrationLoopTimeInMinutes * 60;
            eftDatabaseGlobals.config.Health.Effects.Existence.HydrationDamage = settingsPlayer.playerHealth.healthInRaid.hydrationDecreaseAmountPerLoopTime;
        }

        // player health in-hideout
        if (settingsPlayer.playerHealth.healthInHideout.enabled) {
            eftDatabaseGlobals.config.Health.Effects.Regeneration.Energy = settingsPlayer.playerHealth.healthInHideout.energyRegenerationLoopTimeInMinutes;
            eftDatabaseGlobals.config.Health.Effects.Regeneration.Hydration = settingsPlayer.playerHealth.healthInHideout.hydrationRegenerationLoopTimeInMinutes;

            const bodyHealth = eftDatabaseGlobals.config.Health.Effects.Regeneration.BodyHealth;
            const regenerationMultiplier = settingsPlayer.playerHealth.healthInHideout.healthRegenerationMultiplier;

            bodyHealth.Chest.Value = bodyHealth.Chest.Value * regenerationMultiplier;
            bodyHealth.Head.Value = bodyHealth.Head.Value * regenerationMultiplier;
            bodyHealth.LeftArm.Value = bodyHealth.LeftArm.Value * regenerationMultiplier;
            bodyHealth.LeftLeg.Value = bodyHealth.LeftLeg.Value * regenerationMultiplier;
            bodyHealth.RightArm.Value = bodyHealth.RightArm.Value * regenerationMultiplier;
            bodyHealth.RightLeg.Value = bodyHealth.RightLeg.Value * regenerationMultiplier;
            bodyHealth.Stomach.Value = bodyHealth.Stomach.Value * regenerationMultiplier;
        }

        if (settingsPlayer.playerHealth.healthInHideout.removeFreeHealTrialLevelsAndRaids) {   
            eftDatabaseGlobals.config.Health.HealPrice.TrialLevels = 0;
            eftDatabaseGlobals.config.Health.HealPrice.TrialRaids = 0;
        }
    }

    // static
    public playerScav(settingsPlayer: any, eftDatabaseGlobals: any): any {
        // player-scav raid cooldown timer
        eftDatabaseGlobals.config.SavagePlayCooldown = settingsPlayer.playerScav.cooldownTimer * 60;
    }
}
