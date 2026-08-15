# SCENARIO CATALOG
### Historical modes, parties, and asymmetric victory conditions

**Governing principle:** a scenario is a **config preset, not a content pack.** Same engine, different starting values — force ratios, standing fragility, pact topology, victory thresholds, advisor templates. If a scenario needs bespoke code, it's been designed wrong. The scenario loader must exist from M0 even when only one scenario ships.

Scenarios are tiered by which engine systems they require, not by historical importance. Tier 0 needs **no combat resolution at all** — which is why Tier 0 is where you start.

---

# TIER 0 — Negotiation-only
*Playable with Phase 1 only. No combat engine required.*

---

## S-01 · SÈVRES
**Suez Crisis, 1956** · 6 players · 3–5 days real time

The single best first scenario. It is a secret pact, its exposure, and the collapse that followed — which is the entire Phase 1 feature set and nothing else.

**Parties**

| Player | Position | Opening posture |
|---|---|---|
| United Kingdom | Eden — canal access is imperial credibility | Seeking pretext |
| France | Mollet — Nasser backing Algerian FLN | Seeking pretext |
| Israel | Ben-Gurion — Straits of Tiran, Sinai security | Seeking partners |
| Egypt | Nasser — canal nationalized, holding | Defending sovereignty |
| United States | Eisenhower — election week, alliance credibility | Uninformed, powerful |
| Soviet Union | Khrushchev — Hungary unfolding simultaneously | Opportunistic |

**Historical hook.** The Protocol of Sèvres was a genuine secret tripartite agreement: Israel invades Sinai, Britain and France "intervene to separate the combatants" as a manufactured pretext. It was denied for decades. Eisenhower — deceived by his own allies — applied financial pressure on sterling and forced a withdrawal. Britain and France won militarily and lost catastrophically.

**Victory conditions**
- **UK / France:** control canal zone **and** external standing above floor. *Deliberately near-impossible — that's the historical lesson made mechanical.*
- **Israel:** Straits open, Sinai withdrawal negotiated on favourable terms, patron relationship intact.
- **Egypt:** retain nationalization, survive, external standing gain.
- **USA:** no Soviet entry, alliance preserved, no public humiliation.
- **USSR:** maximize the US–ally rift; bonus if attention stays off Hungary.

**Systems exercised:** secret pacts · visibility rules · leak mechanics · economic coercion by a patron · standing collapse from exposure

**Tuning target:** this scenario exists to calibrate **secret-pact leakage cost.** That single number sets how paranoid the entire game feels. Run it repeatedly at different values.

---

## S-02 · THIRTEEN DAYS
**Cuban Missile Crisis, 1962** · 5–7 players · 2–3 days

**Parties:** USA (Kennedy) · USSR (Khrushchev) · Cuba (Castro) · Turkey · optional: UN Secretary-General as neutral broker, NATO caucus

**Historical hook.** The resolution included a *secret* term — withdrawal of Jupiter missiles from Turkey — publicly denied for decades so Kennedy could appear to have conceded nothing. Negotiated through a back channel. Both leaders needed an outcome each could sell at home as a win.

**Victory conditions**
- **USA:** missiles removed **and** domestic standing intact **and** no public concession visible.
- **USSR:** Cuba guaranteed against invasion **and** Jupiters removed — *counts even if the term is secret.*
- **Cuba:** survival guarantee; standing penalty if the patrons settle over its head.
- **Turkey:** not traded away publicly.

**Systems exercised:** back-channel private channels · escalation ladder · patron-client friction

**Schema requirement this scenario forces:** the `pact` table needs **`public_terms` and `private_terms` as separate fields**, with divergence between them being the whole point. Add this in M1 — it's cheap now and expensive later, and it unlocks a large amount of the design.

---

## S-03 · THE GUARANTEE
**Munich Agreement, 1938** · 6–7 players · 3–4 days

