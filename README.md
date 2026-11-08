# Proyecto SI: bot TicoPay

Proyecto de Seguridad Informática: proteger la flag de un chatbot, probar sus defensas y comparar los resultados con otro bot del curso.

- **Repositorio:** https://github.com/nachoikari/Proyecto_SI
- **Bot publicado:** https://proyectolenin.netlify.app/
- **Documento:** [leer el PDF](informe.pdf) o [editar el LaTeX](informe.tex).
- **Paquete completo:** [descargar el ZIP](https://github.com/nachoikari/Proyecto_SI/raw/refs/heads/main/entregables/Informe_TicoPay_LaTeX.zip).

## Qué hay aquí

| Carpeta o archivo | Contenido |
|---|---|
| `codigo/bot-base/` | Página del chat, función de Netlify y pruebas de los filtros. |
| `codigo/pruebas_robustez.py` | Evaluador original: 18 ataques y dos consultas normales. |
| `codigo/pruebas_exigentes.py` | Evaluador ampliado: hasta 50 casos, con resultados en JSON. |
| `evidencias/` | Respuestas originales, bitácoras de las capas y revisión de seguridad. |
| `figuras/` | Captura original, gráfico comparativo y script para regenerarlo. |
| `informe.tex` e `informe.pdf` | Explicación del trabajo, resultados y mejoras pendientes. |
| `MANIFIESTO_SHA256.txt` | Huellas de los archivos del paquete distribuido. |

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

## Editar el documento

El informe tiene un formato sencillo, sin portada académica ni campos personales pendientes. En Overleaf, importá el ZIP y elegí `informe.tex` como archivo principal con PDFLaTeX. Si conserva una carpeta superior, seleccioná el archivo dentro de ella.

Para compilar localmente, ejecutá dos veces:

```sh
pdflatex -interaction=nonstopmode -halt-on-error informe.tex
```

También funciona `tectonic informe.tex`. Las figuras ya están incluidas; no hace falta Python para compilar. El script opcional `figuras/generar_grafico.py` usa matplotlib para regenerar el gráfico.

La captura original está sin modificar. La ruta de `comprobar_local.cjs` se adaptó para trabajar con `codigo/bot-base` dentro de esta estructura.
