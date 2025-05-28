import { defineConfig } from "@openapi-codegen/cli";
import { Config } from "@openapi-codegen/cli/lib/types";
import { generateFetchers, generateReactQueryComponents, generateSchemaTypes } from "@openapi-codegen/typescript";
import { ConfigBase, Context } from "@openapi-codegen/typescript/lib/generators/types";
import c from "case";
import dotenv from "dotenv";
import _ from "lodash";
import {
  ComponentsObject,
  isReferenceObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  SchemaObject
} from "openapi3-ts";
import ts, { Expression, PropertyAssignment, TypeElement } from "typescript";

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
      await generateSelectors(context, { filenamePrefix: name });
      await generateConstants(context, { filenamePrefix: name });
    }
  };
}

export default defineConfig(config);

const generateLiteral = (value: unknown) => {
  if (_.isString(value)) return f.createStringLiteral(value);
  else if (_.isNumber(value)) return f.createNumericLiteral(value);
  else if (_.isArray(value)) {
    const literals: Expression[] = [];
    value.forEach(member => {
      const literal = generateLiteral(member);
      if (literal != null) literals.push(literal);
    });
    return f.createArrayLiteralExpression(literals, true);
  } else if (_.isObject(value)) {
    const properties: PropertyAssignment[] = [];
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

  const dtoTypes: TypeElement[] = [];
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

    const properties: PropertyAssignment[] = [];
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

const isIndex = (verb: string, operation: OperationObject) => {
  if (verb !== "get") return false;

  const okSchema = operation.responses["200"]?.content["application/json"]?.schema;
  if (okSchema == null) return false;

  const properties = _.isArray(okSchema.oneOf) ? okSchema.oneOf[0]?.properties : okSchema.properties;
  if (properties?.data == null) return false;

  return properties.data.type === "array";
};

/**
 * Generates Connection predicates for checking if a given request is in progress or failed.
 *
 * Based on generators from https://github.com/fabien0102/openapi-codegen/blob/main/plugins/typescript. Many of the
 * methods here are similar to ones in that repo, but they aren't exported, so were copied from there and modified for
 * use in this generator.
 */
const generateSelectors = async (context: Context, config: ConfigBase) => {
  const nodes: ts.Node[] = [];
  const componentImports: string[] = [];

  let variablesExtraPropsType: ts.TypeNode = f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);

  let hasIndexMeta = false;
  Object.entries(context.openAPIDocument.paths).forEach(([route, verbs]: [string, PathItemObject]) => {
    Object.entries(verbs).forEach(([verb, operation]) => {
      if (!isVerb(verb) || !isOperationObject(operation)) return;

      const operationId = c.camel(operation.operationId);
      const { pathParamsType, variablesType, queryParamsType } = getOperationTypes({
        openAPIDocument: context.openAPIDocument,
        operation,
        operationId,
        pathParameters: verbs.parameters,
        variablesExtraPropsType
      });

      for (const type of [pathParamsType, queryParamsType, variablesType]) {
        if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
          componentImports.push(type.typeName.text);
        }
      }

      const includeIndexMeta = isIndex(verb, operation);
      hasIndexMeta ||= includeIndexMeta;
      nodes.push(
        ...createSelectorNodes({
          pathParamsType,
          variablesType,
          queryParamsType,
          url: route,
          verb,
          name: operationId,
          includeIndexMeta
        })
      );
    });
  });

  const utilsImports = ["isFetchingSelector", "fetchFailedSelector"];
  const sliceImports = [];
  if (hasIndexMeta) {
    utilsImports.push("indexMetaSelector");
    sliceImports.push("ResourceType");
  }

  await writeFile(
    [
      createNamedImport(utilsImports, `../utils`),
      ...(sliceImports.length === 0 ? [] : [createNamedImport(sliceImports, "@/store/apiSlice")]),
      ...(componentImports.length === 0
        ? []
        : [createNamedImport(componentImports, `./${formatFilename("-components", context, config)}`)]),
      ...nodes
    ],
    "-selectors",
    context,
    config
  );
};

const camelizedPathParams = (url: string) => url.replace(/\{\w*}/g, match => `{${c.camel(match)}}`);

const createSelectorNodes = ({
  queryParamsType,
  pathParamsType,
  variablesType,
  url,
  verb,
  name,
  includeIndexMeta
}: {
  pathParamsType: ts.TypeNode;
  queryParamsType: ts.TypeNode;
  variablesType: ts.TypeNode;
  url: string;
  verb: string;
  name: string;
  includeIndexMeta: boolean;
}) => {
  const nodes: ts.Node[] = [];

  const createSelectorNode = (fnName: string) => {
    const selectorArguments: ts.ObjectLiteralElementLike[] = [
      f.createPropertyAssignment(f.createIdentifier("url"), f.createStringLiteral(camelizedPathParams(url)))
    ];
    if (fnName === "indexMeta") {
      selectorArguments.push(f.createShorthandPropertyAssignment("resource"));
    } else {
      selectorArguments.push(f.createPropertyAssignment(f.createIdentifier("method"), f.createStringLiteral(verb)));
    }
    if (variablesType.kind !== ts.SyntaxKind.VoidKeyword) {
      selectorArguments.push(f.createSpreadAssignment(f.createIdentifier("variables")));
    }

    let selector: Expression = f.createCallExpression(
      f.createIdentifier(`${fnName}Selector`),
      [queryParamsType, pathParamsType],
      [f.createObjectLiteralExpression(selectorArguments, false)]
    );

    const selectorParameters: ts.ParameterDeclaration[] = [];
    if (fnName === "indexMeta") {
      selectorParameters.push(
        f.createParameterDeclaration(
          undefined,
          undefined,
          f.createIdentifier("resource"),
          undefined,
          f.createTypeReferenceNode("ResourceType"),
          undefined
        )
      );
    }
    if (variablesType.kind !== ts.SyntaxKind.VoidKeyword) {
      selectorParameters.push(
        f.createParameterDeclaration(
          undefined,
          undefined,
          f.createIdentifier("variables"),
          undefined,
          f.createTypeReferenceNode("Omit", [variablesType, f.createLiteralTypeNode(f.createStringLiteral("body"))]),
          undefined
        )
      );
    }
    if (selectorParameters.length > 0) {
      selector = f.createArrowFunction(
        undefined,
        undefined,
        selectorParameters,
        undefined,
        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        selector
      );
    }

    return f.createVariableStatement(
      [f.createModifier(ts.SyntaxKind.ExportKeyword)],
      f.createVariableDeclarationList(
        [
          f.createVariableDeclaration(
            f.createIdentifier(`${name}${_.upperFirst(fnName)}`),
            undefined,
            undefined,
            selector
          )
        ],
        ts.NodeFlags.Const
      )
    );
  };

  for (const selector of ["isFetching", "fetchFailed", "indexMeta"]) {
    if (selector === "indexMeta" && !includeIndexMeta) continue;
    nodes.push(createSelectorNode(selector));
  }

  return nodes;
};

