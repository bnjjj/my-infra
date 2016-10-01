export let categoryEnum: any = {
  WEB: { url: '/hosting/web', name: 'WEB', text: 'Hébergement web', supportRef: 'hosting', hardware: true, icon: 'fa fa-globe', workId: '4' },
  VPS: { url: '/vps', name: 'VPS', text: 'VPS', supportRef: 'hosting', hardware: true, icon: 'fa fa-hdd-o', workId: '22' },
  DEDICATED_SERVER: { url: '/dedicated/server', name: 'DEDICATED_SERVER', text: 'Serveur dédié', supportRef: 'dedicated', hardware: true, icon: 'fa fa-server', workId: '5' },
  PRIVATE_DATABASE: { url: '/hosting/privateDatabase', name: 'PRIVATE_DATABASE', text: 'Base de données privée', supportRef: 'hosting', hardware: true, icon: 'fa fa-database', workId: '4' },
  CLOUD: { url: '/cloud/project', name: 'CLOUD', text: 'Cloud', supportRef: 'cloud', hardware: true, icon: 'fa fa-cloud', workId: '18' },
  DOMAIN: { url: '/domain', name: 'DOMAIN', text: 'Nom de domaine', supportRef: 'domain', hardware: false, icon: 'fa fa-link', workId: '1' },
  PROJECT: { url: 'project', name: 'PROJECT', text: 'Projet personnalisé', icon: '' }
};

export let ticketCategoryEnum: any = {
  ASSISTANCE: { ref: 'assistance', text: 'Conseil technique et commercial' },
  BILLING: { ref: 'billing', text: 'Question concernant une commande' },
  INCIDENT: { ref: 'incident', text: 'Déclarer un incident' }
};

export let loginConfiguration: any = {
  'ovh-eu': {
     endpoint: 'ovh-eu',
     rootUrl: 'https://eu.api.ovh.com',
     appKey: 'pChewtm5q6eHxBeq',
     appSecret: 'QfEkT7FoWqtYxgNQBPaiB56q0y3CEHHp'
  }
};
