import { defineConfig } from "@openapi-codegen/cli";
import { Config } from "@openapi-codegen/cli/lib/types";
import { generateFetchers, generateReactQueryComponents, generateSchemaTypes } from "@openapi-codegen/typescript";
import { ConfigBase, Context } from "@openapi-codegen/typescript/lib/generators/types";
import c from "case";
import dotenv from "dotenv";
import _ from "lodash";
import { isReferenceObject, OperationObject, PathItemObject, SchemaObject } from "openapi3-ts";
import { Project, ts } from "ts-morph";

const f = ts.factory;

dotenv.config();

// constants/environment.ts can't be imported here, so the bits that are relevant are adopted to this file
const ENVIRONMENT_NAMES = ["local", "dev", "test", "staging", "prod"] as const;
type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

type Environment = {
  apiBaseUrl: string;
  userServiceUrl: string;
  jobServiceUrl: string;
  researchServiceUrl: string;
  entityServiceUrl: string;
  dashboardServiceUrl: string;
};

const ENVIRONMENTS: { [Property in EnvironmentName]: Environment } = {
  local: {
    apiBaseUrl: "http://localhost:8080",
    userServiceUrl: "http://localhost:4010",
    jobServiceUrl: "http://localhost:4020",
    researchServiceUrl: "http://localhost:4030",
    entityServiceUrl: "http://localhost:4050",
    dashboardServiceUrl: "http://localhost:4060"
  },
  dev: {
    apiBaseUrl: "https://api-dev.terramatch.org",
    userServiceUrl: "https://api-dev.terramatch.org",
    jobServiceUrl: "https://api-dev.terramatch.org",
    researchServiceUrl: "https://api-dev.terramatch.org",
    entityServiceUrl: "https://api-dev.terramatch.org",
    dashboardServiceUrl: "https://api-dev.terramatch.org"
  },
  test: {
    apiBaseUrl: "https://api-test.terramatch.org",
    userServiceUrl: "https://api-test.terramatch.org",
    jobServiceUrl: "https://api-test.terramatch.org",
    researchServiceUrl: "https://api-test.terramatch.org",
    entityServiceUrl: "https://api-test.terramatch.org",
    dashboardServiceUrl: "https://api-test.terramatch.org"
  },
  staging: {
    apiBaseUrl: "https://api-staging.terramatch.org",
    userServiceUrl: "https://api-staging.terramatch.org",
    jobServiceUrl: "https://api-staging.terramatch.org",
    researchServiceUrl: "https://api-staging.terramatch.org",
    entityServiceUrl: "https://api-staging.terramatch.org",
    dashboardServiceUrl: "https://api-staging.terramatch.org"
  },
  prod: {
    apiBaseUrl: "https://api.terramatch.org",
    userServiceUrl: "https://api.terramatch.org",
    jobServiceUrl: "https://api.terramatch.org",
    researchServiceUrl: "https://api.terramatch.org",
    entityServiceUrl: "https://api.terramatch.org",
    dashboardServiceUrl: "https://api.terramatch.org"
  }
};

const declaredEnv = (process.env.NEXT_PUBLIC_TARGET_ENV ?? "local") as EnvironmentName;
if (!ENVIRONMENT_NAMES.includes(declaredEnv as EnvironmentName)) {
  throw `Environment name is not valid! [${declaredEnv}]`;
}

const DEFAULTS = ENVIRONMENTS[declaredEnv];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULTS.apiBaseUrl;
const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? DEFAULTS.userServiceUrl;
const jobServiceUrl = process.env.NEXT_PUBLIC_JOB_SERVICE_URL ?? DEFAULTS.jobServiceUrl;
const researchServiceUrl = process.env.NEXT_PUBLIC_RESEARCH_SERVICE_URL ?? DEFAULTS.researchServiceUrl;
const entityServiceUrl = process.env.NEXT_PUBLIC_ENTITY_SERVICE_URL ?? DEFAULTS.entityServiceUrl;
const dashboardServiceUrl = process.env.NEXT_PUBLIC_DASHBOARD_SERVICE_URL ?? DEFAULTS.dashboardServiceUrl;

