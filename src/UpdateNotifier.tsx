import React from 'react';
import superagent from 'superagent';
import { Button } from 'semantic-ui-react';
import { toPublicURL, toast } from '@plone/volto/helpers';

const ReloadButton = () => (
  <div>
    <p>A new version of the site is available.</p>
    <Button primary size="small" onClick={() => window.location.reload()}>
      Reload
    </Button>
  </div>
);

export default function UpdateNotifier({ interval = 5000 }) {
  const [version, setVersion] = React.useState<string | null>(null);
  const toastId = React.useRef<string | number | null>(null);

  React.useEffect(() => {
    const url = toPublicURL('/__frontend-version');

    const checkVersion = () => {
      superagent
        .get(url)
        .then((body) => {
          const value = body.text;
          setVersion((currentVersion) => {
            if (currentVersion === null) {
              return value;
            }
            if (value !== currentVersion && !toastId.current) {
              toastId.current = toast.info(<ReloadButton />, {
                autoClose: false,
              });
            }
            return currentVersion;
          });
        })
        .catch(() => {
          // Ignore errors during version check (e.g. network transient issues)
        });
    };

    checkVersion();
    const timer = setInterval(checkVersion, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return null;
}
