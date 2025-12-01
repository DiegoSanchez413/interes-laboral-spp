const puppeteer = require('puppeteer');
const fs = require('fs');

function getFechaDefault(fechaParam) {
    if (fechaParam) return fechaParam;

    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const yyyy = hoy.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

(async () => {
    const fechaParam = process.argv[2]; // ej: "30/11/2025"
    const fechaInput = getFechaDefault(fechaParam);

    const browser = await puppeteer.launch({
        headless: 'new',
        slowMo: 50,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(
        'https://www.sbs.gob.pe/app/pp/estadisticassaeeportal/paginas/tilegallaboral.aspx',
        { waitUntil: 'domcontentloaded' }
    );

    await page.waitForSelector('#ctl00_cphContent_rdpDate_dateInput');
    await page.click('#ctl00_cphContent_rdpDate_dateInput', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#ctl00_cphContent_rdpDate_dateInput', fechaInput);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await page.click('#ctl00_cphContent_btnConsultar');
    await page.waitForTimeout(700);

    const data = await page.evaluate(() => {
        const getText = (selector) => {
            const el = document.querySelector(selector);
            return el ? el.textContent.trim() : null;
        };

        const fechaTexto = getText('#ctl00_cphContent_lblFecha');
        const fecha = fechaTexto.replace(/^.*al\s+/i, "");

        return {
            fecha,
            moneda_nacional: {
                tasa_anual: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MN_TASA')),
                factor_diario: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MN_FDIA')),
                factor_acumulado: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MN_FACU'))
            },
            moneda_extranjera: {
                tasa_anual: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MEX_TASA')),
                factor_diario: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MEX_FDIA')),
                factor_acumulado: parseFloat(getText('#ctl00_cphContent_lblVAL_LELAB_MEX_FACU'))
            }
        };
    });

    console.log("JSON LIMPIO:", data);

    // Normalizar la fecha para usarla como filename
    const fileName = data.fecha.replace(/\//g, '-'); // 13/11/2025 → 13-11-2025

    // Crear carpeta data si no existe
    if (!fs.existsSync('data')) fs.mkdirSync('data');

    // Guardar archivo
    fs.writeFileSync(`data/${fileName}.json`, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Datos guardados en data/${fileName}.json`);

    await browser.close();
})();
