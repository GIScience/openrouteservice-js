const Joi = require('joi')

const schema = Joi.object()
  .keys({
    api_key: Joi.string()
      .required()
      .description('Your openrouteservice API key'),
    locations: Joi.array()
      .min(1)
      .max(5)
      .items(
        Joi.array()
          .length(2)
          .required()
      )
      .required()
      .description(
        'The coordinates tuple the route should be calculated from. In order of visit'
      ),
    profile: Joi.string()
      .valid([
        'driving-car',
        'driving-hgv',
        'foot-walking',
        'foot-hiking',
        'cycling-regular',
        'cycling-road',
        'cycling-mountain',
        'cycling-tour',
        'cycling-electric',
        'wheelchair'
      ])
      .default('driving-car')
      .description(
        'Specifies the mode of transport to use when calculating directions.'
      ),
    range_type: Joi.string()
      .valid(['time', 'distance'])
      .default('time')
      .description('Set time for isochrones or distance for equidistants.'),
    interval: Joi.array()
      .items(Joi.number().default(60))
      .description(
        "Ranges to calculate distances/durations for. This can be a list of multiple ranges, e.g. [600, 1200, 1400] or a single value list. In the latter case, you can also specify the 'segments' variable to break the single value into more isochrones. In meters or seconds."
      ),
    range: Joi.number()
      .description(
        'Maximum range value of the analysis in seconds for time and meters for distance. Alternatively a comma separated list of specific single range values.'
      )
      .default(60),
    units: Joi.string()
      .valid(['m', 'km', 'mi'])
      .description('Specifies the units of response.'),
    attributes: Joi.array()
      .items(Joi.string().valid('area', 'reachfactor', 'total_pop'))
      .description(
        'List of requested attributes. area: Returns the area of each polygon in its feature properties. reachfactor: Returns a reachability score between 0 and 1. total_pop: Returns the total population of each polygon based on Global Human Settlement data.'
      ),
    location_type: Joi.string()
      .valid(['start', 'destination'])
      .default('start')
      .description(
        'Start treats the location(s) as starting point, destination as goal. '
      ),
    options: Joi.object().description(
      'Refer to https://openrouteservice.org for detailed documentation. Construct your own dict() following the example of the minified options object. Will be converted to json automatically.'
    ),
    api_version: Joi.string()
      .valid(['v1', 'v2'])
      .default('v1')
      .description('Determines the API version to be used.'),
    host: Joi.string()
      .default('https://api.openrouteservice.org/isochrones')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

module.exports = schema
