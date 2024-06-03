# HTN Translation Layer API

The HTN Translation Layer API is designed to handle user authentication and address management, including creating, activating, and confirming user accounts as well as adding and retrieving addresses associated with unique identifiers.

## Authentication Routes

### 1. Register a New User Account

**Route**: `POST /api/authentication/register`

**Description**: Registers a new user account and sends an activation email.

**Parameters**:

- `req.body.account` - New user account object.

**Responses**:

- `200`: Success object with account details.
- `404`: Not found response.
- `500`: Internal server error.

### 2. Authenticate User

**Route**: `POST /api/authentication/authenticate`

**Description**: Authenticates a user with email and password.

**Parameters**:

- `req.body.credentials` - User credentials object.

**Responses**:

- `200`: User object.
- `404`: Not found response.
- `500`: Internal server error.

### 3. Confirm User Account

**Route**: `POST /api/authentication/confirm`

**Description**: Confirms a user account with an activation token.

**Parameters**:

- `req.headers.authorization` - User activation token.

**Responses**:

- `200`: Confirmation result object.
- `404`: Not found response.
- `500`: Internal server error.

### 4. Activate User Account

**Route**: `GET /api/authentication/activate/:code`

**Description**: Activates a user account using the provided activation code.

**Parameters**:

- `req.params.code` - The activation code for the account to be activated.

**Responses**:

- `200`: Success object with account details.
- `404`: Not found response.
- `500`: Internal server error.

## Address Routes

### 1. Add an Identifier

**Route**: `POST /api/addresses/identifier`

**Description**: Adds a new identifier.

**Parameters**:

- `req.body.authorization` - Session token of the account.
- `req.body.identifier` - Identifier to be added.

**Responses**:

- `200`: Success response with data of the created identifier.
- `400`: Bad request response.
- `404`: Not found response.
- `500`: Internal server error.

### 2. Add an Address

**Route**: `POST /api/addresses/address`

**Description**: Adds a new address associated with an existing identifier.

**Parameters**:

- `req.body.authorization` - Session token of the account.
- `req.body.identifier` - Existing identifier for the address.
- `req.body.address` - Address to be added.
- `req.body.token` - Token name of the address.

**Responses**:

- `200`: Success response with data of the created address.
- `400`: Bad request response.
- `404`: Not found response.
- `500`: Internal server error.

### 3. Retrieve Addresses by Identifier

**Route**: `GET /api/addresses/:identifier`

**Description**: Retrieves addresses associated with a given identifier.

**Parameters**:

- `req.params.identifier` - Identifier to retrieve addresses for.

**Responses**:

- `200`: Success response with addresses data.
- `404`: Not found response.
- `500`: Internal server error.

## Error Handling

All routes handle errors using the `DEBUG.log` function to log errors and provide consistent error response structures. The error responses include a `result` field indicating the operation's status and a `message` field with an error message.

## TODO

- Implement password recovery functionality.

## Development

### Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the development server using `npm start`.

### Testing

Run tests using `npm test`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
