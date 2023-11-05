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
exports.BSPClassHelpers = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/brace-style*/
const tsyringe_1 = require("tsyringe");
let BSPClassHelpers = class BSPClassHelpers {
    logger;
    databaseServer;
    constructor(logger, databaseServer) {
        this.logger = logger;
        this.databaseServer = databaseServer;
    }
    checkProperties(object) {
        return Object.values(object).some(value => value !== 0);
    }
    generateBot(type, chance, zones, difficulty, supportType, sequence, time, supports, triggerId, triggerName, delay) {
        return {
            "BossName": type,
            "BossChance": chance,
            "BossZone": zones,
            "BossPlayer": false,
            "BossDifficult": difficulty,
            "BossEscortType": supportType,
            "BossEscortDifficult": difficulty,
            "BossEscortAmount": sequence,
            "Time": time,
            "Supports": supports,
            "TriggerId": triggerId,
            "TriggerName": triggerName,
            "Delay": delay,
            "RandomTimeSpawn": false
        };
    }
    generateRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    generateRandomNumberFromSequence(array) {
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
    generateWeightArray(object) {
        const array = [];
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
    idSet = new Set();
    hasItemId(id) {
        return id.some(itemId => this.idSet.has(itemId));
    }
    itemData(container, id, data, value) {
        const eftDatabaseItems = container.resolve("DatabaseServer").getTables().templates.items;
        eftDatabaseItems[id]._props[data] = value;
    }
    removeElementFromWeightArray(array) {
        const elementIndex = Math.floor(Math.random() * array.length);
        return array.splice(elementIndex, 1)[0];
    }
};
exports.BSPClassHelpers = BSPClassHelpers;
exports.BSPClassHelpers = BSPClassHelpers = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("DatabaseServer")),
    __metadata("design:paramtypes", [Object, Function])
], BSPClassHelpers);
