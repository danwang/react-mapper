import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

const packageJson = require("./package.json");

export default {
  input: "src/Retainer.ts",
  output: [
    {
      file: packageJson.main,
      name: "retainer",
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React"
      }
    },
    {
      file: packageJson.module,
      format: "es",
      sourcemap: true,
      globals: {
        react: "React"
      }
    }
  ],
  watch: {
    include: "src/**"
  },
  plugins: [typescript({ useTsconfigDeclarationDir: true }), sourceMaps()],
  external: ["react"]
};
