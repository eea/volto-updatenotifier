import UpdateNotifier from './UpdateNotifier';

export default function applyConfig(config) {
  if (__SERVER__) {
    const installExpressMiddleware = require('./express-middleware').default;
    config = installExpressMiddleware(config);
  }
  config.settings.appExtras = [
    ...config.settings.appExtras,
    { match: '', component: UpdateNotifier, props: { interval: 10000 } },
  ];
  return config;
}
