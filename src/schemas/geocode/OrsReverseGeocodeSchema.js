import Joi from 'joi'

const schema = Joi.object()
  .keys({
    api_key: Joi.string().description('Your openrouteservice API key'),
    point: Joi.object()
      .keys({
        lat_lng: Joi.array()
          .length(2)
          .items(Joi.number().required())
          .required()
          .description(
            'The specific coordinate to reverse geocode, order latitude followed by longitude.'
          ),
        radius: Joi.number().description(
          'The radius in kilometers to restrict the search around the focus point.'
        )
      })
      .description(
        'Point on earth and a maximum distance within which acceptable results can be located.'
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
    boundary_country: Joi.array()
      .items(Joi.string())
      .description(
        'Constrain query by country. Accepts alpha-2 or alpha-3 digit ISO-3166 country codes.'
      ),
    size: Joi.number()
      .description('The amount of results returned. Default 10')
      .default(10),
    host: Joi.string()
      .default('https://api.openrouteservice.org/geocode/reverse')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

export default schema
