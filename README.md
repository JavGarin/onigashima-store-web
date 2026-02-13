# Onigashima Store - E-commerce de Coleccionables de Anime

Bienvenido a **Onigashima Store**, una aplicación web de comercio electrónico moderna y dinámica diseñada especialmente para entusiastas del anime. Este proyecto destaca por ofrecer una experiencia de usuario fluida con animaciones profesionales y una funcionalidad completa de tienda online.

## Captura de Pantalla

![Onigashima Store Screenshot](./src/assets/img/onigashima-store.avif)

## Características Principales

- **UI/UX Moderna:** Interfaz elegante con estética "Manga Pastel Dreams", utilizando efectos de glassmorphism y un diseño premium.
- **Navegación Móvil Enriquecida:** Menú lateral (sidebar) en dispositivos móviles que incluye información de soporte al cliente, redes sociales y acceso rápido.
- **Scroll Suave y Fluido:** Integración con `@studio-freight/lenis` para una navegación sin saltos.
- **Animaciones Dinámicas:** Potenciado por **GSAP** para traer el contenido a la vida mediante scroll-trigger animations.
- **Botón de Carrito Optimizado:** Diseño destacado con ícono descriptivo y contraste mejorado para una mejor usabilidad.
- **Accesibilidad:** Implementación de etiquetas ARIA y navegación por teclado para asegurar que la tienda sea inclusiva.
- **Diseño Responsivo Compacto:** Footer y Navbar optimizados para ocupar el mínimo espacio vertical en móviles, manteniendo toda la información relevante.
- **Autenticación de Usuario:** Gestión segura de inicio de sesión y registro mediante Supabase Auth.
- **Gestión de Carrito:** Carrito de compras persistente utilizando React Context y `localStorage`.

## Notas de Desarrollo y Operación

> [!IMPORTANT]
> **Estado de la Base de Datos:** Actualmente, el código relacionado con la obtención de productos desde la base de datos de **Supabase** se encuentra comentado para reducir costos operativos. La aplicación utiliza un conjunto de datos locales para la demostración del catálogo. La funcionalidad de autenticación de Supabase sigue activa para las rutas protegidas.

## Tecnologías Utilizadas

- **Framework:** [React](https://reactjs.org/)
- **Herramienta de Construcción:** [Vite](https://vitejs.dev/)
- **BaaS (Backend as a Service):** [Supabase](https://supabase.io/) (Auth activo, DB de productos en modo local).
- **Animación:** [GSAP](https://greensock.com/gsap/) y [Lenis](https://github.com/darkroomengineering/lenis).
- **Estilos:** CSS Vanilla con variables modernas y diseño responsivo.

## Estructura del Proyecto

```
src/
├── assets/         # Archivos estáticos: imágenes, videos y estilos globales.
├── components/     # Componentes reutilizables (Navbar, Footer, Spinner, etc.).
├── context/        # Proveedores de contexto (AuthContext, CartContext).
├── pages/          # Páginas de la aplicación (Home, Catalog, Login, etc.).
├── App.jsx         # Configuración principal y rutas.
└── supabaseClient.js # Inicialización del cliente de Supabase.
```

---
by JavGarin
Chile