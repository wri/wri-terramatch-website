# 🌲 Terramatch Web Platform 🌲

### Installation

```
// Install dependencies
yarn
// Run app (dev)
yarn dev
```

### Api Fetchers/Hooks Generation

To generate Api types/queries/fetchers/hooks, this repo uses:

- `@openapi-codegen/cli` (https://www.npmjs.com/package/@openapi-codegen/cli)
- `@openapi-codegen/typescript` (https://www.npmjs.com/package/@openapi-codegen/typescript)

#### Usage

In order to generate from the v1/2 api (whenever there is some backend endpoint/type change) please use this command:

```
yarn generate:api
```

_Can be found in package.json scripts_

This command will fill the `src/generated` folder with a couple of files.

`apiFetcher.ts` will NOT change everytime we re-generate the api, and it's responsible to implement the fetch tool (it uses `fetch` by default but can be changed to something like `axios` if needed).
We can customize the `baseUrl` of where we are fetching from by changing the `const baseUrl` at the top of the file.

`apiContext.ts` will NOT change everytime we re-generate the api, and its responsible to set the global context of api requests.
This is super useful if we want to globally set some headers for each request (such as Authorization header).
It exposes a component hook so we can use other hooks (such as Auth hook or context) to get the logged in token for example and inject it in the global request context.

##### v3 API
The V3 API has a different API layer, but the generation is similar: 
```
yarn generate:services
```

When adding a new **service** app to the v3 API, a few steps are needed to integrate it:
* In `openapi-codegen.config.ts`, add the new service name to the `SERVICES` array (e.g. `foo-service`). 
* This will generate a new target, which needs to be added to `package.json`:
  * Under scripts, add `"generate:fooService": "npm run generate:fooService"`
  * Under the `"generate:services"` script, add the new service: `"generate:services": "npm run generate:userService && npm run generate:fooService`
* After running `yarn generate:fooService` the first time, open the generated `fooServiceFetcher.ts` and 
  modify it to match `userServiceFetcher.ts`. 
  * This file does not get regenerated after the first time, and so it can utilize the same utilities 
    for interfacing with the redux API layer / connection system that the other v3 services use.

When adding a new **resource** to the v3 API, a couple of steps are needed to integrate it:
* The resource needs to be specified in shape of the redux API store. In `apiSlice.ts`, add the new 
  resource plural name (the `type` returned in the API responses) to the store by adding it to the 
  `RESOURCES` const. This will make sure it's listed in the type of the ApiStore so that resources that match that type are seamlessly folded into the store cache structure.
* The shape of the resource should be specified by the auto-generated API. This type needs to be 
  added to the `ApiResource` type in `apiSlice.ts`. This allows us to have strongly typed results
  coming from the redux APi store.

### Connections
Connections are a **declarative** way for components to get access to the data from the cached API
layer that they need. This system is under development, and the current documentation about it is 
[available in Confluence](https://gfw.atlassian.net/wiki/spaces/TerraMatch/pages/1423147024/Connections)

## Translation ([Transifex Native SDK](https://developers.transifex.com/docs/native)).

Transifex native sdk provides a simple solution for internationalization.

### Usage

When developing, simply utilize the `useT` hook exported by `@transifex/react` to access the `t` function. This function is responsible for fetching the translated version of the text and pushing it to the Transifex cloud. To ensure a text is pushed and translated, enclose it within `t(" ")`. It's worth noting that the CLI command scans the codebase for this pattern, and as a result, storing text in a variable and passing it to `t` is not permitted.

While there are alternative methods of usage, we recommend sticking to the `useT` for consistency across the codebase. For more information, refer to the [official documentation](https://developers.transifex.com/docs/native).

Here is an exmple of usage

```jsx
import { useT } from "@transifex/react";

const PageContent = () => {
  const t = useT();

  return t("Terramatch");
};
```

### Pull translations

Translations are automatically retrieved, eliminating the need for a manual pull, thanks to the automatic process in `src/i18n.ts`. The `getInitialProps` method in the `_app` file fetches translations during runtime and populates them as props on each page. These props are then internally utilized by Transifex's `t` function. Importantly, this occurs at runtime, eliminating the necessity for a build when translations are uploaded.

### Push translation

Pushing new translations to the Transifex cloud involves just one manual step. You can achieve this by using the `yarn tx:push` command, which leverages `txjs-cli` for seamless execution. To perform a dry run, use the `--dry-run` option for a simulated upload without making actual changes.

For more details about the command-line interface (CLI), please refer to the [official documentation](https://developers.transifex.com/docs/cli).

It's important to note that the setup requires the correct configuration of `TRANSIFEX_TOKEN` and `TRANSIFEX_SECRET` environment variables. Due to the sensitive nature of these variables, they will be securely shared with you via 1Password.

Additionally, consider automating this step using GitHub Actions for increased efficiency.

# License

MIT License
Developed by 3 Sided Cube