**Parties:** Germany · Britain · France · Czechoslovakia · Italy · USSR · Poland · Hungary

**Historical hook.** Czechoslovakia was not present at the conference that partitioned it. France held a treaty obligation and did not honour it. The USSR's offer of assistance was conditional on French action, so it never triggered. Poland and Hungary took territory in the aftermath.

**Victory conditions**
- **Germany:** Sudetenland without general war.
- **Britain / France:** avoid war **and** retain external standing — *mutually exclusive by design.*
- **Czechoslovakia:** survive with defensible frontiers.
- **USSR:** expose Western unreliability without becoming isolated.

**Systems exercised:** pact obligations that fail to trigger · ally abandonment · conditional-obligation chains

**⚠ Playtest risk — read before shipping this one.** Czechoslovakia is *structurally excluded* from the main negotiation. Historically accurate; potentially miserable to play. This scenario is a live test of whether a near-powerless role is tolerable. Mitigation: give Czechoslovakia real asymmetric levers — leak capability, mobilization as a forcing move, direct appeals to the USSR. If it still isn't fun, that's important information about your disempowered-player design generally, including exile play.

---

## S-04 · THE SECRET PROTOCOL
**Molotov–Ribbentrop, 1939** · 6 players · 3–4 days

**Parties:** Germany · USSR · Poland · Britain · France · Japan

**Historical hook.** Two declared ideological enemies signed a non-aggression pact with a secret protocol partitioning the states between them. Japan — Germany's Anti-Comintern partner, then fighting the USSR at Khalkhin Gol — was blindsided; the cabinet fell.

**Victory conditions**
- **Germany:** Poland isolated, Soviet neutrality secured, Western guarantee neutralized.
- **USSR:** territorial buffer, time, no two-front exposure.
- **Poland:** credible guarantees that actually bind.
- **Britain / France:** make the guarantee deterrent rather than decorative.
- **Japan:** avoid strategic abandonment; reposition.

**Systems exercised:** secret pacts between apparent enemies · third-party pact invalidation · guarantee credibility as a measurable quantity

---

## S-05 · THE CONCERT
**Congress of Vienna, 1814–15** · 8 players · 5–7 days

**Parties:** Austria (Metternich) · Britain (Castlereagh) · Russia (Alexander I) · Prussia (Hardenberg) · **France (Talleyrand)** · Sweden · Spain · German minor states bloc

**Historical hook — and why this scenario matters more than it looks.** Talleyrand represented the *defeated* power. He had no army and no leverage. He exploited the Poland–Saxony dispute to split the victors, and secured a secret defensive alliance with Britain and Austria *against* Russia and Prussia — returning France to the great-power table within months of total defeat.

**This is your exile mechanic, historically attested.** Run this scenario specifically to validate §7 of the architecture: a player with no economy and no force, winning through communication and intelligence alone.

**Victory conditions:** territorial thresholds plus standing floors per party; France wins by re-entering the great-power concert at all.

**Systems exercised:** defeated-player agency · coalition splitting · pure negotiation

---

## S-06 · THE BLANK CHEQUE
**July Crisis, 1914** · 7 players · 4–5 days

**Parties:** Austria-Hungary · Germany · Russia · France · Britain · Serbia · Ottoman Empire

**Historical hook.** Mobilization timetables functioned as commitment devices — once started, effectively irreversible, and each one forced the next. British intent remained deliberately ambiguous until too late.

**Victory conditions:** every party has a *localize the conflict* condition and an *if it goes general, be favourably aligned* condition. Almost all of them fail. The scenario is about how.

**Systems exercised:** pact chain-triggering · **irreversible actions** · deliberate ambiguity as strategy

**Special mechanic — mobilization as a one-way door.** Once triggered it cannot be recalled, and it cascades through pact obligations automatically. This is the cleanest possible test of irreversible-action design and of whether your effect cascade depth cap of 3 is correct.

---

