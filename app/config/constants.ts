export let categoryEnum: any = {
  WEB: { url: '/hosting/web', name: 'WEB', text: 'Hébergement web', supportRef: 'hosting', hardware: true, icon: 'fa fa-globe' },
  VPS: { url: '/vps', name: 'VPS', text: 'Vps', supportRef: 'hosting', hardware: true, icon: 'fa fa-hdd-o' },
  DEDICATED_SERVER: { url: '/dedicated/server', name: 'DEDICATED_SERVER', text: 'Serveur dédié', supportRef: 'dedicated', hardware: true, icon: 'fa fa-server' },
  PRIVATE_DATABASE: { url: '/hosting/privateDatabase', name: 'PRIVATE_DATABASE', text: 'Base de données privée', supportRef: 'hosting', hardware: true, icon: 'fa fa-database' },
  CLOUD: { url: '/cloud/project', name: 'CLOUD', text: 'Cloud', supportRef: 'cloud', hardware: true, icon: 'fa fa-cloud' },
  DOMAIN: { url: '/domain', name: 'DOMAIN', text: 'Nom de domaine', supportRef: 'domain', hardware: false, icon: 'fa fa-link' },
  PROJECT: { url: 'project', name: 'PROJECT', text: 'Projet personnalisé', icon: '' }
};

export let ticketCategoryEnum: any = {
  ASSISTANCE: { ref: 'assistance', text: 'Conseil technique et commercial' },
  BILLING: { ref: 'billing', text: 'Question concernant une commande' },
  INCIDENT: { ref: 'incident', text: 'Déclarer un incident' }
};

