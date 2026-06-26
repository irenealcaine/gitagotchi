# Gitagotchi

Un tamagotchi que evoluciona segun tu actividad en GitHub. Mantén a tu Gitagotchi feliz contribuyendo codigo regularmente.

## Descripcion

Gitagotchi conecta con la API publica de GitHub para visualizar tu perfil, repositorios y eventos de actividad. Tu mascota virtual cambia de estado segun tu frecuencia de commits:

| Estado | Condicion |
| --- | --- |
| Feliz | Mas de 3 commits en las ultimas 24h |
| OK | Actividad en las ultimas 24h |
| Hambriento | Sin actividad entre 24h y 48h |
| Famelico | Sin actividad entre 48h y 72h |
| Muerto | Sin actividad por mas de 72h |

## Caracteristicas

- Busqueda de usuarios de GitHub
- Sistema de XP basado en commits, PRs y repositorios creados
- Sistema de niveles con barra de progreso
- Historial de XP con eventos detallados
- Logros desbloqueables
- Racha actual y maxima de actividad
- Grafico de lenguajes de programacion
- Repositorios activos (ultimos 30 dias)
- PRs abiertos
- Registro de actividad reciente
- Persistencia del usuario en localStorage
- Interfaz responsiva (movil, tablet, desktop)
- Modo oscuro por defecto

## Stack tecnologico

- React 19
- Vite 8
- JavaScript (ES6+)
- CSS plain
- react-icons

## Requisitos

- Node.js >= 18
- pnpm

## Instalacion

```bash
git clone <url-del-repositorio>
cd gitagotchi
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Vista previa del build

```bash
pnpm preview
```

## Lint

```bash
pnpm lint
```

## Estructura del proyecto

```
src/
├── assets/              # Imagenes del tamagotchi
├── components/
│   ├── Achievements/    # Logros desbloqueables
│   ├── ActivityLog/     # Registro de actividad
│   ├── Dashboard/       # Panel principal con stats
│   ├── LanguageChart/   # Grafico de lenguajes
│   ├── ProfileHeader/   # Cabecera del perfil
│   ├── RepoList/        # Lista de repositorios
│   ├── StatsOverview/   # Resumen de estadisticas
│   ├── Streak/          # Racha de actividad
│   ├── Tamagotchi/      # Mascota virtual
│   ├── UserSearch/      # Busqueda de usuario
│   └── XpHistory/       # Historial de XP
├── hooks/
│   ├── useGitHubData.js # Hook para datos de GitHub
│   └── useTamagotchi.js # Hook del tamagotchi
├── services/
│   ├── github.js        # API de GitHub
│   └── storage.js       # Persistencia local
├── utils/
│   └── tamagotchi.js    # Logica del tamagotchi y XP
├── App.jsx
├── App.css
└── main.jsx
```

## API de GitHub

La aplicacion utiliza la API publica de GitHub sin autenticacion. Esta sujeta a limites de tasa (60 requests por hora por IP). Si se alcanza el limite, se mostrara un mensaje de error indicando esperar unos minutos.


