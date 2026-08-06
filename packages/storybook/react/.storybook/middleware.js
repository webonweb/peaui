module.exports = function expressMiddleware(router) {
  const base = process.env.STORYBOOK_BASE
    ? `https://gitpages.gunb.gov.pl`
    : "http://localhost:6009";

  router.use((req, res, next) => {
    const originalSetHeader = res.setHeader.bind(res);

    res.setHeader = (name, value) => {
      const headerName = String(name).toLowerCase();

      if (headerName === "access-control-allow-origin") {
        return originalSetHeader(name, base);
      }

      return originalSetHeader(name, value);
    };

    res.setHeader("Access-Control-Allow-Origin", base);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });
};