# TIER 1 — Combat as background layer
*Requires Phase 2 (combat resolution + asymmetric AAR).*

---

## S-07 · ATTRITION
**Vietnam War, 1964–75** · 8–10 players · 3–4 weeks

The flagship demonstration of asymmetric victory.

**Parties**

| Player | Primary battlefield |
|---|---|
| United States | its own domestic opinion |
| North Vietnam (DRV) | US domestic opinion |
| NLF / Viet Cong | rural control + US casualty visibility |
| South Vietnam (RVN) | internal cohesion, patron retention |
| USSR | client dependency vs. China |
| China | client dependency vs. USSR |
| Cambodia (Sihanouk) | neutrality survival |
| Laos | territorial integrity of the corridor |
| Australia / ROK | alliance credit at acceptable cost |

**Victory conditions — the asymmetry is the design**
- **USA:** RVN survives as an independent state **and** US domestic standing above floor at scenario end.
- **DRV / NLF:** drive US domestic standing below floor. **Never required to win a single engagement.**
- **RVN:** survive independent — hardest condition in the scenario.
- **USSR / China:** competitive, not cooperative. Each wins by making the DRV dependent on *them*. The Sino-Soviet split is a live mechanic, not background.

**Historical hook.** Tet 1968 was a severe military defeat for the NVA and NLF and a decisive strategic victory, entirely through its effect on American domestic opinion. Your asymmetric AAR mechanic, historically documented.

**Systems exercised:** asymmetric victory · insurgency-as-exile-play · domestic standing as primary objective · competitive patronage

**Special mechanic — domestic opinion as a modeled actor.** It gets its own event stream: casualty visibility, media reports, draft policy, economic cost. The US player manages it as a resource; the DRV player attacks it as a target. Casualty *visibility* matters more than casualty count — an operation that is expensive and invisible is cheaper than one that is cheap and televised.

---

## S-08 · THE BLEEDING WOUND
**Soviet–Afghan War, 1979–89** · 7–8 players · 3–4 weeks

**Parties:** USSR · DRA (Kabul government) · **Mujahideen factions ×3, mutually hostile** · Pakistan (ISI) · USA · Saudi Arabia · Iran

**Historical hook.** The resistance was never unified — factional rivalry was structural. Pakistan's intelligence service controlled distribution of American and Saudi funding, which gave it decisive leverage over which factions grew and which withered.

**Victory conditions**
- **USSR:** DRA self-sustaining **and** domestic standing above floor. Historically failed on the second.
- **Mujahideen factions:** *each* wins by outlasting the Soviets **and** ending as the strongest faction. They are not on the same team.
- **Pakistan:** maximize leverage; end with a dependent client.
- **USA / Saudi:** Soviet cost maximized at low attribution.

**Systems exercised:** multi-faction insurgency · occupier internal collapse · **broker position**

**Special mechanic — the broker.** Pakistan sits between funders and fighters and taxes the relationship in both directions. It can skim, misreport, and play factions against each other. This may be the single best social role in the entire catalog and is worth prototyping early even outside this scenario.

---

## S-09 · POLICE ACTION
**Korean War, 1950–53** · 7 players · 2–3 weeks

**Parties:** USA/UN · ROK · DPRK · PRC · USSR · UK · Japan (logistics base)

**Historical hook.** A Soviet boycott of the Security Council allowed the UN authorization to pass. Soviet pilots flew combat missions under strict denial. MacArthur's insubordination created a genuine principal–agent crisis inside the US command.

**Systems exercised:** **deniable participation** · coalition command friction · internal standing as command control

**Special mechanic — deniable forces.** Commit force while maintaining public denial. If exposed, standing penalty scales with how loudly you denied it. Pairs naturally with the belief-state system in Phase 3.

---

## S-10 · THE CONCEPT
**Arab–Israeli Wars, 1967 & 1973** · 8 players · 2 weeks per variant

**Parties:** Israel · Egypt · Syria · Jordan · Iraq · USSR · USA · France

