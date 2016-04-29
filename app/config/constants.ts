export let categoryEnum: any = {
  WEB: { url: '/hosting/web', name: 'WEB', text: 'Hébergement web', supportRef: 'hosting' },
  DEDICATED_SERVER: { url: '/dedicated/server', name: 'DEDICATED_SERVER', text: 'Serveur dédié', supportRef: 'dedicated' },
  // CLOUD: { url: '/cloud/project', name: 'CLOUD', text: 'Cloud' },
  DOMAIN: { url: '/domain', name: 'DOMAIN', text: 'Nom de domaine', supportRef: 'domain' },
  PROJECT: { url: 'project', name: 'PROJECT', text: 'Projet personnalisé' }
};

export let ticketCategoryEnum: any = {
  ASSISTANCE: { ref: 'assistance', text: 'Conseil technique et commercial' },
  BILLING: { ref: 'billing', text: 'Question concernant une commande' },
  INCIDENT: { ref: 'incident', text: 'Déclarer un incident' }
};
