import * as decode from "jwt-decode";

export function DecodeToken(token) {
  if (token == null) {
    return null;
  }
  try {
    let tokenPayload = decode(token);
    if (tokenPayload) {
      return tokenPayload;
    }
  } catch (error) {
    return null;
  }
}
