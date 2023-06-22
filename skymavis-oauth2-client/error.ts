/**
 * An error class for any error the server emits.
 *
 * The 'code' property will have the oauth2 error type,
 * such as:
 * - invalid_request
 * - invalid_client
 * - invalid_grant
 * - unauthorized_client
 * - unsupported_grant_type
 * - invalid_scope
 */

export class OAuth2Error extends Error {
  error: string
  error_description: string
  http_status: number

  constructor(error: string, errorDescription: string, status: number) {
    super(errorDescription)
    this.error = error
    this.error_description = errorDescription
    this.http_status = status
  }
}
