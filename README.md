# Logística La Unión - Landing Page

Landing page oficial de **Logística La Unión**, empresa especializada en mensajería, paquetería y logística de última milla con entregas en el día en la Ciudad Autónoma de Buenos Aires (CABA) y Gran Buenos Aires (GBA).

---

## 🚀 Características y Arquitectura Técnica

- **100% Vanilla Web**: Desarrollado íntegramente con HTML5 semántico, CSS3 moderno y JavaScript vanilla modular, sin frameworks pesados ni dependencias externas.
- **Diseño Sobrio y Profesional**: 
  - Fondo general blanco con secciones destacadas en negro sólido.
  - Paleta estricta: blanco, negro, grises neutros, rojo institucional (`#D62828`) y verde clásico (`#16A34A` / WhatsApp `#25D366`).
  - Sin efectos estridentes, sin neones, sin brillos ni glassmorphism.
- **Animaciones Planas 60 FPS**:
  - **Hero**: Moto de reparto en SVG plano recorriendo la calle con líneas urbanas, rotación continua de ruedas, rebote de la caja portaequipaje y líneas de velocidad.
  - **Flota**: Utilitario con baúl abierto y cajas ingresando en ciclo continuo.
  - **Franja de datos**: Contadores numéricos que se activan con `IntersectionObserver`.
  - **Modal de cotización**: Simulación de ruteo con barra de progreso y check animado antes de redirigir a WhatsApp.
- **Mobile-First & 100% Responsive**: Optimizado para pantallas de 320px, 375px (iPhone SE y estándar), 768px (tablets) y 1024px+ (desktop).
- **Accesibilidad (a11y)**:
  - Salto al contenido (`skip-link`).
  - Navegación por teclado completa con anillos de foco visibles (`:focus-visible`).
  - Trampa de foco y soporte para tecla `Escape` en modal y menú móvil.
  - Soporte de `prefers-reduced-motion` para usuarios con sensibilidad al movimiento.
- **SEO & Datos Estructurados**:
  - Metadatos completos Open Graph y Twitter Cards.
  - Marcado Schema.org con tipo `DeliveryService` / `LocalBusiness`.
  - Atributo de idioma `es-AR` y textos en español rioplatense (voseo).
- **Integración con WhatsApp**: Formulario con validación en cliente que construye dinámicamente el mensaje pre-cargado para iniciar la conversación en WhatsApp sin tocar ningún backend.

---

## 📂 Estructura del Proyecto

```text
logistica-la-union/
├── index.html        # Estructura semántica, SVG inline y datos estructurados
├── styles.css        # Sistema de diseño con variables CSS, animaciones y media queries
├── script.js         # Lógica interactiva, contadores, validaciones y modal
├── vercel.json       # Configuración para deploy estático y headers en Vercel
└── README.md         # Documentación del proyecto
```

---

## 🛠️ Ejecución Local

Para visualizar el proyecto localmente podés usar cualquier servidor estático:

```bash
# Con npx serve
npx serve .

# O con python si está disponible
python -m http.server 8080
```

---

## 🚢 Deploy en Vercel

El proyecto está listo para ser importado directamente en Vercel como un proyecto estático sin ningún paso de compilación (`Build Command: None`, `Output Directory: .`).
