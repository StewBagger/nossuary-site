Rage is normalized to weapon speed, critical hits no longer feed it, and Devastate does not exist. Protection was rebuilt around rage-on-avoidance and still runs dry.
## The seven things that break your muscle memory
1. **Devastate does not exist.** The client holds 42 warrior spells and it is not among them. **Sunder Armor is the ability**, and Blizzard corrected its threat on all ranks on 24 September, adding Attack Power scaling. Vanilla's flat 301 threat is dead; the replacement is unpublished.
2. **Never take the shield off.** Four things die with it — Defiance's threat, Bastion's damage, Master of Defense's rage, Shield Specialization's rage. Vanilla two-hand and dual-wield threat tanking is gone by design, and nothing warns you.
3. **Rage is normalized to weapon speed.** The coefficients, from the simulator's source: **weapon speed × 3.46 one-handed, × 4.50 two-handed, × 1.73 off-hand.** Damage dealt is not a term. **Only white auto-attacks generate rage** — yellow specials generate none, so Heroic Strike and Cleave are net rage *losses*. There is no crit branch at all.
4. **Improved Revenge no longer stuns.** Concussion Blow carries that now.
5. **Shield Block covers two attacks over seven seconds** on a five-second cooldown.
6. **The major cooldowns no longer share a lockout — but only two of three got shorter.** Retaliation and Shield Wall dropped to 15 minutes. **Recklessness is still 30**, and since crits no longer make rage it no longer feeds your rotation either.
7. **Hit improves Taunt reliability**, so hit is worth more to a Forever tank than a vanilla one, while weapon skill is worth much less.
One widely-repeated claim is wrong: **rage from taking damage was not removed.** It was reformulated on pre-armor damage and heavily reduced. A developer said so directly: *"Warrior DOES get Rage when being struck in both PvP and PvE."*
## Protection
### The tree
| Talent | Max | Effect | Change |
| --- | --- | --- | --- |
| Shield Specialization | 5 | +5% block, **5 rage on block** | was 1 rage |
| Anticipation | 5 | **+20 Defense skill** | was +10 |
| **Master of Defense** | 2 | **5 rage on dodge or parry** | **new** |
| Improved Revenge | 3 | +60% damage | stun removed |
| Defiance | 3 | **+15% threat**, shield required | 3 points not 5 |
| **Vanguard** | 1 | Charge in Defensive Stance | **new** |
| Improved Shield Wall | 2 | **cooldown −11 min** | was +duration |
| **Focused Rage** | 3 | offensive abilities −3 rage | **new** |
| Bastion | 5 | +10% damage with a shield | reworked 1H Spec |
Gone: Improved Taunt, Improved Shield Block, One-Handed Weapon Specialization, and Iron Will, which moved to Fury.
**Two staleness traps.** A talent called **Vitality was deleted on 17 September** with no patch note, so any build recommending it predates that. And Blizzard swapped **Bastion and Focused Rage** on 24 September so Focused Rage comes first — several calculators have not caught up.
**Tactical Mastery is now a baseline spell at level 14**, retaining 10 rage through a stance change. The Arms talent became Improved Tactical Mastery, taking you to 25 — vanilla's talented value, now free.
### Threat
Defensive Stance's +30% and Defiance's +15% multiply to roughly **1.495×**. **Per-ability threat coefficients are unpublished and the vanilla table is known wrong**, since Sunder's flat 301 was replaced with an AP-scaling value Blizzard did not disclose. Community measurement puts Revenge at base damage plus 25% of melee attack power.
**You have no external threat help at all.** Forever added no Misdirection analogue, which is presumably why Sunder and Revenge gained AP scaling. The 110% and 130% aggro thresholds are a vanilla assumption — no Forever source states them.
### Stats
| Stat | Forever |
| --- | --- |
| Melee miss | 5% equal level, **9% vs raid bosses** |
| Armor cap | 75% at about 17,265 |
| Strength | 2 attack power, **1 block value per 20** |
| Parry haste | **still 40%** — still a spike risk |
| Resistance cap | 75% at 315 |
**Uncrittable: sources disagree, and the disagreement is not about the game.** It is one formula fed two different assumed boss crit values — 5% gives 425 Defense, 5.6% gives 440. Neither is testable with no level-60 bosses in existence.
**Crushing blows are genuinely undocumented.** Not confirmed present, not confirmed removed. Blizzard's Known Issues list gives *glancing* blows five separate bullets and never once names crushing.
### Gear
**Classic gear lists cannot be used** — dungeon loot and item stats were rewritten wholesale. Neck and off-hand are newly enchantable, and the new defensive options are **Superior Deflection** (+9 Defense skill on bracers), Deflection on the neck, Absorption on the chest and Recovery on the weapon. There are no new shield enchants.
**Healing Potions moved from Alchemy to First Aid**, which takes First Aid from optional to near-mandatory. **Elixir of the Phalanx** (+400 health, +500 armor) is the new tank elixir.
The crafted set, **Battleplate of Glory**, is **raid-gated rather than pre-raid** — it needs a reagent from disenchanting raid drops — and you can equip only one piece at launch, so no set bonus is reachable initially.
## Arms and Fury
**Does normalization favour two-handers?** Per swing-second yes, 4.50 against 3.46, and Unbridled Wrath compounds it with 2 rage per proc versus 1. Fury is subtler: the off-hand pays half, but **Dual Wield Specialization 5/5 grants +100% off-hand rage generation**, restoring it to 3.46. The catch is the **flat +19% dual-wield white miss penalty**, and misses pay nothing. Fury is not starved by design — it is starved by variance and hit.
**Weaponmaster replaces all four weapon specializations.** Axe and polearm give +5% crit, mace and staff ignore 15% armor, sword gives a 5% chance of an extra attack. A gotcha from the implementation: the crit and armor branches test your **main hand only**, while the sword branch matches **either hand**.
**Bloodthrill** is the new 21-point Arms talent and the most interesting thing in the tree: main-hand attacks against an enemy **afflicted by your Rend** have a 20% chance to enable Overpower for 6 seconds. In vanilla, Overpower in PvE is nearly dead because bosses rarely dodge. The cost is that it **binds Arms to Rend uptime**, which vanilla Arms raiders skipped.
**Slam has a cooldown now**, raised to 18 seconds on 24 September — with **Improved Slam given a −1.5/3 second reduction** in the same build as compensation, which most write-ups have missed.
**Fury:** Enrage was rewritten to a flat 30% chance after any damaging attack. Flurry was nerfed to 25% and now requires Enrage 5/5. **Bloodthirst lost its self-heal entirely.** **Raging Blows** makes Whirlwind strike with your off-hand and, with Improved Cleave, takes Cleave from 20 rage to 15. Two compensations are broken or worthless: **Unbridled Wrath is bugged**, measured at 7.5% per point against a 12% tooltip, and **Boundless Rage is close to dead** — a bigger bucket is no use when the tap is a trickle.
### The level-60 rotation, and what is missing from it
The simulator ships level-60 priority lists: Sunder to one stack, cooldowns, Whirlwind above one target, Execute below 20%, Mortal Strike, Spearing Strike, Bloodthirst, Whirlwind as filler, **Heroic Strike only at 40+ rage**, and **Hamstring as an overflow dump above 80**.
Read what is absent. **Slam is not in it at all.** **Rend is not either**, which means a sim-optimal Arms build leaves Bloodthrill unfed — a live tension nobody has resolved. And Heroic Strike behind a 40-rage gate **is what rage starvation looks like expressed as code**.
## Sentiment
Uniformly negative and specifically about rage, at real volume — one thread has 597 posts, another 145, another 132, with **zero staff replies in any of them**. The sharpest technical case is that Fury may be unplayable at 60: one tester's model puts throughput at 480–513 rage per minute against roughly 475 of demand, with **66% of simulated one-minute fights never reaching the 75 rage to press Heroic Strike once**. Take the direction, not the decimals.
**Blizzard has never documented rage normalization anywhere.** The defining change to the class shipped undocumented, and that is itself the story. The much-quoted "not a bug" ruling is real text — but it sits on a **community-run bug tracker**, not a Blizzard forum, from an account whose employer and title are a fansite's attribution. Do not read it as a statement from Blizzard.
## Still unknown
Per-ability threat coefficients. Whether uncrittable is 425 or 440. Whether crushing blows exist. Whether Blizzard considers rage normalization final. Any published hit cap — 9% is the community's working assumption and matches the simulator's 8% base miss plus 1% suppression, but Blizzard has published nothing.
