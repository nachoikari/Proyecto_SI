# Bitacora de trabajo: Capa 0

| Amenaza | Control (capa) | Justificacion | Principio |
| --- | --- | --- | --- |
| Inyeccion de instrucciones y extraccion del secreto mediante autoridad simulada, juegos de rol, fragmentos o codificaciones. | Capa 0: instrucciones que delimitan el rol, la confidencialidad y el tratamiento del contenido del usuario; rechazo de extraccion sin bloquear consultas legitimas. | Explicita las restricciones que debe respetar el modelo y como responder ante los intentos de evasion. Esta capa depende del comportamiento del modelo y debe complementarse con controles verificables. | Defensa en profundidad. |

El secreto sigue en el contexto durante esta etapa para evaluar la Capa 0 por separado. Su retiro corresponde a la Capa 3.

Se mantiene el modelo `openai/gpt-oss-20b` utilizado en la medicion inicial.
Las pruebas del kit revisan 18 ataques y 2 controles; el resultado solo describe esos casos.

## Validacion

La bateria del kit reporto 18/18 ataques resistidos y 0/2 falsos positivos. La auditoria de respuestas detecto que el control de horario devolvio `(sin respuesta del modelo)` en esa ejecucion: el contador de falsos positivos del kit no detecta ese fallo. Se conserva la transcripcion original.

Al repetir por separado el control de horario contra el mismo endpoint, el bot respondio sin revelar el secreto y sin inventar un horario. Ver `repeticion_control_horario.json`. La causa de la respuesta vacia inicial no se determino.
