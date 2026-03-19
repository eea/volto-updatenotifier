import express from 'express';
import pkgJson from '@root/../package.json';

function frontendVersionMiddleware(req, res, next) {
  res.send(pkgJson.version);
}

export default function installMiddleware(config) {
  const middleware = express.Router();

  middleware.all(['**/__frontend-version'], frontendVersionMiddleware);
  middleware.id = 'frontendVersionMiddleware';
  config.settings.expressMiddleware.push(middleware);
  return config;
}
