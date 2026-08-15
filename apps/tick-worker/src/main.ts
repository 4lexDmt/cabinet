import { runLoop } from "./loop.ts";

runLoop().catch((err) => {
  console.error(err);
  process.exit(1);
});
