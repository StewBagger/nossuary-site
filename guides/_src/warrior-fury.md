updated: November 13, 2026
build: 1.60.1.70938
sources: Blizzard — Class Deep Dives: Priest and Warrior|https://worldofwarcraft.blizzard.com/en-us/news/24301514 ;; Blizzard — Development Notes, updated November 2|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Blizzard — Warrior Updates, October 2|https://us.forums.blizzard.com/en/wow/t/warrior-updates-in-todays-beta-build/2369360 ;; Blizzard — WoW: Forever Hotfixes|https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-11-2026/2403040 ;; Raidbots — Forever talent data|https://www.raidbots.com/static/data/forever/talents.json ;; foreverchanges.pro — Warrior talents and spells, build 1.60.1.70938|https://foreverchanges.pro/talents/warrior ;; WoWSims Forever — Fury|https://www.wowsims.com/forever/warrior/dps/ ;; WoWSims Forever — source and combat-log measurements|https://github.com/wowsims/forever ;; Icy Veins — Fury Warrior Leveling|https://www.icy-veins.com/wow-forever/fury-warrior-leveling ;; Icy Veins — Fury Warrior Talents|https://www.icy-veins.com/wow-forever/fury-warrior-melee-dps-pve-spec-builds-talents ;; Icy Veins — Fury Warrior Stat Priority|https://www.icy-veins.com/wow-forever/fury-warrior-melee-dps-pve-stat-priority ;; Wowhead — Fury Warrior Leveling|https://www.wowhead.com/forever/guide/classes/warrior/fury/dps-leveling-tips ;; Wowhead — Fury Warrior Talent Builds|https://www.wowhead.com/forever/guide/classes/warrior/fury/talent-builds-pve-dps ;; Wowhead — Fury Warrior Stat Priority|https://www.wowhead.com/forever/guide/classes/warrior/fury/stat-priority-pve-dps

