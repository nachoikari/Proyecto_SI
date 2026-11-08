# Bitacora de trabajo: capas 2 y 3

| Amenaza | Control (capa) | Justificacion | Principio |
| --- | --- | --- | --- |
| Divulgacion del secreto en la respuesta del modelo, literal o en variantes conocidas. | Capa 2: filtro de salida que compara el texto con el secreto y variantes invertida, base64 y sustituciones a/4 y e/3. Ignora diferencias de mayusculas, espacios y ciertos caracteres invisibles. Si detecta una coincidencia, sustituye la respuesta completa por un rechazo. | La revision se ejecuta en el servidor antes de devolver el contenido. No depende de que el modelo obedezca el prompt. No cubre todas las codificaciones ni fragmentos posibles. | Defensa en profundidad y confidencialidad. |
| Exposicion innecesaria del secreto al modelo. | Capa 3: mantener `SECRETO` como variable de entorno del servidor, fuera de `SYSTEM_PROMPT`, del cuerpo enviado a Groq y de la interfaz. | El modelo recibe solo las instrucciones de atencion al cliente y la consulta. El secreto se utiliza localmente como referencia para el filtro de salida. | Minimo privilegio y minimizacion de datos. |

## Configuracion

Se utiliza la variable `SECRETO` que ya estaba configurada en `.env`. La clave de Groq sigue en `GROQ_API_KEY`. Ambas deben configurarse como variables del servidor al desplegar en Netlify; el archivo `.env` no debe compartirse en la entrega ni publicarse.

Si falta el secreto de referencia, el servidor no consulta al modelo y devuelve HTTP 503. Los errores externos y las respuestas vacias tambien devuelven un error generico, sin detalles que puedan contener datos reservados.

## Validacion

- Las diez pruebas automatizadas de `filtro_entrada.test.js` y `filtro_salida.test.js` pasaron. Usan un modelo simulado para provocar fugas de salida deliberadas y comprobar que se interceptan, permitir consultas normales y verificar que el secreto no se incluye en la solicitud al modelo. Tambien verifican fallos de configuracion y errores externos.
- `resultado_pruebas.txt` y `transcripciones.json` contienen la ejecucion del script original del kit contra el bot local. Como los 18 ataques conocidos son interceptados por la Capa 1, esa bateria por si sola no demuestra el funcionamiento de la Capa 2; por eso se incluyen las pruebas con salidas simuladas.
- Se corrigio la eleccion del cierre para que ocurra por respuesta, en vez de una sola vez al cargar el archivo. La seleccion aleatoria permite repeticiones.

Estos resultados describen los casos evaluados; quedan pendientes el despliegue, la documentacion final en PDF y la prueba autorizada contra un bot de un companero.
