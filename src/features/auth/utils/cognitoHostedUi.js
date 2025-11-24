// src/features/auth/utils/cognitoHostedUi.js
const domain = process.env.REACT_APP_COGNITO_DOMAIN;
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
const redirectUri = process.env.REACT_APP_COGNITO_REDIRECT_URI;

if (!domain || !clientId || !redirectUri) {
  // optional: console.warn(...)
}

/**
 * provider: "Google" | "Facebook" | "Amazon" | ...
 */
export function getSocialLoginUrl(provider) {
  const base = `${domain}/oauth2/authorize`;

  const params = new URLSearchParams({
    response_type: "token", // nhận luôn id_token, access_token trên URL hash
    client_id: clientId,
    redirect_uri: redirectUri,
    identity_provider: provider,
    scope: "openid email profile",
    state: provider, // để biết đang login bằng provider nào (nếu cần về sau)
  });

  return `${base}?${params.toString()}`;
}
