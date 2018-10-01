const Joi = require("joi");

const schema = Joi.object()
    .keys({
        api_key: Joi.string()
            .required()
            .description("Your openrouteservice API key"),
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
                "The coordinates tuple the route should be calculated from. In order of visit"
            ),
        profile: Joi.string()
            .valid([
                "driving-car",
                "driving-hgv",
                "foot-walking",
                "foot-hiking",
                "cycling-regular",
                "cycling-road",
                "cycling-mountain",
                "cycling-tour",
                "cycling-electric",
                "wheelchair"
            ])

            .default("driving-car")
            .description(
                "Specifies the mode of transport to use when calculating directions."
            ),
        preference: Joi.string()
            .valid(["fastest", "shortest", "recommended"])
            .default("fastest")
            .description("Specifies the routing preference."),
        units: Joi.string()
            .valid(["m", "km", "mi"])
            .default("m")
            .description("Specifies the units of response."),
        language: Joi.string()
            .valid([
                "en",
                "de",
                "cn",
                "es",
                "ru",
                "dk",
                "fr",
                "it",
                "nl",
                "br",
                "se",
                "tr",
                "gr"
            ])
            .default("en")
            .description("Language for routing instructions."),
        geometry: Joi.boolean()
            .default(true)
            .description("Specifies whether geometry should be returned."),
        geometry_format: Joi.string()
            .valid(["encodedpolyline", "geojson", "polyline"])
            .default("encodedpolyline")
            .description("Specifies which geometry format should be returned."),
        format: Joi.string()
            .valid(["json", "geojson", "gpx"])
            .default("json")
            .description("Specifies the format of response."),
        instructions: Joi.boolean()
            .default(true)
            .description(
                "Specifies whether route instruction should be returned."
            ),
        instructions_format: Joi.string()
            .valid(["text", "html"])
            .default("text")
            .description("Specifies the format of route instructions."),
        roundabout_exits: Joi.boolean(),
        attributes: Joi.array()
            .items(Joi.string().valid("avgspeed", "detourfactor", "percentage"))
            .description("Returns route attributes."),
        continue_straight: Joi.boolean(),
        elevation: Joi.boolean().description(
            "Specifies whether to return elevation values for points."
        ),
        extra_info: Joi.array()
            .items(
                Joi.string().valid(
                    "steepness",
                    "suitability",
                    "surface",
                    "waycategory",
                    "waytype",
                    "tollways",
                    "traildifficulty"
                )
            )
            .description("Returns additional information"),
        optimized: Joi.boolean(),
        options: Joi.object().description(
            "Refer to https://openrouteservice.org for detailed documentation. Construct your own dict() following the example of the minified options object. Will be converted to json automatically."
        ),
        api_version: Joi.string()
            .valid(["v1", "v2"])
            .default("v1")
            .description("Determines the API version to be used."),
        host: Joi.string()
            .default("https://api.openrouteservice.org/directions")
            .description("Determines the API url."),
        mime_type: Joi.string()
            .valid(["application/json"])
            .default("application/json")
            .description("Determines the mime type of request.")
    })
    .unknown(false);

module.exports = schema;
