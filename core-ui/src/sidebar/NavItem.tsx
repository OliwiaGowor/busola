import { Icon, SideNav } from 'fundamental-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { NavNode } from 'state/types';
import { useUrl } from 'hooks/useUrl';

import './NavItem.scss';

type NavItemProps = {
  node: NavNode;
};

export function NavItem({ node }: NavItemProps) {
  const { t } = useTranslation();
  const urlGenerators = useUrl();
  const { scopedUrl } = urlGenerators;

  const isNodeSelected = () => {
    if (node.externalUrl) return false;
    return false;
    //TODO
    /*
    const { pathname } = window.location;
    const namespacePart = namespaceId ? `/namespaces/${namespaceId}/` : '/';
    const resourcePart = pathname.replace(namespacePart, '');
    const pathSegment = resourcePart.split('/')?.[0];
    return (
      pathSegment === node.pathSegment || pathSegment === node.resourceType
    );
     */
  };

  const name = t(node.label, { defaultValue: node.label });

  return (
    <SideNav.ListItem
      selected={isNodeSelected()}
      key={node.pathSegment}
      id={node.pathSegment}
      glyph={node.icon}
    >
      {node.externalUrl ? (
        <a className="nav-item__external-link" href={node.externalUrl}>
          {name} <Icon glyph="inspect" />
        </a>
      ) : (
        <Link
          to={
            node.createUrlFn
              ? node.createUrlFn(urlGenerators)
              : scopedUrl(node.pathSegment)
          }
        >
          {name}
        </Link>
      )}
    </SideNav.ListItem>
  );
}