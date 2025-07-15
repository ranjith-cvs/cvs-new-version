# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Covalsys-App/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Images, icons, static files
│   ├── components/          # Shared reusable UI components (e.g. Button, Table)
│   ├── features/            # Feature modules (with own logic, UI)
│   │   └── ExampleFeature/
│   │       ├── components/  # Feature-specific components
│   │       ├── hooks/       # Feature-specific custom hooks
│   │       ├── services/    # API calls or business logic
│   │       └── index.jsx
│   ├── hooks/               # Global reusable hooks
│   ├── layouts/             # App layout (Sidebar, Header, Footer)
│   ├── pages/               # Top-level route views (Home, Login, etc.)
│   ├── routes/              # Route definitions
│   ├── store/               # State management (Redux, Zustand, etc.)
│   ├── theme/               # MUI theme setup
│   ├── utils/               # General helper functions
│   ├── constants/           # Static app-wide constants, enums
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts (optional, auto-generated)
├── .env
├── index.html
├── package.json
├── jsconfig.json            # For alias support in JS projects
└── vite.config.js
