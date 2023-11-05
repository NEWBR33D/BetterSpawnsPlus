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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSPClassBots = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
const BSPEnumLocations_1 = require("../enums/BSPEnumLocations");
const BSPEnumBots_1 = require("../enums/BSPEnumBots");
const dogTags_json_1 = __importDefault(require("../db/bots/pmcs/dogTags.json"));
let BSPClassBots = class BSPClassBots {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    altLocationNames = Object.values(BSPEnumLocations_1.AltLocationNames);
    botBrainTypes = Object.values(BSPEnumBots_1.BotBrainTypes);
    botDifficultyTypes = Object.values(BSPEnumBots_1.BotDifficultyTypes);
    pmcBotTypes = Object.values(BSPEnumBots_1.PmcBotTypes);
    // dynamic
    botBrainType(settingsBots, bspClassHelpers, sptConfigsBot, sptConfigsPmc) {
        if (settingsBots.brainTypes.enabled) {
            // randomize bot brain types
            if (settingsBots.brainTypes.randomize) {
                for (const brainType of this.botBrainTypes) {
                    settingsBots.brainTypes.bear[brainType] = bspClassHelpers.generateRandomInteger(1, 5);
                    settingsBots.brainTypes.usec[brainType] = bspClassHelpers.generateRandomInteger(1, 5);
                    settingsBots.brainTypes.scav[brainType] = bspClassHelpers.generateRandomInteger(1, 5);
                }
            }
            // bot brain types for pmcs and scavs
            for (const altLocation of this.altLocationNames) {
                sptConfigsPmc.pmcType.sptbear[altLocation] = settingsBots.brainTypes.bear;
                sptConfigsPmc.pmcType.sptusec[altLocation] = settingsBots.brainTypes.usec;
                sptConfigsBot.assaultBrainType[altLocation] = settingsBots.brainTypes.scav;
            }
        }
    }
    // static
    pmcDogTags(settingsBots, eftDatabaseBots) {
        // custom bot pmc dogtag usernames
        if (settingsBots.pmc.customPmcDogTags) {
            for (const typeKey in this.pmcBotTypes) {
                const typeValue = this.pmcBotTypes[typeKey];
                eftDatabaseBots.types[typeValue].firstName = dogTags_json_1.default.usernames;
                eftDatabaseBots.types[typeValue].lastName = [];
            }
        }
    }
    // static
    pmcHostility(settingsBots, sptConfigsPmc) {
        // percent chance that a bot pmc of the same faction is hostile to the player
        sptConfigsPmc.chanceSameSideIsHostilePercent = settingsBots.pmc.chanceSameFactionIsHostile;
    }
    // static
    pmcRelativeLevel(settingsBots, sptConfigsPmc) {
        // bot pmc level relative to player level
        sptConfigsPmc.botRelativeLevelDeltaMax = settingsBots.pmc.botLevelRelativeToPlayerLevel;
    }
    // static
    pmcTalkRate(settingsBots, eftDatabaseBots) {
        // bot pmc talk rate
        if (settingsBots.pmc.makePmcsNotRandomlyTalk) {
            for (const typeKey in this.pmcBotTypes) {
                const typeValue = this.pmcBotTypes[typeKey];
                this.botDifficultyTypes.forEach(difficultyType => {
                    const difficulty = eftDatabaseBots.types[typeValue].difficulty[difficultyType];
                    difficulty.Grenade.CHANCE_TO_NOTIFY_ENEMY_GR_100 = 0;
                    difficulty.Mind.CAN_TALK = false;
                    difficulty.Mind.CAN_THROW_REQUESTS = false;
                    difficulty.Mind.TALK_WITH_QUERY = false;
                    difficulty.Mind.MIN_TALK_DELAY = 100;
                    difficulty.Patrol.TALK_DELAY = 50;
                    difficulty.Patrol.TALK_DELAY_BIG = 50.1;
                    difficulty.Patrol.MIN_DIST_TO_CLOSE_TALK = 100;
                    difficulty.Patrol.MIN_DIST_TO_CLOSE_TALK_SQR = 10000;
                });
            }
        }
    }
};
exports.BSPClassBots = BSPClassBots;
exports.BSPClassBots = BSPClassBots = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [Object])
], BSPClassBots);
