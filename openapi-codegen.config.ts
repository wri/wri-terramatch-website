/* eslint-disable no-case-declarations */
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
  PathItemObject
} from "openapi3-ts";
import ts from "typescript";

const f = ts.factory;

dotenv.config();

// constants/environment.ts can't be imported here, so the bits that are relevant are adopted to this file
const ENVIRONMENT_NAMES = ["local", "dev", "test", "staging", "prod"] as const;
type EnvironmentName = (typeof ENVIRONMENT_NAMES)[number];

type Environment = {
  apiBaseUrl: string;
  userServiceUrl: string;
};

const ENVIRONMENTS: { [Property in EnvironmentName]: Environment } = {
  local: {
    apiBaseUrl: "http://localhost:8080",
    userServiceUrl: "http://localhost:4010"
  },
  dev: {
    apiBaseUrl: "https://api-dev.terramatch.org",
    userServiceUrl: "https://api-dev.terramatch.org"
  },
  test: {
    apiBaseUrl: "https://api-test.terramatch.org",
    userServiceUrl: "https://api-test.terramatch.org"
  },
  staging: {
    apiBaseUrl: "https://api-staging.terramatch.org",
    userServiceUrl: "https://api-staging.terramatch.org"
  },
  prod: {
    apiBaseUrl: "https://api.terramatch.org",
    userServiceUrl: "https://api.terramatch.org"
  }
};

const declaredEnv = (process.env.NEXT_PUBLIC_TARGET_ENV ?? "local") as EnvironmentName;
if (!ENVIRONMENT_NAMES.includes(declaredEnv as EnvironmentName)) {
  throw `Environment name is not valid! [${declaredEnv}]`;
}

const DEFAULTS = ENVIRONMENTS[declaredEnv];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULTS.apiBaseUrl;
const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? DEFAULTS.userServiceUrl;

// The services defined in the v3 Node BE codebase. Although the URL path for APIs in the v3 space
// are namespaced by feature set rather than service (a service may contain multiple namespaces), we
// isolate the generated API integration by service to make it easier for a developer to find where
// the associated BE code is for a given FE API integration.
const SERVICES = {
  "user-service": userServiceUrl
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
      await generatePendingPredicates(context, { filenamePrefix: name });
    }
  };
}

export default defineConfig(config);

/**
 * Generates Connection predicates for checking if a given request is in progress or failed.
 *
 * Based on generators from https://github.com/fabien0102/openapi-codegen/blob/main/plugins/typescript. Many of the
 * methods here are similar to ones in that repo, but they aren't exported, so were copied from there and modified for
 * use in this generator.
 */
const generatePendingPredicates = async (context: Context, config: ConfigBase) => {
  const sourceFile = ts.createSourceFile("index.ts", "", ts.ScriptTarget.Latest);

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false
  });

  const printNodes = (nodes: ts.Node[]) =>
    nodes
      .map((node: ts.Node, i, nodes) => {
        return (
          printer.printNode(ts.EmitHint.Unspecified, node, sourceFile) +
          (ts.isJSDoc(node) || (ts.isImportDeclaration(node) && nodes[i + 1] && ts.isImportDeclaration(nodes[i + 1]))
            ? ""
            : "\n")
        );
      })
      .join("\n");

  const filenamePrefix = c.snake(config.filenamePrefix ?? context.openAPIDocument.info.title) + "-";
  const formatFilename = config.filenameCase ? c[config.filenameCase] : c.camel;
  const filename = formatFilename(filenamePrefix + "-predicates");
  const nodes: ts.Node[] = [];
  const componentImports: string[] = [];

  let variablesExtraPropsType: ts.TypeNode = f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);

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

      nodes.push(
        ...createPredicateNodes({
          pathParamsType,
          variablesType,
          queryParamsType,
          url: route,
          verb,
          name: operationId
        })
      );
    });
  });

  await context.writeFile(
    filename + ".ts",
    printNodes([
      createNamedImport(["isFetching", "fetchFailed"], `../utils`),
      createNamedImport(["ApiDataStore"], "@/store/apiSlice"),
      ...(componentImports.length == 0
        ? []
        : [createNamedImport(componentImports, `./${formatFilename(filenamePrefix + "-components")}`)]),
      ...nodes
    ])
  );
};

const camelizedPathParams = (url: string) => url.replace(/\{\w*}/g, match => `{${c.camel(match)}}`);

const createPredicateNodes = ({
  queryParamsType,
  pathParamsType,
  variablesType,
  url,
  verb,
  name
}: {
  pathParamsType: ts.TypeNode;
  queryParamsType: ts.TypeNode;
  variablesType: ts.TypeNode;
  url: string;
  verb: string;
  name: string;
}) => {
  const nodes: ts.Node[] = [];

  const storeTypeDeclaration = f.createParameterDeclaration(
    undefined,
    undefined,
    f.createIdentifier("store"),
    undefined,
    f.createTypeReferenceNode("ApiDataStore"),
    undefined
  );

  nodes.push(
    ...["isFetching", "fetchFailed"].map(fnName => {
      const callBaseSelector = f.createCallExpression(
        f.createIdentifier(fnName),
        [queryParamsType, pathParamsType],
        [
          f.createObjectLiteralExpression(
            [
              f.createShorthandPropertyAssignment("store"),
              f.createPropertyAssignment(f.createIdentifier("url"), f.createStringLiteral(camelizedPathParams(url))),
              f.createPropertyAssignment(f.createIdentifier("method"), f.createStringLiteral(verb)),
              ...(variablesType.kind !== ts.SyntaxKind.VoidKeyword
                ? [f.createSpreadAssignment(f.createIdentifier("variables"))]
                : [])
            ],
            false
          )
        ]
      );

      let selector = f.createArrowFunction(
        undefined,
        undefined,
        [storeTypeDeclaration],
        undefined,
        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        callBaseSelector
      );

      if (variablesType.kind !== ts.SyntaxKind.VoidKeyword) {
        selector = f.createArrowFunction(
          undefined,
          undefined,
          [
            f.createParameterDeclaration(
              undefined,
              undefined,
              f.createIdentifier("variables"),
              undefined,
              variablesType,
              undefined
            )
          ],
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
    })
  );

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