**Two historical hooks, both about belief rather than force**

*1967:* Jordan entered the war on the basis of Egyptian claims of victory that were false. An ally's disinformation — possibly self-deception rather than deliberate deceit — produced a catastrophic decision and the loss of the West Bank.

*1973:* Israeli intelligence held the information and misread it, because it was filtered through a prior doctrine about when Egypt would attack. Not an intelligence collection failure — an interpretation failure.

**This is the best scenario in the catalog for testing the belief-state and advisor systems**, because both wars turned on the gap between what was known and what was believed. Schedule it immediately after Phase 3.

---

## S-11 · MALVINAS
**Falklands War, 1982** · 5–6 players · 1 week

**Parties:** UK · Argentina · USA (Rio Pact vs. NATO, genuinely torn) · Chile (covert UK support) · France (Exocet supplier dilemma) · USSR

**Historical hook.** The junta's invasion was substantially motivated by *internal* standing amid economic collapse. Both leaders' domestic positions were the real stakes. American mediation failed because the US could not choose between two alliance systems.

**Systems exercised:** internal standing as *cause* of war · third-party alignment pressure · arms-supplier leverage as a social lever

Short, compact, few players. Good regression-test scenario once the engine is stable.

---

## S-12 · TANKER WAR
**Iran–Iraq War, 1980–88** · 8 players · 3 weeks

**Parties:** Iraq · Iran · USA · USSR · France · Kuwait · Saudi Arabia · Syria

**Historical hook.** Both superpowers backed Iraq while the United States covertly sold arms to Iran. Syria, a fellow Ba'athist state, backed Iran against Iraq. Nearly every actor was running contradictory positions simultaneously.

**Systems exercised:** duplicity at scale · covert pacts contradicting public pacts · economic warfare

The stress test for the pact evaluator. If your contradiction detection survives this scenario, it survives anything.

---

# TIER 2 — Full system
*Requires Phase 4 (delegation + defeat states).*

---

## S-13 · THE LONG TELEGRAM ★ FLAGSHIP
**Cold War, 1947–91** · 20–30 players · 6–8 weeks, or persistent seasons

The scenario the entire design was built for.

**Parties:** USA · USSR · PRC · UK · France · West Germany · Yugoslavia (non-aligned) · India · Egypt · Cuba · Vietnam (N/S) · Korea (N/S) · Iran · Israel · Poland · Hungary · Czechoslovakia · Chile · Congo · Indonesia · Angola

**Why it fits perfectly.** The nuclear threshold means the principals *cannot fight each other directly*. Every conflict must be proxied, every gain must be made through alignment pressure, intelligence, and client management. A war game where the two strongest players are forbidden from fighting is exactly a social game.

**Special mechanic — the nuclear threshold.** Direct engagement between nuclear principals triggers a scenario-wide loss condition. Not a penalty. A loss, for everyone. This is the constraint that forces all the interesting behaviour.

**Systems exercised:** everything, simultaneously

---

## S-14 · EFFECTIVE OCCUPATION
**Berlin Conference / Partition of Africa, 1884–1914** · 10–14 players · 3 weeks

**Parties — European:** Britain · France · Germany · Belgium (Leopold personally) · Portugal · Italy · Spain
**Parties — African:** Ethiopia · Asante · Sokoto Caliphate · Zulu Kingdom · Buganda · Madagascar

**Design position — take this seriously.** The lazy version models Africa as terrain and European powers as players. Make African polities **actual players with real agency**, because that is both historically accurate and better design: Ethiopia defeated Italy at Adwa and retained independence; Asante fought Britain across a century; Sokoto, Buganda and Madagascar all ran sophisticated diplomacy, played European powers against each other, and signed treaties they understood differently than their counterparties did.

