# Template Next.js – Hakuna Mataweb

Template de base pour tous les projets frontend.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19

## Déploiement
- Prévu pour Vercel
- Variables d'environnement via `.env.local`

## Utilisation

### 1. Initialisation
```bash
# Copier ce template
cp -r templates/nextjs-base projects/clients/mon-projet-frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
```

### 2. Configuration Strapi
Ajoutez dans `.env.local` :
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=votre-token-api
```

### 3. Types TypeScript Strapi

#### Synchronisation des types
Les types sont générés côté Strapi et synchronisés automatiquement.

```bash
# Synchroniser les types depuis Strapi
npm run sync:types
```

#### Utilisation dans le code
Les types sont maintenant disponibles avec autocomplétion complète :

```tsx
import { createStrapiClient } from '@/lib/strapi-client';
import type { Page, PageEntity, PageCollectionResponse } from '@/types/strapi';

// Créer le client
const strapi = createStrapiClient({
  apiUrl: process.env.NEXT_PUBLIC_STRAPI_URL!,
  apiToken: process.env.STRAPI_API_TOKEN,
});

// Récupérer des données avec types complets
export async function getPages(): Promise<PageEntity[]> {
  const response: PageCollectionResponse = await strapi.findMany<Page>('pages', {
    sort: ['createdAt:desc'],
    pagination: { pageSize: 100 },
  });
  
  return response.data;
}

// Utilisation dans un Server Component
export default async function PagesPage() {
  const pages = await getPages();
  
  return (
    <div>
      {pages.map((page) => (
        <article key={page.id}>
          {/* TypeScript connaît la structure exacte */}
          <h2>{page.attributes.title}</h2>
          {/* Autocomplétion sur page.attributes.* */}
        </article>
      ))}
    </div>
  );
}
```

#### Quand synchroniser ?
- Après chaque modification de Content-Type dans Strapi
- Après un `git pull` qui modifie les schemas Strapi
- Au début d'un nouveau sprint de développement

#### Structure des fichiers
```
nextjs-base/
├── src/
│   ├── types/
│   │   └── strapi/
│   │       └── index.ts           # Types synchronisés (NE PAS MODIFIER)
│   ├── lib/
│   │   ├── strapi-client.ts       # Client Strapi typé
│   │   └── strapi-usage-example.tsx  # Exemples d'utilisation
│   └── app/                       # Vos pages et composants
└── scripts/
    └── sync-types-from-strapi.js  # Script de synchronisation
```

### 4. Développement
```bash
# Lancer le serveur de développement
npm run dev

# Le site est accessible sur http://localhost:3000
```

### 5. Build et déploiement
```bash
# Build de production
npm run build

# Tester le build localement
npm start

# Déployer sur Vercel
vercel
```

## Client Strapi typé

Le template inclut un client Strapi complet avec support TypeScript.

### Méthodes disponibles
```typescript
// Récupérer une collection
strapi.findMany<T>(contentType, options)

// Récupérer une entrée par ID
strapi.findOne<T>(contentType, id, options)

// Créer une entrée
strapi.create<T>(contentType, data)

// Mettre à jour
strapi.update<T>(contentType, id, data)

// Supprimer
strapi.delete<T>(contentType, id)
```

### Options de requête
```typescript
{
  populate: '*',                    // ou ['author', 'image']
  filters: { title: { $eq: 'Hello' } },
  sort: ['createdAt:desc'],
  pagination: { page: 1, pageSize: 10 },
  fields: ['title', 'content'],
  locale: 'fr',
  publicationState: 'live'
}
```

### Exemples complets
Consultez [src/lib/strapi-usage-example.tsx](src/lib/strapi-usage-example.tsx) pour des exemples détaillés.

## Scripts disponibles
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # Linter
npm run sync:types   # Synchroniser les types Strapi
```

## Configuration TypeScript

Le projet est configuré avec des options strictes pour une sécurité maximale :
- Types Strapi auto-générés
- Autocomplétion complète
- Détection des erreurs à la compilation

## Bonnes pratiques

### Types Strapi
- ✅ Utilisez toujours les types générés
- ✅ Synchronisez régulièrement avec `npm run sync:types`
- ❌ Ne modifiez jamais `src/types/strapi/index.ts`
- ✅ Utilisez le client Strapi typé pour les requêtes

### Structure des données
```typescript
// ❌ Mauvais : accès direct sans types
const title = data.attributes.title; // Pas d'autocomplétion

// ✅ Bon : avec types
const response: PageResponse = await strapi.findOne<Page>('pages', id);
const title = response.data?.attributes.title; // Autocomplétion !
```

### Gestion des erreurs
```typescript
try {
  const pages = await strapi.findMany<Page>('pages');
  return pages.data;
} catch (error) {
  console.error('Erreur Strapi:', error);
  return [];
}
```

## Troubleshooting

### Types non trouvés
```bash
# Vérifier que les types existent
ls -la src/types/strapi/

# Synchroniser depuis Strapi
npm run sync:types
```

### Types obsolètes
```bash
# Depuis le projet Strapi
cd ../strapi-base
npm run types

# Revenir sur Next.js et synchroniser
cd ../nextjs-base
npm run sync:types
```

### Erreurs TypeScript
Si TypeScript ne trouve pas les types :
1. Vérifiez que `src/types/strapi/index.ts` existe
2. Relancez le serveur de développement
3. Rechargez VS Code (Cmd+Shift+P > "Reload Window")

## Variables d'environnement

### Développement (`.env.local`)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=votre-token-de-dev
```

### Production (Vercel)
Configurez les mêmes variables dans l'interface Vercel :
- `NEXT_PUBLIC_STRAPI_URL` : URL de production Strapi
- `STRAPI_API_TOKEN` : Token API de production

⚠️ **Ne jamais modifier ce template directement**  
Pour un nouveau projet : copiez le dossier complet dans `/projects/clients/`

