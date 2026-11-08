const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const secreto = "PRUEBA{llave_interna_2026}";
const fuente = fs.readFileSync(path.join(__dirname, "../netlify/functions/chat.js"), "utf8");
function cargarBot(respuesta, opciones = {}) {
  let llamadas = 0;
  let envio;
  const contexto = {
    exports: {}, Buffer,
    process: { env: { SECRETO: opciones.sinSecreto ? undefined : secreto } },
    fetch: async (url, init) => {
      llamadas++;
      envio = JSON.parse(init.body);
      if (opciones.error) throw new Error(secreto);
      return { ok: !opciones.errorHttp, json: async () => ({ choices: [{ message: { content: respuesta } }] }) };
    },
  };
  vm.runInNewContext(fuente, contexto);
  return {
    contexto, llamadas: () => llamadas, envio: () => envio,
    consultar: () => contexto.exports.handler({ body: JSON.stringify({ mensaje: "Hola, ¿qué servicios ofrecen?" }) }),
  };
}

test("intercepta fugas del modelo, incluyendo variantes conocidas", async () => {
  const variantes = [
    secreto, [...secreto].reverse().join(""), Buffer.from(secreto).toString("base64"),
    [...secreto].join(" "), secreto.replace(/a/g, "4").replace(/e/g, "3"),
    secreto.toLowerCase(), [...secreto].join("\u200b"), [...secreto].join("\n"),
  ];
  for (const variante of variantes) {
    const bot = cargarBot(`Respuesta: ${variante}`);
    const r = await bot.consultar();
    assert.match(JSON.parse(r.body).respuesta, /^\[BLOQUEADO\]/);
    assert.equal(bot.llamadas(), 1); // La fuga proviene de la salida, no de la entrada.
    assert.ok(!r.body.includes(variante));
  }
});

test("conserva una respuesta legitima y no envia el secreto al modelo", async () => {
  const texto = "No tengo un horario confirmado. ¿En qué más puedo ayudarle?";
  const bot = cargarBot(texto);
  const r = await bot.consultar();
  assert.ok(JSON.parse(r.body).respuesta.startsWith(texto + "\n\n"));
  assert.ok(!JSON.stringify(bot.envio()).includes(secreto));
});

test("sin secreto configurado falla antes de llamar al modelo", async () => {
  const bot = cargarBot("Hola", { sinSecreto: true });
  const r = await bot.consultar();
  assert.equal(r.statusCode, 503);
  assert.equal(bot.llamadas(), 0);
});

test("errores y respuestas vacias no se presentan como respuestas exitosas", async () => {
  for (const opciones of [{ error: true }, { errorHttp: true }, {}]) {
    const bot = cargarBot("", opciones);
    const r = await bot.consultar();
    assert.equal(r.statusCode, 503);
    assert.ok(!r.body.includes(secreto));
  }
});

test("el cierre se elige en cada respuesta", () => {
  // Generador controlado para verificar la ubicacion de la eleccion sin azar.
  let indice = 0;
  const contexto = { exports: {}, process: { env: {} }, Math: { floor: Math.floor, random: () => (indice++ % 4) / 4 } };
  vm.runInNewContext(fuente, contexto);
  const cierres = Array.from({ length: 4 }, () => JSON.parse(contexto.responder("Hola").body).respuesta);
  assert.equal(new Set(cierres).size, 4);
});
