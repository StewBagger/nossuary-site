Skyborne can be Druids on either faction — the only new path into the class in the patch. And bear lost something structural that has not been noticed loudly enough.
## Starting out
A druid is four classes sharing one character. Out of form you are a caster: ranged damage at distance, or healing. Shift into bear and you are a tank with high health and thick hide. Shift into cat and you are a stealthy melee attacker built on quick strikes. Later forms handle travel and water. No other class in the game covers this much ground.
The flexibility is real and it is also the trap. A druid who picks a lane — tanking, healing, damage — and spends talents on it performs perfectly well. A druid who tries to be all four at once is worse at each of them than a specialist and often out of mana besides. Forms are not four full characters; they are one character's worth of power pointed in different directions.
Honestly, the first levels are odd. You begin with no forms at all, casting spells like a weaker mage, and the class only becomes recognisable once bear arrives and then cat. Expect a stretch of levelling where you are not quite sure what you are. After that it clicks, and it clicks hard: a druid can solo comfortably, switch roles when a group needs it, and rarely finds itself useless.
### What the specs do
| Spec | Role | In one line |
| --- | --- | --- |
| Balance | Ranged DPS | Casts spell damage from distance, out of any animal form. |
| Feral (bear) | Tank | High health and heavy hide; holds the monsters' attention in melee. |
| Feral (cat) | Melee DPS | Stealth, positioning and quick strikes built into a finishing move. |
| Restoration | Healer | Keeps the group up, largely through healing that ticks over time. |
Bear and cat are two uses of one talent tree, so a feral druid can tank a dungeon and deal damage in the next one without changing anything but which form they shift into. Changing *tree* means paying a trainer to reset your talents. If you have not grouped before: the tank keeps the monsters hitting it, the healer keeps the tank alive, and the DPS players kill things. The useful thing about a druid is that you can be asked to change which of those you are doing halfway through an evening, and say yes.
### Your resource
You have three, and they do not talk to each other.
Out of form you use **mana**: starts full, drains as you cast, refills by drinking. In **bear** you use **rage**: starts empty, fills as you fight and get hit, drains away out of combat. In **cat** you use **energy**: a small bar that refills steadily on its own, whether you are fighting or not — so cat is never starved, only paced. Cat also builds **combo points** on the target as you use your basic attacks; those points are fuel for a finisher, and they are lost if you change target or leave combat without spending them.
The trap is mana. Shifting into a form does not carry your mana with it in any useful way, and you cannot eat or drink while shifted, so the mana bar you left at 20% is the one you come back to. A druid who levels entirely in cat form, kills something, and then needs a heal discovers there is nothing to heal with. The habit: watch your mana before you shift, not after, and drink to full while you are already out of form. Shifting also costs mana each time, so flipping in and out repeatedly is expensive in itself.
### Your first twenty levels
- **Wrath** — your basic ranged attack while you are still form-less. **Moonfire** — instant, so it works while moving, and it leaves damage burning. Your opener.
- **Rejuvenation** — healing that ticks over time. Cast it and keep fighting; this is the efficient way to heal yourself. **Healing Touch** — the large, slow heal, for when a tick-over-time is not enough.
- **Mark of the Wild** — a long buff for you and everyone near you. The most forgotten button in the class. Also **Thorns**, which hurts whatever hits you.
- **Entangling Roots** — pins something in place. Good for escaping and for splitting a pair of monsters.
- **Bear Form** — arrives around level ten and changes the class. **Maul** is your rage dump, **Growl** takes a monster's attention back, and the bear's roar weakens everything nearby.
- **Cat Form** — arrives around level twenty. **Claw** and **Rake** build combo points, and a finisher spends them. Cat also brings stealth, which lets you pick which fight you take.
- **Aquatic Form** and later **Travel Form** — not combat abilities, but they will save you hours.
### Common beginner mistakes
- Shifting into cat or bear on low mana, then needing a heal you cannot afford to cast.
- Shifting back and forth repeatedly during one fight. Each shift costs mana and abandons the rage or energy you had built.
- Fighting without **Mark of the Wild** up. It is a long buff, which is exactly why people forget it has expired.
- Using **Growl** when somebody else is tanking, and pulling the monster onto yourself.
- Attacking a monster from the front in cat form. Some of your best attacks require standing behind it, and from the front it can parry and block.
- Ending a fight with a full set of combo points unspent, or building points and then switching to a different target.
- Trying to tank, heal and deal damage in the same dungeon. Decide what you are for that run and tell the group.
*Everything from here on is for players who have played WoW before: what Forever changed against the original game, and how well each claim is sourced.*
## Bear tanking
Bear is one of three tanks. Two of the three biggest questions about it resolve **against** bear, and Blizzard has answered neither.
### Forever deleted bear's threat talent
Classic's Feral Instinct read *"increases threat caused in Bear and Dire Bear Form by 3% per rank"* plus Swipe damage. Forever's Feral Instinct reads *"increases damage done by your Swipe ability by 10/20/30% and reduces the chance enemies have to detect you while Prowling."* **The threat component is gone**, and this is client-diff evidence, not inference.
**There is no Defiance equivalent anywhere in the 19-talent Feral tree** — the only talents mentioning threat are threat *reduction*. Meanwhile **both other tanks kept theirs**: Warrior has Defiance, Paladin has Righteous Fury.
Bear Form's tooltip contains no threat clause at all, the same as Classic's did while carrying a hidden 1.3×, so the tooltip settles nothing. **The best number anyone has is one beta tester with a threat meter** reporting *"bears have an inherent +50% threat gen multiplier... This info is just not stated explicitly anywhere at all and its really lame that i had to use a threat meter to figure this out."* Others in the same threads insist there is no modifier, or claim 30%. A player asked Blizzard directly for the coefficients and **got no answer**.
**Bear's only documented threat bonus is on Lacerate** — "causes a high amount of threat" — which is a **trained ability from level 42**, untestable in a level-20 beta. That is also the best explanation for why beta bears feel broken.
### Growl
**Growl is now an 8-second cooldown**, down from 10 — the only recorded change, and Warrior's Taunt moved to 8 too. If you have seen Growl described as increasing threat by 800% for 6 seconds, discard it; that is later-expansion text appearing nowhere in Forever's data. **Challenging Roar is unchanged**, including its 10-minute cooldown.
**Whether hit improves Growl is unconfirmed, and it matters enormously.** Blizzard confirmed unified hit helps taunts — but the sentence names *"Warriors, Hunters, and Rogues"* and **omits Druids**. Taunts can definitely miss in Forever; Blizzard built a Paladin talent specifically so "a missed taunt does not end the moment". **This is the difference between bear's taunt being reliable and being a coin flip in raid gear.**
### Uncrittable: bear appears to have no route
Defense is a skill, base 5 × level, so 300 at 60. **The 425-versus-440 disagreement is not about the game** — it is one formula fed two different assumed boss crit values: 5% gives 425, 5.6% gives 440. Neither is verifiable with no level-60 bosses in existence.
But the deeper problem is the route, not the number:
- **Thick Hide is explicitly not crit immunity** — said twice by the most careful source.
- **There is no Survival-of-the-Fittest equivalent** in the Feral tree.
- Bear **cannot block or parry**, so two of Defense's five returns are dead stats for it.
- **Whether leather gear can even carry Defense is unconfirmed** — one guide's feral stat list omits Defense entirely, another ranks it *first* without saying how a bear acquires it.
The strongest available summary: feral tank *"remains the only tank with no easy way of removing Critical Strikes and Crushing Blows from enemies."*
### Rage
**Bear rage was normalized like Warrior's** — player-measured, not officially documented, and there is not one blue reply in any bear thread. The measurement: *"normalized by the attack speed of the bear (2.5) so you only get **7 rage per swing**, and **no extra rage if your attack crits**."* Structurally corroborated by a confirmed mechanic: bear and cat auto-attacks run at **fixed speeds** with weapon DPS carried over.
Two live contradictions. **Blood Frenzy's tooltip** still says it gives 5 extra rage on a crit in bear form — and the tester reports it does not pay out. And **rage from damage taken** is disputed: one guide says you build rage by taking damage, while beta bears report *"taking damage doesn't seem to give me rage, only my own auto attacks."*
**Every one of bear's rage tools sits above the beta cap.** The comparison testers keep drawing: *"Warriors, every time you block? 5 rage. Every time you parry or dodge? 5 rage. Bears get nothing and they don't have Revenge."*
### Armor
Multipliers are **unchanged** — Bear +180% of item armor, Dire Bear **+360%**, not the 450% often quoted. Bear Form's only change is flat health, from +20 to **+180**.
**One open Blizzard-acknowledged bug inflates every bear measurement in the beta:** *"armor bonuses from consumables and buffs are multiplied by Bear Form armor bonuses."* Elixir of Minor Defense gives **140 armor in bear form versus 50** in humanoid. **Any buffed beta bear armor figure is unusable.**
### Crushing blows
**We will not assert either way.** The entire evidentiary record is one clause on a page that is demonstrably stale elsewhere, about content forty levels above the cap. Against it: the term appears in **none** of the dev notes, the Known Issues list, or the stats guide that documents Armor, Defense, Block, Dodge, Parry and Resistances. And the sharpest signal — Blizzard's Known Issues gives **glancing blows five separate bullets**, so the attack table is being actively tuned at build level, **and crushing blows are never named in it.**
## Talents
| Tree | 11 | **16** | 21 | 31 |
| --- | --- | --- | --- | --- |
| Balance | Nature's Splendor | **Insect Swarm**, from Resto | Nature's Grace | Moonkin Form |
| Feral | Feral Charge | **Primal Bite** | Leader of the Pack | **Berserk** |
| Restoration | Gift of the Earthmother | **Swiftmend**, demoted | Nature's Swiftness | **Wild Growth** |
**Berserk** is the new Feral capstone, 3-minute cooldown, 15 seconds: *"Causes your Primal Bite ability to strike up to 3 targets, removes its cooldown, and increases the critical strike chance of your Combo Point-generating abilities by 100%. Clears and grants immunity to Fear effects."* Note the asymmetry — **the +100% crit applies to combo-point generators, so Cat only.** Bear gets the three-target Primal Bite and nothing else.
**Mangle was renamed Primal Bite and lost its signature debuff** — confirmed by Blizzard directly. **Primal Fury was renamed Blood Frenzy.**
**New in Feral:** Feral Swiftness (**+4% dodge in all forms**), Predatory Instincts, King of the Jungle, **Natural Reaction** (5 rage on dodge), **Rend and Tear** (+10% melee ability damage on bleeding targets). **Furor was reworked to kill powershifting**, though the bear effect remains.
**Balance** gained **Eclipse** — which is **not** the Wrath-expansion Eclipse. It is a cast-time accelerator: *"Your Wrath spell reduces the cast time of your next 2 Starfire spells."* Passive, no crit requirement, no reverse effect. **Nature's Grasp and Omen of Clarity both left the tree by becoming baseline.** Moonkin Form now grants **all** crit and only blocks *healing* spells.
**Restoration** gained **Wild Growth**, and **Swiftmend was demoted to the 16-point slot and buffed — it no longer consumes the HoT it fires from.** **Improved Mark of the Wild went baseline**, named by Blizzard directly.
## Abilities
Base spell damage was cut hard and coefficients raised enormously: **Wrath rank 8 went from 236–264 base to 86–96, while its spell power bonus went from 12.3% to 42.9%.** Forever druid casting is a spell-power game now.
| Ability | Forever | Classic |
| --- | --- | --- |
| **Growl** | **8 sec cooldown** | 10 sec |
| **Lacerate** | **new**, from L42, stacks 5, **high threat** | absent |
| Maul / Swipe / Bash / Challenging Roar | **unchanged** | — |
| **Frenzied Regeneration** | rage to **1% max health per point** | 10 flat health |
| **Enrage** | **instantly generates 10 rage** plus 20 over 10s | 20 over 10s |
| Bear Form | **+180 health** | +20 |
| Cat Form | **+12 AP** plus Agility | +40 AP |
| **Tiger's Fury** | **no energy cost**, **+15% physical damage** | 30 energy, +10 flat |
| **Faerie Fire** | **usable in Cat and Bear forms** | form-locked |
| **Hurricane** | **cooldown removed** | 1 min |
| **Barkskin** | **costs nothing** | 15% base mana |
**Bear and Cat Form are now unlocked by class quests** at 10 and 20, and **consumables are usable while shapeshifted** — a tanking bear can drink a rage potion.
## Rotation
**At 20, bear:** build rage from auto-attacks, **Enrage** on cooldown for 30 rage, spend on **Maul** single-target or **Swipe** on three or more, **Faerie Fire** for the armor debuff. Shift out to heal yourself, and note you regenerate mana in bear form. Testers add two pre-pull threat tricks: **Moonfire before shifting**, and **self-Regrowth for heal aggro**.
**At 20, cat:** Claw to five combo points, spend on Rip. That is the whole rotation.
**At 60, bear becomes a Lacerate-maintenance tank**: stack Lacerate to five since it is the only high-threat tool, keep Demoralizing Roar and Faerie Fire up, Primal Bite on cooldown, Maul as the rage dump. **Rend and Tear makes Lacerate uptime load-bearing for damage as well as threat.**
## Stats
| Role | Priority |
| --- | --- |
| **Feral, bear and cat** | **Weapon DPS**, Hit and Expertise, Crit, **Strength**, Agility, Stamina |
| **Restoration** | Item level, **Healing Power**, Intellect, Spirit, Crit, Haste |
| **Balance** | Item level, **Spell Power**, Intellect, Haste, Crit, Spirit |
**Weapon DPS is the top stat for both bear and cat**, because weapon damage applies in form — and **weapon speed is irrelevant**, because form attack speeds are fixed. **Agility gives attack power in cat form only; bear gets none**, so bears stack Strength.
One correction to a common lead: **there is no Feral attack power stat in Forever.** Weapon damage applies directly in form instead, and Cat Form's base AP was cut from 40 to 12 — which removed the reason Feral AP existed.
**A live tuning question:** because Thorns now scales dynamically with spell power and bear's physical output is weak, testers report that *"stacking pure spellpower for a buffed thorns does more damage/threat then a top geared druid."* That is player observation, but it is a predictable consequence of a confirmed change — and it means the published feral priority, which ranks spell power *last*, predates the change that may invert it.
**Haste does not affect HoT tick rate**, so there are no HoT breakpoints.
## Race
**Druid is Night Elf, Tauren, and Skyborne** — and Skyborne is the unusual part, because it is **neutral**: you pick Windshaper for Horde or High Order for Alliance at creation, and Druid is available either way. Blizzard confirms there are **new Skyborne druid forms created specifically for the race**, though no description of them has ever been published. Two practical notes: **Skyborne require a purchase**, and community reception of their racials is poor.
| Race | What matters |
| --- | --- |
| **Night Elf** | **Elune's Light** (+10% crit, 15s), Shadowmeld, **Quickness** (+1% dodge, +2% run speed) |
| **Tauren** | **Endurance: +5% health *and* +1% hit.** War Stomp, plus new **Plainsrunning** |
| **Skyborne** | **Wind Blessed** +1% haste, **Elemental Insight** +5% vs Elementals, **Walk on Air** |
**A Tauren feral bug worth knowing:** a tester reports **Cat Form loses the 5% health portion of Endurance entirely**, while Bear Form applies it to the whole post-Bear pool. At level 20 with no gear: caster 423 HP, bear 633, **cat 406**.
**None of the six new Classic race/class combos is a Druid**, which is what makes Skyborne Druid the only new path into the class.
## Sentiment, and the disclaimer that goes with it
**Bear feedback is consistently negative across at least eight threads**, clustering on two mechanics rather than on power. Rage starvation: *"I cannot generate enough rage to hold threat on mobs regardless of if it's 1 target or 3+... I'm in full blue gear and I can't hold aggro vs DPS classes."* And a DPS player's view, which is the most telling: *"As a DPS I find myself having to sit there waiting for bears to establish threat a lot more than other tanks."*
**Now the disclaimer, which experienced beta posters make themselves.** Every tank comparison today comes from a level-20 beta with no raids and no level-60 gear, and **bear's rage talents, Lacerate, Dire Bear, Barkskin and Berserk are all above the cap** — which is a sufficient explanation for most of the complaints on its own. One poster put it directly: *"the level cap realistically disallows any meaningful feedback on this topic."* Warriors are just as unhappy, and every Forever tank tier list in existence is worthless as a prediction.
**What is *not* level-gated, and is therefore the real signal, is the pair of structural findings above:** bear is the only tank with no flat-percentage threat talent, and Forever actively deleted the one vanilla gave it; and bear has no identified route to crit immunity. **Neither has a Blizzard response.**
## Still unknown
Whether bear form carries any threat multiplier at all. **Whether Growl can miss and whether hit improves it.** Growl's range and duration, stated nowhere. **Whether leather gear can carry Defense** — the pivotal question for bear crit immunity. Whether crushing blows exist. Bear's rage formula officially. Whether Blood Frenzy's crit-rage pays out. And **what the Skyborne druid forms actually look like**, which Blizzard confirmed exist and has never shown.
