module.exports = {
	"paths": {
		"description": "Device management",
		"/apps/location": {
			"post": {
				"tags": [
					"GPS Location"
				],
				"description": "Update device location",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Location of device",
						"schema": {
							"$ref": "#/definitions/GPSLocation"
						}
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid data input",
					},
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/Device"
						}
					}
				},
				"security" : [
					{
						"JWT" : []
					}
				]
			},

		},
	},
	"definitions": {
		"GPSLocation": {
			"type": "object",
			"description": "The Geojson Point https://docs.mongodb.com/manual/reference/geojson/#point",
			"properties": {
				"type": {
					"type": "string",
					"description": "Geometry Point Type"
				},
				"coordinates": {
					"type": "array",
					"items":{
						"type": "integer"
					},
					"minItems": 2,
					"maxItems": 2,
					"description": "Geometry coordinates"
				},

			}
		},
		"Device": {
			"type": "object",
			"properties": {
				"client_id": {
					"type": 'string'
				},
				"secret": {
					"type": 'string'
				},
				"location": {
					"type": "object",
					"description": "Geometry Point Type"
				}
			}
		}
	}
};

