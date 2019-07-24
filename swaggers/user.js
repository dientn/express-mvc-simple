module.exports = {
	"paths": {
		"description": "User management",
		"/users": {
			"get": {
				"tags": [
					"Agency"
				],
				"description": "Get users",
				"parameters": [
					{
						"name": "page",
						"in": "path",
						"description": "Page number of list to return ",
						"type": "integer",
						"format" : "int64"
					},
					{
						"name": "per_page",
						"in": "path",
						"description": "Per Page of list to return ",
						"type": "integer",
						"format" : "int64"
					},
					{
						"name": "sort",
						"in": "path",
						"description": "Sort field of list to return (-field to ascending, +field to descending)",
						"type": "string",
					},
					{
						"name": "fields",
						"in": "path",
						"description": "Select field of each item to return ('field_a field_b')",
						"type": "string",
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid input data",
					},
					"200": {
						"description": "Get list Agency successful",
						"schema": {
							"type" : "array",
							"items": {
								"$ref": "#/definitions/Agency"
							}
						}
					}
				}
			},
		},
		"/users/{id}": {
			"get": {
				"tags": [
					"User"
				],
				"description": "Find User by ID",
				"parameters": [
					{
						"name": "id",
						"in": "path",
						"description": "Id  of User to return ",
						"type": "integer",
						"format" : "int64"
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid ID supplied or User not found",
					},
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/User"
						}
					}
				}
			},
			"put": {
				"tags": [
					"User"
				],
				"description": "Update User by ID",
				"parameters": [
					{
						"name": "id",
						"in": "path",
						"description": "Id  of User to return ",
						"type": "integer",
						"format" : "int64"
					},
					{
						"name": "body",
						"in": "body",
						"description": "Update profile for user",
						"schema": {
							"$ref": "#/definitions/User"
						}
					},
				],
				"consumes": [
					"multipart/form-data"
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid ID supplied or Agency not found",
					},
					"200": {
						"description": "successful operation",
						"schema": {
							"$ref": "#/definitions/User"
						}
					}
				}
			},
			"delete": {
				"tags": [
					"User"
				],
				"description": "Delete a User",
				"parameters": [
					{
						"name": "id",
						"in": "path",
						"description": "User ID to delete",
						"type": "integer",
						"format" : "int64"
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid ID supplied or User not found",
					},
					"200": {
						"description": "successful operation",
					}
				},
				"security" : [
					{
						"JWT" : []
					}
				]
			},
		},
		"/users": {
			"post": {
				"tags": [
					"User"
				],
				"description": "Add new User",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Data for new User",
						"schema": {
							"$ref": "#/definitions/User"
						}
					},
				],
				"consumes": [
					"multipart/form-data"
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
							"$ref": "#/definitions/User"
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
		"/users/count": {
			"get": {
				"tags": [
					"User"
				],
				"description": "Get total of Users",
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid data or fail",
					},
					"200": {
						"description": "Get Total of user successful",
						"schema": {
							"type" : "object",
							"additionalProperties" : {
								"type" : "integer",
								"format" : "int32"
							}
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
		"User": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string",
					"description": "Name of agency"
				},
				"email": {
					"type": "string",
					"description": "Email of agency"
				},
				"phone": {
					"type": "string",
					"description": "Phone number of user"
				},
				"address": {
					"type": "string",
					"description": "Address of agency"
				},
				"balance": {
					"type": "integer",
					"description": "Point balance point of user"
				},
				"usage": {
					"type": "integer",
					"description": "Point usage of user"
				},
				"status": {
					"type": "string"
				},
			}
		}
	}
};

