updated: November 13, 2026
build: 1.60.1.70938
sources: Blizzard — Class Deep Dives: Rogue and Warlock|https://worldofwarcraft.blizzard.com/en-us/news/24310968 ;; Blizzard — Development Notes, updated November 2|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Blizzard — WoW: Forever Hotfixes, November 5 to 12|https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-11-2026/2403040 ;; foreverchanges.pro — Warlock spells by level, build 1.60.1.70938|https://foreverchanges.pro/spellbook/warlock/levels ;; Raidbots — Forever talent data|https://www.raidbots.com/static/data/forever/talents.json ;; WoWSims Forever — source and Warlock presets|https://github.com/wowsims/forever ;; Wowhead — Destruction Warlock Leveling, November 6|https://www.wowhead.com/forever/guide/classes/warlock/destruction/dps-leveling-tips ;; Wowhead — Destruction Warlock Talent Builds, November 4|https://www.wowhead.com/forever/guide/classes/warlock/destruction/talent-builds-pve-dps ;; Wowhead — Destruction Warlock Rotation, November 3|https://www.wowhead.com/forever/guide/classes/warlock/destruction/rotation-cooldowns-pve-dps ;; Wowhead — Destruction Warlock Stat Priority, November 3|https://www.wowhead.com/forever/guide/classes/warlock/destruction/stat-priority-pve-dps ;; Icy Veins — Destruction Warlock Leveling, November 4|https://www.icy-veins.com/wow-forever/destruction-warlock-leveling ;; Icy Veins — Destruction Warlock Guide, November 9|https://www.icy-veins.com/wow-forever/destruction-warlock-ranged-dps-pve-guide ;; Icy Veins — Destruction Warlock Talents, November 4|https://www.icy-veins.com/wow-forever/destruction-warlock-ranged-dps-pve-spec-builds-talents ;; Icy Veins — Destruction Warlock Stat Priority, November 4|https://www.icy-veins.com/wow-forever/destruction-warlock-ranged-dps-pve-stat-priority ;; ClassicWoW.gg — Destro Warlock|https://classicwow.gg/forever/guides/warlock/destruction

