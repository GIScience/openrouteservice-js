const Joi = require('joi')

const schema = Joi.object()
  .keys({
    api_key: Joi.string()
      .required()
      .description('Your openrouteservice API key'),
    format_in: Joi.string()
      .valid(['geojson', 'encodedpolyline', 'polyline'])
      .description('The input format geometry.'),
    format_out: Joi.string()
      .valid(['geojson', 'encodedpolyline', 'polyline'])
      .description('The output format geometry.'),
    geometry: Joi.any()
      .when('format_in', {
        is: Joi.string().regex(/^geojson$/),
        then: Joi.object().keys({
          type: Joi.string()
            .valid(['LineString'])
            .description('The type of GeoJSON'),
          coordinates: Joi.array().description(
            'The coordinates of the GeoJSON LineString object.'
          )
        })
      })
      .when('format_in', {
        is: Joi.string().regex(/^polyline$/),
        then: Joi.array()
          .min(1)
          .max(2000)
          .items(
            Joi.array()
              .length(2)
              .items(Joi.number())
              .required()
          )
          .required()
          .description('The list of coordinate tuples.')
      })
      .when('format_in', {
        is: Joi.string().regex(/^encodedpolyline$/),
        then: Joi.string()
          .required()
          .description('The encoded polyline as input.')
      })
      .required()
      .description('GeoJSON object'),
    dataset: Joi.string()
      .valid(['srtm'])
      .default('srtm')
      .description('The dataset used to return elevation data.'),
    api_version: Joi.string()
      .valid(['v1'])
      .default('v1')
      .description('Determines the API version to be used.'),
    host: Joi.string()
      .default('https://api.openrouteservice.org/elevation/line')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

module.exports = schema
