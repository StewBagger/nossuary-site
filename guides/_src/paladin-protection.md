updated: October 5, 2026
build: 1.60.1.70124
sources: Blizzard — Beta Development Notes, October 1|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Wowhead — Level 20 Protection Paladin Guide|https://www.wowhead.com/forever/guide/classes/paladin/protection/level-20-tank-overview ;; Icy Veins — Protection Paladin Tank Guide|https://www.icy-veins.com/wow-forever/protection-paladin-tank-pve-guide ;; ClassicWoW.gg — Protection Paladin|https://classicwow.gg/forever/guides/paladin/protection

Shield tanking that generates threat from Holy damage rather than weapon damage, which makes it **the only tank in the game that gears for Spell Power.**
:::scope
Levelling guide, 1 to 60. The beta is capped at **level 30** as of the October 1 build, which Blizzard raised from 20 that day, so no level-60 Protection build has been tested. Talent tiers unlock at levels 10, 15, 20, 25, 30, 35 and 40. No source has posted a level 30 build either — the cap only reached 30 on October 1 and none of the three has published one since — so the level 30 line below extends the published level 20 build using the full talent tree's point costs, not a build any guide has recommended.
:::
## What Protection is for
**Taking several enemies at once, and taunting without spending a talent point.** [[Seal of Fury]] is available from level 10 and judging it taunts — baseline, not a talent — while [[Consecration]] amplified by [[Righteous Fury]] puts threat on everything in the ring, which is why Spell Power leads your stat priority. You can safely pull several enemies and grind them down; **mana is the real limiter**.
**What is published about levelling in it: Forever nerfed the thing this spec used to be good at.** Protection Paladin's dungeon levelling rested on [[Consecration]], its one source of damage to a whole pull. Forever **cut dungeon experience hard**, which one published guide calls out directly as hurting this spec more than any other — and the October 1 build went further, cutting the extra experience on dungeon quests by 50% as a deliberate reduction in levelling speed. **No source publishes a levelling score for any Paladin spec**; what is published here is that experience cut and the guide calling it out.
## Your talent points
**Level 20: 0/11/0.** Two published builds agree on the first ten points.
1. `Redoubt`, 5 points — **+4% Block per rank, 20% at the 5 points this build spends**. It is the first pick: no alternative tier-1 Protection talent is published, and the Block chance it grants feeds `Holy Shield` (a **30%** base chance to Block) and `Reckoning`'s block-triggered proc.
2. `Precision`, 3 points — +3% hit
3. `Anticipation`, 2 points
4. The eleventh point is either **`Shield Specialization`** or **`Improved Seal of Fury`**
Named alternatives for that last point: `Improved Righteous Fury` for damage reduction, or `Sacred Duty` for stamina. If you do not want the hit, max `Anticipation` instead of `Precision`.
**Wowhead currently recommends this Retribution dip outright**, not as a fallback: `Holy Conduit` and `Benediction` give more mana retention right now than `Improved Seal of Fury` does. Part of that gap is a live bug, [[Seal of Fury]] is granting its `Improved Seal of Fury` mana return even on builds that never talented it, so Wowhead expects the two routes to even out once that is fixed and more `Shield Specialization` ranks unlock at 30. It trades durability for uptime, and no exact point total is published for it.
**Level 30: 0/21/0 — our own extension, not a published build**, reaching `Reckoning`: `Redoubt` 5, `Precision` 3, `Anticipation` 4, `Improved Seal of Fury` 1, `Improved Righteous Fury` 3, `Swift Judgement` 1, `One-Handed Weapon Specialization` 3, `Reckoning` 1.
## Rotation
**Multi-target is the default here**, which is unusual for a tank.
1. **[[Righteous Fury]]** up at all times
2. **[[Seal of Fury]]** maintained, it is both the absorb and the taunt enabler
3. **[[Consecration]]** as often as mana allows
4. **[[Judgement]]**, damage, and **your taunt** while Seal of Fury is up. Hold it when you expect to lose something
5. **[[Holy Strike]]** on cooldown
6. **[[Exorcism]]** against Undead and Demons; keep a Blessing and an Aura up
**Single target:** same order, but drop [[Consecration]] to conserve mana.
**Two things that will catch you out.** **Swapping seals removes your taunt.** And `Swift Judgement`, which finishes Judgement's cooldown and makes the next one free, is a **missed-taunt recovery tool, not a damage button.**
## Stat priority
**Spell Power**, then Hit, Stamina, Defense, Armor, Block, Intellect, Strength, Agility.
Spell Power first genuinely is correct here, and the reason is worth stating: in Forever a Paladin's threat *is* Holy damage — [[Seal of Fury]], [[Consecration]] and [[Holy Strike]], all amplified by [[Righteous Fury]], and Seal of Fury's absorb is worth half of that damage again. Take mail over leather where the stats are close, and **carry a shield**, which Seal of Fury's absorb requires.
**[[Righteous Fury]]'s multiplier moved in the September 24 build, and Blizzard's own wording there does not parse.** The note reads *"Righteous Fury: Holy threat increase increased to 60% (was 90%)"* — 60% is lower than 90%, so the verb and the numbers contradict each other. Both figures are Blizzard's; which way the multiplier actually moved is not something that post settles, so read it as an apparent slip rather than a published buff or nerf. The case for Spell Power is unaffected either way: the amplifier multiplies Holy damage whichever number is live.
**Leave spell power weapons alone below 20.** Wowhead flags a real trap here: a weapon with a heavy spell power roll carries roughly a 25% melee damage penalty, and you do not have the spell-power talents yet to make that trade pay off. A plain melee weapon out-damages it until you hit 20.
## What defines Protection
| Talent or ability | Earliest level | What it does |
| --- | --- | --- |
| **[[Seal of Fury]] + [[Judgement]]** | **10, baseline** | **This is the taunt**, and it is not a talent. The single biggest change to the spec |
| **`Improved Seal of Fury`** | 20 | Returns mana when the Fury absorb is fully consumed, scaling up to 45% by the attacker's level |
| **`Shield Specialization`** | 20 | +10% shield absorb per rank, and a **33% chance per rank for a block to restore 6% of your maximum mana, once every 3 seconds at most** |
| **`Templar's Bulwark`** | 30 | An absorb worth **100% of your max health** for 8 seconds, but it **applies Forbearance**, so it and [[Divine Shield]] are one cooldown, not two |
## What Forever changed for Protection
- **Five new talents:** `Improved Seal of Fury`, `Sacred Duty`, `Swift Judgement`, `Templar's Bulwark`, and `Iron Creed`.
- **`Improved Righteous Fury` is a different talent under the same name**, it now gives −2% damage taken per rank while Righteous Fury is up, where Classic gave threat.
- **`Redoubt` was rewritten** into a proc: a 10% chance on being hit to grant **+4% block per rank (20% at max rank)** for 10 seconds or 5 blocks — cut from +6%/30% at max rank in the October 1 build.
- `Reckoning` now **also procs on a block**, an 8% chance after blocking a melee attack, on top of the 20% chance after a non-periodic critical strike against you. `Anticipation` moved a tier and doubled at max rank to +20 Defense. `Holy Shield` deals 110 damage per block, **now requires `Templar's Bulwark`**, and the October 1 build raised its Block chance to **30%**.
- **`Blessing of Kings` left the tree to become baseline at 20.** `Blessing of Sanctuary` was removed from the class entirely, alongside `Improved Devotion Aura` and `Improved Concentration Aura`.
## At level 60
Unknown, and there is a specific open question: **whether a 4-second conditional taunt can hold a raid boss.** The [[Consecration]] bug Wowhead reported — targets inside the ring not taking its full damage, worst near the edge — is **fixed.** Blizzard's September 24 build repaired Consecration's failure to apply its increased damage effect to some targets, its inconsistent Z axis, and a case where it pulled targets vertically above or below the caster.
