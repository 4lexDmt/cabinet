import { runSequence } from "./sequence.ts";

const seed = Number(process.argv[2] ?? 20260815);
const ticks = Number(process.argv[3] ?? 1000);
const nations = Number(process.argv[4] ?? 30);
const shuffle = process.argv[5] === "shuffle";
const { hash } = runSequence(seed, ticks, nations, shuffle);
process.stdout.write(hash);
