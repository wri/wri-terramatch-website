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

In order to generate from the api (whenever there is some backend endpoint/type change) please use this command:

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

## Translation

We are using [Transifex Native](https://developers.transifex.com/docs/native).

### Usage

To push new translation run the following command

```
yarn tx:push
```

There is no need to pull translations as it will be handled automatically.

# License

MIT License

Developed by 3 Sided Cube
