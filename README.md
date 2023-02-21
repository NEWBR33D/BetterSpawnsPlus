# **PreyToLive-BetterSpawnsPlus v1.0.7**

Developed by: [NEWBR33D](https://github.com/NEWBR33D) (aka [PreyToLive](https://hub.sp-tarkov.com/user/24548-preytolive/))

[BetterSpawnsPlus](https://hub.sp-tarkov.com/files/file/1002-betterspawnsplus/) is a mod that aims to make all bots in SPTarkov spawn more consistently throughout each raid and prevent raids from becoming ghost towns after ~20 minutes.

- All maps have their own set of customized spawns, all bots have a set percent chance to spawn, and all bots have a random chance to spawn in groups.
- Bots will spawn in set intervals for 45 or 60 minutes depending on the map.
  - 45 minute maps: Factory and The Lab
  - 60 minute maps: Customs, Interchange, Lighthouse, Reserve, Shoreline, Streets of Tarkov, and Woods.
- Pmc bots have been made to mostly spawn in seperate waves from scav bots. So, now you will more likely have a chance to encounter pmcs before they get spawn killed by scavs.
- All bots have been made to spawn more consistently in POIs, however the "randomness" of the spawns will ensure that entire maps still feel "alive" during raids.
- This mod also makes PMCs spawn in labs. :sunglasses:

> NOTE: Besides making bot spawns "better" I have also included some other options that can be enabled within the config file presets that I've made to better suit how I prefer to play the game. (See "BetterSpawnsPlus Options" below for more information.) 

> This is still very much a work-in-progress so if you have any recommendations for the mod or would like to see any other options added to it please let me know and I will see what I can do.

## ***Important!:***

1. *This mod is more than likely NOT compatible with other mods that change bot spawn waves, bot spawn type, and/or bot amount.
However, it should still be compatible with mods that change bot behavior, bot difficulty and/or bot loadouts.*

2. *Furthermore, ***BOSSES MUST BE ENABLED IN-GAME*** or else this mod will not work. You must only enable or disable the bosses in the config file preset.*

3. *This mod already includes my other mod "AllOpenZones" so if you are already using it then you need to either remove it or delete it from your mods folder.*

### **How To Install:**

1. Download the PreyToLive-BetterSpawnPlus-v1.0.7.zip from the github.
2. Unzip the file and place the unzipped file in the user\mods directory within your sptarkov folder.
3. Choose a preset. (See "Presets" below for more information.)
5. That is all. Have fun!

## **Presets:**

You can now create your own presets within the "presets" folder. Create a duplicate of the "defaultPreset.json" and name it to whatever you want. To select which preset is used in-game use the "presetManager.json". Type only the name of the file into the option "presetFileName". Do not inlcude .json in the name.

> NOTE: If you only want the ai spawn changes that my mod offers then please use the "spawnChangesOnlyPreset". This preset is already selected by default in the "presetManager.json" when first downloading the mod.

## **BetterSpawnsPlus Options:**
Below is a listing of information about each option within the mod and what they do. Every option is able to be enabled or disabled.
```
"enabled": [true/false]
```
- This option is used quite frequently to enable or disable sections of the mod.

### **Raids Options:**
```
"allOpenZones": [n/a]
```
- My mod "AllOpenZones" is enabled by default when the mod is enabled and is a requirement for the mod to work correctly. 
- "AllOpenZones" basically makes pmcs and scavs spawn in certain bot "spawn zones" that they previously could not or did not spawn in. More information about the included open zones can be found [here](https://hub.sp-tarkov.com/files/file/936-allopenzones/).
```
"betterSpawns": 
    enabled: [true/false]
```
- This option enables or disables the better spawn waves for bots on each map.
- As mentioned above, I have made the bots conistently spawn over a duration of 45 to 60 minutes based on the map (factory & labs are 45 min, everything else is 60 min).
- Setting the raid timer past 45 or 60 minutes is okay to do, but just know that the bots will stop spawning after 45 or 60 minutes.
```
"bosses": 
    "enabled": [true/false]
    "chance": {
        "bossName": [0->100]
    }
```
- This option enables or disables boss bots. Please use this option to enable or disable bosses instead of the enable/disable checkbox in-game.
- The chance of each boss spawning can be set as well.
- All boss spawns are the same as online.
```
"cultists": {
    "enabled": [true/false],
    "chance": [0->100]
}
"snipers": {
    "enabled": [true/false]
}
```
- These options are similar to the bosses options except for cultists and sniper scavs.
- All cultists and sniper scavs spawns are the same as online, with the exception of sniper scavs having a small chance to spawn twice within a raid.
```
"escapeTimeLimit": [integer]
```
- This option sets the duration of a raid (in minutes).
```
"maxBotCap": [integer]
```
- This option sets the maximum number of bots able to spawn on the map. When a map reaches the maximum number of bots set it will stop spawning more bots until a bot on the map dies.
- It is recommended to not set this number any higher than 30 since it can cause fps to drop significantly.
```
"airDropChance": [%]
```
- This option sets the chance that the airdrop plane will spawn into the raid.
```
"airdropsPerRaid": [integer]
```
- This option sets the amount of airdrop planes that can spawn each raid.
- Additional airdrop planes are not guaranteed to spawn however, even with "airDropChance" set to 100.
```
"globalLootChanceModifier": [integer/decimal]
```
- This option sets the chance for loot to spawn in each loot spawn.
```
"looseLootMultiplier": [integer/decimal]
```
- This option changes the amount of loose loot found in-raid.
```
"staticLootMultiplier": [integer/decimal]
```
- This option changes the amount of loot found in-raid in containers.
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
```
"airdropMinStartTime": [integer]
"airdropMaxStartTime": [integer]
```
- These options set the minimum and maximum time that an airdrop plane will spawn into the map (in minutes).
```
"planeVolume": [0->100]
```
- This option sets the volume of the plane audio in-raid.
```
"randomEncounters":
    "enabled": [true/false]
    "chance": [%]
    "botAmount": ["#,#,#"]
```
- This is an experimental option I thought would make raids more dangerous and/or exciting.
- Inlcudes the option for random cultists, random raiders, and/or random rogues during a raid.
- A number from the sequence of numbers in "botAmount" is chosen at random. This randomly chosen number is the number of bots that will be spawned in.

### **Bots Options:**
```
"chanceSameFactionIsHostile": [%]
```
- This option sets the chance that bear or usec pmc bots will be hostile towards you, depending on the faction of your character.
```
"botLevelRelativeToPlayerLevel": [integer]
```
- This option sets the bot level based on the player level.
- The number you set is a range. For example: If you are level 25 and the number set is 5 then the bot level will range from 20 to 30.
```
"customPmcDogTags": [true/false]
```
- This option enables or disables the use of the "live tarkov" names I created for the pmc dog tags.
```
"makePmcsNotRandomlyTalk": [true/false]
```
- Pmcs now talk again in spt-aki 3.5.0, however I prefer them not talking like in stp-aki 3.4.1 as it gives there position away too often.
- This option fixes this by preventing the pmc bots from talking, except when reloading they occasionally talk. Its not perfect and doesn't make them completely silent but its better than their usual shouting that occurs quite often.

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
"scavTimer": [integer]
```
- This option sets the scav cooldown timer (in minutes).
```
"healthInRaid":
    "energyLoopTime": [integer]
    "energyDecreasePerLoopTime": [integer/decimal]
    "hydrationLoopTime": [integer]
    "hydrationDecreasePerLoopTime": [integer/decimal]
```
- This option changes the amount of energy and hydration lost per minute while in raid.
```
"healthInHideout":
    "healthRegenerationMultiplier": [integer/decimal]
    "energyRegenerationLoopTime": [integer]
    "hydrationRegenerationLoopTime": [integer]
```
- This option changes the energy, hydration, and health regeneration time while in the hideout or menu screen.
```
"removeFreeHealTrialLevelsAndRaids": [true/false]
```
- This option removes the free heals you get after raids and is meant for those of you that want to make the game more difficult at the start of a new profile.
```
"allowTacticalClothingForBothFactions": [true/false]
```
- This option allows all tactical clothing to be available for both bear and usec.
```
"unlockAllTacticalClothingForFree": [true/false]
```
- This option unlocks all tactical clothing for free.

### **Hideout Options:**
```
"constructionTimeMultiplier": [integer/decimal]
```
- This option can either increase or decrease the construction time in the hideout. For example: If the number is set to 0.025 then a construction that takes 24 hours will now only take 36 minutes.
```
"productionTimeMultiplier": [integer/decimal]
```
- This option can either increase or decrease the production time in the hideout.

### **Traders Options:**
```
"repairCostMultiplierForAllTraders": [integer/decimal]
```
- This option can either increase or decrease traders item repair costs. For example: If the number is set to 0.75 then a repair that normally costs 30,000 roubles will now only cost 22,500 roubles.
```
"insuranceMultiplier": [integer/decimal]
```
- This option changes the cost of insurance. For example: If the number is set to 0.50 then insurance that normally costs 15,000 roubles will now only cost 7,500 roubles.
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
"replaceTradersProfilePics": [true/false]
```
- This option uses my custom trader profile pictures that I think look better than the original.
> IMPORTANT: Clean the temporary files in the launcher settings for the trader profile pictures to show.
```
"replaceLauncherBackground": [true/false]
```
- This option uses my preferred launcher background images.
- A random image will be chosen each time you restart the server and launcher.
- All launcher background artwork is created by [Vlad Novikov](https://www.artstation.com/yu2673) and [Eugene Shushliamin](https://www.artstation.com/geck).
> IMPORTANT: Clean the temporary files in the launcher settings for the launcher backgrounds to show.
