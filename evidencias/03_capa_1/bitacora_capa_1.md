# Bitacora de trabajo: Capa 1

| Amenaza | Control (capa) | Justificacion | Principio |
| --- | --- | --- | --- |
| Intentos de cambiar las instrucciones o extraer datos reservados antes de consultar al modelo. | Capa 1: validar tipo y longitud, normalizar una copia del mensaje y evaluar patrones de cambio de reglas, roles sin restricciones y pedidos de extraccion dirigidos a datos reservados. | Los mensajes detectados reciben un rechazo desde el servidor sin llamar a Groq. Se combinan acciones y objetivos para evitar bloquear todas las consultas que mencionen claves. | Validacion de entradas y defensa en profundidad. |

## Validacion

- `bot-base/tests/filtro_entrada.test.js`: pruebas locales con respuestas del modelo simuladas para verificar el filtro y comprobar que un bloqueo no llama a Groq. Incluyen consultas legitimas sobre recuperacion y cambio de claves, variantes Unicode, tipo y longitud.
- `validacion_filtro.json`: evaluacion aislada del filtro sobre los mensajes originales del kit. No representa una ejecucion de robustez del bot completo ni verifica respuestas reales de Groq.

## Limites

El filtro usa patrones conocidos: puede dejar pasar ataques reformulados, codificados o en otros idiomas y bloquear consultas legitimas que citen un ataque. La normalizacion no cubre todas las formas de ocultar instrucciones. Las capas 2 y 3 siguen pendientes.

Fuente: [OWASP, LLM Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).
