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
    state: provider,
    // thêm dòng này: luôn bắt Google hiển thị màn chọn tài khoản
    prompt: "select_account",
    // nếu muốn bắt nhập lại mật khẩu luôn thì dùng: prompt: "login",
  });

  return `${base}?${params.toString()}`;
}
