export interface ChairBrief {
  posture: string;
  instruments: string;
  victory: string;
}

export interface ScenarioBrief {
  id: string;
  catalogNo: string;
  displayName: string;
  situation: string;
  duration: string;
  systems: string;
  chairs: Record<string, ChairBrief>;
}

export const SCENARIO_BRIEFS: Record<string, ScenarioBrief> = {
  sevres_1956: {
    id: "sevres_1956",
    catalogNo: "S-01",
    displayName: "Sèvres",
    situation:
      "The canal has been nationalized. A secret is waiting to be written. The strongest player at the table has not been told.",
    duration: "Three to five days",
    systems: "Secret pacts, visibility, leakage, economic coercion, standing",
    chairs: {
      uk: {
        posture: "Canal access is imperial credibility. Seeking a pretext.",
        instruments: "Sterling, the Mediterranean stations, a treaty with France already in force.",
        victory: "Hold the canal zone, and keep how much others trust you above the floor. Near-impossible on purpose.",
      },
      fr: {
        posture: "Nasser is backing the FLN. Seeking a pretext.",
        instruments: "The Algerian war, the same secret if you write it.",
        victory: "The canal, and standing enough to survive the exposure.",
      },
      il: {
        posture: "The Straits are closed. Seeking partners.",
        instruments: "A small army and a need for patrons who will not trade you away.",
        victory: "Straits open, Sinai settled on favourable terms, the patron still yours.",
      },
      eg: {
        posture: "The canal is nationalized. Holding.",
        instruments: "The ground itself, and the ability to make a secret expensive when it leaks.",
        victory: "Keep the nationalization. Survive. Gain standing.",
      },
      us: {
        posture: "Election week. Uninformed, and powerful.",
        instruments: "Sterling support. The capacity to coerce an ally without firing.",
        victory: "No Soviet entry. The alliance preserved. No public humiliation.",
      },
      su: {
        posture: "Hungary is unfolding. Opportunistic.",
        instruments: "The rift between Washington and its allies. Attention, if it stays off Budapest.",
        victory: "Widen the American–allied split. Keep Hungary quiet.",
      },
    },
  },
  vienna_1815: {
    id: "vienna_1815",
    catalogNo: "S-05",
    displayName: "The Concert",
    situation:
      "The defeated power has no army. It still has a seat, if it can split the victors.",
    duration: "Five to seven days",
    systems: "Defeated-player agency, coalition splitting, pure negotiation",
    chairs: {
      fr: {
        posture: "Talleyrand. No force. The table is the only ground left.",
        instruments: "Correspondence, other people's disagreements, a secret defensive pact if you can write one.",
        victory: "Re-enter the concert at all.",
      },
      at: {
        posture: "The chair of the congress.",
        instruments: "Procedure, and the fear of Russian weight.",
        victory: "A settlement that keeps Austria at the centre.",
      },
      gb: {
        posture: "The purse of the concert. Preferring a balance to a triumph.",
        instruments: "Credit, the sea, and the ability to leave the room.",
        victory: "A settlement that does not make a single hegemon.",
      },
      ru: {
        posture: "Weight in the east. Seeking a Poland that answers to Petersburg.",
        instruments: "The largest army in the room, and the patience to wait on the others' quarrel.",
        victory: "A Polish settlement on Russian terms, without isolation.",
      },
      pr: {
        posture: "Seeking elevation. Saxony is the prize that would make a great power.",
        instruments: "The Rhine, and a need for Russian cover.",
        victory: "Leave heavier than you arrived.",
      },
      se: {
        posture: "A northern seat. Norway is settled; influence is not.",
        instruments: "A vote, and the memory of having chosen the winning side.",
        victory: "Remain in the concert as a power that was consulted.",
      },
      es: {
        posture: "A restored throne, a diminished reach.",
        instruments: "Dynastic claims, and the embarrassment of the liberals.",
        victory: "Be named in the settlement.",
      },
      de: {
        posture: "Many courts, one table.",
        instruments: "The Confederation as a fact the great powers must walk around.",
        victory: "A German order that is not merely Prussian or Austrian.",
      },
    },
  },
  july_crisis_1914: {
    id: "july_crisis_1914",
    catalogNo: "S-06",
    displayName: "The Blank Cheque",
    situation: "Mobilisation, once begun, cannot be recalled. Ambiguity is a strategy until it is not.",
    duration: "Four to five days",
    systems: "Irreversible actions, pact chains, cascade depth",
    chairs: {
      gb: {
        posture: "Intent kept deliberately unclear.",
        instruments: "The last word, if it is spoken in time.",
        victory: "Localise it — or, if it goes general, be aligned.",
      },
      rs: {
        posture: "The smallest chair, and the one the timetable is written around.",
        instruments: "A guarantee, if anyone will make it bind.",
        victory: "Survive without occupation.",
      },
      ah: {
        posture: "Seeking a limited war. The cheque has been received.",
        instruments: "An ultimatum, and a German covering letter.",
        victory: "Punish Serbia without a general war — or, if it comes, not alone.",
      },
      de: {
        posture: "The cheque has been written.",
        instruments: "The timetable, and the fear of a two-front war.",
        victory: "A localised Austrian success, or a war fought before Russia is ready.",
      },
      ru: {
        posture: "The protector of Serbia, on a clock it does not set.",
        instruments: "Partial mobilisation as a signal that may not stay partial.",
        victory: "Serbia unoccupied, without isolation in Europe.",
      },
      fr: {
        posture: "The alliance is the policy.",
        instruments: "A Russian partner, and the knowledge that delay is a kind of choice.",
        victory: "Not stand alone, and not be the one who flinched.",
      },
      ot: {
        posture: "Watching the straits. Not yet in the quarrel.",
        instruments: "The ability to close a sea, and to be paid for staying out — or in.",
        victory: "Enter on terms, or remain unbruised.",
      },
    },
  },
  thirteen_days_1962: {
    id: "thirteen_days_1962",
    catalogNo: "S-02",
    displayName: "Thirteen Days",
    situation:
      "Missiles are already on the island. The public settlement and the private one will not be the same document.",
    duration: "Two to three days",
    systems: "Back-channels, secret terms, patron-client friction",
    chairs: {
      us: {
        posture: "The missiles must leave. Nothing public may look like a concession.",
        instruments: "The quarantine, the back channel, Jupiter sites that can be traded in private.",
        victory: "Missiles gone, the house still holding, no public concession visible.",
      },
      su: {
        posture: "The island must live. The Jupiters are the price that can be collected quietly.",
        instruments: "The missiles already emplaced, and a guarantee that can be written in secret.",
        victory: "Cuba guaranteed, Jupiters gone — even if that term never sees daylight.",
      },
      cu: {
        posture: "Survival first. Being settled over your head is the other risk.",
        instruments: "The ground, and the ability to make a patron's deal expensive.",
        victory: "A guarantee. Standing if you were in the room when it was written.",
      },
      tr: {
        posture: "The Jupiters are on your soil. Do not be the concession.",
        instruments: "NATO paper, and a seat that can be skipped.",
        victory: "Not traded away in public.",
      },
      un: {
        posture: "Honest broker. No army. The minutes may still matter.",
        instruments: "A room both principals can enter without losing face.",
        victory: "Missiles down, no public humiliation that starts the next crisis.",
      },
    },
  },
  munich_1938: {
    id: "munich_1938",
    catalogNo: "S-03",
    displayName: "The Guarantee",
    situation:
      "The conference that partitions a country has not invited it. A treaty obligation is about to fail in public.",
    duration: "Three to four days",
    systems: "Obligations that do not trigger, abandonment, conditional chains",
    chairs: {
      de: {
        posture: "The Sudetenland without a general war.",
        instruments: "The threat of one, and partners who prefer delay.",
        victory: "The frontier, and no general war.",
      },
      gb: {
        posture: "Peace in our time is the brief. Standing is the cost.",
        instruments: "The conference, and the appearance of a settlement.",
        victory: "Avoid war and keep trust — written as mutually exclusive.",
      },
      fr: {
        posture: "A treaty with Prague exists. Honouring it means war.",
        instruments: "The alliance on paper, and a Soviet condition that never quite fires.",
        victory: "Avoid war and keep trust. The same trap as London.",
      },
      cz: {
        posture: "Not in the room. Still a chair.",
        instruments: "Leak, mobilisation as a forcing move, a direct appeal east.",
        victory: "Survive with a frontier that can be held.",
      },
      it: {
        posture: "The honest broker of a dishonest conference.",
        instruments: "A seat between Berlin and the West.",
        victory: "Leave heavier than you arrived.",
      },
      su: {
        posture: "Assistance was offered, conditional on French action.",
        instruments: "The condition itself, and the record of who failed it.",
        victory: "Expose Western unreliability without isolation.",
      },
      pl: {
        posture: "A neighbour's crisis is also a frontier question.",
        instruments: "Proximity, and the temptation of a scrap.",
        victory: "Do not become the next name on the agenda.",
      },
      hu: {
        posture: "Revision, if the settlement opens.",
        instruments: "A claim, and larger partners to hide behind.",
        victory: "Be named in whatever is signed.",
      },
    },
  },
  molotov_ribbentrop_1939: {
    id: "molotov_ribbentrop_1939",
    catalogNo: "S-04",
    displayName: "The Secret Protocol",
    situation:
      "Two declared enemies can still write a partition. The partner who is not in the room will notice.",
    duration: "Three to four days",
    systems: "Secret pacts between apparent enemies, guarantee credibility",
    chairs: {
      de: {
        posture: "Poland isolated. Soviet neutrality bought. The Western guarantee made decorative.",
        instruments: "A public non-aggression, and a protocol that must not leak on the wrong morning.",
        victory: "Poland alone, the East quiet, the West still talking.",
      },
      su: {
        posture: "A buffer, and time. Not a two-front war.",
        instruments: "The same protocol. The price is ideological humiliation if it prints.",
        victory: "Depth, time, no second front.",
      },
      pl: {
        posture: "Guarantees exist. Whether they bind is the game.",
        instruments: "London and Paris on paper.",
        victory: "A guarantee that actually fires.",
      },
      gb: {
        posture: "The guarantee must deter, or it is a bluff already called.",
        instruments: "The last public word, if it is spoken in time.",
        victory: "Make the guarantee real, or survive its failure with the house intact.",
      },
      fr: {
        posture: "The same guarantee, the same clock.",
        instruments: "An alliance with Warsaw that may never be marched.",
        victory: "Not be the one who left Poland to the protocol.",
      },
      jp: {
        posture: "The Anti-Comintern partner was not told.",
        instruments: "A cabinet that can fall, and a war already running in the east.",
        victory: "Avoid strategic abandonment. Reposition if you must.",
      },
    },
  },
  vietnam_1964: {
    id: "vietnam_1964",
    catalogNo: "S-07",
    displayName: "Attrition",
    situation:
      "The war is not won by holding ground. It is won by what the other house can still bear.",
    duration: "Three to four weeks",
    systems: "Asymmetric victory, patronage, domestic standing as a target",
    chairs: {
      us: {
        posture: "Saigon must remain a state, and the house must hold.",
        instruments: "Force, money, and a press you do not command.",
        victory: "The RVN independent, internal standing above the floor at the end.",
      },
      drv: {
        posture: "You are not required to win an engagement.",
        instruments: "Time, and the American house.",
        victory: "Drive American internal standing below the floor.",
      },
      nlf: {
        posture: "The countryside, and what can be made visible.",
        instruments: "Presence where the patron cannot comfortably go.",
        victory: "The same as Hanoi — the American house, not the map.",
      },
      rvn: {
        posture: "Survive as a state. Keep the patron.",
        instruments: "A capital, and a relationship that can be lost.",
        victory: "Remain independent. The hardest chair.",
      },
      su: {
        posture: "A client, and a rival in Beijing.",
        instruments: "Aid that creates dependence.",
        victory: "Hanoi leans on you, not on China.",
      },
      cn: {
        posture: "The same client, the same rivalry.",
        instruments: "Proximity, and another doctrine.",
        victory: "Hanoi leans on you, not on Moscow.",
      },
      kh: {
        posture: "Neutrality as a survival strategy.",
        instruments: "A corridor others want, and a name that can be kept out of the war.",
        victory: "Still a state when it ends.",
      },
      la: {
        posture: "The trail is on your ground.",
        instruments: "A geography you did not choose.",
        victory: "Territorial integrity of a sort.",
      },
      au: {
        posture: "Alliance credit at a cost the house will notice.",
        instruments: "A contingent, and Washington's memory.",
        victory: "Leave with the alliance intact and the bill payable.",
      },
    },
  },
  afghanistan_1979: {
    id: "afghanistan_1979",
    catalogNo: "S-08",
    displayName: "The Bleeding Wound",
    situation:
      "The resistance is not one chair. The broker sits between the money and the guns.",
    duration: "Three to four weeks",
    systems: "Multi-faction insurgency, broker position, occupier standing",
    chairs: {
      su: {
        posture: "Kabul must stand alone, and the house must hold.",
        instruments: "The 40th Army, and a client that does not.",
        victory: "A self-sustaining DRA, internal standing above the floor.",
      },
      dra: {
        posture: "A capital that does not command the passes.",
        instruments: "The patron, and a state that exists on paper.",
        victory: "Survive as a government that can stand without the 40th.",
      },
      hiz: {
        posture: "Not on the same team as the other factions.",
        instruments: "The eastern approaches, and whoever funds you this month.",
        victory: "Outlast the Soviets and end strongest.",
      },
      jam: {
        posture: "The same war, a different command.",
        instruments: "The Panjshir, and a claim to lead.",
        victory: "Outlast the Soviets and end strongest.",
      },
      har: {
        posture: "Smaller, not quieter.",
        instruments: "The south-east, and the same broker.",
        victory: "Outlast the Soviets and end strongest.",
      },
      pk: {
        posture: "The broker. Tax both directions.",
        instruments: "Distribution, visas, camps, the story told to donors.",
        victory: "Leave with a dependent client and leverage intact.",
      },
      us: {
        posture: "Cost to Moscow, low attribution.",
        instruments: "Money that passes through someone else's hands.",
        victory: "Soviet internal standing broken, your fingerprints deniable.",
      },
      sa: {
        posture: "The same cost, a different pulpit.",
        instruments: "Money, and a preference among factions.",
        victory: "Moscow bled, a friendly client on the far side.",
      },
      ir: {
        posture: "A neighbour's war, a sectarian interest.",
        instruments: "A border, and factions the others will not fund.",
        victory: "Not isolated, not occupied by the outcome.",
      },
    },
  },
  korea_1950: {
    id: "korea_1950",
    catalogNo: "S-09",
    displayName: "Police Action",
    situation:
      "A boycott let the authorisation through. Some of the force in the air will be denied until it cannot be.",
    duration: "Two to three weeks",
    systems: "Deniable participation, coalition friction, command standing",
    chairs: {
      us: {
        posture: "A UN war that is also an American one.",
        instruments: "The command, and a general who may not stay in it.",
        victory: "The ROK stands. The house still holds the command.",
      },
      kr: {
        posture: "The capital has already been lost once.",
        instruments: "A patron, and ground that must be retaken.",
        victory: "Seoul held, the state unoccupied.",
      },
      kp: {
        posture: "Unify by force before the authorisation hardens.",
        instruments: "A surprise, and two patrons who do not always speak.",
        victory: "Seoul, and a state that is not a rump.",
      },
      cn: {
        posture: "A frontier that cannot be an American one.",
        instruments: "Volunteers who are not volunteers.",
        victory: "No hostile army on the Yalu, standing intact.",
      },
      su: {
        posture: "Present, denied.",
        instruments: "Pilots under another flag, a veto unused.",
        victory: "Unexposed, and a client not destroyed.",
      },
      uk: {
        posture: "A coalition member, not a spectator.",
        instruments: "A contingent, and the right to be consulted.",
        victory: "The alliance holds without a wider war.",
      },
      jp: {
        posture: "The logistics base. Not a combatant.",
        instruments: "Harbours, and a constitution.",
        victory: "Remain the base, not the battlefield.",
      },
    },
  },
  the_concept_1967: {
    id: "the_concept_1967",
    catalogNo: "S-10",
    displayName: "The Concept",
    situation:
      "What is believed will move armies. What is true may arrive too late to matter.",
    duration: "Two weeks",
    systems: "Belief, disinformation, patron alignment",
    chairs: {
      il: {
        posture: "A doctrine about when the other side will move.",
        instruments: "Intelligence that can be held and still misread.",
        victory: "Survive unoccupied, standing enough to keep the patron.",
      },
      eg: {
        posture: "The claims you make will be believed in Amman.",
        instruments: "Radio, a patron, Sinai.",
        victory: "Sinai held, standing not spent on a fiction.",
      },
      sy: {
        posture: "The Golan is the stake.",
        instruments: "A front, and Cairo's word.",
        victory: "The Golan still yours.",
      },
      jo: {
        posture: "Enter on a report that may be false.",
        instruments: "A West Bank, and an alliance that can lie to itself.",
        victory: "The West Bank held, the state unoccupied.",
      },
      iq: {
        posture: "An expeditionary chair.",
        instruments: "A force that can arrive, and a claim to Arab standing.",
        victory: "Be seen to have stood with the front.",
      },
      su: {
        posture: "Clients who may not wait for your reading.",
        instruments: "Arms, and a version of events.",
        victory: "Clients intact, standing not spent on their misread.",
      },
      us: {
        posture: "A patron who prefers no war this week.",
        instruments: "Resupply, and a brake that may not bind.",
        victory: "Israel unoccupied, the rift with Moscow managed.",
      },
      fr: {
        posture: "An old supplier, a new distance.",
        instruments: "Arms policy as a social lever.",
        victory: "Standing without being the arsenal of a war you did not choose.",
      },
    },
  },
  malvinas_1982: {
    id: "malvinas_1982",
    catalogNo: "S-11",
    displayName: "Malvinas",
    situation:
      "The junta needs the house to hold. Washington cannot choose between two alliances in the same afternoon.",
    duration: "One week",
    systems: "Internal standing as cause of war, third-party alignment, arms leverage",
    chairs: {
      uk: {
        posture: "The islands are a cabinet question at home.",
        instruments: "A task force, and NATO paper that does not cover this.",
        victory: "The islands held, the house above the floor.",
      },
      ar: {
        posture: "The landing was for the house, not the chart.",
        instruments: "Occupation on the ground, a collapsing estimate at home.",
        victory: "The islands, and internal standing recovered.",
      },
      us: {
        posture: "Rio Pact and NATO in the same inbox.",
        instruments: "Mediation that cannot pick a winner without losing one.",
        victory: "Neither alliance publicly broken.",
      },
      cl: {
        posture: "A neighbour's war, a quiet alignment.",
        instruments: "A border, and assistance that must stay deniable.",
        victory: "Standing without becoming a party.",
      },
      fr: {
        posture: "The missiles already sold.",
        instruments: "An embargo that can be late, and a relationship with both.",
        victory: "Not the supplier of the shot that decides it.",
      },
      su: {
        posture: "A Western quarrel is still a quarrel.",
        instruments: "Attention, and a client elsewhere.",
        victory: "The rift widened, no wider war.",
      },
    },
  },
  tanker_war_1980: {
    id: "tanker_war_1980",
    catalogNo: "S-12",
    displayName: "Tanker War",
    situation:
      "Nearly every chair is running two positions. The pact evaluator is the battlefield.",
    duration: "Three weeks",
    systems: "Covert pacts contradicting public ones, economic warfare",
    chairs: {
      iq: {
        posture: "A war of exhaustion with patrons on both sides of the ledger.",
        instruments: "Oil, credit, and a Ba'athist rival in Damascus.",
        victory: "Unoccupied, standing not spent on a stalemate you cannot name.",
      },
      ir: {
        posture: "The same war, fewer declared friends.",
        instruments: "The gulf, and buyers who will deny they bought.",
        victory: "Unoccupied, a channel that survived the embargo.",
      },
      us: {
        posture: "Publicly with Baghdad. Another ledger exists.",
        instruments: "Escorts, and a covert channel that cannot print.",
        victory: "Oil moving, standing intact if the second ledger leaks.",
      },
      su: {
        posture: "Arms to Baghdad, a revolutionary file on Tehran.",
        instruments: "The same duplicity, a different ideology.",
        victory: "Neither client collapsed onto the other.",
      },
      fr: {
        posture: "A supplier with a preference.",
        instruments: "Credit and aircraft as social facts.",
        victory: "Paid, unexposed, still a power in the gulf.",
      },
      kw: {
        posture: "The tanker is the war.",
        instruments: "Flags, insurance, a request for escort.",
        victory: "Unoccupied, the sea still a living.",
      },
      sa: {
        posture: "The purse of the Arab side, and a fear of the other.",
        instruments: "Money, holy places, American cover.",
        victory: "Unoccupied, the gulf not a Soviet lake.",
      },
      sy: {
        posture: "A Ba'athist state backing the other Ba'athist state's enemy.",
        instruments: "The contradiction itself.",
        victory: "Standing for having chosen, not for having been consistent.",
      },
    },
  },
  long_telegram_1947: {
    id: "long_telegram_1947",
    catalogNo: "S-13",
    displayName: "The Long Telegram",
    situation:
      "The two strongest chairs cannot fight each other. Every gain is a client, a pact, or a leak. Direct engagement is a loss for the table.",
    duration: "Six to eight weeks, or a season",
    systems: "Everything, under a nuclear threshold",
    chairs: {
      us: { posture: "Containment. Not a war with the other principal.", instruments: "Alliances, money, stations.", victory: "No nuclear exchange. Standing of a first power." },
      su: { posture: "Depth, clients, time.", instruments: "The Pact, and parties that can be split.", victory: "No nuclear exchange. Standing of a first power." },
      cn: { posture: "A third centre, when it can be afforded.", instruments: "A frontier, and clients of your own.", victory: "Not a junior partner of either principal." },
      uk: { posture: "A first-rank memory, a second-rank purse.", instruments: "Intelligence, residual stations.", victory: "Still consulted." },
      fr: { posture: "Independence inside an alliance.", instruments: "A seat, and a force de frappe later.", victory: "Not merely Atlantic." },
      de: { posture: "A front-line client with a future.", instruments: "The border, and rehabilitation.", victory: "Sovereign enough to matter." },
      yu: { posture: "Non-aligned on purpose.", instruments: "The split you already made.", victory: "Not recaptured, not ignored." },
      in: { posture: "A conference of the unaligned.", instruments: "Scale, and a refusal to choose.", victory: "Not a camp." },
      eg: { posture: "The canal, and a choice of patrons.", instruments: "Geography.", victory: "Not a client of only one." },
      cu: { posture: "An island that can become a crisis.", instruments: "Proximity to the other principal.", victory: "Survive as more than a station." },
      drv: { posture: "A war that is also a patronage contest.", instruments: "Time.", victory: "A state, not a battlefield only." },
      rvn: { posture: "A client that must look like a state.", instruments: "The patron.", victory: "Independent at the end." },
      kp: { posture: "The northern half of a freeze.", instruments: "A patron, and a frontier.", victory: "Not absorbed." },
      kr: { posture: "The southern half.", instruments: "A different patron.", victory: "Not absorbed." },
      ir: { posture: "Oil, a throne, a future argument.", instruments: "Location.", victory: "Not a prize only." },
      il: { posture: "A small chair with a dense file.", instruments: "A patron, and a neighbourhood.", victory: "Unoccupied, not traded." },
      pl: { posture: "A client on the road west.", instruments: "A history the principal does not own.", victory: "A little room inside the Pact." },
      hu: { posture: "The same Pact, a different memory.", instruments: "1956 as a file, not a parade.", victory: "Not the next example." },
      cz: { posture: "Industry, a spring that has not happened yet.", instruments: "A position in the centre.", victory: "Not merely occupied in all but name." },
      cl: { posture: "A long coast, a contestable house.", instruments: "Copper, and a vote.", victory: "Not a trophy of either camp." },
      cg: { posture: "A crisis that will be named for you.", instruments: "Minerals, and a seat that can be sat in by others.", victory: "A state that is yours." },
      id: { posture: "A conference, then a turn.", instruments: "Scale in Asia.", victory: "Not a camp by default." },
      ao: { posture: "A late decolonisation that will not be local.", instruments: "A war of patrons already arriving.", victory: "A government that is not only an embassy." },
    },
  },
  berlin_conference_1884: {
    id: "berlin_conference_1884",
    catalogNo: "S-14",
    displayName: "Effective Occupation",
    situation:
      "The map is being written in Berlin. African chairs are at the table because they already were — treaties included.",
    duration: "Three weeks",
    systems: "Treaty translation, African agency, effective occupation as a claim",
    chairs: {
      gb: { posture: "The sea, and a preference for paper that reads one way in London.", instruments: "Credit, the navy, treaties already signed.", victory: "A settlement that looks like a concert you chair." },
      fr: { posture: "Recovery of standing by reach.", instruments: "West Africa, and a rival in London.", victory: "Not merely present. Named." },
      de: { posture: "Late, therefore loud.", instruments: "The conference itself.", victory: "Colonies that make a world power." },
      be: { posture: "A small European chair with a personal claim.", instruments: "A recognition others can be made to sign.", victory: "The basin, on paper." },
      pt: { posture: "Old claims, thin occupation.", instruments: "Priority in time, if anyone honours it.", victory: "Not erased by effective occupation elsewhere." },
      it: { posture: "A seat, and a Horn that can go wrong.", instruments: "Ambition in excess of the estimate.", victory: "Be named. Do not be humiliated." },
      es: { posture: "A residual coast.", instruments: "Old titles.", victory: "Still a colonial name on the map." },
      et: { posture: "A state that has defeated a European army before and will again.", instruments: "Arms, altitude, diplomacy among the latecomers.", victory: "Independence recognised, not partitioned." },
      as: { posture: "A century of war with Britain already in the file.", instruments: "Gold, inland depth, treaties read differently in Kumasi.", victory: "Unoccupied, terms that mean what you signed." },
      sk: { posture: "A caliphate that signs, and means the signing differently.", instruments: "The interior, and a treaty whose private reading is tribute.", victory: "Unoccupied. The paper not a deed of sale." },
      zu: { posture: "A kingdom Britain has already fought.", instruments: "A military reputation, and a shrinking frontier.", victory: "Still a name, not a district." },
      bg: { posture: "A court that has played missions against each other.", instruments: "The lake, and a preference among protectors.", victory: "A protectorate you chose, if you must have one." },
      mg: { posture: "An island monarchy with a European file already open.", instruments: "Distance, and a court.", victory: "Not annexed in the settlement." },
    },
  },
  fragmentation_1991: {
    id: "fragmentation_1991",
    catalogNo: "S-15",
    displayName: "Fragmentation",
    situation:
      "The house collapsing is the plot. Recognition, mediation, and thresholds for intervention — not the rest.",
    duration: "Three to four weeks",
    systems: "Internal standing as dissolution, recognition, intervention thresholds",
    chairs: {
      rs: { posture: "A federation that is becoming a claim.", instruments: "The army of a state that may no longer exist.", victory: "The house holds enough to remain a power." },
      hr: { posture: "Independence that needs a stamp.", instruments: "A declaration, and a lobby in Brussels.", victory: "Recognised, unoccupied." },
      ba: { posture: "A government, not a set of armies.", instruments: "Sarajevo as a capital, and an appeal outward.", victory: "Unoccupied, a house that still sits." },
      si: { posture: "The first to leave, the easiest to recognise.", instruments: "A short war, a long fax.", victory: "Recognised." },
      mk: { posture: "A name that is already an argument.", instruments: "Quiet, and a Greek file you do not own.", victory: "Unoccupied, named at all." },
      xk: { posture: "A status, not yet a seat others accept.", instruments: "An appeal, and a demographic fact.", victory: "Standing enough to be a question that must be answered." },
      eu: { posture: "Recognition as a tool, intervention as a threshold.", instruments: "Stamps, monitors, a purse.", victory: "No threshold crossed that you cannot explain." },
      us: { posture: "A late, heavy chair.", instruments: "NATO, and a preference for a settlement you did not start.", victory: "Standing of a closer, not an author." },
      ru: { posture: "A patron of the old centre.", instruments: "A veto, and a memory of the federation.", victory: "Not locked out of the settlement." },
      un: { posture: "Mandates, maps, a reluctance to become a party.", instruments: "Resolutions, and forces that arrive under someone else's will.", victory: "The threshold not crossed in your name." },
    },
  },
  grand_alliance_1939: {
    id: "grand_alliance_1939",
    catalogNo: "S-16",
    displayName: "Grand Alliance",
    situation:
      "The guarantee has been called. The secret protocol is still in force. The alliance that will win does not yet exist.",
    duration: "Six weeks",
    systems: "Alliance formation under fire, secret protocols, late principals",
    chairs: {
      de: { posture: "A local war that must not wait.", instruments: "The timetable, and a pact with Moscow that is already a lie in waiting.", victory: "A settlement on German terms before the other principals finish arriving." },
      it: { posture: "Not yet in. The Pact of Steel is a date.", instruments: "Delay as a price.", victory: "Enter on terms, or be paid for the hesitation." },
      jp: { posture: "A war already running, a partner in Europe.", instruments: "China, and a choice about the north.", victory: "Not abandoned by a European deal." },
      uk: { posture: "The guarantee is now a war, or it is nothing.", instruments: "The sea, credit, and a partner not yet in the room.", victory: "Not alone, and not the one who left Warsaw." },
      fr: { posture: "The same guarantee, a frontier.", instruments: "An army that must move or admit it will not.", victory: "Not 1914 again, and not 1940 by another name." },
      su: { posture: "The protocol bought time. Time is a policy.", instruments: "Depth, and a Finnish file.", victory: "No two-front war this year." },
      us: { posture: "Not in. Already the purse.", instruments: "Cash-and-carry, and a house that prefers distance.", victory: "The settlement not made without you." },
      cn: { posture: "The war that started earlier.", instruments: "Space, and a request for a real ally.", victory: "Not partitioned by everyone else's war." },
      pl: { posture: "The guarantee's subject.", instruments: "A state that must survive long enough to be rescued.", victory: "Unoccupied. Historically the hardest sentence on this table." },
      fi: { posture: "A neighbour of the protocol.", instruments: "A winter, and a reputation.", victory: "Independence, even if the border moves." },
      hu: { posture: "Revision, if the map opens.", instruments: "A claim, and Berlin.", victory: "Heavier, not occupied." },
      ro: { posture: "Oil, and a fear of both east and west.", instruments: "Ploiești, and a choice of patron.", victory: "Unoccupied, still a kingdom of a kind." },
      yu: { posture: "A guarantee of a different sort.", instruments: "A position between pacts.", victory: "Not the next campaign." },
      es: { posture: "Exhausted, non-belligerent, useful.", instruments: "A coast, and a refusal.", victory: "Not dragged in." },
      se: { posture: "Iron, and a neutrality that must be armed.", instruments: "Ore, and a Baltic that others want.", victory: "Unoccupied, still consulted." },
    },
  },
};

export function briefFor(scenarioId: string): ScenarioBrief | null {
  return SCENARIO_BRIEFS[scenarioId] ?? null;
}

const SKINS: Record<string, string> = {
  sevres_1956: "sevres-1956",
  thirteen_days_1962: "thirteen-days-1962",
  munich_1938: "munich-1938",
  molotov_ribbentrop_1939: "molotov-ribbentrop-1939",
  vienna_1815: "vienna-1815",
  july_crisis_1914: "july-crisis-1914",
  vietnam_1964: "vietnam-1964",
  afghanistan_1979: "afghanistan-1979",
  korea_1950: "korea-1950",
  the_concept_1967: "the-concept-1967",
  malvinas_1982: "malvinas-1982",
  tanker_war_1980: "tanker-war-1980",
  long_telegram_1947: "long-telegram-1947",
  berlin_conference_1884: "berlin-conference-1884",
  fragmentation_1991: "fragmentation-1991",
  grand_alliance_1939: "grand-alliance-1939",
};

export function scenarioSkin(scenarioId: string): string {
  return SKINS[scenarioId] ?? "sevres-1956";
}