**Special mechanic — treaty translation divergence.** Many colonial treaties meant materially different things to each signatory. Implement this as a Pact where the two parties' *belief states* about the terms genuinely differ. It is historically exact and mechanically superb — and it's the strongest possible showcase of separating world truth from belief.

---

## S-15 · FRAGMENTATION
**Yugoslav Wars, 1991–2001** · 10–12 players · 3–4 weeks

**Parties:** Serbia · Croatia · Bosnia (three internal factions) · Slovenia · Macedonia · Kosovo · EU · USA · Russia · UN/NATO

**Historical hook.** Internal standing collapse *causing* state dissolution — your `standing_internal` mechanic as the entire plot rather than a modifier.

**⚠ Content position — decide this deliberately, not by default.** These wars involved genocide and mass ethnic cleansing, within living memory, with survivors and perpetrators alive. Two workable approaches:

1. **Terminate the model at the political layer.** Model the collapse of cohesion, the international response, the intervention thresholds. Do not model atrocity as a player-selectable action with mechanical payoff. Ethnic cleansing appearing in a strategy menu as an efficient option is indefensible and will end the product.
2. **Skip it.** S-13 already exercises every system this does.

Ship this only with advisory input from people connected to the region, or don't ship it. This is a business risk as much as an ethical one — storefront removal is a real outcome for games that get this wrong.

The same reasoning applies to a US-Afghanistan 2001–21 or Iraq 2003 scenario. Both are mechanically excellent fits and both are recent enough that the participants are alive. Defer.

---

## S-16 · GRAND ALLIANCE
**Second World War, 1939–45** · 15–20 players · 6 weeks

The obvious scenario. Most expensive to build, least novel in what it proves, and directly comparable to a game with a decade of iteration behind it. **Deliberately last.** Every system it needs is validated by earlier scenarios, and arriving late with a mature engine is a far better position than arriving early with a weak one.

---

# Build sequence

| Order | Scenario | Gate it proves |
|---|---|---|
| 1 | **S-01 Sèvres** | Core loop works with no combat at all |
| 2 | **S-05 The Concert** | Defeated players can still play |
| 3 | **S-06 July Crisis** | Irreversible actions and cascade caps |
| 4 | **S-07 Vietnam** | Asymmetric victory and combat AAR |
| 5 | **S-10 The Concept** | Belief state and disinformation |
| 6 | **S-08 Afghanistan** | Multi-faction and broker roles |
| 7 | **S-13 Cold War** | Full system at scale |

Scenarios 8+ are content, not engineering.

---

# Scenario config schema

Every scenario above compiles to one file of this shape:

```json
{
  "id": "sevres_1956",
  "display_name": "Sèvres",
  "duration_ticks": 720,
  "player_slots": 6,
  "requires_systems": ["pacts", "standing", "channels"],

  "nations": [
    {
      "id": "uk",
      "name": "United Kingdom",
      "standing_external": 72,
      "standing_internal": 58,
      "economy": 80,
      "intelligence_capacity": 85,
      "territories": ["cyprus", "malta", "home_isles"],
      "social_tree_unlocks": ["covert_operations", "economic_coercion"],
      "advisor_set": "whitehall_1956"
    }
  ],

  "starting_pacts": [
    {
      "parties": ["uk", "fr"],
      "type": "defense",
      "secret": false,
      "terms": { "…": "…" }
    }
  ],

  "victory_conditions": {
    "uk": {
      "all_of": [
        { "control": "territory:canal_zone" },
        { "gte": ["standing_external", 45] }
      ]
    },
    "eg": {
      "all_of": [
        { "retain": "nationalization" },
        { "status_not": "occupied" }
      ]
    }
  },

  "tuning": {
    "secret_pact_leak_base_chance": 0.08,
    "standing_penalty_on_breach": 25,
    "cascade_depth_cap": 3
  }
}
```

If a scenario in this catalog cannot be expressed in this schema, either the schema is missing a field that several scenarios need — add it — or the scenario is asking for bespoke code, which means it doesn't ship.
