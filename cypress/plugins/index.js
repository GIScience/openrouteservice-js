// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const path = require("path");
const vite = require("vite");

const cache = {};

module.exports = (on, config) => {
  on("file:preprocessor", async (file) => {
    const { filePath, outputPath, shouldWatch } = file;
    if (cache[filePath]) {
      return cache[filePath];
    }

    const filename = path.basename(outputPath);
    const filenameWithoutExtension = path.basename(
      outputPath,
      path.extname(outputPath)
    );

    const viteConfig = {
      build: {
        emptyOutDir: false,
        minify: false,
        outDir: path.dirname(outputPath),
        sourcemap: true,
        write: true
      }
    };

    if (filename.endsWith(".html")) {
      viteConfig.build.rollupOptions = {
        input: {
          [filenameWithoutExtension]: filePath
        }
      };
    } else {
      viteConfig.build.lib = {
        entry: filePath,
        fileName: () => filename,
        formats: ["es"],
        name: filenameWithoutExtension
      };
    }

    if (shouldWatch) {
      viteConfig.build.watch = true;
    }

    const watcher = await vite.build(viteConfig);

    if (shouldWatch) {
      watcher.on("event", (event) => {
        if (event.code === "END") {
          file.emit("rerun");
        }
      });
      file.on("close", () => {
        delete cache[filePath];
        watcher.close();
      });
    }

    cache[filePath] = outputPath;
    return outputPath;
  });

  return config;
};
