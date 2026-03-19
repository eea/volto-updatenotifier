import React from 'react';
import superagent from 'superagent';
import { toPublicURL } from '@plone/volto/helpers';

export default function UpdateNotifier({ interval = 5000 }) {
  const [version, setVersion] = React.useState<string | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const url = toPublicURL('/__frontend-version');
    let timer = setTimeout(() => {
      superagent.get(url).then((body) => {
        const value = body.text;
        if (version === null) {
          setVersion(value);
        } else if (value !== version) {
          setShow(true);
        }
      });
    }, interval);

    return () => {
      clearTimeout(timer);
      return;
    };
  }, [version, interval]);

  if (!show) return null;

  return (
    <div>
      <button onClick={() => window.location.reload()}>Reload window</button>
    </div>
  );
}