const isVerb = (verb: string): verb is "get" | "post" | "patch" | "put" | "delete" =>
  ["get", "post", "patch", "put", "delete"].includes(verb);

const isOperationObject = (obj: any): obj is OperationObject & { operationId: string } =>
  typeof obj === "object" && typeof (obj as any).operationId === "string";

export type GetOperationTypesOptions = {
  operationId: string;
  operation: OperationObject;
  openAPIDocument: OpenAPIObject;
  pathParameters?: PathItemObject["parameters"];
  variablesExtraPropsType: ts.TypeNode;
};

export type GetOperationTypesOutput = {
  pathParamsType: ts.TypeNode;
  variablesType: ts.TypeNode;
  queryParamsType: ts.TypeNode;
};

const getParamsGroupByType = (parameters: OperationObject["parameters"] = [], components: ComponentsObject = {}) => {
  const { query: queryParams = [] as ParameterObject[], path: pathParams = [] as ParameterObject[] } = _.groupBy(
    [...parameters].map<ParameterObject>(p => {
      if (isReferenceObject(p)) {
        const schema = _.get(components, p.$ref.replace("#/components/", "").replace("/", "."));
        if (!schema) {
          throw new Error(`${p.$ref} not found!`);
        }
        return schema;
      } else {
        return p;
      }
    }),
    "in"
  );

  return { queryParams, pathParams };
};

export const getVariablesType = ({
  pathParamsType,
  pathParamsOptional,
  queryParamsType,
  queryParamsOptional
}: {
  pathParamsType: ts.TypeNode;
  pathParamsOptional: boolean;
  queryParamsType: ts.TypeNode;
  queryParamsOptional: boolean;
}) => {
  const variablesItems: ts.TypeElement[] = [];

  const hasProperties = (node: ts.Node) => {
    return (!ts.isTypeLiteralNode(node) || node.members.length > 0) && node.kind !== ts.SyntaxKind.UndefinedKeyword;
  };

  if (hasProperties(pathParamsType)) {
    variablesItems.push(
      f.createPropertySignature(
        undefined,
        f.createIdentifier("pathParams"),
        pathParamsOptional ? f.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        pathParamsType
      )
    );
  }
  if (hasProperties(queryParamsType)) {
    variablesItems.push(
      f.createPropertySignature(
        undefined,
        f.createIdentifier("queryParams"),
        queryParamsOptional ? f.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        queryParamsType
      )
    );
  }

  return variablesItems.length === 0
    ? f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
    : f.createTypeLiteralNode(variablesItems);
};

const getOperationTypes = ({
  operationId,
  operation,
  openAPIDocument,
  pathParameters = [],
  variablesExtraPropsType
}: GetOperationTypesOptions): GetOperationTypesOutput => {
  // Generate params types
  const { pathParams, queryParams } = getParamsGroupByType(
    [...pathParameters, ...(operation.parameters || [])],
    openAPIDocument.components
  );

  const pathParamsOptional = pathParams.reduce((mem, p) => {
    return mem && !p.required;
  }, true);
  const queryParamsOptional = queryParams.reduce((mem, p) => {
    return mem && !p.required;
  }, true);

  const pathParamsType =
    pathParams.length > 0
      ? f.createTypeReferenceNode(`${c.pascal(operationId)}PathParams`)
      : f.createTypeLiteralNode([]);

  const queryParamsType =
    queryParams.length > 0
      ? f.createTypeReferenceNode(`${c.pascal(operationId)}QueryParams`)
      : f.createTypeLiteralNode([]);

  const variablesIdentifier = c.pascal(`${operationId}Variables`);

  let variablesType: ts.TypeNode = getVariablesType({
    pathParamsType,
    queryParamsType,
    pathParamsOptional,
    queryParamsOptional
  });

  if (variablesExtraPropsType.kind !== ts.SyntaxKind.VoidKeyword) {
    variablesType =
      variablesType.kind === ts.SyntaxKind.VoidKeyword
        ? variablesExtraPropsType
        : f.createIntersectionTypeNode([variablesType, variablesExtraPropsType]);
  }

  if (variablesType.kind !== ts.SyntaxKind.VoidKeyword) {
    variablesType = f.createTypeReferenceNode(variablesIdentifier);
  }

  return {
    pathParamsType,
    queryParamsType,
    variablesType
  };
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
