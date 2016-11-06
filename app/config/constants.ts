import { CloudPage } from '../pages/products/cloud/cloud';
import { DedicatedServerPage } from '../pages/products/dedicated-server/dedicated-server';
import { DomainPage } from '../pages/products/domain/domain';
import { HostingWebPage } from '../pages/products/hosting-web/hosting-web';
import { PrivateDatabasePage } from '../pages/products/private-database/private-database';
import { SmsPage } from '../pages/products/sms/sms';
import { VpsPage } from '../pages/products/vps/vps';

export const categoryEnum: any = {
  WEB: {
    url: '/hosting/web',
    name: 'WEB',
    text: 'Hébergement web',
    supportRef: 'hosting',
    hardware: true,
    icon: 'fa fa-globe',
    workId: '4',
    monitoring: [
      {
        type: 'in.httpHits',
        text: 'Requêtes HTTP'
      },
      {
        type: 'in.httpMeanResponseTime',
        text: 'Temps de réponse'
      },
      {
        type: 'in.ftpCommands',
        text: 'Requêtes FTP'
      },
      {
        type: 'out.tcpConn',
        text: 'Connexions externes'
      },
      {
        type: 'sys.cpuUsage',
        text: 'Utilisation CPU'
      },
      {
        type: 'sys.workerSpawnOverload',
        text: 'Dépassements de ressources'
      }
    ],
    page: HostingWebPage
  },
  VPS: {
    url: '/vps',
    name: 'VPS',
    text: 'VPS',
    supportRef: 'hosting',
    hardware: true,
    icon: 'fa fa-hdd-o',
    workId: '22',
    page: VpsPage
  },
  DEDICATED_SERVER: {
    url: '/dedicated/server',
    name: 'DEDICATED_SERVER',
    text: 'Serveur dédié',
    supportRef: 'dedicated',
    hardware: true,
    icon: 'fa fa-server',
    workId: '5',
    monitoring: [
      {
        type: 'cpu',
        text: 'Utilisation CPU'
      },
      {
        type: 'memory',
        text: 'Utilisation mémoire'
      },
      {
        type: 'swap',
        text: 'Utilisation SWAP'
      }
    ],
    page: DedicatedServerPage
  },
  PRIVATE_DATABASE: {
    url: '/hosting/privateDatabase',
    name: 'PRIVATE_DATABASE',
    text: 'Base de données privée',
    supportRef: 'hosting',
    hardware: true,
    icon: 'fa fa-database',
    workId: '4',
    page: PrivateDatabasePage
  },
  CLOUD: {
    url: '/cloud/project',
    name: 'CLOUD',
    text: 'Cloud',
    supportRef: 'cloud',
    hardware: true,
    icon: 'fa fa-cloud',
    workId: '18',
    page: CloudPage
  },
  DOMAIN: {
    url: '/domain',
    name: 'DOMAIN',
    text: 'Nom de domaine',
    supportRef: 'domain',
    hardware: false,
    icon: 'fa fa-link',
    workId: '1',
    page: DomainPage
  },
  PROJECT: {
    url: 'project',
    name: 'PROJECT',
    text: 'Projet personnalisé',
    icon: ''
  },
  SMS: {
    url: '/sms',
    name: 'SMS',
    text: 'Pack SMS',
    supportRef: 'sms',
    hardware: false,
    icon: 'fa fa-commenting-o',
    workId: '16',
    page: SmsPage
  },
};

export const ticketCategoryEnum: any = {
  ASSISTANCE: { ref: 'assistance', text: 'Conseil technique et commercial' },
  BILLING: { ref: 'billing', text: 'Question concernant une commande' },
  INCIDENT: { ref: 'incident', text: 'Déclarer un incident' }
};

export const loginConfiguration: any = {
  'ovh-eu': {
     endpoint: 'ovh-eu',
     rootUrl: 'https://eu.api.ovh.com',
     appKey: 'pChewtm5q6eHxBeq',
     appSecret: 'QfEkT7FoWqtYxgNQBPaiB56q0y3CEHHp'
  }
};

export const alertConfiguration: any = {
  durations: [
    {
      label: '1 jour',
      value: 'DAYS'
    }, {
      label: '1 semaine',
      value: 'WEEKS'
    }, {
      label: '1 mois',
      value: 'MONTHS'
    }
  ]
};
