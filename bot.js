// קובץ: bot.js

import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/run-order', async (req, res) => {
  const {
    user_id, email, search_type, city, street, house_number,
    block, parcel, subparcel, service_type
  } = req.body;

  if (!user_id || !email || !search_type || !service_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (search_type === 'address' && (!city || !street || !house_number)) {
    return res.status(400).json({ error: 'Missing address fields' });
  }
  if (search_type === 'block' && (!block || !parcel)) {
    return res.status(400).json({ error: 'Missing block/parcel fields' });
  }

  const CARD_NUM = process.env.CREDIT_CARD_NUM;
  const CARD_DATE = process.env.CREDIT_CARD_DATE_DD_YY;
  const CARD_CVV = process.env.CREDIT_CARD_DATE_CVV;
  if (!CARD_NUM || !CARD_DATE || !CARD_CVV) {
    return res.status(500).json({ error: 'Missing credit card env vars' });
  }

  const PROXY_SERVER = process.env.PLAYWRIGHT_PROXY;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        PROXY_SERVER ? `--proxy-server=${PROXY_SERVER}` : ''
      ].filter(Boolean)
    });

    const page = await browser.newPage();

    // Proxy authentication
    if (PROXY_SERVER && PROXY_SERVER.includes('@')) {
      const proxyUrl = new URL(PROXY_SERVER);
      if (proxyUrl.username && proxyUrl.password) {
        await page.authenticate({
          username: proxyUrl.username,
          password: proxyUrl.password
        });
      }
    }

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setViewport({ width: 3374, height: 770 });

    page.on('console', msg => console.log('[PAGE CONSOLE]', msg.text()));
    page.on('requestfailed', req => console.log('[REQUEST FAILED]', req.url(), req.failure()));

    // 1. כניסה לאתר
    await page.goto('https://mekarkein-online.justice.gov.il/voucher/main', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 2. בחירת flip-card לפי service_type
    let flipCardSelector = 'moj-flip-card:nth-of-type(1) i';
    if (service_type === 'historical') flipCardSelector = 'moj-flip-card:nth-of-type(2) i';
    if (service_type === 'concentrated') flipCardSelector = 'moj-flip-card:nth-of-type(3) i';
    await page.waitForSelector(flipCardSelector);
    await page.click(flipCardSelector, { offset: { x: 113, y: 192 } });

    // 3. שם
    await page.waitForSelector("moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']");
    await page.click("moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']", { offset: { x: 313, y: 24.34375 } });
    await page.type("moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']", 'טאבו ישראל', { delay: 20 });

    // 4. דוא"ל
    await page.click("moj-textbox.ng-invalid [data-cy='textbox_input']", { offset: { x: 153, y: 24.34375 } });
    await page.type("moj-textbox.ng-invalid [data-cy='textbox_input']", 'orders@tabuisrael.co.il', { delay: 20 });

    // 5. אימות דוא"ל
    await page.click("moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']", { offset: { x: 281, y: 24.34375 } });
    await page.type("moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']", 'orders@tabuisrael.co.il', { delay: 20 });

    // 6. הבא
    await page.click("[data-cy='button_wizard_next']", { offset: { x: 42, y: 22.34375 } });

    if (search_type === 'address') {
      // 7. איתור לפי כתובת
      await page.waitForSelector('#for-searchOption9');
      await page.click('#for-searchOption9', { offset: { x: 87.78125, y: 9.34375 } });
      await page.click('#for-searchOption11', { offset: { x: 80.4375, y: 10.34375 } });

      // 8. רחוב
      await page.click("moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']", { offset: { x: 197.328125, y: 25.34375 } });
      await page.type("moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']", street, { delay: 20 });

      // 9. מספר בית
      await page.click("moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']", { offset: { x: 218.65625, y: 30.34375 } });
      await page.type("moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']", house_number, { delay: 20 });

      // 10. יישוב
      await page.click('#addressCity28', { offset: { x: 142.984375, y: 19.34375 } });
      await page.type('#addressCity28', city, { delay: 20 });

      // 11. בחירת עיר מהרשימה (אם יש)
      try {
        await page.waitForSelector('p-overlay > div > div > div div', { timeout: 4000 });
        const options = await page.$$('p-overlay > div > div > div div');
        for (const option of options) {
          const text = await option.evaluate(el => el.innerText.trim());
          if (text === city.trim()) {
            await option.click();
            break;
          }
        }
      } catch (e) {}

      // 12. איתור
      await page.click('app-address-params > moj-line span', { offset: { x: 12.421875, y: 3.34375 } });

      // 13. הוספה
      await page.click('div > moj-line:nth-of-type(2) span', { offset: { x: 46.234375, y: 15.34375 } });
    } else if (search_type === 'block') {
      // 7. איתור לפי גוש/חלקה
      await page.waitForSelector('#for-searchOption10');
      await page.click('#for-searchOption10', { offset: { x: 80, y: 10 } });
      await page.click('#for-searchOption12', { offset: { x: 80, y: 10 } });

      // 8. גוש
      await page.click("input[formcontrolname='block']", { offset: { x: 40, y: 10 } });
      await page.type("input[formcontrolname='block']", block, { delay: 20 });

      // 9. חלקה
      await page.click("input[formcontrolname='parcel']", { offset: { x: 40, y: 10 } });
      await page.type("input[formcontrolname='parcel']", parcel, { delay: 20 });

      // 10. תת חלקה (אם יש)
      if (subparcel) {
        await page.click("input[formcontrolname='subParcel']", { offset: { x: 40, y: 10 } });
        await page.type("input[formcontrolname='subParcel']", subparcel, { delay: 20 });
      }

      // 11. איתור
      await page.click('app-block-params > moj-line span', { offset: { x: 12, y: 3 } });

      // 12. הוספה
      await page.click('div > moj-line:nth-of-type(2) span', { offset: { x: 46, y: 15 } });
    }

    // 14. הבא
    await page.click("[data-cy='button_wizard_next']", { offset: { x: 35, y: 23.34375 } });

    // 15. הצהרה
    await page.click('#for-statement34', { offset: { x: 978, y: 41.34375 } });

    // 16. סיום ומעבר לתשלום
    await page.click("[data-cy='button_wizard_submit']", { offset: { x: 58, y: 6.34375 } });

    // 17. אישור
    await page.click('moj-buttons-line span', { offset: { x: 23.203125, y: 13.390625 } });

    // 18. המתן לניווט לעמוד התשלום
    await page.waitForNavigation({ url: /ecom\.gov\.il\/counterspa\/basket2/, timeout: 60000 });

    // 19. עמוד תשלום
    await page.setViewport({ width: 1687, height: 495 });
    await page.goto('https://ecom.gov.il/counterspa/payment/53/1/JusticePayments_1_Tabu/card', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 20. שם לקוח
    await page.click('#client-name', { clickCount: 2, offset: { x: 192.5, y: 9.5 } });
    await page.type('#client-name', 'tabuisrael', { delay: 20 });

    // 21. אימייל
    await page.click('#client-email', { offset: { x: 253.5, y: 25.5 } });
    await page.type('#client-email', 'orders@tabuisrael.co.il', { delay: 20 });

    // 22. כרטיס אשראי זר
    await page.click('div:nth-of-type(5) div:nth-of-type(2) > label', { offset: { x: 385.7421875, y: 9.5 } });

    // 23. מספר כרטיס
    await page.click('#cardNumber', { offset: { x: 208.5, y: 18.5 } });
    await page.type('#cardNumber', CARD_NUM, { delay: 20 });

    // 24. שנה
    await page.click('#years', { offset: { x: 62.5, y: 13.5 } });
    await page.type('#years', '20' + CARD_DATE.slice(2, 4), { delay: 20 });

    // 25. חודש
    await page.click('div:nth-of-type(2) > select', { offset: { x: 67.5, y: 27.5 } });
    await page.type('div:nth-of-type(2) > select', CARD_DATE.slice(0, 2), { delay: 20 });

    // 26. CVV
    await page.click('#card_cvvNumber', { offset: { x: 233.5, y: 3 } });
    await page.type('#card_cvvNumber', CARD_CVV, { delay: 20 });

    // 27. תנאי שימוש
    await page.click('#eula', { offset: { x: 6.5, y: 6 } });

    // 28. לתשלום
    await page.click('div.justify-content-start input', { offset: { x: 171.5, y: 25.5 } });

    // 29. המתן לניווט לדף סיום
    await page.waitForNavigation({ url: /mekarkein-online\.justice\.gov\.il\/voucher\/request\/landing/, timeout: 60000 });

    // 30. להורדת הנסחים (לא חובה)
    // await page.click('div.main-data > moj-buttons-line moj-button:nth-of-type(1) span', { offset: { x: 57.78125, y: 8.75 } });

    await browser.close();
    res.json({ success: true, message: 'Order completed up to payment (puppeteer, full flow, all search types)' });
  } catch (err) {
    if (browser) await browser.close();
    console.error('[TABU-BOT ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Automation Bot running on port ${PORT}`);
});
