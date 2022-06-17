# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
