# **PreyToLive-BetterSpawnsPlus v1.1.2**

Developed by: [NEWBR33D](https://github.com/NEWBR33D) (aka [PreyToLive](https://hub.sp-tarkov.com/user/24548-preytolive/))

[BetterSpawnsPlus](https://hub.sp-tarkov.com/files/file/1002-betterspawnsplus/) is a mod that aims to make all bots in SP-Tarkov spawn more consistently throughout each raid and prevent raids from becoming ghost towns after ~20 minutes.

#### ***Please read everything in this "README.md" before using the mod. Thanks!***

BetterSpawnsPlus v1.1.2 includes a spawn generator for creating your very own custom spawn wave presets that fit to your own playstyle. This feature includes the ability to select the bot type, bot difficulty, bot chance, bot amount, number/time of initial spawn waves, number/time of interval spawn waves, spawn delays for randomizing time of spawns, the open zones that the bots spawn in, and more.

The addition of this new feature means that this mod now consists of two seperate methods for spawning bots. The "main" method of spawning bots is very similiar to how the bots were spawned in previous versions of BetterSpawnsPlus and are much more difficult and time consuming to create. However, the new "spawnGenerator" method of spawning bots is much more simple and makes it easy to create consistent bot spawns.

Furthermore, your spawn generator presets will now be chosen by random before and after each raid as well as all the values in the chosen preset will be randomized based on your settings. This means that raid spawns will now be even more random "in a good way" than ever before.

- I have included several of my own customized bot spawns that attempt to keep spawns as true as possible to how they are in live Tarkov.
- In these Like-Live-Tarkov "main" presets bots will spawn in set intervals for 45 or 60 minutes depending on the map.
  - 45 minute maps: Factory and The Lab.
  - 60 minute maps: Customs, Interchange, Lighthouse, Reserve, Shoreline, Streets of Tarkov, and Woods.
- Pmc bots have been made to mostly spawn in seperate wave intervals from scav bots. So you will more likely have a chance to encounter pmcs before they get spawn killed by scavs.
- Bots have also been made to spawn more consistently in POIs, however the "randomness" of the spawns will ensure that entire maps still feel "alive" during raids.

> NOTE: Besides making bot spawns "better" I have also included some other options that can be enabled/disabled within the config file presets that I've made to better suit how I prefer to play the game. (See "Other Options" below for more information.)

> This is still very much a work-in-progress so if you have any recommendations for the mod or would like to see any other options added to it please let me know and I will see what I can do.

## ***Important!:***

  1. *This mod is more than likely NOT compatible with other mods that change bot spawn waves, bot spawn type, and/or bot amount. However, it should still be compatible with mods that change bot behavior, bot difficulty and/or bot loadouts.*
  
  2. *Furthermore, ***BOSSES MUST BE ENABLED IN-GAME*** or else this mod will not work. You must only enable or disable the bosses in the presets.*
  
  3. *This mod already includes my other mod "AllOpenZones" so if you are already using it then you need to either remove it or delete it from your mods folder.*

### **How To Install:**

1. Download the PreyToLive-BetterSpawnPlus-v1.1.2.zip from the github.
2. Unzip the file and place the unzipped file in the user/mods directory within your SP-Tarkov folder.
3. Choose or create a config preset. (See "Config Presets" below for more information.)
4. Choose or create custom spawn waves with the spawn generator. (See "Spawn Generator Presets" below for more information.)
5. That is all. Have fun!

## **Config Presets:**

How to create and choose config presets:
  1. You can create your own config presets within the presets folder at BetterSpawnsPlus/config/presets.
  2. Create a duplicate of the "defaultValuesForReference.json" and name it to whatever you want. 
  3. To select which preset is used in-game use the "configPresetManager.json" found at BetterSpawnsPlus/config.
  4. Type only the name of the file into the option "configFilePreset". Do not include .json in the name.

> NOTE: If you only want the default bot spawn changes that my mod offers then please use the "spawnChangesOnlyConfig". This config preset is already selected by default in the "configPresetManager.json" when you first download the mod.

## **Spawn Generator Presets:**

Please follow the steps below to learn how to create your own custom spawn wave presets.

How to create and choose spawn generator presets:
  1. The spawn generator for each location can be found at BetterSpawnsPlus/db/locations/"map-name"/spawnGenerator. 
  2. Within the "spawnGenerator" folder you will find a "presets" folder and a template.
  3. Copy/paste the template into the presets folder to start creating your own custom spawn waves.
  4. To add your newly created preset to the game, you must enter the name of the file and the weight to your config file.
```
"spawnGenerator": {
    "enabled": [true/false],
    "presets": {
        "spawnGenerator_Preset_Name": [0->5]
    }
}
```  
How the weight system works:
  1. Its important to understand that the spawn generator uses a weight system between 0 and 5.
  2. Setting the weight to 0 will disable the preset.
  3. Setting the weight to 5 yields a higher chance of that preset being chosen after each raid.
  4. Everything in BetterSpawnsPlus uses this same weight system.

What each option in the spawn generator does:
```
"enableMainPresets": [true/false],
```
- This option sets whether or not the "spawnGenerator" preset is an addon for the "main" preset.
- If set to "true" then the spawns from the chosen "spawnGenerator" preset will be added to the spawns from the chosen "main" presets.
- If set to "false" then the mod will randomly choose between picking either just the spawns from the "main" preset or just the "spawnGenerator" preset after every raid.
```
"botType": {
    "bear": [0->5],
    "usec": [0->5]
}
```
- This option is only available for pmcs and bosses. It uses the weight system to determine what pmc/boss bot type gets generated.
  - e.g. setting "bear" to 2 and "usec" to 5 means that 2 out of every 7 pmc waves will spawn bear pmcs and the other 5 pmc waves will spawn usec pmcs.
```
"botDifficulty": {
    "easy": [0->5],
    "normal": [0->5],
    "hard": [0->5],
    "impossible": [0->5]
}
```
- This option uses the weight system to determine what difficulty each bot is generated with.
  - e.g. setting "normal" to 3 and "hard" to 1 means that 3 out of every 4 spawns will spawn with normal difficulty and the other spawn wave will be hard difficulty.
```
"botChance": {
    "min": [0->100%],
    "max": [0->100%]
}
```
- This option generates a random percent chance to spawn each bot.
  - e.g. setting the "min" to 60 and the "max" to 100 will choose a random number between these two numbers for each spawn.
```
"botAmountPerSpawnWave": [0,1,2,3,4],
```
- This option uses a number sequence to determine the amount of bots that spawn in each spawn wave. The mod will randomly pick a number from the number sequence.
- Having more of the same number will yield higher probability of that number being chosen.
  - e.g. a number sequence set to [1,1,1,1,2,2] will have a 2 out of 6 chance to spawn two bots in the spawn wave or 4 out of 6 chance to spawn one bot in the spawn wave.
```
"spawnWaves": {
    "initial": {
        "waves": [integer],
        "time": [integer]
    },
    "interval": {
        "waves": [integer],
        "wavesPerInterval": [integer],
        "time": [integer]
    },
    "spawnDelay": {
        "min": [integer],
        "max": [integer]
    }
}
```
- This option determines when and how many bot waves spawn. Time is in seconds.
- The "initial" waves determines how many waves will be generated at the set time.
  - e.g. setting "initial" waves to 10 with a time of 20 will spawn 10 waves of bots at 20 seconds.
- The "interval" waves set how many waves will be added in intervals after the "initial" waves.
- The "wavesPerInterval" determines how many "interval" waves get spawned per the "interval" time.
  - e.g. setting "interval" waves to 30, "wavesPerInterval" to 3, and the time to 120 will generate 3 waves every 120 seconds for a total of 10 times. That means the waves will stop spawning after 20 minutes since 2 minutes * 10 = 20 minutes. Increasing the number of "interval" waves will increase the time that bots continue to spawn.
- The "spawnDelay" randomizes each spawn wave so that they do not all occur at the exact same time.
  - e.g. setting the "min" spawn delay to -30 and the "max" spawn delay to 60 will generate a random number between the two and add it to the "initial" and "interval" time.
```
"triggers": {
    "autoId_00632_EXFIL": [0->5],
    "autoId_00000_D2_LEVER": [0->5],
    "raider_simple_patroling": [0->5]
}
```
- This option uses the weight system to determine the triggers that will be applied to bot spawn waves. This option is only available for raiders on The Lab and on Reserve.
```
"onlyVanillaOpenZones": [true/false],
"openZones": {
  "BotZone": [0->5],
}
```
- This option uses the weight system to determine which open zone the bots will spawn in.
- The "onlyVanillaOpenZones" option is only available for bosses and some of the other bots on certain locations. Setting this option to "true" forces the vanilla (live Tarkov) open zones, as well as, the vanilla triggers to only be applied.
  - e.g. If "onlyVanillaOpenZones" is set to "true" for bosses on Customs then Knight will only spawn at "ZoneScavbase" and Reshala will only spawn at "ZoneDormitory" or "ZoneGasStation".

> IMPORTANT: Do not edit or remove the "init" file within the BetterSpawnPlus/db/locations folder.

## **Main Presets:**

Main presets are more difficult and time consuming to create but can be tuned more precisely. If you would like to make them then follow the steps below.

How to create and choose main presets:
  1. The "main" spawn method for each location can be found at BetterSpawnsPlus/db/locations/"map-name"/main. 
  2. Within the "main" folder you will find a "presets" folder and a template.
  3. Copy/paste the template into the presets folder to start creating your own custom spawn waves.
  4. To add your newly created preset to the game, you must enter the name of the file and the weight to your config file.
```
"main": {
    "enabled": [true/false],
    "enableBosses": [true/false],
    "presets": {
        "main_Preset_Name": [0->5]
    }
}
```
How the weight system works:
  1. Its important to understand that the "main" spawn method uses a weight system between 0 and 5.
  2. Setting the weight to 0 will disable the preset.
  3. Setting the weight to 5 yields a higher chance of that preset being chosen after each raid.
  4. Everything in BetterSpawnsPlus uses this same weight system.

What each option in the "main" spawn method does:
```
"randomize": {
    "enabled": [true/false],
    "pmcs": {
        "difficulty": {
            "easy": [0->5],
            "normal": [0->5],
            "hard": [0->5],
            "impossible": [0->5]
        },
        "spawnDelay": {
            "min": [integer],
            "max": [integer]
        }
    }
}
```
- The option "difficulty" uses the weight system to determine what difficulty each bot is generated with.
  - e.g. setting "normal" to 3 and "hard" to 1 means that 3 out of every 4 spawns will spawn with normal difficulty and the other spawn wave will be hard difficulty.
- The "spawnDelay" randomizes each spawn wave so that they are different each raid.
  - e.g. setting the "min" spawn delay to -30 and the "max" spawn delay to 60 will generate a random number between the two and add it to each spawn for that type.
```
"botType": [
    {
        "BossName": "botType",
        "BossChance": [0->100%],
        "BossZone": "botZone",
        "BossPlayer": [true/false],
        "BossDifficult": "botDifficulty",
        "BossEscortType": "botType",
        "BossEscortDifficult": "botEscortDifficulty",
        "BossEscortAmount": "0,1,2,3,4",
        "Time": [integer],
        "Supports": null,
        "TriggerId": "",
        "TriggerName": "",
        "Delay": 0,
        "RandomTimeSpawn": [true/false]
    }
]
```
The above code is what you will use to create a spawn wave with the "main" spawn method.
- "BossName" and "BossEscortDifficult" options
    - pmcs: "sptBear" or "sptUsec"
    - scavs: "assault" or "cursedAssault"
    - sniperScavs: "marksman"
    - bosses: "bossBully", "bossKilla", "bossKojaniy", "bossGluhar", "bossSanitar", "bossTagilla", "bossKnight", or "bossZryachiy"
    - bossesEscort: "followerGluharAssault", "followerBully", "followerBigPipe", "followerBirdEye", or "followerSanitar"
    - cultists: "sectantPriest" or "sectantWarrior"
    - raiders: "pmcBot"
    - rogues: "exUsec"
- "BossZone" options
    - All open zones available for each location can be found in BetterSpawnsPlus/info/OpenZoneGuide.txt.

> IMPORTANT: Do not edit or remove the "init" file within the BetterSpawnPlus/db/locations folder.

## **BetterSpawnsPlus Config Options:**

Below is a listing of information about each option within the mod and what they do. Every option can be enabled or disabled.
> NOTE: My mod "AllOpenZones" is enabled by default when this mod is enabled and is a requirement for the mod to work correctly. "AllOpenZones" basically makes pmcs and scavs spawn in certain spawn zones that they previously could not or did not spawn in. More information about the included open zones can be found [here](https://hub.sp-tarkov.com/files/file/936-allopenzones/).
```
"enabled": [true/false]
```
- This option is used quite frequently to enable or disable sections of the mod.
```
"consoleLogs": [true/false]
```
- This option outputs information about the mod in the server console. Displays all the spawn changes, number of spawns generated for each map and the files chosen before each raid. I highly recommend to have this turned on.
```
"extendedLogs": [true/false]
```
- This option outputs detailed information about every spawn wave that is generated. This option fills the server console with a ton of information so I only recommend having this turned on while testing your custom spawn waves to see exactly what it is spawning.
```
"main": {
    "enabled": [true/false],
    "enableBosses": [true/false],
    "presets": {
        "PTL_BSP_MAIN_PRESET_LIKELIVETARKOV_1": [0->5],
        "PTL_BSP_MAIN_PRESET_LIKELIVETARKOV_2": [0->5]
    }
}
```
- This is where you can enabe/disable the "main" Like-Live-Tarkov presets for each location that I have made. Setting a preset to 0 disables it.
- If you decide to create your own preset using the "main" method for spawn waves then you will need to add the file name and the weight here.
- You can enable/disable bosses for the "main" presets for each location.
- If you want to change the spawn chance of bosses for the "main" presets, they can be changed at BetterSpawnsPlus/db/locations/"map-name"/presets/"preset-name"/"bosses": [].
```
"spawnGenerator": {
    "enabled": [true/false],
    "presets": {
        "PTL_BSP_SG_PRESET_ADDON_BOSSES": [0->5],
        "PTL_BSP_SG_PRESET_ADDON_CULTISTS": [0->5],
        "PTL_BSP_SG_PRESET_ADDON_RAIDERS": [0->5],
        "PTL_BSP_SG_PRESET_ADDON_ROGUES": [0->5],
        "PTL_BSP_SG_PRESET_LIKELIVETARKOV": [0->5]
    }
}
```
- This is where you can enable/disable the "spawnGenerator" presets for each location that have been made. Setting a preset to 0 disables it.
- If you decide to create your own preset using the "spawnGenerator" method for spawn waves then you will need to add the file name and the weight here.

## **Other Config Options:**

### **Raids Options:**

```
"maxBotCap": {
    "enabled": [true/false],
    "customs": {
        "min": [integer],
        "max": [integer]
    }
}
```
- This number sets the maximum number of bots able to spawn on the map. When a location reaches the maximum number of bots set it will stop spawning more bots until a bot on the location dies.
- This option chooses a random number between the "min" and "max" before each raid. 
- It is recommended to not set the "max" number any higher than 30 since it can cause fps to drop significantly.
```
"raidTimer": {
    "enabled": [true/false],
    "customs": {
        "min": [integer],
        "max": [integer]
    }
}
```
- This option sets the duration of a raid (in minutes).
- This option chooses a random number between the "min" and "max" before each raid.
- The airdrop time and armored train times are adjusted dynamically to fit the selected time.
```
"airdrops": {
    "enabled": [true/false],
    "startTime": {
        "min": [integer],
        "max": [integer]
    }
}
```
- This option sets the "min" and "max" time that the airdrop will spawn into the raid.
```
"plane": {
    "dynamic": [true/false],
    "speed": {
        "min": [integer (min = 50)],
        "max": [integer (max = 120)]
    },
    "height": {
        "min": [integer (min = 200)],
        "max": [integer (max = 600)]
    },
    "volume": {
        "min": [integer (min = 0)],
        "max": [integer (max = 100)]
    },
    "crate": {
      "speed": {
          "min": [integer (min = 1)],
          "max": [integer (max = 10)]
      },
      "items": {
          "min": [integer (min = 0)],
          "max": [integer (max = 35)]
      }
   }
}
```
- This option set the speed, height, and volume of the airdrop plane as well as the crate fall speed and item count.
- I have limited the min and max values that can be set for each option since setting the values lower or higher than these cause the plane or the crate to not spawn.
- If the "dynamic" option is set to "true" then the speed of the plane and volume level will be changed based on the height of the plane. Additionally, the crate fall speed will be changed based on the item count.
  - e.g. a higher plane height will yield a lower volume and lower speed. A higher item count will yield a faster fall speed.
```
"chance": {
    "customs": [0->100%],
    "interchange": [0->100%],
    "lighthouse": [0->100%],
    "reserve": [0->100%],
    "shoreline": [0->100%],
    "streets": [0->100%],
    "woods": [0->100%]
}
```
- This option sets the chance that the airdrop plane will spawn into the raid.

### **Bots Options:**

```
"customPmcDogTags": [true/false]
```
- This option enables or disables the use of the "live tarkov" names I created for the pmc dog tags.
```
"makePmcsNotRandomlyTalk": [true/false]
```
- Pmcs now talk again in spt-aki 3.5.0+, however I prefer them not talking like in spt-aki 3.4.1 as it gives there position away too often.
- This option fixes this by preventing the pmc bots from talking, except when reloading they occasionally talk. Its not perfect and doesn't make them completely silent but its better than their usual shouting that occurs quite often.
```
"chanceSameFactionIsHostile": [0->100%]
```
- This option sets the chance that bear or usec pmc bots will be hostile towards you, depending on the faction of your character.
```
"botLevelRelativeToPlayerLevel": [integer]
```
- This option sets the bot level based on the player level.
- The number you set is a range. For example: If you are level 25 and the number set is 5 then the bot level will range from 20 to 30.
```
"brainType": {
    "enabled": [true/false],
    "randomize": [true/false],
    "bear": {
        "bossKilla": [0->5],
        "bossKnight": [0->5],
        "bossGluhar": [0->5],
        "bossSanitar": [0->5],
        "bossTagilla": [0->5],
        "followerGluharAssault": [0->5],
        "followerBully": [0->5],
        "followerBigPipe": [0->5],
        "followerSanitar": [0->5],
        "assault": [0->5],
        "cursedAssault": [0->5],
        "exUsec": [0->5],
        "pmcBot": [0->5]
    }
}
```
- This option chooses the brain type for enemy pmcs in-raid.
- Use the "randomize" option to randomize all of the brain types before each raid.

### **Extraction Options:**

```
"openAllExfilsRegardlessOfEntryPoint": [true/false]
```
- This option opens all exfil locations regardless of player spawn / map side. However, not all efils will be available to the player each raid.
```
"allExtractionsAlwaysAvailable": [true/false]
```
- This option makes all exfil locations always available to extract at in every raid.
- This option is side-based however. So scav players will not be able to extract at pmc exfils and vice-versa.
```
"removeExtractionRestrictions": [true/false]
```
- This option removes extraction restrictions such as co-op requirements, money requirments, etc.

### **Loot Options:**
```
"loot": {
    "enabled": true,
    "customs": {
        "globalLootChanceModifier": [integer/decimal],
        "looseLootMultiplier": [integer/decimal],
        "staticLootMultiplier": [integer/decimal]
    }
}
```
- The option "globalLootChanceModifier" sets the chance for loot to spawn in each loot spawn.
- The option "looseLootMultiplier" changes the amount of loose loot found in-raid.
- The option "staticLootMultiplier" changes the amount of loot found in-raid in containers.

### **Items Options:**

```
"removeArmorDegradationFromRepairs": [true/false]
```
- This option prevents permanent armor degradation from repairs.
```
"removeWeaponDegradationFromRepairs": [true/false]
```
- This option prevents permanent weapon degradation from repairs.
```
"insuranceAllowedOnAllLocations": [true/false]
```
- This option allows insurance on all locations, primarily for labs.
```
"insuranceAllowedForAllItems": [true/false]
```
- This option allows all items to be insurable, primarily for ammunition and grenades.
```
"removeWeaponDurabilityBurn": [true/false]
```
- This options removes durability burn for weapons from general use.
```
"removeWeaponDeteriorationFromBullets": [true/false]
```
- This options removes bullet deterioration for weapons.
```
"allowAllItemsToBelootable": [true/false]
```
- This option allows all items to be lootable off of bots, primarily armbands and scabbards.
```
"allItemsUnexaminedByDefault": [true/false]
```
- This option makes all items unexamined by default and is meant for new profiles where some of the items can already be examined by default.
```
"labsAccessKeycard":
    "removeLabsReq": [true/false]
    "maxNumberOfUses": [integer]
```
- This option allows you to either completely disable the labs keycard requirement or instead you can set the number of uses allowed for each labs keycard you find in-raid.

### **Player Options:**
```
"scavCooldownTimer": [integer]
```
- This option sets the scav cooldown timer (in minutes).
```
"healthInRaid": {
    "enabled": [true/false],
    "energyLoopTime": [integer]
    "energyDecreasePerLoopTime": [integer/decimal]
    "hydrationLoopTime": [integer]
    "hydrationDecreasePerLoopTime": [integer/decimal]
}
```
- This option changes the amount of energy and hydration lost per minute while in raid.
```
"healthInHideout": {
    "enabled": [true/false],
    "healthRegenerationMultiplier": [integer/decimal]
    "energyRegenerationLoopTime": [integer]
    "hydrationRegenerationLoopTime": [integer],
    "removeFreeHealTrialLevelsAndRaids": [true/false]
}
```
- This option changes the energy, hydration, and health regeneration time while in the hideout or menu screen.
- The option "removeFreeHealTrialLevelsAndRaids" removes the free heals you get after raids and is meant for those of you that want to make the game more difficult at the start of a new profile.
```
"tacticalClothing": {
    "allowAllTacticalClothingForBothFactions": true,
    "unlockAllTacticalClothingForFree": false
}
```
- The option "allowAllTacticalClothingForBothFactions" allows all tactical clothing to be available for both bear and usec.
- The option "unlockAllTacticalClothingForFree" unlocks all tactical clothing for free.

### **Hideout Options:**

```
"constructionTimeMultiplier": [integer/decimal]
```
- This option can either increase or decrease the construction time in the hideout.
  - e.g. if the number is set to 0.025 then a construction that takes 24 hours will now only take 36 minutes.
```
"productionTimeMultiplier": [integer/decimal]
```
- This option can either increase or decrease the production time in the hideout.

### **Traders Options:**

```
"repairCostMultiplierForAllTraders": [integer/decimal]
```
- This option can either increase or decrease traders item repair costs.
  - e.g. if the number is set to 0.75 then a repair that normally costs 30,000 roubles will now only cost 22,500 roubles.
```
"insuranceMultiplier": [integer/decimal]
```
- This option changes the cost of insurance.
  - e.g. if the number is set to 0.50 then insurance that normally costs 15,000 roubles will now only cost 7,500 roubles.
```
"returnChancePercent": [%]
```
- This option sets the chance that a trader returns your insured items.
```
"minReturnTime": [integer]
"maxReturnTime": [integer]
```
- These options set the minimum and maximum return time of insured items (in hours).
```
"repairQualityDegradation": [integer/decimal]
```
- This option sets the amount of degradation applied to gear/weapons during repairs.
- Setting this option to zero will prevent any gear/weapon degradation during repairs.

### **Misc Options:**

```
"replaceLauncherBackground": [true/false]
```
- This option uses my preferred launcher background images.
- A random image will be chosen each time you restart the server and launcher.
- All launcher background artwork is created by [Vlad Novikov](https://www.artstation.com/yu2673) and [Eugene Shushliamin](https://www.artstation.com/geck).
> IMPORTANT: Clean the temporary files in the launcher settings for the launcher backgrounds to show.
```
"replaceTradersProfilePics": [true/false]
```
- This option uses my custom trader profile pictures that I think look better than the original.
> IMPORTANT: Clean the temporary files in the launcher settings for the trader profile pictures to show.

## **Disclaimer:**

I do not claim any of the rights to any of the images or artwork used within this mod.
