import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/parcel-tracker-card.ts",
  output: {
    file: "dist/parcel-tracker-card.js",
    format: "es",
  },
  plugins: [resolve(), typescript()],
};
