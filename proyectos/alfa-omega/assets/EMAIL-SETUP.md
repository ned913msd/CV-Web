# Configuración de Correos HTML — Auditoría Gratis

## Formspree Setup

### Paso 1: Ir a Formspree Dashboard
1. Ve a https://formspree.io/forms/xppzkkoj/settings
2. En la sección **"Email Notifications"**

### Paso 2: Auto-Respuesta al Cliente
1. Activa **"Confirmation email"** (auto-reply)
2. En **"Subject"** pega:
   ```
   🎥 Tu Auditoría de Conversión está en camino - Alfa & Omega
   ```
3. En **"Body"** pega el contenido completo de:
   `assets/email-autorespuesta.html`

### Paso 3: Notificación a David Ned
1. En **"Notification email"** (o "CC"):
   - Email: `contacto.nedbustamante@gmail.com`
2. En **"Subject"** pega:
   ```
   🚀 NUEVA AUDITORÍA: {{nombre}} - {{url_tienda}}
   ```

### Paso 4: Variables de Formspree
Formspree reemplaza automáticamente estas variables:
| Variable | Campo del form | Ejemplo |
|----------|---------------|---------|
| `{{nombre}}` | `name="nombre"` | Carlos Rodríguez |
| `{{url_tienda}}` | `name="url_tienda"` | https://mitienda.com |
| `{{email}}` | `name="email"` | carlos@ejemplo.com |

**Nota:** `{{fecha}}` NO es soportada nativamente por Formspree. Para agregarla, usar JavaScript en el form para enviar un campo hidden con la fecha actual.

### Alternativa: Web3Forms
Si se cambia a Web3Forms, usar EmailJS o Resend.io para correos HTML personalizados desde el frontend.

## Archivos de Referencia

| Archivo | Uso |
|---------|-----|
| `assets/email-autorespuesta.html` | Plantilla del correo que recibe el cliente |
| `assets/email-notificacion-david.html` | Plantilla del correo que recibe David Ned |

## Notas Técnicas
- Los correos se ven bien en Gmail, Outlook y Apple Mail
- Usar inline styles para compatibilidad máxima
- El header usa gradiente oscuro (#0A0A0A) para consistencia con la marca
- Botones con colores de la paleta Alfa & Omega (#10B981 verde, #00D9FF cyan)
