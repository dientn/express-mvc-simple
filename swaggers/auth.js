module.exports = {
	"paths": {
		"/signin": {
			"post": {
				"tags": [
					"Authentication"
				],
				"description": "Login user into system",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Authentication info that we want to login",
						"schema": {
							"$ref": "#/definitions/Auth"
						}
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid input data or User not found",
					},
					"200": {
						"description": "User login successful",
						"schema": {
							"$ref": "#/definitions/User"
						}
					}
				}
			},
		},
		"/signout": {
			"get": {
				"tags": [
					"Authentication"
				],
				"description": "Sign out current logged in user session",

				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid data or fail",
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
		"/signup": {
			"post": {
				"tags": [
					"Authentication"
				],
				"description": "Register new account from system",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Authentication info that we want to register",
						"schema": {
							"$ref": "#/definitions/UserRegister"
						}
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid data or user exists already",
					},
					"200": {
						"description": "User is registered",
						"schema": {
							"$ref": "#/definitions/User"
						}
					}
				}
			},
		},
		"/me": {
			"put": {
				"tags": [
					"Profile"
				],
				"description": "Update profile for users",
				"parameters": [
					{
						"name": "body",
						"in": "body",
						"description": "Update profile for user",
						"schema": {
							"$ref": "#/definitions/Profile"
						}
					},
				],
				"produces": [
					"application/json"
				],
				"responses": {
					"400": {
						"description": "Invalid data or not logged in",
					},
					"200": {
						"description": "Profile update successfully",
						"schema": {
							"$ref": "#/definitions/Profile"
						}
					}
				},
				"security" : [
					{
						"JWT" : []
					}
				]
			}
		}
	},
	"definitions": {
		"Auth": {
			"properties": {
				"email": {
					"type": "string"
				},
				"password": {
					"type": "string"
				},
				"remember_me": {
					"type": "boolean"
				},
			}
		},
		"UserRegister": {
			"properties": {
				"first_name": {
					"type": "string"
				},
				"last_name": {
					"type": "string"
				},
				"email": {
					"type": "string"
				},
				"password": {
					"type": "string"
				},
				"confirmed_password": {
					"type": "string"
				}
			}
		},
		"Profile": {
			"properties": {
				"name": {
					"type": "string"
				},
				"logo": {
					"type": "file"
				},
				"email": "string",
				"phone": "string",
				"address": "string"
			}
		}
	}
};

