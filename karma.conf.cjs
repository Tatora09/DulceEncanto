/**
 * Configuración de Karma + Jasmine para las pruebas unitarias del proyecto.
 * Los .spec.tsx se transpilan con ts-loader (transpileOnly) vía karma-webpack.
 * No afecta a `npm run dev` / `npm run build` (el producto final no cambia).
 */
// Detecta el navegador Chromium disponible (Chrome o Edge), sin forzar rutas en el resto de equipos.
if (!process.env.CHROME_BIN) {
  const candidatos = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  ];
  const encontrado = candidatos.find((p) => p && require("fs").existsSync(p));
  if (encontrado) process.env.CHROME_BIN = encontrado.replace(/\\/g, "/");
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "src/tests/**/*.spec.tsx", watched: false }],
    preprocessors: {
      "src/tests/**/*.spec.tsx": ["webpack"],
    },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".tsx", ".ts", ".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: { loader: "ts-loader", options: { transpileOnly: true } },
          },
        ],
      },
    },
    reporters: ["progress"],
    browsers: ["ChromeHeadless"],
    singleRun: true,
    restartOnFileChange: false,
    concurrency: 1,
  });
};
