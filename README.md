# **PreyToLive-BetterSpawnsPlus v2.0.4**

Developed by: [NEWBR33D](https://github.com/NEWBR33D) (aka [PreyToLive](https://hub.sp-tarkov.com/user/24548-preytolive/))

[BetterSpawnsPlus](https://hub.sp-tarkov.com/files/file/1002-betterspawnsplus/) is a mod that focuses on enhancing and elevating the spawn mechanics of SPTarkov, delivering a more immersive and captivating gameplay experience. With its powerful spawn generator, this mod empowers you with an extensive selection of features and options, allowing you to exert precise control and customization over your raids. Take charge of every aspect of spawns, from the timing and frequency of bot spawns to their quantity, variety, and even their specific spawn zones. BetterSpawnsPlus is your key to creating unique and tailored encounters that truly challenge and engage you in the world of SPTarkov.

#### ***If you would like to support me and my work you can donate to me [here](https://ko-fi.com/preytolive). Thank you!***

#### ***DISCLAIMER:***
BetterSpawnsPlus may not be completely compatible with other mods that alter bot spawn waves, spawn types, and bot quantities. However, it should work seamlessly with mods that modify bot behavior, logic, and difficulty.

#### ***IMPORTANT:***
To ensure proper functionality, please make sure that bosses are enabled in your in-game settings. If you wish to disable bosses, please do so only within the mod's config files.

## **Overview:**
- Consistent Bot Spawns: Bid farewell to desolate maps within minutes of starting a raid. BetterSpawnsPlus ensures that spawns occur consistently throughout the raid, keeping the action alive and intense from start to finish.
- Presets Reflect Live Tarkov: Experience a more authentic and dynamic gameplay environment with customized bot spawns that closely replicate the behavior of the online version of Escape From Tarkov. These presets guarantee all bot types spawn within their specified intervals and waves, depending on the map you're playing.
- Separate PMC and Scav Bot Waves: To enhance the realism and fairness of encounters, PMCs are set to spawn in separate wave intervals from Scavs. By adjusting this spawn mechanic, BetterSpawnsPlus minimizes the occurrence of PMCs and Scavs spawn killing each other. This intentional configuration creates a more challenging and competitive gameplay environment.
- Enhanced POI Spawns: BetterSpawnsPlus improves the consistency of bot spawns in certain points of interest (POIs) while maintaining a level of randomness and ensuring the entire map feels alive and dynamic. Key POIs will have a higher bot presence, making engagements in these areas more strategic and intense.
- PMC Spawns in Labs: Prepare for intense firefights and heightened tension as BetterSpawnsPlus enables PMC spawns in The Labs.
- Spawn Generator: With this feature, you have control over the timing, quantity, variety, frequency, and even the precise locations where bots spawn. Customize your gaming experience by strategically spawning bots in specific open zones, creating dynamic and challenging encounters wherever you choose.
- The Plus: Aside from the improved spawns, BetterSpawnsPlus provides a variety of other options within the config file, allowing you to customize various aspects of the game to align with your preferred playstyle. Among these options you can adjust raid timers to your liking, manage insurance settings, set exfil mechanics, control airdrop occurrences, modify loot distribution, and more.

## **Installation Instructions:**
1. Begin by downloading the "PreyToLive-BetterSpawnPlus-v2.0.4.zip" file from the provided link or the Github repository.
2. Extract the contents of the downloaded archive. You should now have a folder named 'PreyToLive-BetterSpawnsPlus' containing the mod files.
3. Navigate to the location of your SPTarkov folder on your computer.
4. Inside the SPTarkov folder, find the 'user/mods/' directory.
5. Place the extracted folder containing the mod files into the 'mods' folder within your SPTarkov folder.

## **Basic Setup**
> NOTE: This mod comes with pre-configured Like-Live Tarkov spawn presets that are already selected by default when you download the mod. Therefore, you are not required to follow the setup process or create presets unless you wish to do so.

1. Start by locating the config folder and settings manager in the 'PreyToLive-BetterSpawnsPlus/config/' directory.
2. Within the config folder, browse through the available settings folders and decide which one you wish to use in your gameplay. Alternatively, you may make a copy of the "settings_Template" folder and modify it according to your preferences.
3. After choosing the desired settings folder, make a note of its exact name.
4. Open the settings manager and locate the "settingsFolder" option.
5. In the "settingsFolder" option, enter the exact name of the settings folder you want to use.
6. Save the changes made in the settings manager file.
Thats it! Have fun playing!

## **Spawn Features:**
BetterSpawnsPlus offers two distinct spawn systems, which are explained in detail below. Prior to and after each raid, the mod examines the preset configuration file and randomly selects a spawn generator preset or main preset for each map. The mod then applies randomization to the values of each preset.
- Logs: To access all the spawns generated by the mod, navigate to the 'PreyToLives-BetterSpawnsPlus/logs/' directory. There, you'll find logs detailing the spawn information for each map. These logs can be reviewed before a raid to understand the locations and timings of bot spawns. Please note that these logs are overwritten with new spawn data that gets generated after each raid.

### **The Weight System:**
The weight system in BetterSpawnsPlus is an important aspect of customizing the mod to suit your preferences. The weight system uses integer values between 0 and 5. This range allows you to assign different probabilities to each preset or option. Setting the weight of a preset or option to 0 will effectively disable it. It will not be chosen during the raid, and its effects will not be applied. On the other hand, setting the weight to an integer value from 1 and 5 will give the preset or option a higher chance of being applied, with 5 being the highest chance.

### **Spawn Generator Presets:**
Spawn generator presets offer a user-friendly and efficient way to generate spawn waves with various customizable options. Here is a simplified overview of the available configurations:
- Bot Types: Specify the types of bots to include in the spawn waves, such as PMCs, Scavs, Sniper Scavs, Bosses, Cultists, Raiders, Rogues, and Bloodhounds.
- Difficulty: Choose the difficulty level for the bots, ranging from easy, normal, hard, to impossible. These difficulty levels align with those found in online EFT.
- Chance: Define the minimum and maximum chance of a bot wave spawning during a raid.
- Amount: Set the quantity of bots to spawn in each wave using an array of numbers. The mod will randomly select a value from this array for each wave.
- Initial Spawns: Determine the initial number of spawn waves and the time at which they will occur at the beginning of a raid.
- Interval Spawns: Specify the total number of interval spawn waves and the time interval between each wave.
- Delay: Apply a spawn delay that randomizes the timing for each generated wave, introducing variation and unpredictability.
- Open Zones: Configure the specific spawn zones where the different bot types are allowed to spawn.

### **How To Create Spawn Generator Presets:**
  1. To access the spawn generator presets for each location in SPTarkov, navigate to the "BetterSpawnsPlus/db/locations/"map-name"/spawnGenerator" directory.
  2. Inside this directory, you will find a presets folder and a template file.
  3. To create your own spawn waves, copy and paste the template file into the presets folder.
  4. Modify the copied template file according to your preferences, adjusting parameters such as timing, quantity, variety, and other settings for the bot spawns.
  5. Save the modified file with a unique name to distinguish it as your custom preset.
  6. To enable your custom spawn wave in the game, you need to add its file name and weight to the config file.
  7. In the config file, specify the file name of your custom preset and assign a weight value between 0 and 5, with higher weights increasing the chance of the preset being selected during a raid. This allows the mod to recognize and include your custom spawn wave in-game. By adjusting the weight, you can control the likelihood of your custom spawn wave being selected during a raid.
  8. The code below demonstrates how it should look in the config preset. Check to make sure that the folder name of where your spawn generator preset is matches the location name within the config preset.
```
"spawnGenerator": {
    "enabled": [true/false],
    "presets": {
        "TYPE_YOUR_SG_PRESET_FILE_NAME_HERE": [0->5]
    }
}
```
### **Detailed Overview Of Spawn Generator Presets:**
```
"enableMainPresets": [true/false],
```
Enable Main Presets: This option sets whether or not the spawn generator preset is an addon for the main preset. If set to true then the all the spawns from the chosen spawn generator preset will be added to the spawns of the chosen main preset. If set to false then the mod will not combine both presets and will randomly choose either just the spawns from the main preset or just the spawns from the spawn generator preset after every raid.
```
"botType": {
    "bear": [0->5],
    "usec": [0->5]
}
```
Bot Type: This option is only available for PMCs and Bosses. It uses the weight system to determine what PMC or Boss bot type gets generated. For example, setting "bear" to 2 and "usec" to 5 will result in 2 out of every 7 PMC waves spawning as Bear PMCs and the remaining 5 PMC waves will spawn as Usec PMCs.
```
"botDifficulty": {
    "easy": [0->5],
    "normal": [0->5],
    "hard": [0->5],
    "impossible": [0->5]
}
```
Bot Difficulty: This option uses the weight system to determine what difficulty each bot wave gets generated with. For example, setting "normal" to 3 and "hard" to 1 means that 3 out of every 4 spawns will spawn with the normal difficulty and the remaining spawn wave will spawn with the hard difficulty.
```
"botChance": {
    "min": [0->100%],
    "max": [0->100%]
}
```
Bot Chance: This option generates a random spawn chance for each spawn wave. For example, setting the "min" to 60 and the "max" to 100 will result in a random number between these two numbers for each spawn wave.
```
"botAmountPerSpawnWave": [0,1,2,3,4],
```
Bot Amount Per Spawn Wave: This option uses a number sequence to determine the amount of bots that spawn in each spawn wave. The mod will randomly pick a number from the number sequence. Having more of the same number in the array will yield a higher probability of that number being chosen. For example, a number sequence set to [1,1,1,1,2,2] will have a 2 out of 6 chance to spawn two bots in the spawn wave or a 4 out of 6 chance to spawn one bot in the spawn wave.
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
Initial Spawn Waves: The "initial" waves option determines how many waves will be generated at the set time ("time" is in seconds). For example, setting "initial" waves to 10 with a time of 20 will spawn 10 waves of bots 20 seconds into a raid.

Interval Spawn Waves: The "interval" waves option determines the number of additional waves that will be introduced at regular time intervals after the initial waves. The "waves" option represents the overall pool of possible waves. The "wavesPerInterval" parameter specifies the number of waves that are spawned during each interval. Once all waves from the total pool have been depleted, the bots will no longer spawn in the raid. For example, setting "interval" waves to 30, "wavesPerInterval" to 3, and the time to 120 will generate 3 waves every 120 seconds for a total of 10 times. That means the waves will stop spawning after 20 minutes since 2 minutes * 10 = 20 minutes. Increasing the number of "interval" waves will increase the time that bots continue to spawn.

Spawn Delay: The "spawnDelay" option randomizes each spawn wave so that they do not all occur at the exact same time thorughout a raid. For example, setting the "min" spawn delay to -30 and the "max" spawn delay to 60 will generate a random number between the two and add it to the "initial" and "interval" time.
```
"triggers": {
    "autoId_00632_EXFIL": [0->5],
    "autoId_00000_D2_LEVER": [0->5],
    "raider_simple_patroling": [0->5]
}
```
Triggers: This option uses the weight system to determine the triggers that will be applied to bot spawn waves. This option is only available for Raiders on The Lab and Reserve.
```
"onlyVanillaOpenZones": [true/false],
"openZones": {
  "BotZone": [0->5],
}
```
Open Zones: This option uses the weight system to determine which spawn zones the bot waves will spawn in.

Only Vanilla Open Zones: The "onlyVanillaOpenZones" option is primarily only available to Bosses but some of the other bots on certain locations also have this option. Setting this option to true forces the vanilla (vanilla = same as online EFT) open zones, as well as, the vanilla triggers to only be applied. For example, if "onlyVanillaOpenZones" is set to "true" for Bosses on Customs then Knight will only spawn at "ZoneScavbase" and Reshala will only spawn at "ZoneDormitory" or "ZoneGasStation", just like they would in online EFT.

> IMPORTANT: Please note that it is essential not to make any edits or deletions to the init file located in the "PreyToLive-BetterSpawnPlus/db/locations" folder.

### **Main Presets:**
Creating main presets can be a more intricate and time-consuming process compared to spawn generator presets. Main presets require manual configuration, allowing for precise fine-tuning. They offer additional randomizer settings that enable slight variations in spawns for each raid, maintaining an element of randomness while still adhering to the preset parameters.

### **How To Create Main Presets:**
1. To access the main presets for each location in SPTarkov, navigate to the "BetterSpawnsPlus/db/locations/"map-name"/main" directory.
2. Inside this directory, you will find a presets folder and a template file.
3. To create your own spawn waves, copy and paste the template file into the presets folder.
4. Modify the copied template file according to your preferences, adjusting parameters such as timing, quantity, variety, and other settings for the bot spawns.
5. Save the modified file with a unique name to distinguish it as your custom preset.
6. To enable your custom spawn wave in the game, you need to add its file name and weight to the config file.
7. In the config file, specify the file name of your custom preset and assign a weight value between 0 and 5, with higher weights increasing the chance of the preset being selected during a raid. This allows the mod to recognize and include your custom spawn wave in-game. By adjusting the weight, you can control the likelihood of your custom spawn wave being selected during a raid.
8. The code below demonstrates how it should look in the config preset. Check to make sure that the folder name of where your main preset is matches the location name within the config preset.
```
"main": {
    "enabled": [true/false],
    "enableBosses": [true/false],
    "presets": {
        "TYPE_YOUR_MAIN_PRESET_FILE_NAME_HERE": [0->5]
    }
}
```
### **Detailed Overview Of Main Presets:**
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
#### ***Optional Randomizer Settings***

Randomize Difficulty: The "difficulty" option employs a weight system to determine the difficulty level of each bot in the main preset. For instance, if you set "normal" to 3 and "hard" to 1, it means that out of every four spawns, three will have normal difficulty, while one will be of hard difficulty.

Randomize Time: The "spawnDelay" feature introduces randomness to each spawn wave, ensuring that they differ in timing during each raid. For example, by setting the "min" spawn delay to -30 and the "max" spawn delay to 60, a random number within that range will be generated and added to the spawn timing for each type of spawn.
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
The code provided above serves as an example for creating a single spawn wave. It is important to ensure that all bot types listed in the preset are included in their respective bot type arrays. Here's an explanation of each option:
- "BossName": Specify the type of bot you want to spawn in the wave.
- "BossChance": Set the probability of the bot spawning.
- "BossZone": Define the open zone(s) where the wave will spawn. Multiple zones can be specified by separating them with commas (e.g., "zone1,zone2,zone3").
- "BossPlayer": This option has no effect and should be left set to false.
- "BossDifficult": Determine the difficulty level of the bots. Options include "easy", "normal", "hard", and "impossible".
- "BossEscortType": Specify the type of bot that will spawn alongside the bot defined in "BossName". Multiple bot types can be included together.
- "BossEscortDifficult": Set the difficulty level for the "BossEscortType" bots.Options include "easy", "normal", "hard", and "impossible".
- "BossEscortAmount": Determine the number of "BossEscortType" bots that will spawn. A sequence of numbers is used to randomly select the quantity.
- "Time": Set the time (in seconds) at which the bots will spawn during a raid.
- "Supports": This option is similar to "BossEscortType" but more complex. It is recommended to refer to one of the main presets included with BetterSpawnsPlus for a practical example.
- "TriggerId": A unique identifier used to trigger the spawning of Raiders in The Labs and Reserve maps.
- "TriggerName": The name of the trigger that spawns Raiders in The Labs and Reserve maps.
- "Delay": This option is primarily intended for Raiders in The Labs and Reserve. It determines the delay in seconds after a trigger before the wave spawns. It is not the same as the "Randomize Time" delay option mentioned earlier.
- "RandomTimeSpawn": This option has no effect and should be left set to false.

Here is a listing of all the available bot types for "BossName and "BossEscortType":
- PMCs: "pmcBEAR" and "pmcUSEC"
- Scavs: "assault", "cursedAssault", and "crazyAssaultEvent"
- Sniper Scavs: "marksman"
- Bosses: "bossBoar", "bossBoarSniper", "bossBully", "bossGluhar", "bossKilla", "bossKnight", "bossKojaniy", "bossSanitar", "bossTagilla", and "bossZryachiy"
- Boss Followers: "followerBoar", "followerBully", "followerGluharAssault", "followerGluharScout", "followerGluharSecurity", "followerGluharSnipe", "followerKojaniy", "followerSanitar", "followerTagilla", "followerBirdEye", "followerBigPipe", and "followerZryachiy"
- Cultists: "sectantPriest" and "sectantWarrior"
- Raiders: "pmcBot"
- Rogues: "exUsec"
- Bloodhounds: "arenaFighterEvent"

For the available "BossZone" open zones specific to each location, please refer to the BetterSpawnsPlus/info/OpenZoneGuide.txt file. It provides the necessary information regarding the open zones associated with each location.

> IMPORTANT: Please note that it is essential not to make any edits or deletions to the init file located in the "PreyToLive-BetterSpawnPlus/db/locations" folder.

## **Plus Features:**
BetterSpawnsPlus provides a range of additional options to enhance your experience in SPTarkov. Here's a brief overview of these options:
- Raid Options: Maximum Bot Cap, Raid Timer, Airdrop Start Time, Plane Speed, Plane Height, Plane Volume, Crate Fall Speed, Crate Items
- Bot Options: Custom Live-Like PMC Dogtags, Make PMCs Not Randomly Talk, Chance Same Faction Is Hostile, Bot Level Relative To Player Level, PMC Brain Type
- Exfil Options: Open All Exfils Regardless Of Entry Point, All Extractions Always Available, Remove Extraction Restrictions
- Loot Options: Global Loot Chance Modifier, Loose Loot Modifier, Static Loose Multiplier
- Item Options: Remove Armor Degradation From Repairs, Remove Weapon Degradation From Repairs, Insurance Allowed On All Locations, Insurance Allowed For All Items, Remove Weapon Durability Burn, Remove Weapon Detiorioration From Bullets, Allow All Items To Be Lootable, All Items Unexamined By Default, Remove Labs Keycard Requirement, Labs Access Keycard Max Number Of Uses
- Player Options: Scav Cooldown Timer, Health In-Raid, Health In-Hideout, Tactical Clothing
- Hideout Options: Construction Time Multiplier, Production Time Mulitplier
- Trader Options: Repair Cost Multiplier For All Traders, Insurance Mulitiplier, Insurance Return Chance, Insurance Return Time, Repair Quality Degradation

> NOTE: Please note that any feature or option that is disabled within the mod means that it will have no effect in the game. Disabling a feature effectively renders it inactive within the mod.

### **Detailed Overview Of Plus Features:**
```
--- Raid Options ---

"maxBotCap": {
    "enabled": [true/false],
    "customs": {
        "min": [integer],
        "max": [integer]
    }
}
```
Maximum Bot Cap: This option sets the maximum number of bots able to spawn on the map. When a location reaches the maximum number of bots set it will stop spawning more bots until a bot on the location dies. This mod chooses a random number between the "min" and "max" before each raid. It is recommended to not set the max number of bots any higher than 30 since it can cause FPS to drop significantly.
```
"raidTimer": {
    "enabled": [true/false],
    "customs": {
        "min": [integer],
        "max": [integer]
    }
}
```
Raid Timer: This option sets the duration of a raid (in minutes). The mod chooses a random number between the "min" and "max" before each raid. The airdrop time and armored train times are adjusted dynamically to fit the selected time.
```
"airdrops": {
    "enabled": [true/false],
    "startTime": {
        "min": [integer],
        "max": [integer]
    }
}
```
Airdrop Start Time: This option sets the "min" and "max" time that the airdrop plane will spawn into the raid.
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
Airdrop Plane: These options set the speed, height, and volume of the airdrop plane as well as the crate fall speed and item count. The min and max values of each have been limited to ensure the plane and crate don't break in-game. If an option is outside of the threshold the mod will revert them back to the threshold.

Dynamic: If the dynamic option is set to true then the speed of the plane and volume level will be adjusted based on the height of the plane. Additionally, the crate fall speed will be adjusted based on the item count in the crate. For example, a higher plane height will yield a lower volume and lower speed. A higher item count will yield a faster fall speed for the crate.
```
"chance": {
    "customs": [0->100%],
    "groundzero": [0->100%],
    "interchange": [0->100%],
    "lighthouse": [0->100%],
    "reserve": [0->100%],
    "shoreline": [0->100%],
    "streets": [0->100%],
    "woods": [0->100%]
}
```
Airdrop Chance: This option sets the chance that the airdrop plane will spawn into the raid for each map.

#### ***Bot Options***
```
"customPmcDogTags": [true/false]
```
Custom Live-Like PMC Dogtags: This option enables the use of the custom Live-Like usernames created for PMC dogtags.
```
"makePmcsNotRandomlyTalk": [true/false]
```
Make PMCS Not Randomly Talk: PMCs talk again in SPT 3.5.0+ giving away there position too often. This option mostly fixes this by preventing the PMC bots from talking, except when reloading they still occasionally talk. Its not perfect and doesn't make them completely silent but its better than nothing.
```
"chanceSameFactionIsHostile": [0->100%]
```
Chance Same Faction Is Hostile: This option sets the chance that Bear or Usec PMCs will be hostile towards you, depending on the faction of your character.
```
"botLevelRelativeToPlayerLevel": [integer]
```
Bot Level Relative To Player Level: This option sets the bot level based on your PMC player level. The number you set is a range from your level. For example, if you are level 25 and the number set is 5 then the bot level will only range from 20 to 30.
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
PMC Brain Type: This option chooses the brain type for bot PMCs in-raid. You can also use the "randomize" option to randomize all of the brain types before each raid.

#### ***Exfil Options***
```
"openAllExfilsRegardlessOfEntryPoint": [true/false]
```
Open All Exfils Regardless Of Entry Point: This option opens all exfil locations regardless of player spawn, map side, or faction. However, this does not make exfils that have a requirement to escape free.
```
"allExtractionsAlwaysAvailable": [true/false]
```
All Extractions Always Available: This option makes all exfil locations always available to extract at in every raid. However, this option is side-based. So Scav players will not be able to extract at PMC exfils and vice-versa.
```
"removeExtractionRestrictions": [true/false]
```
Remove Extraction Restrictions: This option removes extraction restrictions such as co-op requirements, money requirements, etc.

#### ***Loot Options***
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
Global Loot Chance Modifier: This option sets the chance for loot to spawn in each loot spawn across each map.
Loose Loot Multiplier: This option changes the amount of loose loot found in-raid.
Static Loot Multiplier: This option changes the amount of loot found in containers in-raid.

#### ***Item Options***
```
"removeArmorDegradationFromRepairs": [true/false]
```
Remove Armor Degradation From Repairs: This option prevents permanent armor degradation from repairs.
```
"removeWeaponDegradationFromRepairs": [true/false]
```
Remove Weapon Degradation From Repairs: This option prevents permanent weapon degradation from repairs.
```
"insuranceAllowedOnAllLocations": [true/false]
```
Insurance Allowed On All Locations: This option allows insurance on all locations, primarily for The Labs.
```
"insuranceAllowedForAllItems": [true/false]
```
Insurance Allowed For All items: This option allows all items to be insurable, primarily for ammunition and grenades.
```
"removeWeaponDurabilityBurn": [true/false]
```
Remove Weapon Durability Burn: This option removes durability burn from general use of weapons.
```
"removeWeaponDeteriorationFromBullets": [true/false]
```
Remove Weapon Detiorioration From Bullets: This options removes bullet deterioration for all weapons, so you won't need to repair them.
```
"allowAllItemsToBelootable": [true/false]
```
Allow All Items To Be Lootable: This option allows all items to be lootable off of bots, primarily armbands and scabbards.
```
"allItemsUnexaminedByDefault": [true/false]
```
All Items Unexamined By Default: This option makes all items unexamined by default and is solely meant for new profiles where some of the items can already be examined by default.
```
"labsAccessKeycard":
    "removeLabsReq": [true/false]
    "maxNumberOfUses": [integer]
```
Remove Labs Keycard Requirement: This option completely disable the labs keycard requirement.
Labs Keycard Max Number Of Uses: This option sets the maximum number of uses allowed for each labs keycard you find in-raid.

#### ***Player Options***
```
"scavCooldownTimer": [integer]
```
Scav Cooldown Timer: This option sets the scav cooldown timer (in minutes).
```
"healthInRaid": {
    "enabled": [true/false],
    "energyLoopTime": [integer]
    "energyDecreasePerLoopTime": [integer/decimal]
    "hydrationLoopTime": [integer]
    "hydrationDecreasePerLoopTime": [integer/decimal]
}
```
Health In-Raid: This option changes the amount of energy and hydration lost per minute while in raid.
```
"healthInHideout": {
    "enabled": [true/false],
    "healthRegenerationMultiplier": [integer/decimal]
    "energyRegenerationLoopTime": [integer]
    "hydrationRegenerationLoopTime": [integer],
    "removeFreeHealTrialLevelsAndRaids": [true/false]
}
```
Health In-Hideout: This option changes the energy, hydration, and health regeneration time while in the hideout or menu screen. The option "removeFreeHealTrialLevelsAndRaids" removes the free heals you get after raids and is meant for those of you that want to make the game more difficult at the start of a new profile.
```
"tacticalClothing": {
    "allowAllTacticalClothingForBothFactions": true,
    "unlockAllTacticalClothingForFree": false
}
```
Allow All Tactical Clothing For Both Factions: This option allows all tactical clothing to be available for both Bear and Usec PMC players.

Unlock All Tactical Clothing For Free: This option unlocks all tactical clothing to be free of purchase.

#### ***Hideout Options***
```
"constructionTimeMultiplier": [integer/decimal]
```
Construction Time Multiplier: This option can increase or decrease the construction time in the hideout. For example, if the number is set to 0.025 then a construction that normally takes 24 hours will instead take 36 minutes to complete.
```
"productionTimeMultiplier": [integer/decimal]
```
Production Time Multiplier: This option can increase or decrease the production time in the hideout.

#### ***Trader Options***
```
"repairCostMultiplierForAllTraders": [integer/decimal]
```
Repair Cost Multiplier For All Traders: This option can increase or decrease traders item repair costs. For example, if the number is set to 0.75 then a repair that normally costs 30,000 roubles will now only cost 22,500 roubles.
```
"insuranceMultiplier": [integer/decimal]
```
Insurance Multiplier: This option changes the cost of insurance. For example, if the number is set to 0.50 then insurance that normally costs 15,000 roubles will now only cost 7,500 roubles.
```
"returnChancePercent": [%]
```
Insurance Return Chance: This option sets the chance that a trader returns your insured items.
```
"minReturnTime": [integer]
"maxReturnTime": [integer]
```
Insurance Return Time: These options set the minimum and maximum return time of insured items (in hours).
```
"repairQualityDegradation": [integer/decimal]
```
Repair Quality Degradation: This option sets the amount of degradation applied to gear and weapons that are repaired. Setting this option to zero will prevent any gear and weapon degradation during repairs.
