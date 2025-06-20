import { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { languageAtom } from 'state/preferences/languageAtom';
import { extensionsState } from 'state/navigation/extensionsAtom';

import { resourceRoutesNamespaced } from 'resources';
import { createExtensibilityRoutes } from './ExtensibilityRoutes';
import { otherRoutesNamespaced } from 'resources/other';
import { IncorrectPath } from './IncorrectPath';
import { useUrl } from 'hooks/useUrl';
import { useGet } from 'shared/hooks/BackendAPI/useGet';

export default function NamespaceRoutes() {
  const { t } = useTranslation();
  const { namespaceId } = useParams();
  const { clusterUrl, namespaceUrl } = useUrl();
  const language = useRecoilValue(languageAtom);
  const extensions = useRecoilValue(extensionsState);
  const [extensibilityRoutes, setExtensibilityRoutes] = useState<
    JSX.Element[] | null
  >(null);

  useEffect(() => {
    if (extensions?.length) {
      setExtensibilityRoutes(
        extensions.map(extension =>
          createExtensibilityRoutes(extension, language),
        ),
      );
    }
  }, [extensions, language]);

  const { error } = useGet(
    namespaceId === '-all-'
      ? `/api/v1/namespaces`
      : `/api/v1/namespaces/${namespaceId}`,
    {
      skip: false,
      pollingInterval: 0,
      onDataReceived: () => {},
    } as any,
  );
  const hasAccessToNamespace =
    JSON.parse(JSON.stringify(error)) === null ||
    JSON.parse(JSON.stringify(error))?.code === 403;
  if (namespaceId !== '-all-' && error && !hasAccessToNamespace) {
    return (
      <IncorrectPath
        to={clusterUrl('overview')}
        message={t('components.incorrect-path.message.cluster')}
      />
    );
  }

  return (
    <Routes>
      {extensibilityRoutes && (
        <Route
          path="*"
          element={
            <IncorrectPath
              to={namespaceUrl('')}
              message={t('components.incorrect-path.message.namespace')}
            />
          }
        />
      )}
      {/* extensibility routes should go first, so if someone overwrites the default view, the new one should have a higher priority */}
      {extensibilityRoutes}
      {resourceRoutesNamespaced}
      {otherRoutesNamespaced}
    </Routes>
  );
}
