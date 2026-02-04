import { spawn } from "child_process";

const port = process.env.PORT || "4173";

const child = spawn("npx", ["serve", "-s", "dist", "-l", port], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