Direct damage and burst: two instants on short cooldowns, and from 40 a new Fire filler.
:::scope
A guide to the live game, 1 to 60, on client 1.60.1.70938 with hotfixes through November 12. The talent order is Icy Veins' published one; Wowhead's two builds are described from its own text. Levels assume no Legacy `Talented`. Wowhead's Destruction rotation and stat pages predate launch (November 3) and its stat page calls its own order a best estimate. No raid opens until December 9, so the level-60 section rests on guides and on WoWSims' model, not on logs.
:::
## What Destruction is for
**Burst whose timing you control.** [[Shadowburn]] at 20 is an instant on a 15-second cooldown that costs a Soul Shard and hands it back if the target dies within 8 seconds. [[Conflagrate]] at 25 is an instant on a 10-second cooldown that turns your [[Immolate]] into one hit.
**From 40 it has its own filler.** [[Incinerate]] is a Fire spell with a 2.5-second cast that deals 25% more to a target carrying your [[Immolate]]. `Shadow and Flame` at 35 to 39 stops [[Conflagrate]] consuming [[Immolate]] and makes [[Shadowburn]] refund its shard, so both are cast on cooldown.
**Solo, its talents add burst and not sustain.** Wowhead's levelling page says that plainly and offers two builds: one for questing that borrows Affliction's sustain, and one deep in Destruction for players who level in dungeons, where a tank holds the enemies and mana matters less.
Icy Veins' ratings out of 5, from its three spec pages (November 9). A levelling score measures solo kill speed and nothing else.
| Spec | Overall | Levelling | Dungeon | Utility | Mobility |
| --- | --- | --- | --- | --- | --- |
| Affliction | 3.5 | 5.0 | 3.5 | 4.5 | 2.0 |
| Demonology | 4.0 | 5.0 | 4.0 | 4.5 | 2.0 |
| **Destruction** | 3.5 | 3.5 | 4.0 | 4.5 | 2.0 |
The tree's answer to spell pushback is `Intensity`: 3 points for a 70% chance that damage does not delay any Destruction cast.
## Your talent points
Wowhead publishes two levelling builds and Icy Veins one. Icy Veins prints its order point by point. Wowhead shows each build as an interactive calculator and describes it in words. All three take `Bane` and `Aftermath` early and reach [[Shadowburn]] at 20 and [[Conflagrate]] at 25.
**Wowhead's Solo Build (November 6).** The build itself is a calculator on [Wowhead's levelling page](https://www.wowhead.com/forever/guide/classes/warlock/destruction/dps-leveling-tips); the page prints no point-by-point order. Its text: *"Your first 16 points go into Destruction, for Shadowburn at 20 and Conflagrate at 25."* After that, `Unholy Power` makes the demon hit harder and the Affliction talents strengthen [[Drain Life]] and [[Life Tap]]. Core talents, *"in about this order"*: `Bane` 5/5, `Cataclysm` 3/3, `Aftermath` 5/5, [[Shadowburn]], `Molten Skin` 2/5, [[Conflagrate]], `Unholy Power` 5/5, `Demonic Energies` 1/2, `Improved Life Tap` 2/2, `Suppression` 5/5, `Improved Drains` 3/3, `Agonizing Flames` 3/3, `Amplify Curse` 1/1, `Improved Bane of Agony` 2/2, `Pandemic` 3/3, `Malevolence` 4/5, `Fire and Brimstone` 3/3, `Soul Siphon` 2/3.
**Wowhead's Dungeon Build (November 6).** Also a calculator on the same page. Its text: *"Every point goes into Destruction until Incinerate at 40"*, with [[Shadow Bolt]] as the filler until then and the Imp kept out. Core talents, *"in about this order"*: `Bane` 5/5, `Cataclysm` 3/3, `Aftermath` 5/5, [[Shadowburn]], `Ruin` 3/5, [[Conflagrate]], `Agonizing Flames` 3/3, [[Bane of Havoc]], `Fire and Brimstone` 3/3, `Shadow and Flame` 5/5, [[Incinerate]], `Suppression` 5/5, `Improved Imp` 3/3, `Improved Life Tap` 2/2, `Improved Corruption` 5/5, `Amplify Curse` 1/1, `Pandemic` 3/3, `Malevolence` 1/5.
**Level 60, Icy Veins' order (November 4): 6/11/34.** `Bane` 5 (levels 10 to 14) → `Aftermath` 5 (15 to 19) → [[Shadowburn]] 1 (20) → `Destructive Reach` 2 (21, 22) → `Ruin` 2 (23, 24) → [[Conflagrate]] 1 (25) → `Intensity` 3 (26 to 28) → `Agonizing Flames` 1 (29) → `Fire and Brimstone` 3 (30 to 32) → [[Bane of Havoc]] 1 (33) → `Agonizing Flames` to 2/3 (34) → `Shadow and Flame` 5 (35 to 39) → [[Incinerate]] 1 (40) → `Agonizing Flames` to 3/3 (41) → `Suppression` 4 (42 to 45) → `Demonic Embrace` 5 (46 to 50) → `Demonic Aegis` 2 (51, 52) → `Fel Vitality` 3 (53 to 55) → [[Demonic Sacrifice]] 1 (56) → `Improved Life Tap` 2 (57, 58) → `Ruin` to 4/5 (59, 60).
**Where they differ.** Wowhead's Solo Build never takes [[Incinerate]], which its page marks *"Dungeon Build only"*: after [[Conflagrate]] it turns to `Unholy Power` and Affliction's drain talents, and plays like Affliction with two burst buttons. Its Dungeon Build and Icy Veins' order both reach [[Incinerate]] at 40, and Icy Veins finishes `Shadow and Flame` at 39. Icy Veins spends three points on `Intensity` against pushback where Wowhead spends them on `Cataclysm` for mana.
**[[Incinerate]] needs [[Bane of Havoc]] and 30 points in the tree, and `Shadow and Flame` needs 25.** `Fire and Brimstone` needs [[Conflagrate]].
## Rotation
**Levelling solo** (Wowhead, November 6, for its Solo Build). Use the Voidwalker until 20, then the Succubus or Incubus.
1. **Send the demon in**
2. **[[Curse of the Elements]] first, from 40**
3. **[[Immolate]]** on every enemy, but not as the opener. Its first hit can pull the enemy off your demon
4. **[[Bane of Agony]]** if the enemy will live long enough for it to ramp up
5. **[[Corruption]]** only on enemies that live long. Its cast is slow without `Improved Corruption`
6. **Fill.** Your wand or [[Drain Life]] before 30, [[Drain Life]] from 30. With mana to spare, [[Shadow Bolt]] kills faster
7. **[[Conflagrate]]** after the second-to-last tick of [[Immolate]], or sooner if it kills
8. **[[Shadowburn]]** if it kills the enemy. Otherwise finish with the wand
9. **[[Life Tap]]** in place of the drain when you are low on mana and high on health
[[Conflagrate]] and [[Shadow Bolt]] often break [[Fear]], so when you fight two enemies keep them for the one your demon holds.
**Levelling in dungeons** (Wowhead's Dungeon Build). Summon the Imp: `Blood Pact` gives the group Stamina. On a boss or a long-lived enemy:
1. **[[Bane of Agony]]**. On a pack, [[Bane of Havoc]] on a second enemy that will live long
2. **[[Curse of the Elements]]** from 40, if no other Warlock has it up
3. **[[Immolate]]**
4. **[[Corruption]]**
5. **[[Conflagrate]]** after the second-to-last tick of [[Immolate]]. With `Shadow and Flame` 5/5, whenever it is ready
6. **[[Shadowburn]]** whenever it is ready, if you have shards to spare. With `Shadow and Flame` 5/5 it refunds the shard
7. **Fill** with [[Shadow Bolt]] until 40, then [[Incinerate]]
On trash that dies fast Wowhead casts only [[Immolate]], [[Conflagrate]] and the filler. On packs both sites say to let the tank build threat, then channel [[Hellfire]], or [[Rain of Fire]] from range.
**Why this order.** Figures are the client's base numbers, before gear and talents.
- **[[Conflagrate]] eats [[Immolate]] until `Shadow and Flame` is 5/5.** Each point is a 20% chance that it does not. At 25 a rank 1 [[Conflagrate]] hits for 88 to 111, and a rank 4 [[Immolate]] at 30 ticks for 95 in all, so firing it early throws away as much as it deals. That is the reason for Wowhead's second-to-last-tick rule.
- **[[Shadowburn]] is a finisher until then.** It costs a shard and returns one only on a kill within 8 seconds.
- **[[Incinerate]] replaces [[Shadow Bolt]] as the filler at 40.** Rank 1 deals 99 to 114, plus 25% on a target with your [[Immolate]], for 205 Mana. Ranks 2 and 3 train at 50 and 60. `Bane` 5/5 takes half a second off it.
- **Refresh [[Immolate]] with one cast left.** WoWSims' list recasts it when less than an [[Incinerate]] cast remains *(WoWSims' model, at 60)*.
- **[[Bane of Havoc]] is the two-target tool.** 15% of the damage you deal to other targets is also dealt to the marked one, for 5 minutes. It is a Bane, so it displaces [[Bane of Agony]] on that target. Since November 10 it incurs the global cooldown.
- **[[Soul Fire]] arrives at 48** with a 6-second cast, a 60-second cooldown and a shard cost. Wowhead skips training it while levelling and at 60 casts it once, before the pull.
## Stat priority
**Wowhead (November 3, from sim stat weights, and by its own word a best estimate for 60):** Spell Power or Fire damage, then critical strike, Hit to the cap, Haste, Spell Pierce, Intellect, Spirit. It calls crit and Hit nearly tied.
**Icy Veins (November 4):** Hit to the cap, then Spell Power, Haste, critical strike, Intellect.
- **They disagree on Haste against critical strike.** Wowhead puts 1% Haste at roughly 7 Spell Power and 1% crit or Hit at roughly 9.
- **Hit cap:** 17% against raid bosses and 4% against an enemy of your own level. `Suppression` 5/5 covers 5%.
- **`Ruin` 5/5 makes Destruction crits deal double damage.** In Classic that took one point. Here it takes five, 20% a point.
- **Fire damage is worth about two-thirds of Spell Power** to the [[Incinerate]] build and Shadow damage about a third, on Wowhead's figures.
## Your demon
[[Summon Imp]] in your starting zone, [[Voidwalker]] at 10, [[Summon Succubus]] or [[Summon Incubus]] at 20, [[Summon Felhunter]] at 30, all from class quests. Destruction has no pet talents of its own.
- **Solo:** Voidwalker until 20, then the Succubus or Incubus. Wowhead: keep the Voidwalker if you want the sturdier tank; it deals less damage.
- **Dungeons:** the Imp, for `Blood Pact`, with `Fire Shield` on the tank.
- **You are a stand-still caster without `Suppression`'s threat reduction** in the early levels of every published order, so give the demon a moment before the first direct hit.
Demon Health was cut on November 2 and raised on November 6 and 10; the [class page](/guides/wow-forever/warlock/) has the figures.
## What defines Destruction
| Talent | Points and row | What it does |
| --- | --- | --- |
| **`Bane`** | 5, row 1 | Half a second off [[Shadow Bolt]], [[Immolate]] and [[Incinerate]], two seconds off [[Soul Fire]] |
| **`Aftermath`** | 5, row 2 | +50% to [[Immolate]]'s first hit, and [[Conflagrate]] dazes the target for 5 seconds |
| **`Ruin`** | 5, row 3 | +100% critical strike damage on Destruction spells at 5/5 |
| **[[Shadowburn]]** | 1, row 3 | The 11-point milestone, level 20. 65 to 74 at rank 1; ranks at 24, 32, 40, 48 and 56 |
| **`Agonizing Flames`** | 3, row 4 | +10% to all Destruction damage and +10% [[Searing Pain]] crit chance |
| **[[Conflagrate]]** | 1, row 4 | The 16-point milestone, level 25. It no longer needs `Improved Immolate`. Ranks at 32, 40, 48, 54 and 60 |
| **[[Bane of Havoc]]** | 1, row 5 | New, the 21-point milestone, level 30 |
| **`Fire and Brimstone`** | 3, row 5 | New. +25% critical strike chance on [[Conflagrate]] at 3/3 |
| **`Shadow and Flame`** | 5, row 6 | New. [[Conflagrate]] raises your Shadow damage and [[Shadowburn]] your Fire damage by 4% a point, 20% at 5/5, for 20 seconds. Each point is also a 20% chance that [[Conflagrate]] keeps [[Immolate]] and that [[Shadowburn]] refunds its shard |
| **[[Incinerate]]** | 1, row 7 | New, the 31-point milestone, level 40 |
## What Forever changed for Destruction
- **New talents:** `Molten Skin` (2% less damage taken a point, 10% at 5/5), [[Bane of Havoc]], `Fire and Brimstone`, `Shadow and Flame`, [[Incinerate]].
- **[[Incinerate]] is Destruction's alone.** A November 9 hotfix fixed it being available to other specializations.
- **The tree was compressed:** `Bane` and `Destructive Reach` to row 1, `Ruin` to row 3, [[Conflagrate]] from row 7 to row 4. `Destructive Reach` adds 10/20% range to Destruction spells only. `Cataclysm` cuts their mana cost by 10% at 3/3.
- **`Intensity` is 3 points and covers every Destruction spell.** `Pyroclasm` gives [[Soul Fire]], [[Rain of Fire]] and [[Hellfire]] a 26% chance to stun at 2/2.
- **`Improved Shadow Bolt` is a personal debuff.** A [[Shadow Bolt]] crit raises the Shadow damage that target takes from *you* by 20% for 12 seconds at 5/5. ClassicWoW.gg's warning: *"This is a personal benefit, not the original Classic four-charge Shadow vulnerability shared by damage sources… Do not build a group assignment around supplying that old debuff."*
- **Forever cut the base numbers.** [[Conflagrate]] is 88 to 111 at rank 1 where Classic's was 249 to 316, and [[Soul Fire]] 344 to 431 against 640 to 801.
- **`Improved Searing Pain` became `Agonizing Flames`.** Removed: `Improved Immolate`, `Emberstorm`, `Devastation`, `Improved Firebolt`, `Improved Lash of Pain`.
- **`Curse of Shadow` no longer exists.** [[Curse of the Elements]] covers every magic school.
## At level 60
**Wowhead publishes three raid builds around the same 33-point Destruction core (November 4):** `Shadow and Flame` 5/5, [[Conflagrate]], [[Shadowburn]], `Fire and Brimstone` 3/3 and [[Incinerate]].
- **[Succubus, 14/4/33](https://www.wowhead.com/forever/guide/classes/warlock/destruction/talent-builds-pve-dps).** Wowhead ranks it first if the demon survives. `Suppression` 5/5, `Improved Corruption` 3/5 and `Unholy Power` 4/5.
- **Imp, 14/6/31.** Slightly behind on Wowhead's reading. The Imp attacks from range and brings `Blood Pact`.
- **[[Demonic Sacrifice]], 7/11/33.** Sacrifice the Succubus for +15% Fire damage and play with no demon. Wowhead puts it behind the other two.
**Icy Veins publishes one, the [[Demonic Sacrifice]] Fire build at 7/11/33 (November 4).** The two sites disagree on whether giving up the demon is worth it. WoWSims' Destruction preset is 18/0/33 with no Demonology points.
**The priority** (Wowhead; WoWSims' list runs the same order *(a model)*):
1. **Your Bane:** [[Bane of Doom]] with a minute or more left in the fight, `Amplify Curse` and [[Bane of Agony]] with less
2. **Your assigned Curse**
3. **[[Immolate]]**
4. **[[Corruption]]**
5. **[[Conflagrate]]** on cooldown. It raises your Shadow damage by 20% for 20 seconds
6. **[[Shadowburn]]** on cooldown. It raises your Fire damage by 20% for 20 seconds, and needs a shard in your bags
7. **[[Life Tap]]** before a refresh or while moving
8. **[[Incinerate]]**
On two targets put [[Bane of Havoc]] on the second and play the list on the first. On three or more within reach, [[Bane of Havoc]] on one and then [[Hellfire]].
