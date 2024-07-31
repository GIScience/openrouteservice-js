# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://github.com/GIScience/openrouteservice-js/compare/v0.4.0...v0.4.1) (2024-07-31)


### Bug Fixes

* timeout not passed to default arguments ([60ce10d](https://github.com/GIScience/openrouteservice-js/commit/60ce10de9b1735be805ca85b036373b9842b603f))

## [0.4.0](https://github.com/GIScience/openrouteservice-js/compare/v0.3.2...v0.4.0) (2024-07-11)


### Features

* add snapping functionality ([b625597](https://github.com/GIScience/openrouteservice-js/commit/b62559736535a88b9717c1a915ae568711ad80a4))
* add html example for snap ([634eab6](https://github.com/GIScience/openrouteservice-js/commit/634eab64f2bbaf4cae00ae9523786ffdd4d0d0ac))
* avoid needing api-key for defined host ([659fe90](https://github.com/GIScience/openrouteservice-js/commit/659fe90ecedd6f321b130d8d992ec75a17b19559))
* add dev_app components & maps for services ([eee14a7](https://github.com/GIScience/openrouteservice-js/commit/eee14a7d80b9a437c7875ca40995a9030e7a4988))


### Bug Fixes

* **eslint:** leftover linting issues ([5a7cd33](https://github.com/GIScience/openrouteservice-js/commit/5a7cd3318f5603c9e7a366a36baedaebda01908b))


### Docs

* **README:** add snap example ([2839ae6](https://github.com/GIScience/openrouteservice-js/commit/2839ae6aa3809aab517110d8ab31d7b1ee768be7))
* **README:** fix missing await in examples ([b375cb2](https://github.com/GIScience/openrouteservice-js/commit/b375cb232ce9e6a3673af1ff6129e9abda90dd4e))


### Styling

* reformat html examples ([21e72f1](https://github.com/GIScience/openrouteservice-js/commit/21e72f191100e02c2ec0aba1860d9b430c4e9f94))


### Code Refactoring

* **examples:** use try/catch with async/await syntax ([2ba8aa4](https://github.com/GIScience/openrouteservice-js/commit/2ba8aa4c19b3f4e088ab23fc10e89905666cc174))


### Build System

* add leaflet dependencies ([114dc42](https://github.com/GIScience/openrouteservice-js/commit/114dc421c8df1d54671d8c9157e4ba54387571f0))
* **deps:** upgrade eslint & plugins ([62eac28](https://github.com/GIScience/openrouteservice-js/commit/62eac28aa42f317c6c88e1b82694627bad263db5))
* update dependencies ([aeb48c0](https://github.com/GIScience/openrouteservice-js/commit/aeb48c059c2b87353dc3c44de3be42cd4f0f4c93))


### CI

* add user id for ff testing ([6f5296b](https://github.com/GIScience/openrouteservice-js/commit/6f5296b0675b4d8f75622d992434502eab51eca4))
* update actions & container image ([f1cbac1](https://github.com/GIScience/openrouteservice-js/commit/f1cbac194d0d25326c839730eb78d91ec6aebd50))
* use --host for ci test run for gh-actions to work ([eb907d5](https://github.com/GIScience/openrouteservice-js/commit/eb907d5d35a0350b7447ec893f56a3de4e66a5b1))


### Tests

* add IsochronesApp component test ([5997dbd](https://github.com/GIScience/openrouteservice-js/commit/5997dbd374b5218ae0a002b558fde9a28fc468f1))
* add test for other parameters ([fe8fd0a](https://github.com/GIScience/openrouteservice-js/commit/fe8fd0a2559b773cb77723cf78f9a042fe0d5825))
* e2e test for route services in dev-app ([4c74a1d](https://github.com/GIScience/openrouteservice-js/commit/4c74a1de81cd5ee00d7d78129509adbd8d6631c6))
* snapping functionality ([fa2bead](https://github.com/GIScience/openrouteservice-js/commit/fa2bead8dff5d9f6c5559d459c7d3a5fe6a9d19f))
* verify OrsBase works for defined host without api_key ([7fdd364](https://github.com/GIScience/openrouteservice-js/commit/7fdd364302b6b2ca1b3b66346be1d7f29d2a93d2))

### [0.3.2](https://github.com/GIScience/openrouteservice-js/compare/v0.3.1...v0.3.2) (2023-09-22)


### Code Refactoring

* remove api_version 'v2' requirement ([51c5bb2](https://github.com/GIScience/openrouteservice-js/commit/51c5bb2987d4d7a6c0458ce72c2207cf2dcb9b8b))


### Tests

* remove tests for api_version 'v2' requirement ([caab49a](https://github.com/GIScience/openrouteservice-js/commit/caab49a3e390ed883a272df14e31bd5d48d29fb7))


### Build System

* **deps:** upgrade vite from 3.2.6 to 3.2.7 ([8395acd](https://github.com/GIScience/openrouteservice-js/commit/8395acd46f7619891dfb4f6470d72620bd7915fb))

### [0.3.1](https://github.com/GIScience/openrouteservice-js/compare/v0.3.0...v0.3.1) (2023-08-09)


### Bug Fixes

* gpx response not returned correctly ([c9a3865](https://github.com/GIScience/openrouteservice-js/commit/c9a3865e0513b213912b2968691d8663cbde394d))

## [0.3.0](https://github.com/GIScience/openrouteservice-js/compare/v0.2.0...v0.3.0) (2023-04-20)


### ⚠ BREAKING CHANGES

* removal of Openrouteservice.OrsInput and Openrouteservice.OrsUtils
* Response object from Error changed from superagent to [fetch response type](https://developer.mozilla.org/en-US/docs/Web/API/Response)
    that can still be consumed
* removes clear(), clearPoints(), addWaypoint() and addLocation() functions

### Features

* Add development vue app ([046b90d](https://github.com/GIScience/openrouteservice-js/commit/046b90d59bc7925e352653a4d902115c90cdb827))
* add Optimization Service support ([44d57b6](https://github.com/GIScience/openrouteservice-js/commit/44d57b68d46642669363b22e413d6b6bb7d85e5a)), closes [#38](https://github.com/GIScience/openrouteservice-js/issues/38)


### CI

* Adjust GitHub actions testing workflow ([7bb711d](https://github.com/GIScience/openrouteservice-js/commit/7bb711dcb1110c43d614fd95876e52f62017daa6))
* trigger ci run on pushes to master as well ([e9cc2ba](https://github.com/GIScience/openrouteservice-js/commit/e9cc2ba3b176438c94d11d4c4a7bb319de16b6ba))


### Others

* Add codecov badge ([dcf6bbb](https://github.com/GIScience/openrouteservice-js/commit/dcf6bbbdea52ce891bc9ad2dab41381502f5b7cf))
* Remove prettier ([f2d0aaf](https://github.com/GIScience/openrouteservice-js/commit/f2d0aaf454eb2836625f06bae49525f0a2c60dbc))
* Simplify npm script commands ([5203936](https://github.com/GIScience/openrouteservice-js/commit/52039364f1aadbcc51c56b05c0e9fa60e9144ff7))


### Styling

* standardise syntax to ES6 arrow funtions ([0c57dbc](https://github.com/GIScience/openrouteservice-js/commit/0c57dbc7e46a975588d227590478d1e588e5dd88))


### Tests

* adjust and increase coverage ([f63e5ca](https://github.com/GIScience/openrouteservice-js/commit/f63e5caa4968a1cdbf20537d75df2d95dc55297c))
* increase OrsDirections test coverage ([a08f500](https://github.com/GIScience/openrouteservice-js/commit/a08f5000e89276c2b2f93e68fc546e986960b332))
* increase OrsElevation test coverage ([875ebe8](https://github.com/GIScience/openrouteservice-js/commit/875ebe8db6a8e2f0e67821c68d25ca2b02554bc0))
* increase OrsGeocode test coverage ([762b010](https://github.com/GIScience/openrouteservice-js/commit/762b01091f8a296d5d6836e969c4d3c1dcf12e88))
* increase OrsIsochrones test coverage ([935fb23](https://github.com/GIScience/openrouteservice-js/commit/935fb2307c0d90a9dcb5b018c6f86489851ea156))
* increase OrsMatrix test coverage ([b109c38](https://github.com/GIScience/openrouteservice-js/commit/b109c38b6fc9dac831040a2c004034b59a739441))
* increase OrsOptimization test coverage ([3aba0dc](https://github.com/GIScience/openrouteservice-js/commit/3aba0dce57123de089d489eb507a226a8b43f3d4))
* increase OrsPOIs test coverage ([6f8f6ee](https://github.com/GIScience/openrouteservice-js/commit/6f8f6eeb22414c915777654a8bba3f9b8435968d))
* increase OrsUtil test coverage ([09c2cac](https://github.com/GIScience/openrouteservice-js/commit/09c2cacd5f57d437089870e50432190d1900e670))
* Remove error checking blocks ([ae8df5e](https://github.com/GIScience/openrouteservice-js/commit/ae8df5e9e8a105884473f5b679b619a8ba30b04f))
* remove tests for removed functions ([fff7398](https://github.com/GIScience/openrouteservice-js/commit/fff7398f36a78e3c1bea1aeb8e88a704a2e053fb))


### Docs

* document Optimization Service usage ([02d3e8b](https://github.com/GIScience/openrouteservice-js/commit/02d3e8bd7eed3a736fe3bb1949d134a4a5325ecf))
* **README:** Fix typo and linting ([d6db353](https://github.com/GIScience/openrouteservice-js/commit/d6db353f94041e6f18c6f11a69412bcc99e00d68))
* **README:** adjust examples and add local instance example ([d2752b5](https://github.com/GIScience/openrouteservice-js/commit/d2752b55007400baa2a030ca9dd7feb422d93d6a))
* **README:** remove clear() usage from examples ([d372680](https://github.com/GIScience/openrouteservice-js/commit/d3726800e1edb4d157d11ae060897893b749f857))


### Build System

* Add code coverage for src files ([1e9c5e9](https://github.com/GIScience/openrouteservice-js/commit/1e9c5e918d047f7e19eab1df3d5e76b253983b33))
* Add coverage for dev_app ([15e6411](https://github.com/GIScience/openrouteservice-js/commit/15e64113c15309e32e92065efbfd436a7e964112))
* Change API key usage ([46f338e](https://github.com/GIScience/openrouteservice-js/commit/46f338e728ddf42af40d40eefb3ff0dcca5933d8))
* **deps:** update to latest manageable dependencies ([5f29873](https://github.com/GIScience/openrouteservice-js/commit/5f2987305489b20aa76f57af716349d5ca66f46f))
* Move to cypress testing framework ([c57cd28](https://github.com/GIScience/openrouteservice-js/commit/c57cd28bd2a19dbfb289d4898db1586632a01ba2))
* Move to module repository type & change bundler ([a3c2a73](https://github.com/GIScience/openrouteservice-js/commit/a3c2a732e6cd8489bdc0d2686153375fd2f29ce3))
* remove bluebird and superagent dependencies ([ad479aa](https://github.com/GIScience/openrouteservice-js/commit/ad479aa52e97d3c51ddb2f0f5b7d95b1a3e6bc60))
* Remove lcov.info file ([f460992](https://github.com/GIScience/openrouteservice-js/commit/f460992ce94cf0b97e39dd23124f63d869c43360))
* Remove unused derequire dependency ([612939d](https://github.com/GIScience/openrouteservice-js/commit/612939d0dd840d265c11e556d81e62bbbd9b3cfd))
* Rename branch master to main ([3ff1b22](https://github.com/GIScience/openrouteservice-js/commit/3ff1b220e874248cf427740aa92a9cf6ebe0deb8))
* Use coverage upload action in GitHub workflow ([ddec0d1](https://github.com/GIScience/openrouteservice-js/commit/ddec0d1f1126d9300636a69db28a14b2db0cee13))


### Code Refactoring

* move from explicit Promises to async functions ([56d06bd](https://github.com/GIScience/openrouteservice-js/commit/56d06bd83348b5d6e0b665b202e328fbecaa850b))
* remove setting of default vehicle when profile is 'driving-hgv' ([0b308e0](https://github.com/GIScience/openrouteservice-js/commit/0b308e0dea72d816d3d0aecdba62885a67db640c))
* remove unused functions ([441fd38](https://github.com/GIScience/openrouteservice-js/commit/441fd3871116c9ff7a141a1d5f1ab4755b661fdd))
* remove unused properties from library ([62d9afe](https://github.com/GIScience/openrouteservice-js/commit/62d9afecbcdc7bda46dc8dcc0108abd5064c2f90))
* Replace apiKeyPropName with propNames.apiKey ([f324e23](https://github.com/GIScience/openrouteservice-js/commit/f324e234f3f531f06cfe7c23046757d87327c03a))
* split createRequest parts to new fetchRequest function ([0c336ee](https://github.com/GIScience/openrouteservice-js/commit/0c336eeb730d26365ffb46b1351e41342acec339))

## [0.2.0](https://github.com/GIScience/openrouteservice-js/compare/v0.1.31...v0.2.0) (2022-06-10)


### ⚠ BREAKING CHANGES

* **deps:** moving declared dependencies to dev dependencies or remove

fixes https://github.com/GIScience/openrouteservice-js/issues/43

### Code Refactoring

* cleanup basic code issues ([e5b33ad](https://github.com/GIScience/openrouteservice-js/commit/e5b33ade708981a6e9f136c12daf9ee94be6ed9e))


### Others

* **.gitignore:** Update .gitignore ([d742c59](https://github.com/GIScience/openrouteservice-js/commit/d742c59179dd824f4ae6c9f923d77f359a21526b))
* cleanup npm package ([3acdf04](https://github.com/GIScience/openrouteservice-js/commit/3acdf04e026eb62237c4a3337a68fdfb05035a86))
* **deps:** update and cleanup dependencies ([03a9d90](https://github.com/GIScience/openrouteservice-js/commit/03a9d905d2b77db04b8af1734fe5386d135927ef))
* **nyc:** ignore tests for coverage ([cf89e97](https://github.com/GIScience/openrouteservice-js/commit/cf89e97a61d1f7c228212bf9022c7e5a57870c42))

### [0.1.31](https://github.com/GIScience/openrouteservice-js/compare/v0.1.30...v0.1.31) (2021-12-17)


### Bug Fixes

* **orsgeocode.js:** add support for geocode with special char in text ([a0b264c](https://github.com/GIScience/openrouteservice-js/commit/a0b264c9a2b49fbd50a486703f2935cda106c9ce))

### [0.1.30](https://github.com/GIScience/openrouteservice-js/compare/v0.1.29...v0.1.30) (2021-11-25)


### Others

* update critical packages ([6f66b3e](https://github.com/GIScience/openrouteservice-js/commit/6f66b3ecd8274430c028e969d8247572e1d19ab0))


### Tests

* fix ors poi tests ([1ef00d0](https://github.com/GIScience/openrouteservice-js/commit/1ef00d0fa31560ef72d19901df77461edbf40b9b))

### [0.1.29](https://github.com/GIScience/openrouteservice-js/compare/v0.1.28...v0.1.29) (2021-10-11)

### [0.1.28](https://github.com/GIScience/openrouteservice-js/compare/v0.1.27...v0.1.28) (2021-10-11)


### Bug Fixes

* **orsgeocode:** remove api key setting on geocode method ([744563b](https://github.com/GIScience/openrouteservice-js/commit/744563b7766e7b4d5547f7905b98059366740115))


### Tests

* add keep custom host and service test case ([2705a3e](https://github.com/GIScience/openrouteservice-js/commit/2705a3e9339354ef571b1daa953dcfbc58b850c7))

### [0.1.27](https://github.com/GIScience/openrouteservice-js/compare/v0.1.26...v0.1.27) (2021-08-10)


### Bug Fixes

* **orsgeocode:** remove focus preprend from point parameter parser ([5940258](https://github.com/GIScience/openrouteservice-js/commit/5940258c65be4826197ddfb86bfdfc67691f3112))

### [0.1.26](https://github.com/GIScience/openrouteservice-js/compare/v0.1.25...v0.1.26) (2021-08-05)


### Features

* add throw error to services' constructor when no api key is passed ([795f7ad](https://github.com/GIScience/openrouteservice-js/commit/795f7ad9e7d4af86fea189f7bc43d137364ad6b0))


### Bug Fixes

* **orsgeocode.js:** source and point shorthand parser ([3d969a3](https://github.com/GIScience/openrouteservice-js/commit/3d969a3bc30d365ac86f4adde3c9888518e7072d))


### Code Refactoring

* **orsinput.js:** remove non used methods ([5534d1a](https://github.com/GIScience/openrouteservice-js/commit/5534d1a3c1800f0d5f6661f7a0ee20df3678a145))
* **orsutil.js:** remove non used methods ([86847dd](https://github.com/GIScience/openrouteservice-js/commit/86847dd1c70f35cb50ca0fab8b353d16812836f0))


### Tests

* coverage of at least 80% for all services/classes ([db2a262](https://github.com/GIScience/openrouteservice-js/commit/db2a2621e1e7dcc218ada6730883c09cb8aa2291))

### [0.1.25](https://github.com/GIScience/openrouteservice-js/compare/v0.1.24...v0.1.25) (2021-08-04)


### Bug Fixes

* **orsdirections.js:** process avoidables and restrictions correctly ([406cad9](https://github.com/GIScience/openrouteservice-js/commit/406cad99ec6f78d9b149a2f50388483c61b78b54)), closes [#35](https://github.com/GIScience/openrouteservice-js/issues/35)

### [0.1.24](https://github.com/GIScience/openrouteservice-js/compare/v0.1.23...v0.1.24) (2021-07-23)


### Tests

* add test report generation via instanbuljs ([48f1057](https://github.com/GIScience/openrouteservice-js/commit/48f10573cb99b649ffbde777aefbafdd027efc4b))

### [0.1.23](https://github.com/GIScience/openrouteservice-js/compare/v0.1.22...v0.1.23) (2021-07-23)


### CI

* migrate to Github actions CI ([1cda82f](https://github.com/GIScience/openrouteservice-js/commit/1cda82fff6909466e4d850db49a7aa4d8c81e6f2))


### Docs

* **readme.md:** add section about commits and versioning ([e30fda9](https://github.com/GIScience/openrouteservice-js/commit/e30fda90ca5785ca10379b08526528e8c1044ddc))

### [0.1.22](https://github.com/GIScience/openrouteservice-js/compare/v0.1.21...v0.1.22) (2021-07-22)


### Docs

* **readme.md:** change build status from travis-ci.org to travis-ci.com ([3d2f269](https://github.com/GIScience/openrouteservice-js/commit/3d2f26921cdc0a194f46b78b2f22657a36f75bbb))

### 0.1.21 (2021-07-22)


### Others

* add standard-version and versionrc ([1cd8afe](https://github.com/GIScience/openrouteservice-js/commit/1cd8afe1a575b684912eb5ff663e2d45fc869cb0))
