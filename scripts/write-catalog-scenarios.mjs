/**
 * Writes catalog scenario JSON (S-02..S-16 except those already in repo).
 * Scenarios are config. Re-run: node scripts/write-catalog-scenarios.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../packages/scenarios");

function n(id, name, shortName, adjective, [ext, inn, eco, intel, supply], territories, extra = {}) {
  return {
    id,
    name,
    shortName,
    adjective,
    standing_external: ext,
    standing_internal: inn,
    economy: eco,
    intelligence_capacity: intel,
    supply,
    status: extra.status ?? "sovereign",
    territories,
    social_tree_unlocks: extra.unlocks ?? [],
    advisor_set: extra.advisor ?? `${id}_desk`,
  };
}

function t(id, name, owner, region, supplyValue = 8) {
  return { id, name, owner, controller: owner, region, supplyValue };
}

function ob(id, party, must, target) {
  return { id, party, must, target };
}

function pact(id, parties, type, secret, title, obligations, private_terms) {
  const terms = { title, type, secret, obligations };
  return private_terms ? { id, parties, type, secret, terms, private_terms } : { id, parties, type, secret, terms };
}

function formationsFor(nations, strength = (nation) => Math.max(3, Math.round(nation.supply / 7))) {
  return nations
    .filter((nation) => nation.status !== "exile")
    .map((nation) => ({
      id: `${nation.id}-home`,
      nationId: nation.id,
      location: nation.territories[0],
      strength: strength(nation),
    }));
}

function gte(field, value) {
  return { gte: [field, value] };
}

function write(filename, config) {
  if (config.nations.length !== config.player_slots) {
    throw new Error(`${config.id}: player_slots ${config.player_slots} != nations ${config.nations.length}`);
  }
  const ids = new Set(config.nations.map((nation) => nation.id));
  for (const terr of config.territories) {
    if (!ids.has(terr.owner) || !ids.has(terr.controller)) {
      throw new Error(`${config.id}: territory ${terr.id} owner/controller not a nation`);
    }
  }
  writeFileSync(join(dir, filename), `${JSON.stringify(config, null, 2)}\n`);
  console.log(filename, config.nations.length, "chairs");
}

const scenarios = {
  "thirteen-days-1962.json": () => {
    const nations = [
      n("us", "United States", "America", "American", [90, 74, 98, 92, 90], ["united_states_home", "jupiter_sites"], { advisor: "excomm_1962", unlocks: ["patronage"] }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [82, 68, 78, 88, 80], ["soviet_home", "cuba_missiles"], { advisor: "kremlin_1962" }),
      n("cu", "Cuba", "Cuba", "Cuban", [40, 78, 22, 48, 28], ["cuba_home"], { advisor: "havana_1962", status: "client" }),
      n("tr", "Turkey", "Turkey", "Turkish", [52, 58, 36, 44, 40], ["turkey_home"], { advisor: "ankara_1962", status: "client" }),
      n("un", "United Nations", "the Secretariat", "UN", [60, 70, 20, 55, 8], ["un_hq"], { advisor: "un_1962" }),
    ];
    return {
      id: "thirteen_days_1962",
      display_name: "Thirteen Days",
      duration_ticks: 480,
      player_slots: 5,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("united_states_home", "United States", "us", "americas", 24),
        t("jupiter_sites", "Jupiter sites", "us", "anatolia", 4),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("cuba_missiles", "Missile sites", "su", "caribbean", 6),
        t("cuba_home", "Cuba", "cu", "caribbean", 8),
        t("turkey_home", "Turkey", "tr", "anatolia", 10),
        t("un_hq", "Headquarters", "un", "americas", 2),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("nato-us-tr", ["us", "tr"], "defense", false, "NATO guarantee", [
          ob("us-no-war-tr", "us", "not_declare_war_on", "tr"),
          ob("tr-no-war-us", "tr", "not_declare_war_on", "us"),
        ]),
        pact("su-cu-cover", ["su", "cu"], "defense", true, "Cover for the island", [
          ob("su-no-war-cu", "su", "not_declare_war_on", "cu"),
          ob("cu-no-war-su", "cu", "not_declare_war_on", "su"),
        ]),
      ],
      trade_routes: [],
      flags: { missiles_in_cuba: true, jupiters_in_turkey: true, cuba_guaranteed: false, public_concession: false },
      victory_conditions: {
        us: { all_of: [gte("standing_internal", 60), { flag_eq: ["missiles_in_cuba", false] }, { flag_eq: ["public_concession", false] }] },
        su: { all_of: [{ flag_eq: ["cuba_guaranteed", true] }, { flag_eq: ["jupiters_in_turkey", false] }] },
        cu: { all_of: [{ flag_eq: ["cuba_guaranteed", true] }, { status_not: "occupied" }] },
        tr: { all_of: [gte("standing_external", 45)] },
        un: { all_of: [{ flag_eq: ["missiles_in_cuba", false] }, { flag_eq: ["public_concession", false] }] },
      },
      tuning: { secret_pact_leak_base_chance: 0.07, standing_penalty_on_breach: 22, cascade_depth_cap: 3 },
    };
  },

  "munich-1938.json": () => {
    const nations = [
      n("de", "Germany", "Germany", "German", [62, 80, 70, 68, 72], ["berlin"], { advisor: "wilhelmstrasse_1938" }),
      n("gb", "Britain", "Britain", "British", [78, 60, 80, 70, 76], ["london"], { advisor: "whitehall_1938" }),
      n("fr", "France", "France", "French", [70, 52, 68, 62, 64], ["paris"], { advisor: "quai_1938" }),
      n("cz", "Czechoslovakia", "Czechoslovakia", "Czechoslovak", [48, 64, 50, 58, 46], ["prague", "sudetenland"], { advisor: "prague_1938" }),
      n("it", "Italy", "Italy", "Italian", [55, 62, 48, 50, 50], ["rome"], { advisor: "rome_1938" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [58, 70, 60, 72, 68], ["moscow"], { advisor: "kremlin_1938" }),
      n("pl", "Poland", "Poland", "Polish", [42, 58, 32, 40, 36], ["warsaw"], { advisor: "warsaw_1938" }),
      n("hu", "Hungary", "Hungary", "Hungarian", [38, 52, 28, 36, 30], ["budapest"], { advisor: "budapest_1938" }),
    ];
    return {
      id: "munich_1938",
      display_name: "The Guarantee",
      duration_ticks: 720,
      player_slots: 8,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("berlin", "Berlin", "de", "europe", 12),
        t("london", "London", "gb", "europe", 12),
        t("paris", "Paris", "fr", "europe", 11),
        t("prague", "Prague", "cz", "europe", 8),
        t("sudetenland", "Sudetenland", "cz", "europe", 6),
        t("rome", "Rome", "it", "europe", 8),
        t("moscow", "Moscow", "su", "europe", 12),
        t("warsaw", "Warsaw", "pl", "europe", 7),
        t("budapest", "Budapest", "hu", "europe", 5),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("franco-czech", ["fr", "cz"], "defense", false, "Franco-Czechoslovak alliance", [
          ob("fr-no-war-cz", "fr", "not_declare_war_on", "cz"),
          ob("cz-no-war-fr", "cz", "not_declare_war_on", "fr"),
        ]),
        pact("franco-soviet", ["fr", "su"], "defense", false, "Franco-Soviet pact", [
          ob("fr-no-war-su", "fr", "not_declare_war_on", "su"),
          ob("su-no-war-fr", "su", "not_declare_war_on", "fr"),
        ]),
      ],
      trade_routes: [],
      flags: { sudeten_ceded: false, general_war: false },
      victory_conditions: {
        de: { all_of: [{ control: "territory:sudetenland" }, { flag_eq: ["general_war", false] }] },
        gb: { all_of: [{ flag_eq: ["general_war", false] }, gte("standing_external", 70)] },
        fr: { all_of: [{ flag_eq: ["general_war", false] }, gte("standing_external", 65)] },
        cz: { all_of: [{ control: "territory:sudetenland" }, { status_not: "occupied" }] },
        su: { all_of: [gte("standing_external", 55)] },
        it: { all_of: [gte("standing_external", 50)] },
        pl: { all_of: [{ status_not: "occupied" }] },
        hu: { all_of: [gte("standing_external", 40)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.06, standing_penalty_on_breach: 24, cascade_depth_cap: 3 },
    };
  },

  "molotov-ribbentrop-1939.json": () => {
    const nations = [
      n("de", "Germany", "Germany", "German", [74, 78, 76, 70, 78], ["berlin"], { advisor: "wilhelmstrasse_1939" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [66, 72, 64, 80, 74], ["moscow"], { advisor: "kremlin_1939" }),
      n("pl", "Poland", "Poland", "Polish", [40, 62, 34, 42, 40], ["warsaw"], { advisor: "warsaw_1939" }),
      n("gb", "Britain", "Britain", "British", [80, 58, 84, 72, 80], ["london"], { advisor: "whitehall_1939" }),
      n("fr", "France", "France", "French", [72, 50, 70, 60, 66], ["paris"], { advisor: "quai_1939" }),
      n("jp", "Japan", "Japan", "Japanese", [60, 64, 58, 62, 70], ["tokyo"], { advisor: "tokyo_1939" }),
    ];
    return {
      id: "molotov_ribbentrop_1939",
      display_name: "The Secret Protocol",
      duration_ticks: 720,
      player_slots: 6,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("berlin", "Berlin", "de", "europe", 12),
        t("moscow", "Moscow", "su", "europe", 14),
        t("warsaw", "Warsaw", "pl", "europe", 8),
        t("london", "London", "gb", "europe", 12),
        t("paris", "Paris", "fr", "europe", 11),
        t("tokyo", "Tokyo", "jp", "asia", 12),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("anti-comintern", ["de", "jp"], "defense", false, "Anti-Comintern Pact", [
          ob("de-no-war-jp", "de", "not_declare_war_on", "jp"),
          ob("jp-no-war-de", "jp", "not_declare_war_on", "de"),
        ]),
        pact("polish-guarantee", ["gb", "pl"], "defense", false, "British guarantee of Poland", [
          ob("gb-no-war-pl", "gb", "not_declare_war_on", "pl"),
          ob("pl-no-war-gb", "pl", "not_declare_war_on", "gb"),
        ]),
        pact("franco-polish", ["fr", "pl"], "defense", false, "Franco-Polish alliance", [
          ob("fr-no-war-pl", "fr", "not_declare_war_on", "pl"),
          ob("pl-no-war-fr", "pl", "not_declare_war_on", "fr"),
        ]),
      ],
      trade_routes: [],
      flags: { poland_isolated: false, secret_protocol: false },
      victory_conditions: {
        de: { all_of: [{ flag_eq: ["poland_isolated", true] }, gte("standing_external", 60)] },
        su: { all_of: [gte("standing_external", 55), { status_not: "occupied" }] },
        pl: { all_of: [{ status_not: "occupied" }, gte("standing_external", 35)] },
        gb: { all_of: [gte("standing_external", 70)] },
        fr: { all_of: [gte("standing_external", 60)] },
        jp: { all_of: [gte("standing_external", 55)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.09, standing_penalty_on_breach: 26, cascade_depth_cap: 3 },
    };
  },

  "vietnam-1964.json": () => {
    const nations = [
      n("us", "United States", "America", "American", [86, 62, 96, 88, 90], ["united_states_home"], { advisor: "foggy_bottom_1964" }),
      n("drv", "North Vietnam", "the DRV", "North Vietnamese", [44, 82, 28, 60, 40], ["hanoi"], { advisor: "hanoi_1964" }),
      n("nlf", "NLF", "the Front", "NLF", [28, 70, 12, 64, 22], ["rural_south"], { advisor: "nlf_1964", status: "rump" }),
      n("rvn", "South Vietnam", "the RVN", "South Vietnamese", [36, 42, 30, 48, 34], ["saigon"], { advisor: "saigon_1964", status: "client" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [78, 66, 80, 86, 76], ["soviet_home"], { advisor: "kremlin_1964", unlocks: ["patronage"] }),
      n("cn", "China", "China", "Chinese", [70, 72, 48, 70, 60], ["beijing"], { advisor: "beijing_1964", unlocks: ["patronage"] }),
      n("kh", "Cambodia", "Cambodia", "Cambodian", [40, 55, 18, 40, 20], ["phnom_penh"], { advisor: "phnom_penh_1964" }),
      n("la", "Laos", "Laos", "Lao", [32, 48, 14, 36, 16], ["vientiane"], { advisor: "vientiane_1964" }),
      n("au", "Australia", "Australia", "Australian", [64, 68, 58, 52, 50], ["canberra"], { advisor: "canberra_1964" }),
    ];
    return {
      id: "vietnam_1964",
      display_name: "Attrition",
      duration_ticks: 2016,
      player_slots: 9,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("united_states_home", "United States", "us", "americas", 24),
        t("hanoi", "Hanoi", "drv", "indochina", 10),
        t("rural_south", "The southern countryside", "nlf", "indochina", 6),
        t("saigon", "Saigon", "rvn", "indochina", 8),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("beijing", "Beijing", "cn", "asia", 16),
        t("phnom_penh", "Phnom Penh", "kh", "indochina", 5),
        t("vientiane", "Vientiane", "la", "indochina", 4),
        t("canberra", "Canberra", "au", "pacific", 10),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("us-rvn", ["us", "rvn"], "defense", false, "SEATO cover", [
          ob("us-no-war-rvn", "us", "not_declare_war_on", "rvn"),
          ob("rvn-no-war-us", "rvn", "not_declare_war_on", "us"),
        ]),
        pact("us-au", ["us", "au"], "defense", false, "ANZUS", [
          ob("us-no-war-au", "us", "not_declare_war_on", "au"),
          ob("au-no-war-us", "au", "not_declare_war_on", "us"),
        ]),
        pact("su-drv", ["su", "drv"], "defense", false, "Soviet aid understanding", [
          ob("su-no-war-drv", "su", "not_declare_war_on", "drv"),
          ob("drv-no-war-su", "drv", "not_declare_war_on", "su"),
        ]),
      ],
      trade_routes: [],
      flags: { rvn_independent: true },
      victory_conditions: {
        us: { all_of: [{ flag_eq: ["rvn_independent", true] }, gte("standing_internal", 50)] },
        drv: { all_of: [{ lte: ["us.standing_internal", 45] }] },
        nlf: { all_of: [{ lte: ["us.standing_internal", 45] }] },
        rvn: { all_of: [{ flag_eq: ["rvn_independent", true] }, { status_not: "occupied" }] },
        su: { all_of: [gte("standing_external", 70)] },
        cn: { all_of: [gte("standing_external", 65)] },
        kh: { all_of: [{ status_not: "occupied" }] },
        la: { all_of: [{ status_not: "occupied" }] },
        au: { all_of: [gte("standing_external", 55)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.05, standing_penalty_on_breach: 18, cascade_depth_cap: 3 },
    };
  },

  "afghanistan-1979.json": () => {
    const nations = [
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [80, 58, 82, 84, 80], ["soviet_home"], { advisor: "kremlin_1979" }),
      n("dra", "DRA", "Kabul", "DRA", [28, 36, 16, 40, 22], ["kabul"], { advisor: "kabul_1979", status: "client" }),
      n("hiz", "Hezb-e Islami", "Hekmatyar", "Hezb", [22, 60, 8, 48, 18], ["nangarhar"], { advisor: "hiz_1979" }),
      n("jam", "Jamiat-e Islami", "Jamiat", "Jamiat", [24, 62, 8, 50, 18], ["panjshir"], { advisor: "jam_1979" }),
      n("har", "Harakat", "Harakat", "Harakat", [20, 58, 6, 42, 16], ["paktia"], { advisor: "har_1979" }),
      n("pk", "Pakistan", "Pakistan", "Pakistani", [48, 55, 32, 78, 40], ["islamabad"], { advisor: "isi_1979", unlocks: ["covert_operations"] }),
      n("us", "United States", "America", "American", [88, 64, 96, 90, 88], ["united_states_home"], { advisor: "langley_1979", unlocks: ["patronage"] }),
      n("sa", "Saudi Arabia", "Saudi Arabia", "Saudi", [70, 72, 80, 55, 50], ["riyadh"], { advisor: "riyadh_1979", unlocks: ["patronage"] }),
      n("ir", "Iran", "Iran", "Iranian", [50, 60, 40, 62, 44], ["tehran"], { advisor: "tehran_1979" }),
    ];
    return {
      id: "afghanistan_1979",
      display_name: "The Bleeding Wound",
      duration_ticks: 2016,
      player_slots: 9,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("kabul", "Kabul", "dra", "hindu_kush", 8),
        t("nangarhar", "Nangarhar", "hiz", "hindu_kush", 5),
        t("panjshir", "Panjshir", "jam", "hindu_kush", 5),
        t("paktia", "Paktia", "har", "hindu_kush", 4),
        t("islamabad", "Islamabad", "pk", "south_asia", 10),
        t("united_states_home", "United States", "us", "americas", 24),
        t("riyadh", "Riyadh", "sa", "gulf", 12),
        t("tehran", "Tehran", "ir", "gulf", 10),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("su-dra", ["su", "dra"], "defense", false, "Treaty of friendship", [
          ob("su-no-war-dra", "su", "not_declare_war_on", "dra"),
          ob("dra-no-war-su", "dra", "not_declare_war_on", "su"),
        ]),
      ],
      trade_routes: [],
      flags: { dra_self_sustaining: false },
      victory_conditions: {
        su: { all_of: [{ flag_eq: ["dra_self_sustaining", true] }, gte("standing_internal", 50)] },
        dra: { all_of: [{ status_not: "occupied" }, { flag_eq: ["dra_self_sustaining", true] }] },
        hiz: { all_of: [gte("standing_external", 30)] },
        jam: { all_of: [gte("standing_external", 30)] },
        har: { all_of: [gte("standing_external", 28)] },
        pk: { all_of: [gte("standing_external", 50)] },
        us: { all_of: [{ lte: ["su.standing_internal", 50] }] },
        sa: { all_of: [{ lte: ["su.standing_internal", 50] }] },
        ir: { all_of: [gte("standing_external", 45)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.06, standing_penalty_on_breach: 16, cascade_depth_cap: 3 },
    };
  },

  "korea-1950.json": () => {
    const nations = [
      n("us", "United States", "America", "American", [90, 70, 96, 88, 92], ["united_states_home"], { advisor: "foggy_bottom_1950" }),
      n("kr", "Republic of Korea", "the ROK", "South Korean", [38, 48, 22, 40, 30], ["seoul"], { advisor: "seoul_1950", status: "client" }),
      n("kp", "DPRK", "the DPRK", "North Korean", [36, 72, 20, 44, 32], ["pyongyang"], { advisor: "pyongyang_1950", status: "client" }),
      n("cn", "China", "China", "Chinese", [58, 74, 40, 62, 70], ["beijing"], { advisor: "beijing_1950" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [80, 68, 78, 90, 76], ["soviet_home"], { advisor: "kremlin_1950" }),
      n("uk", "United Kingdom", "Britain", "British", [76, 64, 78, 72, 74], ["home_isles"], { advisor: "whitehall_1950" }),
      n("jp", "Japan", "Japan", "Japanese", [44, 52, 36, 50, 40], ["japan_home"], { advisor: "tokyo_1950" }),
    ];
    return {
      id: "korea_1950",
      display_name: "Police Action",
      duration_ticks: 1440,
      player_slots: 7,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("united_states_home", "United States", "us", "americas", 24),
        t("seoul", "Seoul", "kr", "korea", 8),
        t("pyongyang", "Pyongyang", "kp", "korea", 8),
        t("beijing", "Beijing", "cn", "asia", 16),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("home_isles", "Home Isles", "uk", "europe", 18),
        t("japan_home", "Japan", "jp", "pacific", 12),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("us-rok", ["us", "kr"], "defense", false, "US–ROK commitment", [
          ob("us-no-war-kr", "us", "not_declare_war_on", "kr"),
          ob("kr-no-war-us", "kr", "not_declare_war_on", "us"),
        ]),
        pact("su-dprk", ["su", "kp"], "defense", true, "Soviet covering support", [
          ob("su-no-war-kp", "su", "not_declare_war_on", "kp"),
          ob("kp-no-war-su", "kp", "not_declare_war_on", "su"),
        ]),
        pact("us-uk", ["us", "uk"], "defense", false, "NATO", [
          ob("us-no-war-uk", "us", "not_declare_war_on", "uk"),
          ob("uk-no-war-us", "uk", "not_declare_war_on", "us"),
        ]),
      ],
      trade_routes: [],
      flags: { deniable_exposed: false, un_authorized: true },
      victory_conditions: {
        us: { all_of: [{ status_not: "occupied" }, gte("standing_external", 70)] },
        kr: { all_of: [{ control: "territory:seoul" }, { status_not: "occupied" }] },
        kp: { all_of: [{ control: "territory:seoul" }] },
        cn: { all_of: [gte("standing_external", 55)] },
        su: { all_of: [{ flag_eq: ["deniable_exposed", false] }, gte("standing_external", 70)] },
        uk: { all_of: [gte("standing_external", 65)] },
        jp: { all_of: [{ status_not: "occupied" }] },
      },
      tuning: { secret_pact_leak_base_chance: 0.08, standing_penalty_on_breach: 22, cascade_depth_cap: 3 },
    };
  },

  "the-concept-1967.json": () => {
    const nations = [
      n("il", "Israel", "Israel", "Israeli", [52, 76, 48, 82, 58], ["israel_home"], { advisor: "kirya_1967" }),
      n("eg", "Egypt", "Egypt", "Egyptian", [58, 70, 40, 55, 50], ["egypt_home", "sinai"], { advisor: "cairo_1967" }),
      n("sy", "Syria", "Syria", "Syrian", [44, 62, 28, 50, 36], ["syria_home", "golan"], { advisor: "damascus_1967" }),
      n("jo", "Jordan", "Jordan", "Jordanian", [46, 58, 26, 48, 32], ["jordan_home", "west_bank"], { advisor: "amman_1967" }),
      n("iq", "Iraq", "Iraq", "Iraqi", [48, 60, 36, 46, 40], ["iraq_home"], { advisor: "baghdad_1967" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [80, 66, 78, 86, 74], ["soviet_home"], { advisor: "kremlin_1967" }),
      n("us", "United States", "America", "American", [88, 68, 96, 90, 88], ["united_states_home"], { advisor: "foggy_bottom_1967" }),
      n("fr", "France", "France", "French", [70, 58, 72, 70, 64], ["metropolitan_france"], { advisor: "quai_1967" }),
    ];
    return {
      id: "the_concept_1967",
      display_name: "The Concept",
      duration_ticks: 1008,
      player_slots: 8,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("israel_home", "Israel", "il", "levant", 8),
        t("egypt_home", "Egypt", "eg", "nile", 12),
        t("sinai", "Sinai", "eg", "nile", 5),
        t("syria_home", "Syria", "sy", "levant", 8),
        t("golan", "Golan", "sy", "levant", 4),
        t("jordan_home", "Jordan", "jo", "levant", 6),
        t("west_bank", "West Bank", "jo", "levant", 5),
        t("iraq_home", "Iraq", "iq", "mesopotamia", 9),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("united_states_home", "United States", "us", "americas", 24),
        t("metropolitan_france", "Metropolitan France", "fr", "europe", 16),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("egypt-syria", ["eg", "sy"], "defense", false, "United Arab understanding", [
          ob("eg-no-war-sy", "eg", "not_declare_war_on", "sy"),
          ob("sy-no-war-eg", "sy", "not_declare_war_on", "eg"),
        ]),
        pact("su-eg", ["su", "eg"], "defense", false, "Soviet patronage", [
          ob("su-no-war-eg", "su", "not_declare_war_on", "eg"),
          ob("eg-no-war-su", "eg", "not_declare_war_on", "su"),
        ]),
      ],
      trade_routes: [],
      flags: { egypt_claims_victory: false },
      victory_conditions: {
        il: { all_of: [{ status_not: "occupied" }, gte("standing_external", 45)] },
        eg: { all_of: [{ control: "territory:sinai" }, gte("standing_external", 50)] },
        sy: { all_of: [{ control: "territory:golan" }] },
        jo: { all_of: [{ control: "territory:west_bank" }, { status_not: "occupied" }] },
        iq: { all_of: [gte("standing_external", 40)] },
        su: { all_of: [gte("standing_external", 70)] },
        us: { all_of: [gte("standing_external", 75)] },
        fr: { all_of: [gte("standing_external", 60)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.07, standing_penalty_on_breach: 20, cascade_depth_cap: 3 },
    };
  },

  "malvinas-1982.json": () => {
    const nations = [
      n("uk", "United Kingdom", "Britain", "British", [76, 52, 78, 80, 74], ["home_isles", "falklands"], { advisor: "whitehall_1982" }),
      n("ar", "Argentina", "Argentina", "Argentine", [48, 28, 36, 50, 44], ["buenos_aires"], { advisor: "casa_rosada_1982" }),
      n("us", "United States", "America", "American", [90, 66, 96, 88, 90], ["united_states_home"], { advisor: "foggy_bottom_1982" }),
      n("cl", "Chile", "Chile", "Chilean", [50, 54, 34, 62, 36], ["santiago"], { advisor: "santiago_1982" }),
      n("fr", "France", "France", "French", [72, 60, 74, 70, 66], ["metropolitan_france"], { advisor: "quai_1982" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [78, 58, 76, 84, 72], ["soviet_home"], { advisor: "kremlin_1982" }),
    ];
    return {
      id: "malvinas_1982",
      display_name: "Malvinas",
      duration_ticks: 504,
      player_slots: 6,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("home_isles", "Home Isles", "uk", "europe", 18),
        t("falklands", "the Falklands", "uk", "south_atlantic", 3),
        t("buenos_aires", "Buenos Aires", "ar", "americas", 12),
        t("united_states_home", "United States", "us", "americas", 24),
        t("santiago", "Santiago", "cl", "americas", 8),
        t("metropolitan_france", "Metropolitan France", "fr", "europe", 16),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("nato-uk-us", ["uk", "us"], "defense", false, "NATO", [
          ob("uk-no-war-us", "uk", "not_declare_war_on", "us"),
          ob("us-no-war-uk", "us", "not_declare_war_on", "uk"),
        ]),
        pact("rio-us-ar", ["us", "ar"], "defense", false, "Rio Pact", [
          ob("us-no-war-ar", "us", "not_declare_war_on", "ar"),
          ob("ar-no-war-us", "ar", "not_declare_war_on", "us"),
        ]),
      ],
      trade_routes: [],
      flags: {},
      victory_conditions: {
        uk: { all_of: [{ control: "territory:falklands" }, gte("standing_internal", 50)] },
        ar: { all_of: [{ control: "territory:falklands" }, gte("standing_internal", 40)] },
        us: { all_of: [gte("standing_external", 75)] },
        cl: { all_of: [gte("standing_external", 48)] },
        fr: { all_of: [gte("standing_external", 60)] },
        su: { all_of: [gte("standing_external", 70)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.05, standing_penalty_on_breach: 18, cascade_depth_cap: 3 },
    };
  },

  "tanker-war-1980.json": () => {
    const nations = [
      n("iq", "Iraq", "Iraq", "Iraqi", [50, 64, 44, 52, 56], ["baghdad"], { advisor: "baghdad_1980" }),
      n("ir", "Iran", "Iran", "Iranian", [48, 58, 42, 60, 54], ["tehran"], { advisor: "tehran_1980" }),
      n("us", "United States", "America", "American", [90, 66, 96, 90, 88], ["united_states_home"], { advisor: "foggy_bottom_1980" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [80, 60, 78, 84, 76], ["soviet_home"], { advisor: "kremlin_1980" }),
      n("fr", "France", "France", "French", [72, 58, 74, 68, 64], ["metropolitan_france"], { advisor: "quai_1980" }),
      n("kw", "Kuwait", "Kuwait", "Kuwaiti", [54, 60, 70, 48, 30], ["kuwait_home"], { advisor: "kuwait_1980" }),
      n("sa", "Saudi Arabia", "Saudi Arabia", "Saudi", [74, 70, 88, 58, 52], ["riyadh"], { advisor: "riyadh_1980" }),
      n("sy", "Syria", "Syria", "Syrian", [46, 56, 30, 54, 36], ["damascus"], { advisor: "damascus_1980" }),
    ];
    return {
      id: "tanker_war_1980",
      display_name: "Tanker War",
      duration_ticks: 1512,
      player_slots: 8,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("baghdad", "Baghdad", "iq", "mesopotamia", 10),
        t("tehran", "Tehran", "ir", "gulf", 12),
        t("united_states_home", "United States", "us", "americas", 24),
        t("soviet_home", "Soviet Union", "su", "eurasia", 22),
        t("metropolitan_france", "Metropolitan France", "fr", "europe", 16),
        t("kuwait_home", "Kuwait", "kw", "gulf", 8),
        t("riyadh", "Riyadh", "sa", "gulf", 12),
        t("damascus", "Damascus", "sy", "levant", 8),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("us-sa", ["us", "sa"], "defense", false, "Gulf security understanding", [
          ob("us-no-war-sa", "us", "not_declare_war_on", "sa"),
          ob("sa-no-war-us", "sa", "not_declare_war_on", "us"),
        ]),
        pact("sy-ir", ["sy", "ir"], "defense", false, "Damascus–Tehran alignment", [
          ob("sy-no-war-ir", "sy", "not_declare_war_on", "ir"),
          ob("ir-no-war-sy", "ir", "not_declare_war_on", "sy"),
        ]),
      ],
      trade_routes: [{ id: "gulf-oil", from: "sa", to: "us", open: true }],
      flags: {},
      victory_conditions: {
        iq: { all_of: [gte("standing_external", 48), { status_not: "occupied" }] },
        ir: { all_of: [gte("standing_external", 48), { status_not: "occupied" }] },
        us: { all_of: [gte("standing_external", 75)] },
        su: { all_of: [gte("standing_external", 70)] },
        fr: { all_of: [gte("standing_external", 60)] },
        kw: { all_of: [{ status_not: "occupied" }] },
        sa: { all_of: [{ status_not: "occupied" }, gte("standing_external", 65)] },
        sy: { all_of: [gte("standing_external", 42)] },
      },
      tuning: { secret_pact_leak_base_chance: 0.1, standing_penalty_on_breach: 20, cascade_depth_cap: 4 },
    };
  },

  "long-telegram-1947.json": () => {
    const nations = [
      n("us", "United States", "America", "American", [92, 72, 98, 90, 92], ["united_states_home"], { advisor: "foggy_bottom_1947", unlocks: ["patronage"] }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [84, 70, 80, 88, 84], ["soviet_home"], { advisor: "kremlin_1947", unlocks: ["patronage"] }),
      n("cn", "China", "China", "Chinese", [48, 68, 30, 58, 50], ["beijing"], { advisor: "beijing_1947" }),
      n("uk", "United Kingdom", "Britain", "British", [74, 60, 70, 78, 72], ["home_isles"], { advisor: "whitehall_1947" }),
      n("fr", "France", "France", "French", [62, 52, 58, 66, 56], ["metropolitan_france"], { advisor: "quai_1947" }),
      n("de", "West Germany", "the FRG", "West German", [40, 48, 36, 50, 40], ["bonn"], { advisor: "bonn_1947", status: "client" }),
      n("yu", "Yugoslavia", "Yugoslavia", "Yugoslav", [50, 64, 34, 58, 42], ["belgrade"], { advisor: "belgrade_1947" }),
      n("in", "India", "India", "Indian", [54, 62, 32, 52, 40], ["delhi"], { advisor: "delhi_1947" }),
      n("eg", "Egypt", "Egypt", "Egyptian", [46, 60, 28, 48, 36], ["egypt_home"], { advisor: "cairo_1947" }),
      n("cu", "Cuba", "Cuba", "Cuban", [36, 58, 18, 44, 22], ["cuba_home"], { advisor: "havana_1947" }),
      n("drv", "North Vietnam", "the DRV", "North Vietnamese", [32, 74, 16, 50, 24], ["hanoi"], { advisor: "hanoi_1947" }),
      n("rvn", "South Vietnam", "the RVN", "South Vietnamese", [30, 40, 18, 42, 22], ["saigon"], { advisor: "saigon_1947", status: "client" }),
      n("kp", "DPRK", "the DPRK", "North Korean", [34, 70, 16, 46, 26], ["pyongyang"], { advisor: "pyongyang_1947", status: "client" }),
      n("kr", "Republic of Korea", "the ROK", "South Korean", [34, 46, 18, 42, 26], ["seoul"], { advisor: "seoul_1947", status: "client" }),
      n("ir", "Iran", "Iran", "Iranian", [48, 52, 34, 50, 38], ["tehran"], { advisor: "tehran_1947" }),
      n("il", "Israel", "Israel", "Israeli", [42, 70, 28, 68, 36], ["israel_home"], { advisor: "kirya_1947" }),
      n("pl", "Poland", "Poland", "Polish", [38, 44, 28, 48, 34], ["warsaw"], { advisor: "warsaw_1947", status: "client" }),
      n("hu", "Hungary", "Hungary", "Hungarian", [36, 42, 24, 46, 30], ["budapest"], { advisor: "budapest_1947", status: "client" }),
      n("cz", "Czechoslovakia", "Czechoslovakia", "Czechoslovak", [40, 46, 30, 50, 34], ["prague"], { advisor: "prague_1947", status: "client" }),
      n("cl", "Chile", "Chile", "Chilean", [50, 54, 32, 52, 34], ["santiago"], { advisor: "santiago_1947" }),
      n("cg", "Congo", "the Congo", "Congolese", [28, 36, 14, 34, 20], ["leopoldville"], { advisor: "leopoldville_1947" }),
      n("id", "Indonesia", "Indonesia", "Indonesian", [44, 50, 26, 46, 32], ["jakarta"], { advisor: "jakarta_1947" }),
      n("ao", "Angola", "Angola", "Angolan", [26, 40, 12, 32, 18], ["luanda"], { advisor: "luanda_1947" }),
    ];
    return {
      id: "long_telegram_1947",
      display_name: "The Long Telegram",
      duration_ticks: 4032,
      player_slots: 23,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("united_states_home", "United States", "us", "americas", 24),
        t("soviet_home", "Soviet Union", "su", "eurasia", 24),
        t("beijing", "Beijing", "cn", "asia", 16),
        t("home_isles", "Home Isles", "uk", "europe", 16),
        t("metropolitan_france", "Metropolitan France", "fr", "europe", 14),
        t("bonn", "Bonn", "de", "europe", 10),
        t("belgrade", "Belgrade", "yu", "europe", 8),
        t("delhi", "Delhi", "in", "south_asia", 14),
        t("egypt_home", "Egypt", "eg", "nile", 10),
        t("cuba_home", "Cuba", "cu", "caribbean", 6),
        t("hanoi", "Hanoi", "drv", "indochina", 6),
        t("saigon", "Saigon", "rvn", "indochina", 6),
        t("pyongyang", "Pyongyang", "kp", "korea", 6),
        t("seoul", "Seoul", "kr", "korea", 6),
        t("tehran", "Tehran", "ir", "gulf", 8),
        t("israel_home", "Israel", "il", "levant", 6),
        t("warsaw", "Warsaw", "pl", "europe", 8),
        t("budapest", "Budapest", "hu", "europe", 6),
        t("prague", "Prague", "cz", "europe", 7),
        t("santiago", "Santiago", "cl", "americas", 8),
        t("leopoldville", "Léopoldville", "cg", "africa", 6),
        t("jakarta", "Jakarta", "id", "asia", 10),
        t("luanda", "Luanda", "ao", "africa", 5),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("nato-core", ["us", "uk"], "defense", false, "Atlantic alliance", [
          ob("us-no-war-uk", "us", "not_declare_war_on", "uk"),
          ob("uk-no-war-us", "uk", "not_declare_war_on", "us"),
        ]),
        pact("nato-fr", ["us", "fr"], "defense", false, "Atlantic alliance", [
          ob("us-no-war-fr", "us", "not_declare_war_on", "fr"),
          ob("fr-no-war-us", "fr", "not_declare_war_on", "us"),
        ]),
        pact("warsaw-pl", ["su", "pl"], "defense", false, "Warsaw covering", [
          ob("su-no-war-pl", "su", "not_declare_war_on", "pl"),
          ob("pl-no-war-su", "pl", "not_declare_war_on", "su"),
        ]),
        pact("warsaw-hu", ["su", "hu"], "defense", false, "Warsaw covering", [
          ob("su-no-war-hu", "su", "not_declare_war_on", "hu"),
          ob("hu-no-war-su", "hu", "not_declare_war_on", "su"),
        ]),
        pact("warsaw-cz", ["su", "cz"], "defense", false, "Warsaw covering", [
          ob("su-no-war-cz", "su", "not_declare_war_on", "cz"),
          ob("cz-no-war-su", "cz", "not_declare_war_on", "su"),
        ]),
      ],
      trade_routes: [],
      flags: { nuclear_exchange: false },
      victory_conditions: Object.fromEntries(
        nations.map((nation) => [
          nation.id,
          {
            all_of: [
              { flag_eq: ["nuclear_exchange", false] },
              nation.id === "us" || nation.id === "su" ? gte("standing_external", 70) : gte("standing_external", 35),
            ],
          },
        ]),
      ),
      tuning: { secret_pact_leak_base_chance: 0.06, standing_penalty_on_breach: 22, cascade_depth_cap: 3 },
    };
  },

  "berlin-conference-1884.json": () => {
    const nations = [
      n("gb", "Britain", "Britain", "British", [88, 70, 90, 72, 84], ["london"], { advisor: "whitehall_1884" }),
      n("fr", "France", "France", "French", [76, 58, 74, 64, 70], ["paris"], { advisor: "quai_1884" }),
      n("de", "Germany", "Germany", "German", [80, 74, 78, 66, 76], ["berlin"], { advisor: "berlin_1884" }),
      n("be", "Belgium", "Belgium", "Belgian", [54, 60, 48, 50, 36], ["brussels"], { advisor: "brussels_1884" }),
      n("pt", "Portugal", "Portugal", "Portuguese", [50, 52, 36, 40, 34], ["lisbon"], { advisor: "lisbon_1884" }),
      n("it", "Italy", "Italy", "Italian", [58, 56, 44, 46, 42], ["rome"], { advisor: "rome_1884" }),
      n("es", "Spain", "Spain", "Spanish", [48, 50, 34, 38, 36], ["madrid"], { advisor: "madrid_1884" }),
      n("et", "Ethiopia", "Ethiopia", "Ethiopian", [46, 72, 24, 48, 40], ["addis"], { advisor: "addis_1884" }),
      n("as", "Asante", "Asante", "Asante", [34, 68, 16, 44, 28], ["kumasi"], { advisor: "kumasi_1884" }),
      n("sk", "Sokoto", "Sokoto", "Sokoto", [36, 66, 18, 42, 30], ["sokoto"], { advisor: "sokoto_1884" }),
      n("zu", "Zulu Kingdom", "the Zulu", "Zulu", [32, 70, 12, 38, 26], ["ulundi"], { advisor: "ulundi_1884" }),
      n("bg", "Buganda", "Buganda", "Buganda", [30, 64, 12, 40, 22], ["mengo"], { advisor: "mengo_1884" }),
      n("mg", "Madagascar", "Madagascar", "Malagasy", [34, 60, 14, 36, 24], ["antananarivo"], { advisor: "antananarivo_1884" }),
    ];
    return {
      id: "berlin_conference_1884",
      display_name: "Effective Occupation",
      duration_ticks: 1512,
      player_slots: 13,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("london", "London", "gb", "europe", 14),
        t("paris", "Paris", "fr", "europe", 12),
        t("berlin", "Berlin", "de", "europe", 12),
        t("brussels", "Brussels", "be", "europe", 6),
        t("lisbon", "Lisbon", "pt", "europe", 6),
        t("rome", "Rome", "it", "europe", 8),
        t("madrid", "Madrid", "es", "europe", 8),
        t("addis", "Addis Ababa", "et", "africa", 8),
        t("kumasi", "Kumasi", "as", "africa", 5),
        t("sokoto", "Sokoto", "sk", "africa", 6),
        t("ulundi", "Ulundi", "zu", "africa", 5),
        t("mengo", "Mengo", "bg", "africa", 4),
        t("antananarivo", "Antananarivo", "mg", "africa", 6),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("sokoto-treaty", ["gb", "sk"], "passage", false, "Treaty of friendship and protection", [
          ob("sk-passage-gb", "sk", "provide_passage", "gb"),
        ], {
          title: "Treaty of friendship and protection",
          type: "tribute",
          secret: true,
          obligations: [ob("sk-tribute-gb", "sk", "pay_tribute", "gb")],
        }),
      ],
      trade_routes: [],
      flags: { ethiopia_independent: true },
      victory_conditions: {
        gb: { all_of: [gte("standing_external", 75)] },
        fr: { all_of: [gte("standing_external", 65)] },
        de: { all_of: [gte("standing_external", 70)] },
        be: { all_of: [gte("standing_external", 50)] },
        pt: { all_of: [gte("standing_external", 45)] },
        it: { all_of: [gte("standing_external", 50)] },
        es: { all_of: [gte("standing_external", 42)] },
        et: { all_of: [{ flag_eq: ["ethiopia_independent", true] }, { status_not: "occupied" }] },
        as: { all_of: [{ status_not: "occupied" }] },
        sk: { all_of: [{ status_not: "occupied" }] },
        zu: { all_of: [{ status_not: "occupied" }] },
        bg: { all_of: [{ status_not: "occupied" }] },
        mg: { all_of: [{ status_not: "occupied" }] },
      },
      tuning: { secret_pact_leak_base_chance: 0.05, standing_penalty_on_breach: 18, cascade_depth_cap: 3 },
    };
  },

  "fragmentation-1991.json": () => {
    const nations = [
      n("rs", "Serbia", "Serbia", "Serbian", [48, 32, 36, 52, 44], ["belgrade"], { advisor: "belgrade_1991" }),
      n("hr", "Croatia", "Croatia", "Croatian", [42, 58, 28, 48, 32], ["zagreb"], { advisor: "zagreb_1991" }),
      n("ba", "Bosnia", "Bosnia", "Bosnian", [30, 28, 18, 40, 22], ["sarajevo"], { advisor: "sarajevo_1991" }),
      n("si", "Slovenia", "Slovenia", "Slovene", [40, 62, 26, 44, 24], ["ljubljana"], { advisor: "ljubljana_1991" }),
      n("mk", "Macedonia", "Macedonia", "Macedonian", [32, 50, 16, 36, 20], ["skopje"], { advisor: "skopje_1991" }),
      n("xk", "Kosovo", "Kosovo", "Kosovar", [22, 40, 8, 34, 12], ["pristina"], { advisor: "pristina_1991", status: "rump" }),
      n("eu", "European Community", "the Community", "European", [70, 58, 80, 62, 40], ["brussels"], { advisor: "brussels_1991" }),
      n("us", "United States", "America", "American", [90, 64, 96, 88, 88], ["united_states_home"], { advisor: "foggy_bottom_1991" }),
      n("ru", "Russia", "Russia", "Russian", [62, 40, 48, 72, 60], ["moscow"], { advisor: "moscow_1991" }),
      n("un", "United Nations", "the United Nations", "UN", [64, 66, 24, 58, 10], ["un_hq"], { advisor: "un_1991" }),
    ];
    return {
      id: "fragmentation_1991",
      display_name: "Fragmentation",
      duration_ticks: 2016,
      player_slots: 10,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("belgrade", "Belgrade", "rs", "balkans", 8),
        t("zagreb", "Zagreb", "hr", "balkans", 6),
        t("sarajevo", "Sarajevo", "ba", "balkans", 5),
        t("ljubljana", "Ljubljana", "si", "balkans", 4),
        t("skopje", "Skopje", "mk", "balkans", 4),
        t("pristina", "Pristina", "xk", "balkans", 3),
        t("brussels", "Brussels", "eu", "europe", 8),
        t("united_states_home", "United States", "us", "americas", 24),
        t("moscow", "Moscow", "ru", "europe", 16),
        t("un_hq", "Headquarters", "un", "americas", 2),
      ],
      formations: formationsFor(nations),
      starting_pacts: [],
      trade_routes: [],
      flags: { recognized_slovenia: false, recognized_croatia: false, intervention_threshold: false },
      victory_conditions: {
        rs: { all_of: [gte("standing_internal", 40), { status_not: "occupied" }] },
        hr: { all_of: [{ flag_eq: ["recognized_croatia", true] }, { status_not: "occupied" }] },
        ba: { all_of: [{ status_not: "occupied" }, gte("standing_internal", 30)] },
        si: { all_of: [{ flag_eq: ["recognized_slovenia", true] }] },
        mk: { all_of: [{ status_not: "occupied" }] },
        xk: { all_of: [gte("standing_external", 25)] },
        eu: { all_of: [{ flag_eq: ["intervention_threshold", false] }, gte("standing_external", 60)] },
        us: { all_of: [gte("standing_external", 75)] },
        ru: { all_of: [gte("standing_external", 50)] },
        un: { all_of: [{ flag_eq: ["intervention_threshold", false] }] },
      },
      tuning: { secret_pact_leak_base_chance: 0.05, standing_penalty_on_breach: 20, cascade_depth_cap: 3 },
    };
  },

  "grand-alliance-1939.json": () => {
    const nations = [
      n("de", "Germany", "Germany", "German", [78, 80, 80, 72, 84], ["berlin"], { advisor: "wilhelmstrasse_1939" }),
      n("it", "Italy", "Italy", "Italian", [58, 64, 50, 52, 54], ["rome"], { advisor: "rome_1939" }),
      n("jp", "Japan", "Japan", "Japanese", [66, 70, 60, 64, 72], ["tokyo"], { advisor: "tokyo_1939" }),
      n("uk", "United Kingdom", "Britain", "British", [82, 62, 86, 76, 82], ["london"], { advisor: "whitehall_1939" }),
      n("fr", "France", "France", "French", [74, 52, 72, 64, 70], ["paris"], { advisor: "quai_1939" }),
      n("su", "Soviet Union", "the Soviet Union", "Soviet", [70, 68, 66, 78, 80], ["moscow"], { advisor: "kremlin_1939" }),
      n("us", "United States", "America", "American", [86, 64, 96, 80, 88], ["united_states_home"], { advisor: "foggy_bottom_1939" }),
      n("cn", "China", "China", "Chinese", [40, 48, 24, 50, 36], ["chongqing"], { advisor: "chongqing_1939" }),
      n("pl", "Poland", "Poland", "Polish", [42, 58, 32, 44, 40], ["warsaw"], { advisor: "warsaw_1939" }),
      n("fi", "Finland", "Finland", "Finnish", [48, 66, 30, 46, 34], ["helsinki"], { advisor: "helsinki_1939" }),
      n("hu", "Hungary", "Hungary", "Hungarian", [44, 56, 28, 40, 32], ["budapest"], { advisor: "budapest_1939" }),
      n("ro", "Romania", "Romania", "Romanian", [46, 52, 34, 42, 36], ["bucharest"], { advisor: "bucharest_1939" }),
      n("yu", "Yugoslavia", "Yugoslavia", "Yugoslav", [44, 50, 30, 44, 34], ["belgrade"], { advisor: "belgrade_1939" }),
      n("es", "Spain", "Spain", "Spanish", [40, 44, 22, 40, 28], ["madrid"], { advisor: "madrid_1939" }),
      n("se", "Sweden", "Sweden", "Swedish", [56, 70, 48, 50, 40], ["stockholm"], { advisor: "stockholm_1939" }),
    ];
    return {
      id: "grand_alliance_1939",
      display_name: "Grand Alliance",
      duration_ticks: 3024,
      player_slots: 15,
      requires_systems: ["pacts", "standing", "channels"],
      nations,
      territories: [
        t("berlin", "Berlin", "de", "europe", 14),
        t("rome", "Rome", "it", "europe", 10),
        t("tokyo", "Tokyo", "jp", "asia", 12),
        t("london", "London", "uk", "europe", 14),
        t("paris", "Paris", "fr", "europe", 12),
        t("moscow", "Moscow", "su", "europe", 16),
        t("united_states_home", "United States", "us", "americas", 24),
        t("chongqing", "Chongqing", "cn", "asia", 10),
        t("warsaw", "Warsaw", "pl", "europe", 8),
        t("helsinki", "Helsinki", "fi", "europe", 6),
        t("budapest", "Budapest", "hu", "europe", 6),
        t("bucharest", "Bucharest", "ro", "europe", 7),
        t("belgrade", "Belgrade", "yu", "europe", 6),
        t("madrid", "Madrid", "es", "europe", 8),
        t("stockholm", "Stockholm", "se", "europe", 6),
      ],
      formations: formationsFor(nations),
      starting_pacts: [
        pact("pact-of-steel", ["de", "it"], "defense", false, "Pact of Steel", [
          ob("de-no-war-it", "de", "not_declare_war_on", "it"),
          ob("it-no-war-de", "it", "not_declare_war_on", "de"),
        ]),
        pact("molotov-public", ["de", "su"], "non_aggression", false, "German–Soviet non-aggression", [
          ob("de-no-war-su", "de", "not_declare_war_on", "su"),
          ob("su-no-war-de", "su", "not_declare_war_on", "de"),
        ], {
          title: "Secret protocol",
          type: "custom",
          secret: true,
          obligations: [
            ob("de-no-war-su-priv", "de", "not_declare_war_on", "su"),
            ob("su-no-war-de-priv", "su", "not_declare_war_on", "de"),
          ],
        }),
        pact("allied-guarantee", ["uk", "pl"], "defense", false, "Guarantee of Poland", [
          ob("uk-no-war-pl", "uk", "not_declare_war_on", "pl"),
          ob("pl-no-war-uk", "pl", "not_declare_war_on", "uk"),
        ]),
        pact("franco-polish", ["fr", "pl"], "defense", false, "Franco-Polish alliance", [
          ob("fr-no-war-pl", "fr", "not_declare_war_on", "pl"),
          ob("pl-no-war-fr", "pl", "not_declare_war_on", "fr"),
        ]),
      ],
      trade_routes: [],
      flags: { general_war: false },
      victory_conditions: Object.fromEntries(
        nations.map((nation) => [
          nation.id,
          nation.id === "pl"
            ? { all_of: [{ status_not: "occupied" }] }
            : { all_of: [gte("standing_external", nation.id === "de" || nation.id === "uk" || nation.id === "su" || nation.id === "us" ? 60 : 40)] },
        ]),
      ),
      tuning: { secret_pact_leak_base_chance: 0.07, standing_penalty_on_breach: 24, cascade_depth_cap: 3 },
    };
  },
};

for (const [file, build] of Object.entries(scenarios)) {
  write(file, build());
}
