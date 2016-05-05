export let credentialParams = {
  'redirection': 'http://my-infra.com/login/success',
  "accessRules": [
    {"method":"GET","path":"/*"},
    {"method":"POST","path":"/*"},
    {"method":"PUT","path":"/*"},
    {"method":"DELETE","path":"/*"}
  ]
};
export let endpointsConfiguration = {
  'ovh-eu': {
    endpoint: 'ovh-eu',
    urlRoot: 'https://eu.api.ovh.com/1.0',
    appKey: 'pChewtm5q6eHxBeq',
    appSecret: 'QfEkT7FoWqtYxgNQBPaiB56q0y3CEHHp'
  },
  'ovh-ca': {
    endpoint: 'ovh-ca',
    urlRoot: 'https://ca.api.ovh.com/1.0',
    appKey: '29u9HnS5vuxb0a9k',
    appSecret: 'zS8rFy5Hnyi2oWVyO78Sf4ztWObq2RZf'
  },
  'soyoustart-eu': {
    endpoint: 'soyoustart-eu',
    urlRoot: 'https://eu.api.soyoustart.com/1.0',
    appKey: 's4c82rlIzDyCii7N',
    appSecret: 'JDW0J8japOIZh1qzfqEGf9pwnzY12cbt'
  },
  'soyoustart-ca': {
    endpoint: 'soyoustart-ca',
    urlRoot: 'https://ca.api.soyoustart.com/1.0',
    appKey: 'pR2mlFdk6Ijqosis',
    appSecret: 'enAsKxGxHdR2cgnjXabweze53NgmmXfH'
  },
  'runabove-ca': {
    endpoint: 'runabove-ca',
    urlRoot: 'https://api.runabove.com/1.0',
    appKey: 'h5SyfePwZl8giN3R',
    appSecret: 'PyVKZM0kAbO2Ho4G2oaEDtefrjtQqqLE'
  },
};
