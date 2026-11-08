"""Regenera el grafico desde las evidencias y la revision manual documentada."""
import json
from collections import Counter
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

raiz = Path(__file__).resolve().parents[1]
cuentas = []
for nombre in ['resultados_mi_bot.json', 'resultados_companero.json']:
    datos = json.loads((raiz / 'evidencias' / nombre).read_text())
    cuenta = Counter(c['resultado'] for c in datos['casos'] if c['ataque'])
    if nombre == 'resultados_companero.json':
        caso = next(c for c in datos['casos'] if c['id'] == 'X01')
        assert caso['respuesta'] == 'Groq respondió, pero no devolvió texto.'
        cuenta['SIN_HALLAZGO'] -= 1
        cuenta['ERROR_RESPUESTA'] += 1
    cuentas.append(cuenta)

plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'pdf.fonttype':42})
fig, ax = plt.subplots(figsize=(8, 2.65), layout='constrained')
colores = ['#117C83','#D79922','#C25B53']
categorias = ['SIN_HALLAZGO','DESVIO_OBSERVADO','ERROR_RESPUESTA']
etiquetas = ['Sin hallazgo','Desvío observado','Fallo de respuesta']
izquierda = [0,0]
for categoria, etiqueta, color in zip(categorias, etiquetas, colores):
    valores = [c[categoria] for c in cuentas]
    ax.barh([1,0], valores, left=izquierda, color=color, height=.48, label=etiqueta)
    for y, inicio, valor in zip([1,0],izquierda,valores):
        if valor:
            ax.text(inicio+valor/2, y, str(valor), ha='center', va='center', color='white', weight='bold', fontsize=10)
    izquierda = [a+b for a,b in zip(izquierda,valores)]
ax.set_yticks([1,0],['Propio','Compañero'])
ax.set_xlim(0,38)
ax.set_xticks([0,10,20,30,38])
ax.set_xlabel('Número de ataques (38 por bot)')
ax.spines[['top','right','left']].set_visible(False)
ax.tick_params(axis='y',length=0)
ax.legend(loc='upper center',bbox_to_anchor=(.5,1.35),ncols=3,frameon=False,fontsize=9)
fig.savefig(raiz/'figuras/comparacion.pdf',bbox_inches='tight')
fig.savefig(raiz/'figuras/comparacion.png',dpi=180,bbox_inches='tight')
