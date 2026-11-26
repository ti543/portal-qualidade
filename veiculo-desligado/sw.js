// app Veiculo Desligado: so o necessario para instalar (sem cache - sempre pega a versao nova)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
