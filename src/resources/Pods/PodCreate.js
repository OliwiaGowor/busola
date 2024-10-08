import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import * as _ from 'lodash';

import { ResourceForm } from 'shared/ResourceForm';
import { activeNamespaceIdState } from 'state/activeNamespaceIdAtom';

import { createPodTemplate } from './templates';

export default function PodCreate({
  formElementRef,
  onChange,
  resource: initialPod,
  setCustomValid,
  resourceUrl,
  ...props
}) {
  const namespaceId = useRecoilValue(activeNamespaceIdState);
  const [pod, setPod] = useState(
    _.cloneDeep(initialPod) || createPodTemplate(namespaceId),
  );
  const [initialResource] = useState(
    initialPod || createPodTemplate(namespaceId),
  );
  const [initialUnchangedResource] = useState(_.cloneDeep(initialPod));
  const { t } = useTranslation();

  return (
    <ResourceForm
      {...props}
      pluralKind="pods"
      singularName={t('pods.name_singular')}
      resource={pod}
      initialResource={initialResource}
      initialUnchangedResource={initialUnchangedResource}
      setResource={setPod}
      onChange={onChange}
      formElementRef={formElementRef}
      createUrl={resourceUrl}
      setCustomValid={setCustomValid}
      onlyYaml
    />
  );
}
