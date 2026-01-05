export const requireRole = (roles) => {
  return (request, h) => {
    const { role } = request.auth.credentials;

    if (!roles.includes(role)) {
      return h
        .response({ error: 'Access denied' })
        .code(403)
        .takeover();
    }

    return h.continue;
  };
};