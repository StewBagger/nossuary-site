Damage curses became Banes, so you finally hold one of each — and the debuff cap, the question everyone asks, has no answer from Blizzard at all.
## Starting out
Warlock is a cloth caster that fights alongside a summoned demon and kills things slowly and inevitably. Where a Mage removes an enemy in a few seconds, a Warlock puts three or four rotting effects on it, steps back, and lets them run. Very little dies quickly to you. Almost everything dies eventually, including things several levels above you, which is why Warlock is generally the strongest caster to level on your own.
The class also trades its own health for mana. New players read this as a bug or a trap; it is the engine the whole class runs on. Your health bar is a second mana bar, and learning to spend it without killing yourself is most of what separates a competent Warlock from a struggling one.
Warlock suits people who like bookkeeping. At any moment you are tracking several timers on your target, your pet's health and behaviour, your own health, your mana and your stock of soul shards. That is more to hold in your head than any other caster asks for. Be warned that the damage feels underwhelming before you have gear behind it — the class is back-loaded, and the demon does much of the early work.
### What the specs do
| Spec | Role | In one line |
| --- | --- | --- |
| Affliction | Ranged DPS | Damage over time, curses and draining life from a target that is slowly dying. |
| Demonology | Ranged DPS | The pet-focused tree, and the toughest Warlock to kill. |
| Destruction | Ranged DPS | Direct fire and shadow damage, the closest a Warlock gets to a Mage. |
Talents arrive one point per level and your trainer will reset them for a fee, so nothing you choose early is binding. All three trees are ranged damage; Warlock never tanks or heals, though a Voidwalker can hold a monster's attention well enough that solo play feels like having a tank. If you have not grouped before: the tank holds the monster's attention so it hits the person built to survive it, the healer keeps everyone alive, and the DPS kill it. You are DPS, plus a source of crowd control and utility.
### Your resource
You have three resources, and the pet is a fourth thing to manage.
**Mana** is the usual blue bar. Spells cost it, nothing in combat refills it on its own. Out of combat it trickles back from Spirit and refills quickly when you eat or drink, subject to the five-second rule: finishing a cast switches that passive regeneration off for five seconds, so casting back-to-back gives you nearly none of it. Pause, and it resumes.
**Health** is your mana reserve. Life Tap converts a chunk of health directly into mana, at will, in combat. This is why a Warlock rarely needs to sit and drink: you tap, keep casting, and let a drain spell or a healthstone put the health back later. The rule is to tap early and often while you are comfortable, never at low health with an enemy still alive. Warlocks who refuse to tap run dry constantly; Warlocks who tap at twenty percent health die.
**Soul shards** are a consumable currency. You create them with Drain Soul on a dying enemy, and spend them on healthstones, on soulstones, and on summoning your demon after a death. They are earned one at a time and they occupy space, so farm a handful before a dungeon rather than discovering you have none at the door.
The habit that fixes most new Warlocks: tap for mana while you are healthy, not when you are desperate.
### Your first twenty levels
Shadow Bolt is your direct nuke. Corruption and Immolate are your damage-over-time spells, applied first so they tick while you cast something else. Your damage curse is the third timer in that set. Curse of Weakness reduces what the target hits for, which matters when it is hitting you.
Summon Imp comes first: a ranged firebolt, fragile, no use as a shield. Summon Voidwalker arrives a little later and changes how you play, because it holds the monster's attention while you cast from behind it. Health Funnel keeps it alive at the cost of your own health. Demon Skin and its successor are your armour buff.
Life Tap is the button the whole class is built around. Drain Life returns health while damaging. Drain Soul produces your shards. Fear sends an enemy running for a while, which is your escape and your crowd control. Create Healthstone makes a self-heal you should always be carrying.
The forgotten buttons are Life Tap, the healthstone sitting unused in your bag, and telling your pet to attack a specific target rather than whatever it noticed first.
### Common beginner mistakes
- Never using Life Tap, and drinking after every fight like a Mage without conjured water.
- Using Life Tap at low health with the enemy still up.
- Letting the Imp tank. It cannot. Summon the Voidwalker and let it take the hits.
- Applying your whole set of timed effects to a weak enemy that dies in four seconds. That is wasted mana.
- Never making healthstones, or making one and forgetting it exists.
- Fearing an enemy in an open area so it runs into two more and brings them back.
- Arriving at a dungeon with no soul shards and no way to resummon a dead demon.
*Everything from here on is for players who have played WoW before: what Forever changed against the original game, and how well each claim is sourced.*
## The debuff cap
**There is no Blizzard statement, and this was checked rather than assumed.** The forum threads asking directly have **zero blue replies** — the answers in them are literally *"Good questions, answers unknown at this time"*. It is not in the Deep Dive recap, not in the development notes, not in the Known Issues list, and a full-text search for blue posts on debuff limits across the Forever categories returns nothing.
**It also cannot be tested in this beta.** The cap is 20, there are no raid bosses, and raids do not open until 9 December. Nobody can stack 16 debuffs in a way that proves anything.
The fansites split, and the split is informative. **One asserts removal flatly** — *"Forever removes this limit, so we can put up all the DoTs our hearts desire"* — with no source and no test cited; it reads as an inference from Season of Discovery precedent. **Two others decline to say.** One discusses the cap only in past tense; the other frames the Bane/Curse split as *the* fix, which implies debuff competition still exists.
**Verdict: genuinely unresolved, do not plan around a number.** But note the structural clue pointing the other way — Bane of Havoc's tooltip hard-codes *"only one Bane per Warlock can be active on any one target"*, and every Curse keeps *"only one Curse per Warlock"*. **Per-caster debuff rationing is exactly the rule you keep writing if you still care about debuff economy.**
### What Forever did instead, which is arguably better
Warlock damage curses were split out of the Curse category. **Curse of Agony became Bane of Agony and Curse of Doom became Bane of Doom**, and neither is a Curse any more — so **a Warlock holds one Bane and one Curse simultaneously.** Confirmed three ways: a Known Issues line about Banes and Curses mistracking on target re-acquisition, the Orc racial reading *"Shatter Curse: Immunity to Curses and Banes"*, and both independent dataminers.
This is the change that actually unblocks the old problem of cutting DoTs to make room for the raid's curse.
## Base damage was halved and coefficients tripled
This is the biggest shift in the class, and it explains why Warlock "feels bad" at level 20 before gear exists.
| Spell | Forever | Classic | Coefficient |
| --- | --- | --- | --- |
| Shadow Bolt r10 | **253–283** | 482–538 | **.857** above rank 3 |
| Corruption r7 | **438** total | 822 | **.2 per tick, every rank** |
| Bane of Agony r6 | **46**/tick | 87/tick | **.133 every rank** |
| Bane of Doom | **1742** | 3200 | **4.0** — the largest on any Warlock spell |
| Immolate r8 | **158** direct / **275** DoT | 279 / 510 | .2 / .13 |
| **Incinerate**, new | **201–233** at 60, **+25% vs Immolate** | — | .714 |
| Imp Firebolt r7 | **43–48** | 85–96 | — |
Level 20 with about 100 spell power is therefore the worst possible vantage point from which to judge the class.
## Other ability changes
- **DoTs can critically strike**, which reshapes the class — and **Pandemic** exists specifically to scale DoT crit *damage* by up to 100%. DoTs are also **dynamic, not snapshotted**: every tick re-reads your buffs and the target's debuffs.
- **Curse of Shadow was removed entirely.** **Curse of the Elements absorbs it** — at max rank **−75 to all magic resistances and +10% magic damage taken**, covering all six schools in one aura, trained from **level 20** where Classic had it at 32.
- **Curse of Recklessness** is now **−505 armor with the attack-power bonus removed.**
- **Life Tap now scales with Spirit**, which makes **Spirit a real Warlock stat** and makes Human's +5% Spirit feed it directly.
- **Drain Soul generates shards from damage ticks**, not only kills.
- **Shadow and Flame** at 5/5 means **Conflagrate never consumes Immolate.**
- **Firestone and Spellstone are weapon enchants now.** **Spellstone grants +1% spell haste** — a Warlock-accessible haste source in a game where no gear carries haste.
- **Dark Pact was removed**, as talent and as spell.
- **Soul Shards are a Reagent now** with a dedicated bag slot. **They still do not stack**, which is the most-requested quality-of-life fix in the class.
## Talents
18 new, 32 changed, **16 removed**. The 16-point row assignments are derived from tier positions, not stated by any source:
| Milestone | Affliction | Demonology | Destruction |
| --- | --- | --- | --- |
| 11 | Amplify Curse | Demonic Sacrifice | Shadowburn |
| **16** | Curse of Exhaustion | Fel Domination | **Conflagrate**, from tier 7 |
| 21 | Siphon Life | Soul Link | **Bane of Havoc**, new |
| 31 | **Wrack**, new | **Demonic Pact**, new | **Incinerate**, new |
**Suppression was rewritten and is now core for every spec:** +1% hit and −4% threat per rank, so 5/5 gives **+5% hit and −20% threat**, applying to **all** spells. **Ruin** became 5 ranks of 20% with no Devastation prerequisite. **Shadow Mastery was nerfed** from 5×2% to 5×1%. **Master Demonologist was rebuilt** per-demon. **Fel Domination's cooldown went from 15 minutes to 5.**
## Pets
**Pets now scale off your gear and stats.** The best official evidence is the Known Issues list, which says warlock pets do not yet *display* mana scaling from their master, **health scaling from Stamina**, **hit chance from the master's scaling coefficient**, or **Expertise**. Those four lines are Blizzard confirming the inheritance exists. Coefficients are unpublished, and pet base damage was roughly halved to compensate.
**Beta-measured performance**, from about twelve hours hands-on: **Succubus was far the strongest damage pet at 23–25% of total damage.** **Voidwalker generated enormous threat, competing with real tanks.** **Imp was fragile and ran out of mana.**
**Demonic Sacrifice is reversed from vanilla**, confirmed by both dataminers and by Blizzard's own aura IDs: **Imp now gives +15% Shadow** and **Sayaad gives +15% Fire**, with duration extended to **two hours**. So the Destruction-Sacrifice-Ruin build now **sacrifices the Imp**, not the Succubus. It is thematically backwards and the community has noticed.
**Demonic Pact** is the headline Demonology change: your Demonic Sacrifice buff **survives summoning a different demon**, so you can hold +15% Shadow from a sacrificed Imp *and* field a live Sayaad for Master Demonologist. **It is not the later-expansion raid-wide spell-power Demonic Pact** — a common misreading.
**Incubus** is available alongside Succubus, with the talent renamed **Improved Sayaad** to cover both. New **Demonic Energies** makes your spell damage heal the pet, which removes the Health Funnel treadmill.
## Rotation
**At 20, all three specs share an opener:** send the demon in first, apply your Curse — Elements for a caster group, Recklessness for a physical one — then Immolate, Corruption, and Bane of Agony if the target lives long enough. Affliction drains and finishes with Drain Soul for the shard; Demonology adds Life Tap into Demonic Energies; Destruction uses Shadow Bolt as filler and Shadowburn to execute.
**A caveat that invalidates the most-repeated advice.** Those guides tell you to **wand instead of Shadow Bolt**, because wands were scaling with spell power while Shadow Bolt's base damage was halved. Blizzard has since hit wands **twice** — the 24 September build made *"wands no longer gain any additional damage from the user's spell damage"*, and separately acknowledged the 0.5-second wand pre-cast is bugged short with a fix coming. **Treat all "wand beats Shadow Bolt" advice as stale.**
**At 60**, inferred from structure: **Affliction** maintains Corruption, a Bane, Siphon Life and Immolate, holds a group Curse *alongside* the Bane, and fills with drains — Improved Drains and Soul Siphon pay for the channel, and Nightfall procs off **Wrack** for instant bolts. **Demonology** sacrifices the Imp, fields a Sayaad via Demonic Pact, and keeps the pet alive on Demonic Energies. **Destruction** runs Immolate into Conflagrate into Incinerate, with Bane of Havoc for cleave.
One player reports community sims already put Affliction near the bottom, and that *"the best affliction sims are not full affliction builds, they aren't using the new ability wrack because the ability and the dots damage are so low"*. Unverified.
## Stats
**The spell hit cap could not be established and the sources conflict.** The widely-quoted 3% and 16% spell miss figures trace to one fansite's stats guide, **not to Blizzard**. Worse, **that same site contradicts itself**: its stats page says it is *"currently unknown if the innate 1% miss chance remains"*, while its Warlock page says four points of Suppression hit-caps you against same-level targets and bids *"goodbye Classic's 1% inherent miss chance"*. Four points is 4% hit against a stated 3% miss, which does not reconcile either way. **No source states a cap number.**
One officially-acknowledged oddity nobody has explained: the Known Issues list says **"the Glancing Blow chance for casters is incorrect at all levels"**, and what that refers to is documented nowhere.
**Because DoTs can crit, crit is a genuine Affliction stat for the first time.** Pandemic scales the DoT crit damage bonus by up to 100%, and Ruin does the same for Destruction.
The published level-20 priority is **Spell Power, Hit, Intellect, Spirit, Crit, Stamina, Haste**, explicitly provisional — and one major site declines to publish a Warlock stat priority at all.
## Race
**Warlock races: Orc, Troll (new), Undead on Horde; Gnome, Human on Alliance. Skyborne cannot be a Warlock**, and neither can Tauren, Dwarf or Night Elf.
**Blood Fury now scales casters** — "+10% Attack Power **and Spell Power**" — and because DoTs are dynamic rather than snapshotted, **it retroactively boosts DoTs already ticking.** **Shatter Curse** is new, giving Orcs immunity to Curses and Banes. **The Orc pet-damage racial "Command" was removed**, a real Demonology loss. **Human's +2% crit is the largest crit racial but needs a sword**, which now competes against Forever's new caster weapons that grant spell damage. Undead's **Cannibalize restores 35% health *and* mana**, while **Will of the Forsaken no longer grants immunity** — only removal.
Alliance Warlocks are unhappy about a specific asymmetry: Horde gets Shatter Curse *and* Will of the Forsaken, with no Alliance anti-Polymorph equivalent.
## Tuning and sentiment
**Warlock has received almost no tuning.** The 24 September build is the only balance pass and **its entire Warlock section is two lines**: the Life Tap tooltip fix and Voidwalker Sacrifice scaling with spell healing. **No Blizzard developer has replied to any Warlock feedback thread.**
Sentiment is split, **and it splits by level**. The negative case: DoT damage so low that wanding matches it, no Soul Shard quality-of-life, weak in PvP. The positive: *"warlock got like an entire redesign and feels very unique"*, soloing elite mobs, noticeably more durable pets. **The reconciling view is the most common:** *"Affliction seems to have a lot of its damage talents backloaded... Demonology feels weak before Succubus/Demonic Sac. Destruction feels the best but wanding is stronger early."*
Two specific complaints that look like real artefacts of the recoefficient pass: **Shadow Bolt rank 4 is barely better than rank 2 for 3.6× the mana at around 100 spell power**, and **a fully-talented Imp at level 20 loses to sacrificing it and spamming rank-1 Shadow Bolt.**
## Still unknown
The debuff cap. The effective spell hit cap. The 16-point talents by name. Pet scaling coefficients — Blizzard confirmed the inheritance but published no numbers, and the character sheet does not even display them yet. **What "Glancing Blow chance for casters" means.** Whether Touch of the Grave procs from DoT ticks. And the final state of Felsteed and Dreadsteed under the new riding-skill system.
