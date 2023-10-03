//To access public folder prefix url with `static/media/`
const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-styling",
    "@storybook/addon-mdx-gfm"
  ],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: path.resolve(__dirname, "../next.config.js")
    }
  },
  webpackFinal: config => {
    config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];
    config.resolve.alias = {
      ...config.resolve.alias
    };
    config.resolve.alias["@"] = path.resolve(__dirname, "../src");

    // //To fix svg not loading in storybook ref: https://www.npmjs.com/package/@storybook/nextjs#custom-webpack-config
    const imageRule = config.module.rules.find(rule => {
      if (typeof rule !== "string" && rule.test instanceof RegExp) {
        return rule.test.test(".svg");
      }
    });
    if (typeof imageRule !== "string") {
      imageRule.exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"]
    });

    return config;
  },
  docs: {
    autodocs: true
  }
};
