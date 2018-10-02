const Joi = require('joi')

const schema = Joi.object()
  .keys({
    api_key: Joi.string()
      .required()
      .description('Your openrouteservice API key'),
    text: Joi.string()
      .description('Full-text query against search endpoint.')
      .required(),
    focus_point: Joi.array()
      .length(2)
      .items(Joi.number())
      .description(
        'By specifying a focus point, nearby places will be scored higher depending on how close they are to the focus.point so that places with higher scores will appear higher in the results list. The effect of this scoring boost diminishes to zero after 100 kilometers away from the focus.point. After all the nearby results have been found, additional results will come from the rest of the world, without any further location-based prioritization.'
      ),
    boundary_bbox: Joi.array()
      .min(2)
      .items(
        Joi.array()
          .length(2)
          .items(Joi.number())
      )
      .description(
        'Creates a bounding box from two corners coordinate pairs, the order is bottom_left, top_right.'
      ),
    boundary_circle: Joi.object()
      .keys({
        lat_lng: Joi.array()
          .length(2)
          .items(Joi.number()),
        radius: Joi.number().description(
          'The focus point, gives results within a 100 km radius.'
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
      .default('https://api.openrouteservice.org/geocode/search')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

module.exports = schema
