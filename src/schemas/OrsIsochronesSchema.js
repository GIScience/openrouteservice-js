import Joi from 'joi'

const schema = Joi.object()
  .keys({
    api_key: Joi.string().description('Your openrouteservice API key'),
    locations: Joi.array()
      .min(1)
      .max(5)
      .items(
        Joi.array()
          .length(2)
          .required()
      )
      .required()
      .description('Isochrones locations to use in the request.'),
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
    restrictions: Joi.object()
      .when('profile', {
        is: Joi.string().regex(/^driving-hgv$/),
        then: Joi.object().keys({
          length: Joi.number().description('Length of the HGV vehicle'),
          width: Joi.number().description('Width of the HGV vehicle'),
          weight: Joi.number().description('Weight of the HGV vehicle'),
          height: Joi.number().description('Height of the HGV vehicle'),
          axleload: Joi.number().description('Axleload of the HGV vehicle'),
          hazmat: Joi.boolean().description(
            'Whether the HGV carries hazardous materials'
          )
        })
      })
      .when('profile', {
        is: Joi.string().regex(/^wheelchair$/),
        then: Joi.object().keys({
          surface_type: Joi.any().description('Surface type'),
          track_type: Joi.any().description('Track type'),
          smoothness_type: Joi.any().description('Smoothness type'),
          maximum_sloped_curb: Joi.any().description('Maximum sloped curb'),
          maximum_incline: Joi.any().description('Maximum incline')
        })
      })
      .when('profile', {
        is: Joi.string().regex(/^driving-car$/),
        then: Joi.object().keys({})
      })
      .when('profile', {
        is: Joi.string().regex(/^cycling.*/),
        then: Joi.object().keys({})
      })
      .when('profile', {
        is: Joi.string().regex(/^foot.*/),
        then: Joi.object().keys({})
      }),
    avoid_polygons: Joi.object(),
    avoidables: Joi.array()
      .when('profile', {
        is: Joi.string().regex(/^driving.*/),
        then: Joi.array()
          .items(
            Joi.string().valid(['highways', 'tollways', 'ferries', 'fords'])
          )
          .description('Valid avoidables for selected profile.')
      })
      .when('profile', {
        is: Joi.string().regex(/^foot.*/),
        then: Joi.array()
          .items(Joi.string().valid(['steps', 'ferries', 'fords']))
          .description('Valid avoidables for selected profile.')
      })
      .when('profile', {
        is: Joi.string().regex(/^cycling.*/),
        then: Joi.array()
          .items(Joi.string().valid(['highways', 'tollways', 'ferries']))
          .description('Valid avoidables for selected profile.')
      })
      .when('profile', {
        is: Joi.string().regex(/^wheelchair.*/),
        then: Joi.array()
          .items(Joi.string().valid(['steps', 'ferries']))
          .description('Valid avoidables for selected profile.')
      })
      .description('List of supported avoidables for specific profile.'),
    range_type: Joi.string()
      .valid(['time', 'distance'])
      .default('time')
      .description('Set time for isochrones or distance for equidistants.'),
    smoothing: Joi.number()
      .min(0)
      .max(1),
    interval: Joi.array()
      .items(Joi.number().default(60))
      .description(
        'Ranges to calculate distances/durations for. This can be a list of multiple ranges, e.g. [600, 1200, 1400] or a single value list. In the latter case, you can also specify the segments variable to break the single value into more isochrones. In meters or seconds.'
      ),
    format: Joi.string()
      .valid(['geojson'])
      .default('geojson')
      .description('Specifies which geometry format should be returned.'),
    range: Joi.array()
      .items(Joi.number())
      .min(1)
      .max(1)
      .description(
        'Maximum range value of the analysis in seconds for time and meters for distance. Alternatively a comma separated list of specific single range values.'
      )
      .default(60),
    units: Joi.string()
      .valid(['m', 'km', 'mi'])
      .description('Specifies the units of response.'),
    area_units: Joi.string()
      .valid(['m', 'km', 'mi'])
      .description('Specifies the area units of response.'),
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
    service: Joi.string()
      .default('isochrones')
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
