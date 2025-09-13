export function validateBody(required = []) {
  return (req, _res, next) => {
    for (const field of required) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        const e = new Error(`${field} is required`);
        e.status = 400;
        throw e;
      }
    }
    next();
  };
}
