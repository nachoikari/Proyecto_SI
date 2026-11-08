# Proyecto SI: bot TicoPay

Proyecto de Seguridad Informática: proteger la flag de un chatbot, probar sus defensas y comparar los resultados con otro bot del curso.

- **Repositorio:** https://github.com/nachoikari/Proyecto_SI
- **Bot publicado:** https://proyectolenin.netlify.app/
- **Documento:** [leer cómo hice el proyecto](informe.pdf).

## Qué hay aquí

| Carpeta o archivo | Contenido |
|---|---|
| `codigo/bot-base/` | Página del chat, función de Netlify y pruebas de los filtros. |
| `codigo/pruebas_robustez.py` | Evaluador original: 18 ataques y dos consultas normales. |
| `codigo/pruebas_exigentes.py` | Evaluador ampliado: hasta 50 casos, con resultados en JSON. |
| `evidencias/` | Respuestas originales, bitácoras de las capas y revisión de seguridad. |
| `figuras/` | Captura original, gráfico comparativo y script para regenerarlo. |
| `informe.pdf` | Resumen de tres páginas sobre lo que hice, las pruebas y lo que falta ajustar. |
| `MANIFIESTO_SHA256.txt` | Huellas de los archivos actuales del repositorio. |

## Cómo probar un bot

Desde `codigo/`, con Python 3:

```sh
python3 pruebas_exigentes.py \
  --url https://proyectolenin.netlify.app/.netlify/functions/chat \
  --suite todas --pausa 2 --json resultado_nuevo.json
```

La URL debe terminar en `/.netlify/functions/chat`. Si se cambia la flag del ejercicio, hay que agregar `--secret 'FLAG_DE_PRUEBA'`. No se usa la API key de Groq como flag. Para probar otro bot del curso, usá su endpoint con autorización.

Las pruebas locales no consultan a Groq:

```sh
cd codigo
python3 -m unittest test_pruebas_exigentes.py
node --test bot-base/tests/*.test.js
```

La revisión adicional se ejecuta desde la raíz:

```sh
node evidencias/06_revision_seguridad/comprobar_local.cjs
```

## Levantar el bot localmente

Se necesita Node.js, npm y una clave propia de Groq:

```sh
cd codigo/bot-base
npm ci
cp .env.example .env
```

Completá `GROQ_API_KEY` y `SECRETO` en `.env`; después ejecutá `npm run dev`. Los detalles para publicarlo están en [la guía del bot](codigo/bot-base/README.md). Las variables reales y la configuración privada de Netlify quedan fuera de Git.

## Qué mostraron los resultados

La revisión de los últimos informes encontró cero fugas de la flag de referencia. El bot propio tuvo un desvío y dos consultas legítimas rechazadas; el compañero tuvo dos desvíos, tres rechazos y un fallo de respuesta. Esto no garantiza que sean invulnerables ni confirma que cada servidor use la flag de referencia del evaluador.

Los JSON originales no fueron reescritos. Las correcciones manuales están en [la revisión](evidencias/06_revision_seguridad/REVISION.md). Quedan pendientes límites de uso del proveedor, mejoras de los filtros y correcciones del evaluador.

El PDF está escrito como un resumen personal del trabajo. La captura original y las respuestas completas siguen en las carpetas de evidencias.
