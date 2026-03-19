import UpdateNotifier from './UpdateNotifier';

export default function applyConfig(config) {
  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }
  config.appExtras = [
    ...config.appExtras,
    { match: '', component: UpdateNotifier, props: { interval: 60000 } },
  ];
  return config;
}
