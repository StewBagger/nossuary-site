updated: November 13, 2026
build: 1.60.1.70938
sources: Blizzard — Class Deep Dives: Priest and Warrior|https://worldofwarcraft.blizzard.com/en-us/news/24301514 ;; Blizzard — Development Notes, updated November 2|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Blizzard — WoW: Forever Hotfixes|https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-11-2026/2403040 ;; Blizzard — Dungeon Enemy XP Increased, November 8|https://us.forums.blizzard.com/en/wow/t/dungeon-enemy-xp-increased-november-8/2406595 ;; Blizzard — Raid Overview|https://worldofwarcraft.blizzard.com/en-us/news/24303009/world-of-warcraft-forever-raid-overview-locations-raid-sizes-and-attunement ;; foreverchanges.pro — Warrior spells by level, build 1.60.1.70938|https://foreverchanges.pro ;; Raidbots — Forever talent data|https://www.raidbots.com/static/data/forever/talents.json ;; WoWSims Forever — source and combat-log measurements|https://github.com/wowsims/forever ;; Icy Veins — Arms Warrior Leveling|https://www.icy-veins.com/wow-forever/arms-warrior-leveling ;; Icy Veins — Fury Warrior Leveling|https://www.icy-veins.com/wow-forever/fury-warrior-leveling ;; Icy Veins — Protection Warrior Leveling|https://www.icy-veins.com/wow-forever/protection-warrior-leveling ;; Wowhead — Arms Warrior Leveling|https://www.wowhead.com/forever/guide/classes/warrior/arms/dps-leveling-tips ;; Wowhead — Protection Warrior Leveling|https://www.wowhead.com/forever/guide/classes/warrior/protection/tank-leveling-tips ;; Wowhead — Dual Spec Costs 50 Gold at Level 40|https://www.wowhead.com/forever/news/dual-spec-costs-50-gold-at-level-40-unlock-secondary-talent-tree-383835 ;; Kargoz — The Most BROKEN Way to Level a Warrior in WoW Forever|https://www.youtube.com/watch?v=9ZpQvbxDFlw

