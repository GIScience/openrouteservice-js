import Joi from 'joi'

const schema = Joi.object()
  .keys({
    api_key: Joi.string().description('Your openrouteservice API key'),
    locations: Joi.array()
      .min(1)
      .max(50)
      .items(
        Joi.array()
          .length(2)
          .required()
      )
      .required()
      .description(
        'a single location, or a list of locations, where a location is a list or tuple of lng,lat values'
      ),
    sources: Joi.array()
      .items(Joi.string().default('all'))
      .description(
        "A list of indices that refer to the list of locations (starting with 0) or 'all'"
      )
      .default('all'),
    destinations: Joi.array()
      .items(Joi.string().default('all'))
      .description(
        "A list of indices that refer to the list of locations (starting with 0) or 'all'"
      )
      .default('all'),
    profile: Joi.string()
      .valid([
        'driving-car',
        'driving-hgv',
        'foot-walking',
        'foot-hiking',
        'cycling-regular',
        'cycling-road',
        'cycling-mountain',
        'cycling-electric',
        'wheelchair'
      ])
      .default('driving-car')
      .description(
        'Specifies the mode of transport to use when calculating directions.'
      ),
    units: Joi.string()
      .valid(['m', 'km', 'mi'])
      .description('Specifies the units of response.'),
    format: Joi.string()
      .valid(['json'])
      .default('json')
      .description('Specifies which geometry format should be returned.'),
    metrics: Joi.array()
      .items(Joi.string().valid('duration', 'distance'))
      .description('Specifies a list of returned metrics.'),
    optimized: Joi.boolean().default(true),
    service: Joi.string()
      .default('matrix')
      .description('Determines the service endpoint to be used.'),
    api_version: Joi.string()
      .valid(['v2'])
      .default('v2')
      .description('Determines the API version to be used.'),
    host: Joi.string()
      .default('https://api.openrouteservice.org')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

export default schema
