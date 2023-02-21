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
- sets the volume of the plane audio
```
"randomEncounters":
    "enabled": [true/false]
    "chance": [%]
    "botAmount": ["#,#,#"]
```
- an experimental option i thought would make raids more dangerous/exciting
- provides the option for random cultist, random raider, and random rogue encounters during a raid
- a number from the sequence of numbers in "amount" is chosen at random. this randomly chosen number is the number of raiders that will be spawned in

### **Bots Options:**
```
"chanceSameFactionIsHostile": [%]
```
- percent chance that bear/usec will be hostile to you
```
"botLevelRelativeToPlayerLevel": [integer]
```
- sets the ai level based on the player level
- the number you set is a range, for example if you are lvl 25 and the number set is 5 then the ai level will range from 20 to 30
```
"customPmcDogTags": [true/false]
```
- this option enables the use of the "live tarkov" names I created for the pmc dogtags
```
"makePmcsNotRandomlyTalk": [true/false]
```
- pmcs now talk again in 3.5.0, however i prefered them not talking like in 3.4.1 as it gives there position away
- this doesn't make them completely silent but its better than their usual shouting that occurs quite often
- i'll be looking into making them completely silent, but for now this is all i can do

### **Items Options:**
```
"removeArmorDegradationFromRepairs": [true/false]
```
- this option prevents permanent armor degradation from repairs
```
"removeWeaponDegradationFromRepairs": [true/false]
```
- this option prevents permanent weapon degradation from repairs
```
"insuranceAllowedOnAllLocations": [true/false]
```
- this option allows insurance all locations
- primarily for labs
```
"insuranceAllowedForAllItems": [true/false]
```
- this option allows all items to be insurable
```
"removeWeaponDurabilityBurn": [true/false]
```
- this options removes durability burn for weapons
```
"removeWeaponDeteriorationFromBullets": [true/false]
```
- this options removes bullet deterioration for weapons
```
"allowAllItemsToBelootable": [true/false]
```
- this option allows all items to be lootable off of dead ai bodies
- primarily allows you to loot armbands and scabbards
```
"allItemsUnexaminedByDefault": [true/false]
```
- this option makes all items unexamined by default
- meant for new games where some of the items are examined by default
```
"labsAccessKeycard":
    "removeLabsReq": [true/false]
    "maxNumberOfUses": [integer]
```
- this option allows you to either completely disable the labs keycard requirement
- or instead you can set the number of uses allowed for the labs keycard

### **Player Options:**
```
"scavTimer": [integer]
```
- sets the scav cooldown timer (in minutes)
```
"healthInRaid":
    "energyLoopTime": [integer]
    "energyDecreasePerLoopTime": [integer/decimal]
    "hydrationLoopTime": [integer]
    "hydrationDecreasePerLoopTime": [integer/decimal]
```
- this option changes the energy and hydration lost per minute while in raid
```
"healthInHideout":
    "healthRegenerationMultiplier": [integer/decimal]
    "energyRegenerationLoopTime": [integer]
    "hydrationRegenerationLoopTime": [integer]
```
- this option changes the energy, hydration, and health regeneration time while in hideout
```
"removeFreeHealTrialLevelsAndRaids": [true/false]
```
- this option removes the free heals you get after raids
- for those of you that want to make the game more difficult
```
"allowTacticalClothingForBothFactions": [true/false]
```
- this option allows all tactical clothing to be avilable for both bear and usec
```
"unlockAllTacticalClothingForFree": [true/false]
```
- this option unlocks all tactical clothing for free

### **Hideout Options:**
```
"constructionTimeMultiplier": [integer/decimal]
```
- this option either increases or decreases the construction time in hideout
- for example if the number is set to 0.025 then a construction that takes 24 hours will now take 36 minutes
```
"productionTimeMultiplier": [integer/decimal]
```
- this option either increases or decreases the production time in hideout

###**Traders Options:**
```
"repairCostMultiplierForAllTraders": [integer/decimal]
```
- this option either increases or decreases traders item repair cost
- for example if the number is set to 0.75 then a reapir that costs 30,000 will now cost 22,500
```
"insuranceMultiplier": [integer/decimal]
```
- this option changes the cost of insurance
```
"returnChancePercent": [%]
```
- percent chance that a trader returns your insured items
```
"minReturnTime": [integer]
"maxReturnTime": [integer]
```
- these set the min/max return time of insured items
- must be a whole number, no decimals (in hours)
```
"repairQualityDegradation": [integer/decimal]
```
- this option sets the amount of degradation applied to gear/weapons during repairs
- setting this to zero will remove any degradation during repairs

### **Misc Options:**
```
"replaceTradersProfilePics": [true/false]
```
- this option uses my custom trader profile pics that i think look better than the original
> IMPORTANT: clean the temp files in the launcher settings for the trader profile pictures to show
```
"replaceLauncherBackground": [true/false]
```
- this option uses my preffered launcher background images
- a random image will be chosen each time you restart the server and launcher
- launcher background artwork created by [Vlad Novikov](https://www.artstation.com/yu2673) and [Eugene Shushliamin](https://www.artstation.com/geck)
> IMPORTANT: clean the temp files in the launcher settings for the launcher backgrounds to show