Warrior builds its own resource by fighting, and spends it on three jobs: two-handed damage, dual-wield damage, and shield tanking. You start every fight with an empty bar and fill it by swinging and by being hit. Rage from dealing damage is normalized to weapon speed, and a critical white hit generates **100% increased Rage**.
:::scope
Guide to the live game, levels 1 to 60. Spell levels, talent rows and numbers are read from the live client and its hotfixes. Talent orders are Icy Veins' and Wowhead's published builds, named and dated on each spec page. Rotation notes past 40 lean on WoWSims, which is a model, and on the combat-log measurements its authors publish with it. Still thin: no raid opens until December 9, so nothing here is tested in a raid, and we could not read a public combat log. Blizzard tunes classes on Tuesdays, so numbers can move. Hover tooltips can show the wrong rank, so where one differs from the prose, believe the prose.
:::
## Which spec?
| Spec | Role | Its strongest point | In one line |
| --- | --- | --- | --- |
| **[Arms](/guides/wow-forever/warrior/arms/)** | Melee DPS | `Sweeping Strikes` at 30 copies your next 5 melee attacks onto a second enemy. From 31, [[Rend]] feeds `Bloodthrill`, which opens [[Overpower]] without a dodge | Two-handed hits, bleeds and a 50% healing debuff from [[Mortal Strike]] at 40 |
| **[Fury](/guides/wow-forever/warrior/fury/)** | Melee DPS | Two weapons swing more often, `Unbridled Wrath` gives 60% of those hits +1 Rage, and `Flurry` turns crits into 30% faster swings | Dual wield from 20, [[Whirlwind]] at 36, [[Bloodthirst]] at 40 |
| **[Protection](/guides/wow-forever/warrior/protection/)** | Tank | `Shield Specialization` 5/5 returns 5 Rage on every block, where Classic gave 1. That pays for [[Shield Block]] and funds [[Revenge]] | Shield tanking with real damage; [[Defensive Stance]] adds 80% threat (Blizzard) |
**Both guide sites now tell a new Warrior to level as Protection.** Icy Veins calls it "the fastest Warrior specialization for leveling" and recommends it on its Arms and Fury pages too. Wowhead's Protection page says Arms and Fury Warriors will look to Protection "for the first 35-40 levels". One creator disagrees: Kargoz [levels as Arms from the start](https://www.youtube.com/watch?v=9ZpQvbxDFlw&t=13) and tanks dungeons with a two-hander in [[Battle Stance]]. That is one player's report, not a consensus. Dual Specialization opens at level 40 (Blizzard) and costs 50 gold at the class trainer (Wowhead), so the pick is not permanent.
## Is Warrior for you?
Play Warrior if you want to watch the enemy rather than your own bars. The class depends on its weapon more than any other, has no ranged attack, and has no heal before [[Victory Rush]] at 20. Wowhead's Arms page still calls Warrior "objectively the toughest class to level". Both sites then say Protection removes most of that from level 16, once [[Shield Block]] and [[Revenge]] are trained.
Blizzard's Rage changes are why. Rage from taking damage no longer shrinks for wearing Armor: the formula assumes a fixed mitigation for your level, 20% to 40%. Absorbs no longer block Rage gain. A critical white hit gives 100% increased Rage.
Blizzard's closing assessment of the class, in its own words:
> Warriors remain the masters of melee combat. They can both dish out melee damage and mitigate damage done to them. They have a unique strength in dealing sustained damage to multiple melee targets, found on no other melee class. They have a powerful toolkit to solve nearly any problem, but they lack the tools to easily recover from taking too much damage. And they have unique buffs and debuffs that only Warriors can supply.
:::strengths
- Blizzard's own framing: Warriors *"can both dish out melee damage and mitigate damage done to them"*
- Weapon damage leads every published stat priority, so an upgrade is felt immediately
- Wanted in groups: Wowhead's Arms page lists dungeons and elite quests as the class's strong ground
:::
:::weaknesses
- Nothing in the kit heals you or reaches at range before 20
- [[Victory Rush]] at level 20 is the first self-heal, and it needs a kill before it is available
- Gear reliance: Wowhead lists it as a con for Arms and Fury alike, and Fury needs two weapons kept current
:::
:::new
**Is the rotation simple?** Four or five buttons while levelling, and you react rather than follow a sequence.
**Is it forgiving?** With a shield, yes from level 16. With a two-hander, a second enemy is a real risk until `Sweeping Strikes` at 30.
**What carries you while levelling?** Rage from being hit as well as hitting, [[Victory Rush]] after each kill from 20, and a current weapon.
**Does it need a group?** No, but it gains the most from one. Wowhead's Arms page: a healer removes the downtime and lets you pull two.
:::
## Levelling milestones
Spell levels are the client's, read through foreverchanges.pro on build 1.60.1.70938. You train new ranks every two levels.
| Level | What you get |
| --- | --- |
| 1 | [[Heroic Strike]], [[Battle Shout]]. The shout lasts 3 minutes and covers the raid. Its Attack Power bonus was trimmed because both factions have two casters who can buff it, and Improved Battle Shout's bonus is baked into the base number (Blizzard) |
| 4 | [[Charge]], [[Rend]] |
| 6 | [[Thunder Clap]]. It scales with Attack Power and works in [[Defensive Stance]]. Its cooldown is 6 seconds and its threat was lowered to pay for that (Blizzard) |
| 8 | `Hamstring` |
| 10 | **Class quest, mandatory.** [[Defensive Stance]], [[Sunder Armor]], [[Taunt]], [[Bloodrage]]. First talent point |
| 12 | [[Overpower]], [[Shield Bash]]. Shield Bash is **your only interrupt until [[Pummel]] at 38**, so keep a shield in the bag |
| 14 | [[Revenge]]. [[Tactical Mastery]], trained and not a talent: you keep 10 Rage through a stance change. [[Demoralizing Shout]], 45 seconds |
| 16 | [[Shield Block]], **2 attacks over 7 seconds**. `Mocking Blow` |
| 18 | [[Disarm]] |
| 20 | **[[Victory Rush]]**: free, scales with Attack Power, heals 10% of max health. It is usable for 20 seconds after you kill an enemy that gives experience, on a 30-second cooldown. Dual wield unlocks. [[Cleave]]. [[Retaliation]], 15-minute cooldown. [[Slam]], 15-second cooldown |
| 22 | `Intimidating Shout` |
| 24 | [[Execute]] |
| 26 | `Challenging Shout` |
| 28 | [[Shield Wall]]: 60% less damage for 12 seconds, 15-minute cooldown |
| 30 | **Second class quest**: [[Berserker Stance]], [[Intercept]], `Berserker Rage` |
| 36 | [[Whirlwind]] |
| 38 | [[Pummel]] |
| 40 | Row 7 talents: [[Mortal Strike]], [[Bloodthirst]] or `Shield Slam`. **Plate armour**, mount, Dual Specialization |
| 48, 54, 60 | Ranks 2, 3 and 4 of [[Mortal Strike]], [[Bloodthirst]] and `Shield Slam` |
| 50 | [[Recklessness]]: 15 seconds, 30-minute cooldown |
**Talent points are your level minus nine**: one at 10, eleven at 20, twenty-one at 30, thirty-one at 40, fifty-one at 60. Rows open at 0, 5, 10, 15, 20, 25 and 30 points in a tree, so a row 7 talent is reachable at level 40. The one-point milestone talents sit at 11, 21 and 31 points, joined by a 16-point tier (Blizzard). The Legacy perk Talented starts your points as early as level 5 at full rank. The total stays 51.
**The three major cooldowns no longer share a lockout** (Blizzard). [[Retaliation]] and [[Shield Wall]] are 15 minutes. [[Recklessness]] is still 30.
**Devastate is not in Forever, and it was not in Classic either.** It is a Burning Crusade ability. [[Sunder Armor]] is the ability you use, and its threat scales with Attack Power.
## Which race
Read this section in proportion. Race is the smallest choice on this page, well behind spec, gear and knowing your rotation, and **no race is a wrong answer for levelling** *(ours, not a source's)*. Racials decide things in PvP. The ones that count break crowd control: `Will of the Forsaken` (Undead, fear, sleep and charm), `Escape Artist` (Gnome, roots and snares) and `Stoneform` (Dwarf, bleeds, poisons and disease). A free trinket slot is worth more than any damage racial below *(ours, not a source's)*.
**Alliance — Night Elf.** `Elune's Light` gives +10% crit for 15 seconds on a 3-minute cooldown, `Shadowmeld` drops threat, and `Wisp Spirit` speeds corpse runs.
**Horde — Orc.** `Blood Fury` is +10% attack power and spell power for 15 seconds on a 2-minute cooldown, and `Hardiness` shortens stuns on you by 20%. We keep it as the Horde pick for that pair *(ours, not a source's)*. Tauren Warriors start with 5 more Strength than Human Warriors (Blizzard), and Troll `Berserking` lasts 15 seconds (Blizzard).
**Forever changed the answer.** Vanilla's Human and Orc weapon-skill picks are gone and no racial cares what weapon you hold. Human keeps a flat 1% crit in `Ruthless`, and Night Elf gained an offensive cooldown it never had.
## Quality of life
- **Do the level-10 class quest immediately, and the level-30 one on time.** They are how you get [[Defensive Stance]], [[Sunder Armor]], [[Taunt]] and later [[Berserker Stance]].
- **Keep the weapon current and its skill trained.** A new weapon type performs badly while its skill lags.
- **Carry a one-hander and shield permanently** for [[Shield Bash]] interrupts.
- **Mining and Blacksmithing** let you craft your own weapons and armour (Wowhead suggests the pair on its Arms and Fury pages). Cooked food gives +5% experience from kills while you are well fed.
- **Run dungeons, and take every dungeon quest first.** Blizzard raised dungeon enemy experience by 50% on November 8. Wowhead notes the quest rewards were upgraded, and a weapon from them carries several levels.
- **Finish weak enemies with white hits.** Icy Veins' advice on all three specs: Rage carried into the next pull is worth more than a faster kill.
- **[[Thunder Clap]] works from [[Defensive Stance]]** (Blizzard), so area threat needs no stance change.
- **[[Rend]] and [[Sunder Armor]] instantly tap the enemy to you** (Blizzard). Use them to claim a pull.
## What changed from Classic
| Change | What it means for you |
| --- | --- |
| Rage from dealing damage normalized to weapon speed | Hitting harder does not give more Rage. Swinging and connecting does. Icy Veins gives 4.5 Rage per second of weapon speed for a two-hander |
| Critical white hits give **100% increased Rage** | Blizzard's figure. WoWSims measured exactly double on two-handers in combat logs |
| **Armor no longer reduces Rage from taking damage** | The formula assumes 20% to 40% mitigation for your level, whatever you wear. A hit blocked in full gives no Rage from damage taken (WoWSims' measurement); the block talents pay you instead |
| On-next-swing attacks give no Rage | [[Heroic Strike]] and [[Cleave]] replace a white hit, so they cost their Rage and the swing's. Both sites put them last |
| [[Victory Rush]] at 20 | **Your first self-heal.** Two talents add more: `Blood Craze` and `Gore Drinker`, both in Fury. Neither heal generates threat (Blizzard) |
| [[Tactical Mastery]] trained at 14 | You keep 10 Rage through a stance change without spending a point; `Improved Tactical Mastery` raises it to 25 |
| [[Defensive Stance]] adds 80% threat, and Paladins have no Blessing of Salvation | Classic's stance gave 30%. Damage dealers have no blessing to shed threat with; see the Protection guide |
| `Reckless Swings`, new Fury talent | 25% of base health for 5 extra Rage on each of your next 4 melee attacks. All three published levelling builds take it eventually |
| Plate armour at 40 | Mail until then |
## At level 60
Raids open December 9: Barrow Deeps (10 players), Hyjal Summit (20) and Onyxia's Lair (40) (Blizzard). No raid data exists yet. Until then level 60 is dungeons, and the spec pages carry the level-60 builds Icy Veins and Wowhead publish, with what WoWSims' model does at 60. Wowhead's Protection author adds a caution that applies to all three: endgame tuning is not known yet, so builds may move.
