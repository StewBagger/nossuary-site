updated: October 5, 2026
build: 1.60.1.70124
sources: Blizzard — Beta Development Notes, October 1|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Wowhead — Level 20 Affliction Warlock|https://www.wowhead.com/forever/guide/classes/warlock/affliction/level-20-dps-overview ;; Icy Veins — Affliction Warlock|https://www.icy-veins.com/wow-forever/affliction-warlock-ranged-dps-pve-guide ;; ClassicWoW.gg — Aff Warlock|https://classicwow.gg/forever/guides/warlock/affliction

Stacked shadow damage-over-time spells plus channelled drains, *"for players who enjoy watching their enemies slowly rot away."* **Icy Veins rates it 5 out of 5 for levelling**, joint best in the class.
:::scope
Levelling guide, 1 to 60. The beta is capped at **level 30** as of the October 1 build, which Blizzard raised from 20 that day, so no level-60 Affliction build has been tested. Talent tiers unlock at levels 10, 15, 20, 25, 30, 35 and 40. No source has posted a level 30 build either — the cap only reached 30 on October 1 and none of the three has published one since — so the level 30 line below extends the published level 20 build using the full talent tree's point costs, not a build any guide has recommended.
:::
## Is Affliction worth levelling?
**Yes — Icy Veins rates its levelling 5 out of 5, joint best in the class.** *"Affliction Warlocks have always been excellent levelers, and that strength shows up early in WoW Forever… Learning how to balance those tools lets you move through enemies with very little downtime."*
**Its weakness is short fights, and two sources say so:** *"Affliction performs best when enemies live long enough for your DoTs to ramp up. Fast dungeon pulls can end before that setup has time to pay off."* Put more bluntly by another source: *"On a target that dies in ten seconds, you paid full mana and cast time for half a spell's worth of damage."*
Icy Veins scores it 5.0 for levelling and 4.0 for dungeons. Learn to stop casting when your existing damage-over-time effects will finish the job.
## Your talent points
**Level 20: 11/0/0, and the two sources that publish a build disagree on the shape of it.**
**Icy Veins:** `Improved Corruption` 5/5 → `Improved Life Tap` 2/2 → `Suppression` 3/5 → `Soul Harvest` 1/2 (renamed from `Soul Harvesting` on October 1, the same day its Mana regeneration bonus went from bugged and non-functional to correctly granting 50/100%). Its own note, written before the fix: *"The final point in Soul Harvesting is optional, so feel free to move it elsewhere."* **With the bonus actually working now, that second point buys 50% more Mana regeneration where it previously granted nothing — our own reading, against a source note written before the fix.**
**Wowhead** takes `Suppression` further, to 4/5, on different reasoning: *"4 points is enough to reach Hit cap against a same-level target, and it helps if you push slightly higher-level content."* Its only other fixed pick is `Improved Corruption` 5/5; the rest, including `Improved Life Tap` and `Soul Harvest`, is filed as playstyle-dependent, alongside off-tree options like `Unholy Power` and `Destructive Reach`.
**ClassicWoW.gg does not publish a suggested build at all** for any spec, by design; its talent tree is browsable, not prescriptive.
**The Legacy System adds points beyond these 11.** Wowhead puts the cap at 7 legacy points from world exploration before level 25, worth 2 extra talent points, enough to reach one tier further. Its picks there: `Pandemic` first, for the critical-damage payoff; `Improved Bane of Agony` next, now 10% for 2 points instead of Classic's 6% for 3; `Amplify Curse` if you want the single-point cooldown; skip `Fel Concentration`, since you are not draining enough yet for it to matter. **Those points cannot be spent at 20 as printed.** Blizzard's Known Issues list opening the Legacy System before level 25 as a bug — the “Y” hotkey works and throws LUA errors on tabs 1 and 3 — so read these as what to spend Legacy points on from 25, not as part of a level-20 build.
**Level 30: 21/0/0 — our own extension, not a published build.** No source has posted one; the cap only reached 30 on October 1. Extending the level 20 build on the tree's own point costs, two readings share a core and split on five points. Both take `Suppression` 5, `Improved Corruption` 5, `Nightfall` 2 and [[Siphon Life]] 1. One then takes `Malediction` 4 + `Amplify Curse` + `Pandemic` 3; the other takes `Malediction` 5 + `Improved Drains` 3.
## Rotation
Icy Veins and Wowhead order the opening DoTs differently, and both give a reason.
**Icy Veins' order** (Immolate, then Corruption, then Bane of Agony) leads with the DoT that pays off fastest.
**Wowhead reverses it**, Bane of Agony first, Corruption, Immolate last, arguing threat: *"Bane of Agony first: it deals the least upfront damage, so it's the least threat and requires time to build up to full damage. Immolate last; its initial Hit generates direct threat, so it's the worst opener."*
1. **Send the demon in first**
2. **[[Curse of the Elements]]** or [[Curse of Recklessness]]
3. **[[Immolate]]**: or last, on Wowhead's threat-ordered build, see above
4. **[[Corruption]]**: instant from level 14, see below
5. **[[Bane of Agony]]** *"if the enemy will survive long enough"*: or first, on Wowhead's build
6. **[[Drain Life]]** when you need health
7. **Wand as filler.** This is not a typo: *"At Level 20 with Greater Magic Wand, [[Shadow Bolt]] currently deals less damage for the time spent casting while also costing Mana and generating additional threat"*, and Wowhead agrees for levelling generally: *"you'll use your wand more for damage because it deals more DPS than Shadow Bolt, and it's also mana-free"*
8. **[[Drain Soul]]** to finish, for the shard
9. **Stop spending mana when your existing effects will finish the enemy**
From 30, [[Shadow Bolt]] becomes worth casting on `Nightfall` procs — but not while [[Drain Soul]] is still channelling. Starting another cast now correctly interrupts the channel, where it previously kept channelling through it, so take the free proc before you start Drain Soul, not during it. [[Life Tap]] *"ideally while moving."*
**Multi-target:** *"For maximum damage on AoE and only if the pack lives long enough, spread your DoTs first and then use [[Rain of Fire]]."* If the pack dies fast, skip the effects and go straight to Rain of Fire.
## Stat priority
Spell Power, then Hit, Intellect, Spirit, critical strike, Stamina, Haste.
**Two of those placements are Forever-specific.** Spirit is high because *"[[Life Tap]] has changed and now scales off of your Spirit."* Critical strike matters *"much more than it was in original Classic"* because **damage-over-time effects can now crit**. Haste is last: it *"did not make DoTs or Drain channels tick faster."*
## Your demon
All four come from class quests. [[Imp]] at **2**, [[Voidwalker]] at **10**, [[Succubus]] at **20**, [[Felhunter]] at **30**.
**[[Voidwalker]] is the levelling pet**: *"your tanky option and the best option to use once you unlock it"*, and it *"can literally face tank multiple enemies, while you DoT them all up."* Its threat comes from `Torment`, and Wowhead notes it is noticeably weaker until rank 2 trains at 20. [[Succubus]] *"deals insanely high damage compared to the other available demons."*
**Forever trains the [[Felhunter]] at 30.** In Classic it came from a quest that opened at 30 and withheld Spell Lock until 36.
## What defines Affliction
| Talent | Earliest level | What it does |
| --- | --- | --- |
| **`Improved Corruption` 5/5** | **14** | **Makes [[Corruption]] instant cast and adds 10% damage.** Corruption's base cast is 2 seconds and 5/5 removes exactly 2 seconds, at 2% damage per point. Both published builds fix it at 5/5 |
| **`Suppression` 5/5** | 14 | **Rewritten in Forever**: now +5% hit to *all* spells and −20% threat, where Classic gave Affliction-only resistance reduction |
| **`Pandemic` 3/3** | 22 | New. **+100% critical damage** on Corruption, both Banes, [[Siphon Life]], `Wrack` and both Drains — the talent that cashes in DoT crits. **[[Immolate]] is not on the list** |
| **`Wrack`** | **40** | The 31-point capstone. Not reachable in the beta at any cap |
## What Forever changed for Affliction
- **Damage-over-time effects can critically strike.** One source calls it *"one of the largest overall Warlock mechanical changes"*. Both `Malevolence` and `Pandemic` are new talents built on it.
- **[[Bane of Agony]] and [[Bane of Doom]] are no longer Curses**: *"no longer competes with your Curse, which means you can keep your big damage rolling while still bringing the debuff your group needs."* A Bane and a Curse now coexist on one target.
- **Six new talents**: `Malediction`, `Soul Harvest`, `Improved Drains`, `Pandemic`, `Malevolence`, `Wrack`. **Six removed**: `Improved Curse of Weakness`, `Grim Reach`, `Dark Pact`, `Improved Curse of Exhaustion`, `Improved Drain Soul`, `Improved Drain Mana`.
- **[[Life Tap]] converts 40 health to 40 mana and Spirit increases the amount** (Classic: a flat 20 to 20). `Improved Life Tap` moved to tier 1.
- `Nightfall` now procs off [[Corruption]], [[Drain Soul]], [[Drain Life]] and `Wrack`. `Soul Siphon` was rewritten to 4% per other Affliction effect, up to 36%. **[[Drain Soul]] now has a shard chance on damage, not only on a kill.**
- **[[Drain Soul]] is now correctly interrupted the moment you begin casting another spell.** It previously kept channelling through a new cast; that bug is what let the Nightfall line above treat a proc as free.
## At level 60
Unknown, and one guide says why: *"Critical striking DoTs, Pandemic, Wrack, Improved Drains, and the new Drain Soul execute bonuses all scale together in ways that cannot easily be evaluated from a Level 38 build."*
