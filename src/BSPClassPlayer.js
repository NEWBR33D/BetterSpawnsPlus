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
exports.BSPClassPlayer = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
let BSPClassPlayer = class BSPClassPlayer {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    // static
    playerHealth(settingsPlayer, eftDatabaseGlobals) {
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
    playerScav(settingsPlayer, eftDatabaseGlobals) {
        // player-scav raid cooldown timer
        eftDatabaseGlobals.config.SavagePlayCooldown = settingsPlayer.playerScav.cooldownTimer * 60;
    }
};
exports.BSPClassPlayer = BSPClassPlayer;
exports.BSPClassPlayer = BSPClassPlayer = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassPlayer);
