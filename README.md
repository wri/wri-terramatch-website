# WRI Terramatch Web Client
> Help people and funders grow a trillion trees together.

## Built with:
- [React](https://reactjs.org/) (create-react-app)
- [Redux](https://redux.js.org)
- [React Router](https://github.com/ReactTraining/react-router)
- [Chameleon Component Library 🦎](http://chameleon.cube-sites.com)
- [i18next](https://react.i18next.com/)

## How to get started

### API
Ensure you have the local API setup:
https://github.com/wri/wri-terramatch-api

(or you can set REACT_APP_API_URL, in `.env.local` to an instance of the API e.g. `https://test.wrirestorationmarketplace.cubeapis.com/api`)

### Frontend
This project has been setup with Yarn. It is reccomended to use this instead of NPM.

1. `yarn install`
2. `yarn start`
3. Go to `localhost:3000`

## API codegen
Swagger has been used to document the API this project relies on. This allows us to use swagger code generation. To get it to work with this project we had to modify the generated code to fix an AMD module issue https://github.com/swagger-api/swagger-codegen/issues/3336

A PR has been made on the git project for the swagger codegen to fix that issue. Until then you can build and generate the code from this fork of the codegen.
https://github.com/kev2480/swagger-codegen/tree/hotfix/issue-3336-fix-amd-js-imports

When you have cloned the repo run the following to build the swagger cli jar and then generate the code:
```bash
mvn clean package

java -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate   -i https://test.wrirestorationmarketplace.cubeapis.com/documentation/raw   -l javascript   -o outputfolder
```

The npm commands in this project are setup to build from the swagger REST url but this will break until you modify the relative paths for AMD imports on the generated code.

When you have updated the generated API client you will have to run `yarn upgrade wrm-api` (wrm-api points to `scripts/api-gen`)

## Drafting

### What
Drafting is a feature that allows a user to draft project creation before publishing it. It has it's own section in this readme because of its complexity

### Where?
Drafting is currently only on creating offers and pitches, the main logic for this is located at:
- `src/pages/createPitch/CreatePitch.js`
- `src/pages/createOffer/CreateOffer.js`

Any requests are made through `src/redux/modules/drafts.js`

### How does it work?
#### Creation
To create a patch a name and type are dispatched to `createDraft`
```
{name: newModel.name, type: 'offer'}
```

#### Updating
Drafting uses [JSON patch](http://jsonpatch.com/) to update an existing patch.

To create a json patch the helper function (src/helpers/compare.js compareModels) compares two models, the previous model and the new model, then creates the payload specified for a JSON patch to occur (see the spec in the link above).

Both the createPitch and createOffer pages trigger these on the `onStepChange` function.

`onStepChange` is triggered by a debounce of (500ms) from the FormWalkthrough component.

#### Reading
To read a draft to a state that works with the FormWalkthrough component we must parse the payload, this parses the pitch or draft and its child models.

See `onDraftSelected` for both the createPitch and createOffer pages.

#### Publishing
To publish an id is dispatched to `updateDraft` (validation errors could be returned here).

## Testing
- `yarn test`

## Project Layout
```
src
│   i18n.js -> Initialises i18n for the project
│   index.js -> Main app entry point
│   serviceWorker.js -> Boilerplated service worker
│
└─── assets
│   └─── fonts
│   └─── images
│   └─── translations
│
└─── components / pages
│   └─── [componentName] -> Example component
│       │   [componentName].js
│       │   [componentName].test.js
│       │   [componentName]Container.js -> Container Component, used to connect redux
|
└─── redux
|         └─── modules -> holds modules, see Redux code styling
|         └─── services -> holds service code like api clients
|         |    configureStore.js -> combines reducers
|
└─── style -> SASS

```

## Code Style

### Redux
To keep the redux code tidy this Project uses the ["Ducks"](https://github.com/erikras/ducks-modular-redux) style for Redux. If you are unaware of the style please read that link before contributing to this project.

actionTypes, actions and reducers are kept together in isolated modules within the `redux/modules/` folder.

A module...

1. MUST `export default` a function called reducer()
2. MUST `export` its action creators as functions
3. MUST have action types in the form `npm-module-or-app/reducer/ACTION_TYPE`
4. MAY export its action types as `UPPER_SNAKE_CASE`, if an external reducer needs to listen for them, or if it is a published reusable library

### SASS / Styling
This project uses SASS for styling. Where possible make sure all styling is held in `src/style` and not in seperate files in the components folder.

This project uses [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

### Tests
#### Unit / Component Tests
Each component / page folder can have a `[component].test.js` file. These tests run Jest with `@testing-library/react`.

See `src/components/app/App.test.js` for an example.

# License
MIT License

Developed by 3 Sided Cube