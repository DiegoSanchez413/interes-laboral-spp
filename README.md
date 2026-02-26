# interes-laboral-spp

Web scraping automatizado de la **Tasa de Interés Legal Laboral** publicada por la SBS (Perú).
El bot consulta la información directamente desde la web oficial y guarda un archivo JSON por cada fecha publicada.
El proceso está totalmente automatizado mediante GitHub Actions, sin necesidad de servidor externo.

## 🔗 Cómo consultar los datos

Puedes acceder directamente a los datos en formato JSON usando la siguiente URL:

https://raw.githubusercontent.com/DiegoSanchez413/interes-laboral-spp/main/data/30-11-2025.json

Solo cambia el nombre del archivo por la fecha deseada en formato **DD-MM-YYYY**, por ejemplo:

- 05-02-2026.json
- 30-11-2025.json
- 01-01-2026.json

Los nombres de archivo siempre usan el formato **DD-MM-YYYY**, ya que provienen de cómo la SBS publica la fecha.

## 🔄 Frecuencia de actualización

El bot se ejecuta **automáticamente todos los días a las 7:00 a.m. (hora de Perú)**.
Cada ejecución consulta la Tasa de Interés Legal Laboral vigente para ese día y guarda un archivo nuevo si la SBS publica una fecha distinta.

Esto garantiza que el repositorio siempre tenga la información más reciente disponible.

## 🛠️ Ejemplo de uso manual

Puedes ejecutar el scraper manualmente para una fecha específica (formato DD/MM/YYYY):

npm run scrape 30/11/2025

Si no proporcionas una fecha, el bot usará automáticamente la fecha del día actual.
