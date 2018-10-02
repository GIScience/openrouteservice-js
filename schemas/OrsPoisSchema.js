const Joi = require('joi')

const schema = Joi.object()
  .keys({
    api_key: Joi.string()
      .required()
      .description('Your openrouteservice API key'),
    request: Joi.string()
      .valid('pois', 'list', 'stats')
      .description('Returns additional information'),
    geometry: Joi.object()
      .keys({
        bbox: Joi.array()
          .length(2)
          .items(Joi.array().length(2)),
        geojson: Joi.object()
          .keys({
            type: Joi.string()
              .valid(['Point', 'LineString', 'Polygon'])
              .description('The type of GeoJSON'),
            coordinates: Joi.array().description(
              'The coordinates of the GeoJSON object.'
            )
          })
          .description('The GeoJSON Object'),
        buffer: Joi.number().description(
          "Buffers geometry of 'geojson' or 'bbox' with the specified value in meters."
        )
      })
      .description('GeoJSON object'),
    filters: Joi.object().keys({
      category_ids: Joi.array()
        .min(1)
        .max(5)
        .items(Joi.number())
        .description(
          'Filter by ORS custom category IDs. See https://github.com/GIScience/openrouteservice-docs#places-response for the mappings.'
        ),
      category_group_ids: Joi.array()
        .min(1)
        .max(5)
        .items(Joi.number())
        .description(
          'Filter by ORS custom category IDs. See https://github.com/GIScience/openrouteservice-docs#places-response for the mappings.'
        )
    }),
    sortby: Joi.string()
      .valid(['distance', 'category'])
      .description(
        'Sort the results by distance or category, only works for pois request.'
      ),
    limit: Joi.number().description('Limits the number of results.'),
    api_version: Joi.string()
      .valid(['v1'])
      .default('v1')
      .description('Determines the API version to be used.'),
    host: Joi.string()
      .default('https://api.openrouteservice.org/pois')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

module.exports = schema
