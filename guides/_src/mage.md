Arcane Blast, Hot Streak and Fingers of Frost are new, Molten Armor is not in the game, and Arcane is drawing real criticism on the official forums.
## Talents
**Structure, from client data:** seven rows per tree, **51 points at 60**, 54 Mage talents across 18 Arcane, 17 Fire and 19 Frost. Headline counts: **5 new, 36 changed, 0 removed.** Everything that "went away" was renamed in place.
### The 16-point milestone
All three trees now put a **single-rank ability** in the 16-point row:
| Tree | 11-point | **16-point** |
| --- | --- | --- |
| Arcane | **Arcane Blast**, new | **Missile Barrage**, new |
| Fire | Pyroblast | **Hot Streak**, new |
| Frost | **Ice Lance**, new | **Ice Block**, moved down |
### Arcane
**Arcane Blast** is the new 11-point ability and the spec's defining mechanic: each cast gives **+10% damage to all your *other* spells** while raising Arcane Blast's own mana cost by 175%, stacking four times over 8 seconds. **Missile Barrage** gives Arcane Blast a 40% chance — and Fireball, Frostbolt and Frostfire Bolt a 20% chance — to make your next Arcane Missiles half-channel, free, and fire every 0.5 seconds.
**Arcane Focus was rewritten from resist reduction to +1% hit per rank**, and **nerfed from 10% to 5%**. **Arcane Meditation was hugely buffed** to 51% regeneration while casting at 3 ranks, from 15%. **Arcane Mind** now also gives **+20% Arcane crit damage**. **Arcane Power now requires Presence of Mind** rather than Arcane Instability.
### Fire
**Hot Streak** is new: non-periodic crits with Fireball, Frostfire Bolt, Fire Blast or Scorch grant a stack for 20 seconds, each cutting Pyroblast's cast by 25% — so three stacks takes it from 6 seconds to **1.5**.
**Wake of Fire** replaces Improved Fire Blast and adds a post-kill crit window. **Incineration** was renamed and now covers **Ice Lance and Arcane Blast** as well as Fire Blast and Scorch — genuinely cross-school. **Pyroblast was nerfed** at the base. **Combustion now needs 4 non-periodic crits** rather than 3.
### Frost
**Ice Lance** is new at 11 points: instant, no cooldown, **+300% against Frozen targets**. **Fingers of Frost** is new at 20: chill effects have up to a 30% chance to make your next two spells treat the target as **Frozen**.
**Elemental Precision was rewritten to +1% hit per rank** across Frost **and Fire**. **Shatter was compressed from 5 ranks to 3 at the same 50% ceiling** and **no longer requires Improved Frost Nova**. **Winter's Chill collapsed from 5 stacks to 1** and now feeds only Frostbolt and Ice Lance — which removes the classic ramp entirely.
### Cooldown Manager
Mage is one of five classes with it, and the reason is concrete rather than flavour: **all three new Mage mechanics are stacking proc buffs with hidden timers.** Blizzard shipped a first-party proc tracker for exactly the classes it gave proc windows to. Two Mage-relevant gaps remain open — **Arcane Blast cannot be tracked**, and Mana Gem needs another cast before its cooldown starts. It also does not yet support spell ranks, which matters for a class that downranks Frostbolt to kite.
## Spellbook
60 Mage spells — **4 new, 19 changed, 1 removed**.
**New: Frostfire Bolt** at 40, three ranks. Rank 3 does 270–314 damage with a 40% slow and a DoT, and the key clause is *"checked against the lower of the target's Frost and Fire resists and counts as both Frost and Fire damage."* Also new: Teleport: Dalaran, and two spells for a new "Comprehension" school — **Comprehend Scroll** and **Study**, the latter requiring "a suitable library".
**Removed: Detect Magic** — the only Mage spell not in Forever.
**Molten Armor does not exist in Forever.** Confirmed by its absence from a complete client-derived spellbook. The armours are Frost Armor, Ice Armor and **Mage Armor**, which was buffed to **50% mana regeneration while casting** from 30%.
| Spell | Forever | Classic |
| --- | --- | --- |
| Fireball r12 | **425–541** + 60 DoT | 596–760 + 76 |
| Frostbolt r11 | **457–493** | 515–555 |
| Scorch r7 | **163–193** | 233–275 |
| Pyroblast r8 | **520–646** + 212 | 716–890 + 268 |
| Cone of Cold r5 | **325–355, −40% for 6s** | 335–365, −50% for 8s |
| Arcane Intellect r5 | **1 hour** | 30 min |
| Dampen / Amplify Magic | **substantially buffed** | — |
**Explicitly unchanged:** Polymorph, **Counterspell** (still "generates a high amount of threat"), **Evocation**, Mana Shield, Presence of Mind, **Arcane Power**, Combustion, Blink, Ice Block, all conjures, all teleports and portals.
**Cast times, mana costs and cooldowns are largely absent from the client data.** The "Arcane Blast is a 2.5-second cast" figure circulating is a **player's forum assertion**, not client data.
## Rotation
**Arcane at 20:** open with Frostbolt for the slow and a Missile Barrage roll, then **Arcane Blast ×4 into Arcane Missiles** — dumping immediately on any Barrage proc, and dropping the stack early if Arcane Missiles will finish the mob, because Blast's cost escalates 175% per stack. Fire Blast and Presence of Mind are the *only* movement damage, since Arcane has no DoTs.
**Fire at 20:** open **Pyroblast** for the DoT, Fire Blast if Wake of Fire is up, then Fireball.
**Frost at 20:** **spam Frostbolt, Ice Lance on Frozen.** Two details worth keeping: **do not clip a Frostbolt to cast Ice Lance** — finish the cast and queue it; and **Ice Lance snapshots the target's Frozen status**, so it pays full bonus damage even if the freeze breaks first.
**At 60**, inference: **Arcane** is Arcane Blast ×n into Arcane Missiles, where n is mana-solved rather than fixed at 4. **Fire** banks three Hot Streak stacks for a 1.5-second Pyroblast — and **Frostfire Bolt may beat Fireball outright** as the filler, because it picks up Frost talents, Fireball lost scaling talents, and it sidesteps Fire-resistant bosses by resolving to the lower resist. That is the single most consequential untested claim about Forever Mage. **Frost** is Frostbolt with Ice Lance on every freeze source.
## Stats
**Published spell miss: 3% against an equal-level target, 16% against a raid boss.**
**On the hit cap, the honest answer is that there isn't a published one — and the vanilla 16-versus-6 argument is resolved not by a number but by a rewrite.** Arcane Focus and Elemental Precision were both **rewritten from "reduces the chance the opponent resists" to "improves your chance to hit"**, which is precisely the ambiguity the old theory fight was about. Both now give 1% per rank to 5%, both are **nerfed**, and neither covers all three schools.
**The actually-big deal: because hit is one stat, every melee and ranged hit item in the game is now Mage hit gear.** The old problem of a tiny spell-hit item pool is structurally gone.
A hard blocker from the beta itself: **there is no way to check how much spell hit your character currently has.** The cap cannot be found empirically yet.
**Other stats.** Spell crits deal **+50%** where melee deal +100%; Intellect gives casters 1% spell crit per 54–60 points. **Resistance caps at 75% at 315.** **Spell coefficients** are 80–100% on long-cast nukes and about 15% on instants and AoE — and ranks learned before level 20 have worse coefficients, so **avoid downranking below rank 20**.
**Arcane Subtlety now reduces target resistance by about 15 to *all* your spells**, which is the real reason to take it rather than the threat cut.
Published priorities, explicitly provisional: Spell Power first for all three, then **Hit**, with haste and crit ordered differently per spec. One independent read rates **Spirit above MP5** for Mage, because Mage Armor at 50% and Arcane Meditation at 51% now carry Spirit regeneration through casting.
## Race
**Orc Mage is new.** So is **Skyborne Mage — Alliance only**, since the Horde half of the race gets Shaman instead. Skyborne racials are **Walk on Air**, **Wind Blessed** (+1% haste), **Elemental Insight** (+5% versus Elementals) and **Read Ley Line**, which restores health and mana but **cannot be used in combat**.
**Do Skyborne favour Mage? The verdict is no** — *"one of the weaker races in the game, with nearly all other races having better passive and activated racials."* The Mage-flavoured racial does nothing in a raid; the actual contribution is 1% haste and a situational 5%. Skyborne also **requires a paid pack**.
**Gnome is the strongest Alliance pick** on **Eureka!**, a genuinely new damage cooldown. **Human's +2% crit is only live if you wield a sword**, and Mage sword skill must be trained. **Orc's Axe Specialization is dead weight — Mages cannot equip axes.** **Troll's Beast Slaying** is what edges Troll over Orc in dungeons. **Dwarf Mage still does not exist**, despite the long-standing request.
## Tuning and sentiment
**Four Mage changes on 24 September, and nothing since:** Wake of Fire's buff duration 20 → 30 seconds, Hot Streak 15 → 20 seconds, **Arcane Missiles no longer checks line of sight per missile**, and **Ignite no longer double dips on percentage damage modifiers** — the only Mage nerf. Note that at least one major guide still lists the pre-buff durations despite a later timestamp; **the client data is correct**.
**Fire and Frost are well received. Arcane draws the real criticism**, on the official forums, and the core complaint is precise: **Arcane Blast does not increase its own damage, which feels bad to play** — the buff is +10% to *other* spells only while its own cost climbs 175% a stack. A second thread argues the spec is down to two rotational buttons against Blizzard's stated 3-to-5-button goal. **No blue reply on either.**
**Does "spellcasters ignore threat" still hold? No — and Blizzard said so directly:** *"damage dealers still need to respect Threat, focus targets carefully, and use area damage only when it is safe."* The client backs the intent: Mage carries **three separate 30% threat reductions**, one per tree, none removed as vestigial, and Counterspell still reads "generates a high amount of threat".
## Still unknown
The actual hit cap, and whether the innate 1% miss survives. Cast times and mana costs for the three new spells. **Haste's interaction with Missile Barrage's 0.5-second missile cadence**, flagged as unknown by the source that raised it. Whether Frostfire Bolt displaces Fireball. And **Improved Blizzard's exact slow**, where the per-rank text and the summary disagree by 5%.
