updated: October 8, 2026
build: 1.60.1.70245
sources: Blizzard — Beta Development Notes, October 1|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-updated-october-1/2360696 ;; Blizzard — Beta Known Issues, October 1|https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-known-issues-october-1/2352687 ;; foreverchanges.pro — beta client data|https://foreverchanges.pro

Herbs, and the only feed for Alchemy. **The herb table is unchanged from Classic.** Six new herbs exist in the client with no published node, only two of which can be gathered at all, and Tauren Cultivation was rewritten from the ground up.
:::scope
Herb list, skill thresholds and camp objects come from foreverchanges.pro's reading of the beta client and are solid. **Professions are capped at skill 225 in the beta.** The zones below are Classic spawn data; Forever's new zones are not counted. The source publishing the client data marks node locations, respawns and required skill as unconfirmed.
:::
## Is Herbalism worth taking?
Alchemy gained 70 new recipes and four new raid flasks, and all of that demand lands on herbs. That makes Herbalism the strongest of the three gathering professions right now *(ours, not a source's)*.
**It earns no Legacy Points.** Only the six crafting professions do.
The camp object is [[Incense Candle]] at skill 20: **25 Intellect** to everyone sitting nearby, which is the figure at level 56 and above. The client scales it by level, so at the beta's level-30 cap the candle gives 12. It does not stack with [[Arcane Intellect]], so it is redundant if you have a Mage. Both readings are the client's; Blizzard publishes no camp-object value and no equivalence to a class buff.
## What it pairs with
Alchemy eats herbs, and **Herbalism is the only profession that gathers them.** Unchanged, and Alchemy has no other feed.
One change for veterans, and this is our own reading rather than a published one: [Merchant's Favor](/guides/wow-forever/professions/merchants-favor/) buys recipes, and you can buy the crates at the auction house. That makes the Herbalism half of the pair more optional than it was.
## Levelling it
1. **1 → 50**: Peacebloom, Silverleaf, Earthroot. Barrens, Durotar, Tirisfal, Elwynn
2. **50 → 100**: Mageroyal, Briarthorn. Barrens, Ashenvale, Darkshore, Westfall
3. **100 → 150**: Bruiseweed, Wild Steelbloom, Kingsblood, Grave Moss, Stranglekelp. Wetlands, Barrens, Stonetalon, Ashenvale
4. **150 → 205**: Liferoot, Fadeleaf, Goldthorn, Khadgar's Whisker. Stranglethorn, Arathi, Alterac, Swamp of Sorrows
5. **205 → 230**: Firebloom, Purple Lotus, Arthas' Tears. Azshara, Tanaris, Western Plaguelands, Searing Gorge
6. **230 → 270**: Sungrass, Blindweed, Ghost Mushroom, Gromsblood, Golden Sansam
7. **270 → 300**: Dreamfoil, Mountain Silversage, Plaguebloom, Icecap
**The skill-up curve is published:** a herb gives a point every time for its first 25 points, then less and less, until it turns grey 100 points past its requirement.
This is the cheapest profession in the game to level, and the only cost is travel *(ours, not a source's)*.
## What Forever changed
- **All 28 herbs are unchanged** and sit at their Classic thresholds. None is flagged as new.
- **Six new herbs exist, and no node location is published for any of them:** `Demonsage`, `Death Lotus`, `Marefoil`, `Stranglevine`, `Rosecap` and `Frilled Lichen`. The client splits them in two. `Demonsage` and `Marefoil` have herb-gathering spells of their own, sitting in the same set as all 28 Classic herbs, so both are picked off a node somewhere. `Death Lotus`, `Stranglevine`, `Rosecap` and `Frilled Lichen` have no gathering spell at all and exist only as items. Death Lotus is a reagent in all four of Alchemy's new raid flasks. These are probably the "Scarce materials" that `Bountiful Harvest` boosts, but that is not confirmed.
- **Tauren `Cultivation` was completely rewritten.** Classic gave a passive +15 Herbalism skill. Forever gives an active: *"Cultivate a nearby herb, growing a duplicate you can harvest without requiring Herbalism skill. Each herb may only be cultivated once."* It has a one-hour cooldown. It was then nerfed on September 24: it now asks for a character level of the herb's skill divided by 5, and level 60 for anything above 300 skill. A veteran Tauren will be wrong about this twice over.
- **Three camp objects**, all new:
  | Skill | Object | What it does |
  | --- | --- | --- |
  | 20 | [[Incense Candle]] | **25 Intellect** nearby at 56 and above, 12 at level 30. Mutually exclusive with [[Arcane Intellect]] |
  | 140 | [[Greenhouse]] | Blueprint. Grows herbs over time from planted seeds |
  | 300 | [[Seed Hybridizer]] | Blueprint. Multiplies seeds, or combines them into rarer tiers |
- **A seed economy now exists**, and it is entirely undocumented. Both higher camp objects reference seeds and rarer tiers; no source, drop table or tier list has been published.
- **Herbs now buy recipes.** *Waylaid Crate: Apprentice Herbs*, for example, asks for 20 Peacebloom, 20 Silverleaf, 10 Earthroot, 10 Mageroyal or 10 Briarthorn. Vanilla's worthless starter herbs now have a guaranteed buyer. The crates are still partly broken in the beta. Blizzard's Known Issues post, last edited October 1, carries *"Waylaid Crates do not function on items with a maximum stack size smaller than the quantity required"*, annotated *"This is fixed in the next Beta build"*. Neither the September 24 nor the October 1 change log carries that fix, so a correct turn-in can still be refused.
- **There is no Herbalism specialisation.** Claims about specialising into rare lotus or extra herbs per node are not in the client data.
## What is not known
Where Demonsage and Marefoil grow, and whether the other four new herbs are gathered at all. What a "Scarce material" is. The entire seed system. Whether Find Herbs tracking changed at all. And node locations and respawns in Forever's own zones.
