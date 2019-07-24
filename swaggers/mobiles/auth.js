module.exports = {
	"paths": {
		"/apps/auth": {
			"post": {
				"tags": [
					"Mobile Authentication"
				],
				"description": "Authenticate to system form  Device ",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Authentication info that we want to auth",
						"schema": {
							"$ref": "#/definitions/MobileAuth"
						}
					},
				],

				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid input data or Device not found",
					},
					"200": {
						"description": "Device authenticated",
						"schema": {
							"$ref": "#/definitions/MobileAuthResponse"
						}
					}
				}
			},
		}
	},
	"definitions": {
		"MobileAuth": {
			"properties": {
				"client_id": {
					"type": "string"
				},
				"secret": {
					"type": "string"
				},
			}
		},
		"MobileAuthResponse": {
			"properties": {
				"client_id": {
					"type": "string"
				},
				"secret": {
					"type": "string"
				},
				"token": {
					"type": "string"
				},
			}
		}
	}
};

