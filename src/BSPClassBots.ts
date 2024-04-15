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
import { AltLocationNames } from "../enums/BSPEnumLocations";
import { BotBrainTypes, BotDifficultyTypes, PmcBotTypes } from "../enums/BSPEnumBots";
import pmcDogTags from "../db/bots/pmcs/dogTags.json";

@injectable()
export class BSPClassBots {

    constructor(
        @inject("WinstonLogger") private logger: ILogger
    )
    {}

    private altLocationNames: string[] = Object.values(AltLocationNames);
    private botBrainTypes: string[] = Object.values(BotBrainTypes);
    private botDifficultyTypes: string[] = Object.values(BotDifficultyTypes);
    private pmcBotTypes: string[] = Object.values(PmcBotTypes);

    // dynamic
    public botBrainType(settingsBots: any, bspClassHelpers: any, sptConfigsBot: any, sptConfigsPmc: any): any {
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
    public pmcDogTags(settingsBots: any, eftDatabaseBots: any): any {
        // custom bot pmc dogtag usernames
        if (settingsBots.pmc.useCustomDogTags) {
            for (const typeKey in this.pmcBotTypes) {
                const typeValue = this.pmcBotTypes[typeKey];
                eftDatabaseBots.types[typeValue].firstName = pmcDogTags.usernames;
                eftDatabaseBots.types[typeValue].lastName = [];
            }
        }
    }

    // static
    public pmcHostility(settingsBots: any, sptConfigsPmc: any): any {
        // percent chance that a bot pmc of the same faction is hostile to the player
        sptConfigsPmc.chanceSameSideIsHostilePercent = settingsBots.pmc.hostileFactionChance;
    }

    // static
    public pmcRelativeLevel(settingsBots: any, sptConfigsPmc: any): any {
        // bot pmc level relative to player level
        sptConfigsPmc.botRelativeLevelDeltaMax = settingsBots.pmc.botLevelOffset;
    }

    // static
    public pmcTalkRate(settingsBots: any, eftDatabaseBots: any): any {
        // bot pmc talk rate
        if (settingsBots.pmc.disableRandomPmcDialogue) {
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
}
