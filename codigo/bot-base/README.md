# Bot base — Proyecto 1 "El Duelo de IA"

Un chatbot de atención al cliente (TicoPay S.A.) que **custodia un secreto** y viene
**vulnerable a propósito**. Lo desplegás y luego lo blindás por capas.

```
bot-base/
├── index.html                  # la interfaz del chat (no hay que tocarla)
├── netlify.toml                # configuración de Netlify
└── netlify/functions/chat.js   # system prompt + secreto + donde van tus capas de defensa
```

## Publicar en Netlify

Este proyecto usa una Netlify Function (`chat`), ademas de la pagina. La ruta de publicacion preparada utiliza Netlify CLI, que empaqueta la funcion. El directorio publico es `dist`; `npm run build` copia alli la interfaz. La carpeta del servidor se configura por separado en `netlify.toml`.

### 1) API key gratis (Groq)
1. Entrá a <https://console.groq.com> y creá una cuenta gratuita.
2. **API Keys → Create API Key**. Copiá la clave (empieza con `gsk_...`).

### 2) Crear el proyecto y una primera version de prueba

En una terminal, entra a esta carpeta `bot-base`. Si estas en otra computadora, ejecuta primero `npm ci`.

```bash
npx netlify login
npx netlify deploy
```

El primer comando abre el navegador para iniciar sesion y autorizar Netlify CLI. El segundo permite vincular un proyecto existente o crear uno nuevo. Para la primera publicacion, elegi crear un proyecto, selecciona tu equipo y el nombre del bot. Si ya lo creaste, elegi ese proyecto existente. La configuracion del directorio y la funcion se lee de `netlify.toml`.

Este primer despliegue es de prueba. La funcion necesita las dos variables del siguiente paso para funcionar.

### 3) Configurar la API key
En <https://app.netlify.com>, abri tu proyecto y entra a **Project configuration → Environment variables**. Agrega:

| Variable | Valor |
| --- | --- |
| `GROQ_API_KEY` | Tu clave privada de Groq. |
| `SECRETO` | La flag que protege el bot, igual al valor local de `.env`. |

Aplica las variables al contexto **Production**. Si el panel permite elegir el alcance, incluye **Functions**. Se pueden marcar como valores secretos si la cuenta ofrece esa opcion. El archivo `.env` queda en tu equipo y fuera del directorio publicado.

### 4) Publicar la version definitiva y probar

Desde la misma carpeta:

```bash
npx netlify deploy --prod --context production
```

Esta publicacion incorpora los valores configurados. El comando muestra la URL definitiva. Abri la pagina y proba una consulta normal y un intento de extraccion. En la seccion Functions de Netlify debe aparecer `chat`.

Las siguientes actualizaciones usan el mismo comando; el proyecto queda vinculado localmente. Si cambias variables, volve a desplegar.

Para medir la version publicada, ejecuta el script de pruebas de la carpeta superior con la URL `https://TU-SITIO.netlify.app/.netlify/functions/chat`.

Documentacion: [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/), [variables para Functions](https://docs.netlify.com/build/functions/environment-variables/).

## Tu trabajo: las capas de defensa (en `chat.js`)
En `netlify/functions/chat.js` están las marcas de dónde va cada capa y **qué debe
lograr**. El **cómo implementarlas lo investigás vos** (es parte del proyecto):

- **Capa 0** — endurecer el `SYSTEM_PROMPT`.
- **Capa 1** — filtro de entrada (revisar el mensaje antes del modelo).
- **Capa 2** — filtro de salida (revisar la respuesta antes de devolverla).
- **Capa 3** — mínimo privilegio (el modelo no puede filtrar lo que nunca vio).

> **Regla de oro:** las defensas **no deben romper el chat legítimo**. Si el bot deja de
> responder "¿cuál es el horario?", tu filtro está mal (falso positivo).

> Si el nombre del modelo diera error, actualizá `MODELO` en `chat.js` con uno vigente
> de tu consola de Groq.
