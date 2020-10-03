const { verify } = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

function validateAccessToken(token) {
  const accessKey = fs.readFileSync(path.join(__dirname, './keys/accesskey.pem'), 'utf8');
  try {
    return verify(token, accessKey);
  } catch {
    return null;
  }
}

function validateRefreshToken(token) {
  const refreshKey = fs.readFileSync(path.join(__dirname, './keys/refreshkey.pem'), 'utf8');
  try {
    return verify(token, refreshKey);
  } catch {
    return null;
  }
}

function parseCookies({ req: { headers } }) {
  const { cookie } = headers;

  if (!cookie) return {};

  const cookies = cookie.split(';');
  const list = cookies.reduce((acc, val) => {
    const parts = val.split('=');
    acc[parts.shift().trim()] = decodeURI(parts.join('='));
    return acc;
  }, {});

  return list;
}

module.exports = {
  validateAccessToken,
  validateRefreshToken,
  parseCookies,
};