Dual-wield damage that spends Rage as fast as two weapons make it. The spec arrives in steps: dual wield at 20, `Death Wish` at 30, [[Whirlwind]] at 36, [[Bloodthirst]] at 40.
:::scope
Guide to the live game, levels 1 to 60. The talent order is Icy Veins' published Fury levelling build (page dated November 4), checked against the live tree. Level-60 builds are Icy Veins' and Wowhead's, named where they differ. Numbers are the client's unless a source is named.
Two kinds of caveat run through these pages and they do not mean the same thing. Something marked as ours is our own reasoning rather than a source's. Something marked *(WoWSims' model)* is what a simulator's rotation list does at 60, not a measured result; its combat-log measurements are named as measurements.
No raid is open until December 9, so nothing here is raid-tested. Hover tooltips can show the wrong rank, so where one differs from the prose, believe the prose.
:::
## What Fury is for
**Sustained damage from two weapons, on one target or a small pack.** Two weapons swing more often, `Unbridled Wrath` and `Dual Wield Specialization` turn those swings into Rage, and [[Whirlwind]] strikes with both weapons for every dual-wielder, no talent required.
The catch is timing. **You cannot dual-wield until level 20**, [[Whirlwind]] is level 36 and [[Bloodthirst]] is 40. Icy Veins says so plainly: until those arrive Fury "can be a bit slower than leveling as Protection", and you may prefer to respec into Fury later with good weapons in hand. Wowhead's Fury page credits the new talents, `Gore Drinker` above all, with giving the spec sustain it never had, and lists two-target damage as a strength.
## Your talent points
The lines below are **Icy Veins' Fury levelling build**, in its order, as published on November 4. Every point is legal on the live tree. Each line is the whole build at that level.
**Level 20, 0/11/0:** `Cruelty` 5, `Unbridled Wrath` 5, `Furious Precision` 1.
**Level 30, 0/21/0:** `Cruelty` 5, `Unbridled Wrath` 5, `Furious Precision` 3, `Enrage` 2, `Dual Wield Specialization` 5, `Death Wish` 1.
**Level 40, 0/31/0:** `Cruelty` 5, `Unbridled Wrath` 5, `Furious Precision` 3, `Enrage` 3, `Dual Wield Specialization` 5, `Death Wish` 1, `Reckless Swings` 1, `Improved Berserker Rage` 2, `Improved Whirlwind` 2, `Flurry` 3, `Bloodthirst` 1.
**Level 60, 16/33/2:** `Cruelty` 5, `Unbridled Wrath` 5, `Furious Precision` 3, `Enrage` 5, `Dual Wield Specialization` 5, `Death Wish` 1, `Reckless Swings` 1, `Improved Berserker Rage` 2, `Improved Whirlwind` 2, `Flurry` 3, `Bloodthirst` 1, `Improved Rend` 3, `Deflection` 2, `Improved Charge` 2, `Improved Overpower` 2, `Improved Tactical Mastery` 3, `Anger Management` 1, `Deep Wounds` 3, `Improved Bloodrage` 2.
**The order inside those lines:** `Cruelty` at 10 to 14, `Unbridled Wrath` at 15 to 19. `Furious Precision` at 20 to 22, as soon as you can hold two weapons. Two points of `Enrage` at 23 and 24, `Dual Wield Specialization` at 25 to 29, `Death Wish` at 30. `Reckless Swings` at 31, `Improved Berserker Rage` at 32 and 33, `Improved Whirlwind` at 35 and 36 to meet [[Whirlwind]], `Flurry` at 37 to 39, `Bloodthirst` at 40. Then Arms from 41, with `Improved Bloodrage` at 54 and 55.
**Wowhead's levelling build goes another way and ends at 11/40/0.** Its text aims for `Gore Drinker` and `Bloodthirst` as early as possible, which means `Blood Craze` 3/3 first, then `Flurry`, then `Deflection` in Arms for the Parry. Icy Veins' build takes neither `Blood Craze` nor `Gore Drinker`. The split is sustain against Rage: Wowhead buys healing, Icy Veins buys off-hand Hit and Rage sooner. The 11/40/0 split is our decode of Wowhead's embedded calculator, and its page text names `Improved Rend` where the calculator shows `Improved Tactical Mastery`.
**Level-60 builds for dungeons.** Icy Veins publishes 18/33/0 and Wowhead 17/34/0; WoWSims' preset is 17/33/1. All three take `Cruelty` 5, `Unbridled Wrath` 5, `Furious Precision` 3, `Dual Wield Specialization` 5, `Reckless Swings`, `Death Wish`, `Improved Whirlwind` 2, `Flurry` 3 and `Bloodthirst`, and in Arms `Improved Tactical Mastery` 3, `Improved Overpower` 2, `Deep Wounds` 3 and `Impale` 2. `Enrage` is the open question. Icy Veins takes 5 and says to drop to 3 for `Improved Execute` 2 if it rarely triggers. Wowhead takes 4 in its raid build and 5 in its dungeon build, where you are hit more. WoWSims takes none, because its target hits nobody.
## Rotation
**Before 30 you play in [[Battle Stance]]**, and the list is the same as Arms without [[Slam]]: [[Battle Shout]], [[Charge]], [[Victory Rush]], [[Demoralizing Shout]], [[Rend]] if it will live, [[Overpower]] on a dodge, [[Sunder Armor]] on tough targets.
**Levelling, one target, from 36** (Icy Veins' order):
1. **[[Battle Shout]]** up; [[Bloodrage]] between pulls. `Reckless Swings` from 31 when you need Rage and can spare the health
2. **[[Charge]]** to open
3. **[[Victory Rush]]** before its 20 seconds run out
4. **`Death Wish`** on anything you will hit for most of its 30 seconds. It adds 5% damage taken
5. **[[Whirlwind]]** on cooldown from 36
6. **[[Bloodthirst]]** from 40 while Whirlwind cools down
7. **[[Overpower]]** after a dodge, if the stance change will not waste Rage
8. **[[Sunder Armor]]** and **[[Rend]]** only on elites and bosses
9. **[[Execute]]** on bosses and runners; otherwise keep the Rage for the next pull
10. **[[Heroic Strike]]** only with Rage to burn
**Wowhead orders the top differently**: [[Bloodthirst]] on cooldown first, [[Whirlwind]] lower, and it adds one step. If `Gore Drinker`'s healing is not running, press [[Bloodrage]] or `Berserker Rage` to start it.
**Two or more targets:** [[Whirlwind]] first, then [[Cleave]]. Wowhead queues Cleave above 60 Rage while levelling.
**The reasons behind the order:**
- **[[Whirlwind]] goes ahead of [[Bloodthirst]] once you have `Improved Whirlwind`.** The talent cuts its cooldown to 8 seconds and adds 30% to the closest enemy (Icy Veins gives this as its reason). At 60 the list agrees: Whirlwind, then Bloodthirst, then [[Heroic Strike]] at 40 Rage or more *(WoWSims' model)*. Whirlwind costs 25 and Bloodthirst 30, so an early Heroic Strike can leave you short of both.
- **Count the Rage before you leave [[Berserker Stance]].** [[Overpower]] needs [[Battle Stance]], [[Rend]] needs Battle or Defensive, and a stance change keeps only 10 Rage, or 25 with `Improved Tactical Mastery` 3/3. At 60 the list, keeping 25, swaps for Overpower only at 73 Rage or less *(WoWSims' model)*.
- **[[Execute]] outranks everything on a boss below 20%.** At 60 the list puts it above [[Whirlwind]] and [[Bloodthirst]] *(WoWSims' model)*. An Execute that is dodged, parried or misses costs only its base Rage and keeps the rest (WoWSims' measurement).
- **`Reckless Swings` is a pull button.** At 60 the list casts it 1.5 seconds before the pull *(WoWSims' model)*. It also starts `Gore Drinker` (Blizzard, November 6).
- **[[Cleave]] early on packs.** At 60 the list queues it at 25 Rage on two or more targets, above [[Bloodthirst]] *(WoWSims' model)*.
## Stat priority
**Both weapons matter, the main hand most.** On WoWSims' pre-raid Fury set a point of main-hand DPS is worth about 11.5 Attack Power and a point of off-hand DPS about 3.3 *(WoWSims' model)*.
**At 60 the sites differ.** Icy Veins: weapon DPS, Hit, Expertise, critical strike, Strength. Its Hit figures: 8% caps special attacks against a level 63 boss, and dual-wield white hits would need 27% before talents. Wowhead's list is older, dated October 29 and labelled speculative: weapon skill to 305, Hit to 9%, critical strike, Strength, Agility, Stamina. It does not mention Expertise, which is a new stat that reduces enemy dodges and parries.
**Hit feeds Rage.** A missed white hit earns nothing, and Icy Veins calls repeated misses Fury's main weakness early on. Crit pays twice: a critical white hit generates 100% increased Rage and starts `Flurry`.
`Dual Wield Specialization` gives **+25% off-hand damage** and **+50% off-hand Rage** at 5/5, 5% and 10% per rank. It carries no Hit. Off-hand Hit is `Furious Precision`, 4/7/10%. Queueing [[Heroic Strike]] no longer raises your off-hand hit chance (Blizzard).
## What defines Fury
| Talent | Earliest level | What it does |
| --- | --- | --- |
| **`Unbridled Wrath`** | 15, 5/5 by 19 | 12% per point, 60% at 5/5, to gain 1 Rage when you deal melee damage with a weapon |
| **`Dual Wield Specialization`** | 25 | +25% off-hand damage and +50% off-hand Rage at 5/5 |
| **`Death Wish`** | 30 | +20% physical damage and Fear immunity for 30 seconds, +5% damage taken, 10 Rage, 3-minute cooldown. Required for [[Bloodthirst]] |
| **`Flurry`** | 35 | 10/20/30% attack speed for your next 3 swings after a melee crit. A [[Whirlwind]] off-hand crit starts it and uses no charge (WoWSims' measurement) |
| **`Bloodthirst`** | 40 | 45% of Attack Power plus 30 at rank 1, 30 Rage, 6-second cooldown, +10% movement speed for 10 seconds. It does not heal |
## What Forever changed for Fury
- **`Boundless Rage`, `Improved Cleave` and `Raging Blows` are gone.** Nothing in Fury discounts [[Cleave]] or [[Whirlwind]] any more.
- **`Improved Whirlwind`, row 6**, 2 points: 1/2 seconds off [[Whirlwind]]'s 10-second cooldown and 15/30% more damage to the closest enemy (Blizzard).
- **`Reckless Swings`, row 4**, 1 point: costs 25% of base health; your next 4 melee attacks within 8 seconds generate 5 extra Rage each; 15-second cooldown (Blizzard). Wowhead puts the cost at 657 health at level 60.
- **`Gore Drinker`, row 5, requires `Blood Craze` 3/3.** Your `Enrage`, `Berserker Rage`, [[Bloodrage]], `Death Wish`, `Reckless Swings` and [[Bloodthirst]] make your next 3 melee attacks restore 0.5/1% of max Health each. The healing generates no threat (Blizzard). Each landed strike of a [[Whirlwind]] or [[Cleave]] spends a charge and heals (WoWSims' measurement).
- **Two early talents.** `Lingering Rage` (row 2) delays Rage decay out of combat by 2/4/6/8/10 seconds. `Furious Precision` (row 3) gives +4/7/10% off-hand Hit.
- **`Booming Voice`**: Shout area 10/20/30/40/50% wider, and 5/10/15/20/25% off the Rage cost of Shouts and of `Piercing Howl`.
- `Unbridled Wrath` **no longer grants double Rage for a two-handed weapon**.
- **`Enrage` sits in row 3.** Any damaging attack on you has a 30% chance to trigger it, for +2% physical damage per point over 12 seconds, 10% at 5/5.
- **`Flurry` has 3 ranks and no prerequisite; [[Bloodthirst]] requires `Death Wish`** (Blizzard).
- `Improved Berserker Rage` is row 5, and `Berserker Rage` trains at **level 30**. Berserker Rage gives extra Rage from damage taken for its 10 seconds. The talent adds 5/10 Rage on use and a 50/100% chance to remove movement-impairing effects.
- `Blood Craze` restores 1/2/3% of health over 6 seconds after you are crit or take a hit worth more than 20% of your health. It does not trigger off [[Bloodthirst]] or while you sit (Blizzard).
- `Piercing Howl` is a 50% slow for 6 seconds within 10 yards, 10 Rage. `Improved Execute` takes 3/5 Rage off [[Execute]]. `Improved Battle Shout` and `Improved Demoralizing Shout` are gone because both effects are baseline.
- **`Death Wish` was rebuilt.** Classic's version cut armour and resistances by 20%; Forever's adds 5% damage taken instead and grants Fear immunity.
## At level 60
Dungeons are the level-60 game until raids open on December 9. Both sites publish a dual-wield [[Bloodthirst]] build, above. No raid log exists. Wowhead's tier list predates launch tuning and calls itself a prediction, and Blizzard has said it expects a large tuning pass once it has data from players past 30. Wowhead also describes a Fury and Protection hybrid for tanking; the Protection guide covers it.
