import Joi from 'joi'

const schema = Joi.object()
  .keys({
    api_key: Joi.string().description('Your openrouteservice API key.'),
    address: Joi.string().description(
      'Full-text query against search endpoint.'
    ),
    neighbourhood: Joi.string().description(
      'Neighbourhoods are vernacular geographic entities that may not necessarily be official administrative divisions but are important nonetheless.'
    ),
    borough: Joi.string().description(
      'Boroughs are mostly known in the context of New York City, even though they may exist in other cities, such as Mexico City.'
    ),
    locality: Joi.string().description(
      'Localities are equivalent to what are commonly referred to as cities.'
    ),
    county: Joi.string().description(
      'Counties are administrative divisions between localities and regions.'
    ),
    region: Joi.string().description(
      'Regions are normally the first-level administrative divisions within countries, analogous to states and provinces in the United States and Canada, respectively, though most other countries contain regions as well.'
    ),
    postalcode: Joi.string().description(
      'Postal codes are used to aid in sorting mail with the format dictated by an administrative division, which is almost always countries. Among other reasons, postal codes are unique within a country so they are useful in geocoding as a shorthand for a fairly granular geographical location.'
    ),
    country: Joi.string().description(
      'Countries are the highest-level administrative divisions supported in a search. In addition to full names, countries have common two- and three-letter abbreviations that are also supported values for the country parameter.'
    ),
    sources: Joi.array()
      .items(Joi.string().valid('osm', 'oa', 'wof', 'gn'))
      .description(
        "The originating source of the data. One or more of ['osm', 'oa', 'wof', 'gn']. Currently only 'osm', 'wof' and 'gn' are supported."
      ),
    layers: Joi.array()
      .items(
        Joi.string().valid(
          'venue',
          'address',
          'street',
          'neighbourhood',
          'borough',
          'localadmin',
          'locality',
          'county',
          'macrocounty',
          'region',
          'macroregion',
          'county',
          'coarse'
        )
      )
      .description(
        ' The administrative hierarchy level for the query. Refer to https://github.com/pelias/documentation/blob/master/search.md#filter-by-data-type for details.'
      ),

    size: Joi.number()
      .description('The amount of results returned. Default 10')
      .default(10),
    host: Joi.string()
      .default('https://api.openrouteservice.org/geocode/search/structured')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

export default schema
