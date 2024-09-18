import { defineConfig } from "@openapi-codegen/cli";
import { generateFetchers, generateReactQueryComponents, generateSchemaTypes } from "@openapi-codegen/typescript";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  api: {
    from: {
      source: "url",
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/documentation/v2/raw`
    },
    outputDir: "src/generated",
    to: async context => {
      let paths = context.openAPIDocument.paths;
      let newPaths: any = {};
      //! Treat carefully this might potentially break the api generation
      // This Logic will make sure every sigle endpoint has a `operationId` key (needed to generate endpoints)
      Object.keys(paths).forEach((k, i) => {
        newPaths[k] = {};
        const eps = Object.keys(paths[k]).filter(ep => ep !== "parameters");
        eps.forEach((ep, i) => {
          const current = paths[k][ep];
          const operationId = ep + k.replaceAll("/", "-").replaceAll("{", "").replaceAll("}", "");
          newPaths[k][ep] = {
            ...current,
            operationId
          };
        });
      });
      context.openAPIDocument.paths = newPaths;
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  },
  userService: {
    from: {
      source: "url",
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-service/documentation/api-json`
    },
    outputDir: "src/generated/v3/userService",
    to: async context => {
      const filenamePrefix = "userService";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix
      });
      await generateFetchers(context, {
        filenamePrefix,
        schemasFiles
      });
    }
  }
});