// The services defined in the v3 Node BE codebase. Although the URL path for APIs in the v3 space
// are namespaced by feature set rather than service (a service may contain multiple namespaces), we
// isolate the generated API integration by service to make it easier for a developer to find where
// the associated BE code is for a given FE API integration.
const SERVICES = {
  "user-service": userServiceUrl,
  "job-service": jobServiceUrl,
  "research-service": researchServiceUrl,
  "entity-service": entityServiceUrl,
  "dashboard-service": dashboardServiceUrl
};

const config: Record<string, Config> = {
  api: {
    from: {
      source: "url",
      url: `${apiBaseUrl}/documentation/v2/raw`
    },
    outputDir: "src/generated",
    to: async context => {
      let paths = context.openAPIDocument.paths;
      let newPaths: any = {};
      //! Treat carefully this might potentially break the api generation
      // This Logic will make sure every single endpoint has a `operationId` key (needed to generate endpoints)
      Object.keys(paths).forEach(k => {
        newPaths[k] = {};
        const eps = Object.keys(paths[k]).filter(ep => ep !== "parameters");
        eps.forEach(ep => {
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
  }
};

for (const [service, baseUrl] of Object.entries(SERVICES)) {
  const name = _.camelCase(service);
  config[name] = {
    from: {
      source: "url",
      url: `${baseUrl}/${service}/documentation/api-json`
    },
    outputDir: `src/generated/v3/${name}`,
    to: async context => {
      const { schemasFiles } = await generateSchemaTypes(context, { filenamePrefix: name });
      await generateFetchers(context, { filenamePrefix: name, schemasFiles });
      await rewriteComponents(context, { filenamePrefix: name });
      await generateConstants(context, { filenamePrefix: name });
    }
  };
}

export default defineConfig(config);

const generateLiteral = (value: unknown) => {
  if (_.isString(value)) return f.createStringLiteral(value);
  else if (_.isNumber(value)) return f.createNumericLiteral(value);
  else if (_.isArray(value)) {
    const literals: ts.Expression[] = [];
    value.forEach(member => {
      const literal = generateLiteral(member);
      if (literal != null) literals.push(literal);
    });
    return f.createArrayLiteralExpression(literals, true);
  } else if (_.isObject(value)) {
    const properties: ts.PropertyAssignment[] = [];
    Object.entries(value).forEach(([key, value]) => {
      const childLiteral = generateLiteral(value);
      const name = key.includes("-") ? f.createStringLiteral(key) : key;
      if (childLiteral != null) properties.push(f.createPropertyAssignment(name, childLiteral));
    });
    return f.createObjectLiteralExpression(properties, true);
  }
};

const formatFilename = (filenameSuffix: string, context: Context, config: ConfigBase) => {
  const filenamePrefix = c.snake(config.filenamePrefix ?? context.openAPIDocument.info.title) + "-";
  const formatFunction = config.filenameCase ? c[config.filenameCase] : c.camel;
  return formatFunction(filenamePrefix + filenameSuffix);
};

const writeFile = async (nodes: ts.Node[], filenameSuffix: string, context: Context, config: ConfigBase) => {
  const sourceFile = ts.createSourceFile("index.ts", "", ts.ScriptTarget.Latest);

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
  });

  const filename = formatFilename(filenameSuffix, context, config);

  await context.writeFile(
    filename + ".ts",
    nodes
      .map(
        (node, i, nodes) =>
          printer.printNode(ts.EmitHint.Unspecified, node, sourceFile) +
          (ts.isJSDoc(node) || (ts.isImportDeclaration(node) && nodes[i + 1] && ts.isImportDeclaration(nodes[i + 1]))
            ? ""
            : "\n")
      )
      .join("\n")
  );
};

/**
 * Rewrites the generated components file from openapi-codegen to replace the fetchers that were generated
 * with instances of V3ApiEndpoint that are more generally useful for the v3 / connection system.
 */
const rewriteComponents = async (context: Context, config: ConfigBase) => {
  const filename =
    "src/generated/v3/" + config.filenamePrefix + "/" + formatFilename("-components", context, config) + ".ts";

  // if we don't skip adding all files, it loads the entire project, which takes several extra seconds.
  const project = new Project({ tsConfigFilePath: "./tsconfig.json", skipAddingFilesFromTsConfig: true });
  project.addSourceFileAtPath(filename);
  const components = project.getSourceFile(filename);
  if (components == null) throw new Error("Components file not found: " + filename);

  for (const variable of components.getVariableDeclarations()) {
    if (variable.getName() === "operationsByTag") continue;

    const assert = (condition: boolean, error: string) => {
      if (!condition) {
        throw new Error(`Unable to replace ${variable.getName()}: ${error}`);
      }
    };

    const fetcher = variable.getFirstChildByKind(ts.SyntaxKind.ArrowFunction);
    assert(fetcher != null, "no arrow function found");
    const parameters = fetcher!.getParameters();
    const variablesType = parameters.length === 1 ? undefined : parameters[0].getTypeNode();

    const call = fetcher!.getBody().asKindOrThrow(ts.SyntaxKind.CallExpression);
    const responseType = call.getTypeArguments()[0];
    const errorType = call.getTypeArguments()[1];
    const headersType = call.getTypeArguments()[3];
    assert(responseType != null, "no response type found");
    assert(errorType != null, "no error type found");
    assert(headersType != null, "no headers type found");

    const args = call.getArguments()[0].asKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression);
    const urlProperty = args.getProperty("url");
    const methodProperty = args.getProperty("method");
    assert(urlProperty != null, "no url found");
    assert(methodProperty != null, "no method found");
    const url = urlProperty!.asKindOrThrow(ts.SyntaxKind.PropertyAssignment).getStructure().initializer;
    const method = methodProperty!.asKindOrThrow(ts.SyntaxKind.PropertyAssignment).getStructure().initializer;

    variable.setInitializer(
      `new V3ApiEndpoint<${responseType.getText()}, ${errorType.getText()}, ${
        variablesType?.getText() ?? "{}"
      }, ${headersType.getText()}>(${url}, ${String(method).toUpperCase()})`
    );
  }

  components.addImportDeclaration({ moduleSpecifier: "../utils", namedImports: ["V3ApiEndpoint"] });
  components.organizeImports();
  await components.save();
};

const generateConstants = async (context: Context, config: ConfigBase) => {
  const nodes: ts.Node[] = [];
  const dtoImports = new Set<string>();

  // A mapping of resource type to a set of the DTOs represented for that type.
  const resources: _.Dictionary<Set<string>> = {};
  Object.values(context.openAPIDocument.paths).forEach((verbs: PathItemObject) => {
    Object.entries(verbs).forEach(([verb, operation]: [string, OperationObject]) => {
      if (!["get", "post", "put", "patch"].includes(verb)) return;

      // Find the response schema for the first 2XX response in the definition. There is expected to
      // be only one 2XX response defined.
      const okResponse = Object.entries(operation.responses ?? {}).find(([code]) => code.startsWith("2"))?.[1];
      const schema = okResponse?.content?.["application/json"]?.schema as SchemaObject;
      if (schema == null) return;

      const schemaProperties: _.Dictionary<SchemaObject>[] =
        schema.oneOf == null
          ? [schema.properties!]
          : (schema.oneOf as SchemaObject[]).map(({ properties }) => properties!);
      for (const schema of schemaProperties) {
        for (const definition of [schema.data, schema.included]) {
          if (definition == null) continue;

          const allDtoProperties: _.Dictionary<SchemaObject>[] = [];
          if (definition.type === "object") allDtoProperties.push(definition.properties!);
          else {
            if ((definition.items! as SchemaObject).oneOf != null) {
              for (const oneOf of (definition.items! as SchemaObject).oneOf!) {
                allDtoProperties.push((oneOf as SchemaObject).properties!);
              }
            } else {
              allDtoProperties.push((definition.items! as SchemaObject).properties!);
            }
          }
          for (const dtoProperties of allDtoProperties) {
            const type = dtoProperties.type!.example as string;
            const dtoName = (dtoProperties.attributes!["$ref"] as string).split("/").pop();
            // All top level `data` members of a JSON API schema from the v3 API should have a "type" with an
            // example specifying the resource type, and a ref to a DTO schema definition.
            if (type == null || dtoName == null) {
              throw new Error("Invalid operation definition from v3 API: " + operation.operationId);
            }

            if (resources[type] == null) resources[type] = new Set<string>();
            resources[type].add(dtoName);
          }
        }
      }
    });
  });

  const dtoTypes: ts.TypeElement[] = [];
  Object.entries(resources).forEach(([resourceType, dtoSet]) => {
    const dtoNames = [...dtoSet.values()];
    dtoNames.forEach(dtoName => dtoImports.add(dtoName));
    const dtosType = f.createTypeReferenceNode("StoreResourceMap", [
      dtoNames.length === 1
        ? f.createTypeReferenceNode(dtoNames[0])
        : f.createUnionTypeNode(dtoNames.map(dtoName => f.createTypeReferenceNode(dtoName)))
    ]);

    dtoTypes.push(f.createPropertySignature(undefined, resourceType, undefined, dtosType));
  });
  if (dtoTypes.length > 0) {
    nodes.unshift(
      createNamedImport("StoreResourceMap", "@/store/apiSlice"),
      createNamedImport([...dtoImports.values()], `./${formatFilename("-schemas", context, config)}`)
    );

    nodes.push(
      f.createPropertyDeclaration(
        [f.createModifier(ts.SyntaxKind.ExportKeyword), f.createModifier(ts.SyntaxKind.ConstKeyword)],
        _.snakeCase(`${config.filenamePrefix}_RESOURCES`).toUpperCase(),
        undefined,
        undefined,
        f.createAsExpression(
          f.createArrayLiteralExpression(
            Object.keys(resources).map(resourceType => f.createStringLiteral(resourceType)),
            true
          ),
          f.createTypeReferenceNode("const")
        )
      )
    );

    nodes.push(
      f.createTypeAliasDeclaration(
        [f.createModifier(ts.SyntaxKind.ExportKeyword)],
        _.upperFirst(_.camelCase(`${config.filenamePrefix}ApiResources`)),
        undefined,
        f.createTypeLiteralNode(dtoTypes)
      )
    );
  }

  Object.entries(context.openAPIDocument.components?.schemas ?? {}).forEach(([componentName, componentSchema]) => {
    if (
      isReferenceObject(componentSchema) ||
      componentSchema?.description !== "CONSTANTS" ||
      componentSchema?.properties == null
    ) {
      return;
    }

    const properties: ts.PropertyAssignment[] = [];
    Object.entries(componentSchema.properties).forEach(([propertyName, propertySchema]) => {
      if (isReferenceObject(propertySchema) || propertySchema.type == null || propertySchema.example == null) return;

      const literal = generateLiteral(propertySchema.example);
      if (literal != null) {
        properties.push(
          f.createPropertyAssignment(propertyName, f.createAsExpression(literal, f.createTypeReferenceNode("const")))
        );
      }
    });
    nodes.push(
      f.createPropertyDeclaration(
        [f.createModifier(ts.SyntaxKind.ExportKeyword), f.createModifier(ts.SyntaxKind.ConstKeyword)],
        componentName,
        undefined,
        undefined,
        f.createAsExpression(f.createObjectLiteralExpression(properties, true), f.createTypeReferenceNode("const"))
      )
    );
  });

  if (nodes.length === 0) {
    // If the file doesn't export anything, the build fails due to the `--isolatedModules` flag.
    nodes.push(f.createExportAssignment(undefined, undefined, f.createObjectLiteralExpression(undefined, false)));
  }

  await writeFile(nodes, "-constants", context, config);
};

const createNamedImport = (fnName: string | string[], filename: string, isTypeOnly = false) => {
  const fnNames = Array.isArray(fnName) ? fnName : [fnName];
  return f.createImportDeclaration(
    undefined,
    f.createImportClause(
      isTypeOnly,
      undefined,
      f.createNamedImports(fnNames.map(name => f.createImportSpecifier(false, undefined, f.createIdentifier(name))))
    ),
    f.createStringLiteral(filename),
    undefined
  );
};
