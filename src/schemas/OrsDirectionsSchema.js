import Joi from 'joi'

const schema = Joi.object()
  .keys({
    api_key: Joi.string().description('Your openrouteservice API key'),
    coordinates: Joi.array()
      .min(2)
      .max(50)
      .items(
        Joi.array()
          .length(2)
          .items(Joi.number())
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
    avoid_polygons: Joi.object(),
    preference: Joi.string()
      .valid(['fastest', 'shortest', 'recommended'])
      .default('fastest')
      .description('Specifies the routing preference.'),
    units: Joi.string()
      .valid(['m', 'km', 'mi'])
      .default('m')
      .description('Specifies the units of response.'),
    language: Joi.string()
      .valid([
        'en',
        'de',
        'cn',
        'es',
        'ru',
        'dk',
        'fr',
        'it',
        'nl',
        'br',
        'se',
        'tr',
        'gr'
      ])
      .default('en')
      .description('Language for routing instructions.'),
    geometry: Joi.boolean()
      .default(true)
      .description('Specifies whether geometry should be returned.'),
    geometry_format: Joi.string()
      .valid(['encodedpolyline', 'geojson', 'polyline'])
      .description('Specifies which geometry format should be returned.'),
    format: Joi.string()
      .valid(['json', 'geojson', 'gpx'])
      .default('json')
      .description('Specifies the format of response.'),
    instructions: Joi.boolean()
      .default(true)
      .description('Specifies whether route instruction should be returned.'),
    instructions_format: Joi.string()
      .valid(['text', 'html'])
      .default('text')
      .description('Specifies the format of route instructions.'),
    roundabout_exits: Joi.boolean(),
    attributes: Joi.array()
      .items(Joi.string().valid('avgspeed', 'detourfactor', 'percentage'))
      .description('Returns route attributes.'),
    continue_straight: Joi.boolean(),
    elevation: Joi.boolean().description(
      'Specifies whether to return elevation values for points.'
    ),
    extra_info: Joi.array()
      .items(
        Joi.string().valid(
          'steepness',
          'suitability',
          'surface',
          'waycategory',
          'waytype',
          'tollways',
          'traildifficulty'
        )
      )
      .description('Returns additional information'),
    optimized: Joi.boolean(),
    options: Joi.object().description(
      'Refer to https://openrouteservice.org for detailed documentation. Construct your own dict() following the example of the minified options object. Will be converted to json automatically.'
    ),
    service: Joi.string()
      .default('directions')
      .description('Determines the service endpoint to be used.'),
    api_version: Joi.string()
      .valid(['v2'])
      .default('v2')
      .description('Determines the API version to be used.'),
    host: Joi.string()
      .default('https://api.openrouteservice.org')
      .description('Determines the API url.'),
    mime_type: Joi.string()
      .valid(['application/json', 'application/geo+json'])
      .default('application/json')
      .description('Determines the mime type of request.')
  })
  .unknown(false)

export default schema
