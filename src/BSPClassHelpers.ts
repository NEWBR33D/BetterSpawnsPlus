/* 
 * BetterSpawnsPlus v2.0.0
 * MIT License
 * Copyright (c) 2023 PreyToLive
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/

import { inject, injectable, DependencyContainer } from "tsyringe";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

@injectable()
export class BSPClassHelpers {

    constructor(
        @inject("WinstonLogger") private logger: ILogger,
        @inject("DatabaseServer") private databaseServer: DatabaseServer
    )
    {}

    public checkProperties(object: any): boolean {
        return Object.values(object).some(value => value !== 0);
    }

    public generateBot(type: string, chance: number, zones: string, difficulty: string, supportType: string, sequence: string, time: number, supports: any, triggerId: string, triggerName: string, delay: number): any {
        return {
            "BossName": type,
            "BossChance": chance,
            "BossZone": zones,
            "BossPlayer": false,
            "BossDifficult": difficulty,
            "BossEscortType":supportType,
            "BossEscortDifficult": difficulty,
            "BossEscortAmount": sequence,
            "Time": time,
            "Supports": supports,
            "TriggerId": triggerId,
            "TriggerName": triggerName,
            "Delay": delay,
            "RandomTimeSpawn": false
        }
    }

    public generateRandomInteger(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public generateRandomNumberFromSequence(array: number[]): string {
        let random = array[Math.floor(Math.random() * array.length)];
        random = random > 0 ? random - 1 : 0;
        return random.toString();
    }

    /* TO BE DELETED
    public generateRandomNumberFromSequence(array: number[]) {
        let random = array[Math.floor(Math.random() * array.length)];

        if (random > 0) {
            random = random - 1;
        } else {
            random = 0;
        }
        
        return random.toString();
    }
    */

    public generateWeightArray(object: Record<string, number>): string[] {
        const array: string[] = [];
    
        for (const [key, value] of Object.entries(object)) {
            const repeatedKeys = Math.min(value, 5);
            array.push(...Array(repeatedKeys).fill(key));
        }
    
        return array;
    }

    /* TO BE DELETED
    public generateWeightArray(object: object) {
        const array: string[] = [];

        for (let [key, value] of Object.entries(object)) {
            if (value > 5) {
                value = 5;
            }

            if (value == 1) {
                array.push(key);
            } else if (value == 2) {
                array.push(key);
                array.push(key);
            } else if (value == 3) {
                array.push(key);
                array.push(key);
                array.push(key);
            } else if (value == 4) {
                array.push(key);
                array.push(key);
                array.push(key);
                array.push(key);
            } else if (value == 5) {
                array.push(key);
                array.push(key);
                array.push(key);
                array.push(key);
                array.push(key);
            }
        }

        return array;
    }
    */

    private idSet = new Set<string>();
    
    public hasItemId(id: string[]): boolean {
        return id.some(itemId => this.idSet.has(itemId));
    }

    public itemData(container: DependencyContainer, id: string, data: string, value: any): void {
        const eftDatabaseItems = container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.items;
        eftDatabaseItems[id]._props[data] = value;
    }

    public removeElementFromWeightArray(array: string[]): string | undefined {
        const elementIndex = Math.floor(Math.random() * array.length);
        return array.splice(elementIndex, 1)[0];
    }

    /* TO BE DELETED
    public removeElementFromWeightArray(array: string[]) {
        const element = (Math.random() * array.length) | 0;
        return array.splice(element, 1)[0];
    }
    */
}