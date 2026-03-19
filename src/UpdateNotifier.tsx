import React from 'react';
import superagent from 'superagent';
import { Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { defineMessages, useIntl } from 'react-intl';
import { Toast } from '@plone/volto/components';
import { toPublicURL } from '@plone/volto/helpers';

const messages = defineMessages({
  updateAvailable: {
    id: 'A new version of the site is available.',
    defaultMessage: 'A new version of the site is available.',
  },
  reload: {
    id: 'Reload',
    defaultMessage: 'Reload',
  },
});

export default function UpdateNotifier({ interval = 5000 }) {
  const intl = useIntl();
  const [version, setVersion] = React.useState<string | null>(null);

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
            if (value !== currentVersion && !toast.isActive('update-notifier')) {
              toast.info(
                <Toast
                  info
                  title={intl.formatMessage(messages.updateAvailable)}
                  content={
                    <Button
                      primary
                      size="small"
                      onClick={() => window.location.reload()}
                    >
                      {intl.formatMessage(messages.reload)}
                    </Button>
                  }
                />,
                {
                  toastId: 'update-notifier',
                  autoClose: false,
                  closeButton: false,
                  transition: null,
                },
              );
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
  }, [interval, intl]);

  return null;
}
