// Exporterar en middleware-funktion som kontrollerar om användarens roll finns i den tillåtna roller-listan

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