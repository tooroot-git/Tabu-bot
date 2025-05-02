// קובץ: bot.js

import express from 'express';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// פונקציית retry גנרית
async function retry(fn, retries = 3, delay = 600) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// עוטף פעולה עם לוג
async function logStep(desc, fn) {
  console.log(`[TABU-BOT] ${desc}...`);
  return await fn();
}

// המתנה לאלמנט עם timeout
async function waitAndGet(page, selector, timeout = 9000) {
  return await retry(() => page.waitForSelector(selector, { timeout }), 3, 500);
}

// קליק עם offset בטוח
async function safeClick(page, selector, offsetX = 0, offsetY = 0, timeout = 9000, double = false) {
  const el = await waitAndGet(page, selector, timeout);
  const box = await el.boundingBox();
  if (!box) throw new Error(`No bounding box for: ${selector}`);
  if (double) {
    await page.mouse.dblclick(box.x + offsetX, box.y + offsetY);
  } else {
    await page.mouse.click(box.x + offsetX, box.y + offsetY);
  }
}

// מילוי שדה עם retry
async function safeFill(page, selector, value, timeout = 9000) {
  await waitAndGet(page, selector, timeout);
  await retry(() => page.fill(selector, value), 3, 400);
}

app.post('/run-order', async (req, res) => {
  const { user_id, email, search_type, city, street, house_number, block, parcel, subparcel, service_type } = req.body;

  // בדיקת קלט בסיסית
  if (!user_id || !email || !search_type || !service_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (search_type === 'address' && (!city || !street || !house_number)) {
    return res.status(400).json({ error: 'Missing address fields' });
  }
  if (search_type === 'block' && (!block || !parcel)) {
    return res.status(400).json({ error: 'Missing block/parcel fields' });
  }

  // פרטי אשראי מהסביבה
  const CARD_NUM = process.env.CREDIT_CARD_NUM;
  const CARD_DATE = process.env.CREDIT_CARD_DATE_DD_YY;
  const CARD_CVV = process.env.CREDIT_CARD_DATE_CVV;

  if (!CARD_NUM || !CARD_DATE || !CARD_CVV) {
    return res.status(500).json({ error: 'Missing credit card env vars' });
  }

  // הגדרת פרוקסי מה-ENV (או קשיח)
  const PROXY_SERVER = process.env.PLAYWRIGHT_PROXY; // דוג' "http://user:pass@proxyhost:port" או "socks5://host:port"

  let browser;
  try {
    // נסה קודם כל בלי proxy בכלל (לוקאלי/שרת רגיל)
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled'
      ]
    });

    // אם יש פרוקסי, הגדר אותו ב-context (ולא ב-launch)
    const context = await browser.newContext({
      ...(PROXY_SERVER ? { proxy: { server: PROXY_SERVER } } : {}),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    // לוגים של שגיאות רשת/קונסול
    page.on('console', msg => console.log('[PAGE CONSOLE]', msg.text()));
    page.on('requestfailed', req => console.log('[REQUEST FAILED]', req.url(), req.failure()));
    page.on('response', resp => {
      if (resp.status() >= 400) {
        console.log('[RESPONSE]', resp.url(), resp.status());
      }
    });

    await logStep('Setting viewport', () => page.setViewportSize({ width: 1200, height: 900 }));

    await logStep('Navigating to main site', () =>
      page.goto('https://mekarkein-online.justice.gov.il/voucher/main', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
      })
    );

    // בחירת flip-card לפי סוג שירות
    await logStep('Selecting service type', async () => {
      if (service_type === 'regular') {
        await safeClick(page, 'moj-flip-card:nth-of-type(1) i', 113, 192);
      } else if (service_type === 'historical') {
        await safeClick(page, 'moj-flip-card:nth-of-type(2) i', 113, 192);
      } else if (service_type === 'concentrated') {
        await safeClick(page, 'moj-flip-card:nth-of-type(3) i', 113, 192);
      } else {
        throw new Error('Unknown service_type');
      }
    });

    await logStep('Click שם', () => safeClick(page, "moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']", 313, 24.34375));
    await logStep('Fill שם', () => safeFill(page, "moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']", 'טאבו ישראל'));
    await logStep('Click דוא"ל', () => safeClick(page, "moj-textbox.ng-invalid [data-cy='textbox_input']", 153, 24.34375));
    await logStep('Fill דוא"ל', () => safeFill(page, "moj-textbox.ng-invalid [data-cy='textbox_input']", 'orders@tabuisrael.co.il'));

    await logStep('Click אימות דוא"ל', () => safeClick(page, "moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']", 281, 24.34375));
    await logStep('Fill אימות דוא"ל', () => safeFill(page, "moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']", 'orders@tabuisrael.co.il'));

    await logStep('Click הבא', () => safeClick(page, "[data-cy='button_wizard_next']", 42, 22.34375));

    if (search_type === 'address') {
      await logStep('Click איתור לפי כתובת', () => safeClick(page, '#for-searchOption9', 87.78125, 9.34375));
      await logStep('Click רחוב', () => safeClick(page, "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']", 197.328125, 25.34375));
      await logStep('Fill רחוב', () => safeFill(page, "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']", street));
      await logStep('Click מספר בית', () => safeClick(page, "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']", 218.65625, 30.34375));
      await logStep('Fill מספר בית', () => safeFill(page, "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']", house_number));
      await logStep('Click יישוב', () => safeClick(page, '#addressCity28', 142.984375, 19.34375));
      await logStep('Fill יישוב', () => safeFill(page, '#addressCity28', city));
      await logStep('Select city from overlay', async () => {
        try {
          await page.waitForSelector('p-overlay > div > div > div div', { timeout: 4000 });
          const options = await page.$$('p-overlay > div > div > div div');
          let found = false;
          for (const option of options) {
            const text = await option.innerText();
            if (text.trim() === city.trim()) {
              const box = await option.boundingBox();
              await page.mouse.click(box.x + 10, box.y + 10);
              found = true;
              break;
            }
          }
          if (!found && options.length > 0) {
            const box = await options[0].boundingBox();
            await page.mouse.click(box.x + 10, box.y + 10);
          }
        } catch (e) {
          console.log('[TABU-BOT] No city overlay, continuing...');
        }
      });
      await logStep('Click איתור', () => safeClick(page, 'app-address-params > moj-line span', 12.421875, 3.34375));
      await logStep('Click הוספה', () => safeClick(page, 'div > moj-line:nth-of-type(2) span', 46.234375, 15.34375));
    } else if (search_type === 'block') {
      await logStep('Click איתור לפי גוש', () => safeClick(page, '#for-searchOption10', 80, 10));
      await logStep('Click חלקה', () => safeClick(page, "input[formcontrolname='parcel']", 40, 10));
      await logStep('Fill חלקה', () => safeFill(page, "input[formcontrolname='parcel']", parcel));
      if (subparcel) {
        await logStep('Click תת חלקה', () => safeClick(page, "input[formcontrolname='subParcel']", 40, 10));
        await logStep('Fill תת חלקה', () => safeFill(page, "input[formcontrolname='subParcel']", subparcel));
      }
      await logStep('Click איתור', () => safeClick(page, 'app-block-params > moj-line span', 12, 3));
      await logStep('Click הוספה', () => safeClick(page, 'div > moj-line:nth-of-type(2) span', 46, 15));
    }

    await logStep('Click הבא', () => safeClick(page, "[data-cy='button_wizard_next']", 35, 23.34375));
    await logStep('Click הצהרה', () => safeClick(page, '#for-statement34', 978, 41.34375));
    await logStep('Click סיום ומעבר לתשלום', () => safeClick(page, "[data-cy='button_wizard_submit']", 58, 6.34375));
    await logStep('Click אישור', () => safeClick(page, 'moj-buttons-line span', 23.203125, 13.390625));

    await logStep('Wait for payment page', () =>
      page.waitForNavigation({ url: /ecom\.gov\.il\/counterspa\/basket2/, timeout: 30000 })
    );

    await logStep('Set payment viewport', () => page.setViewportSize({ width: 1687, height: 495 }));
    await logStep('DoubleClick שם לקוח', () => safeClick(page, '#client-name', 192.5, 9.5, 9000, true));
    await logStep('Fill שם לקוח', () => safeFill(page, '#client-name', 'tabuisrael'));
    await logStep('Click אימייל', () => safeClick(page, '#client-email', 253.5, 25.5));
    await logStep('Fill אימייל', () => safeFill(page, '#client-email', 'orders@tabuisrael.co.il'));
    await logStep('Click כרטיס אשראי זר', () => safeClick(page, 'div:nth-of-type(5) div:nth-of-type(2) > label', 385.7421875, 9.5));
    await logStep('Click מספר כרטיס', () => safeClick(page, '#cardNumber', 208.5, 18.5));
    await logStep('Fill מספר כרטיס', () => safeFill(page, '#cardNumber', CARD_NUM));
    await logStep('Click חודש', () => safeClick(page, 'div:nth-of-type(2) > select', 67.5, 27.5));
    await logStep('Fill חודש', () => safeFill(page, 'div:nth-of-type(2) > select', CARD_DATE.slice(0, 2)));
    await logStep('Click שנה', () => safeClick(page, '#years', 62.5, 13.5));
    await logStep('Fill שנה', () => safeFill(page, '#years', '20' + CARD_DATE.slice(2, 4)));
    await logStep('Click CVV', () => safeClick(page, '#card_cvvNumber', 233.5, 3));
    await logStep('Fill CVV', () => safeFill(page, '#card_cvvNumber', CARD_CVV));
    await logStep('Click תנאי שימוש', () => safeClick(page, '#eula', 6.5, 6));
    await logStep('Click לתשלום', () => safeClick(page, 'div.justify-content-start input', 171.5, 25.5));

    await logStep('Wait for landing page', () =>
      page.waitForNavigation({ url: /mekarkein-online\.justice\.gov\.il\/voucher\/request\/landing/, timeout: 60000 })
    );

    await browser.close();
    res.json({ success: true, message: 'Order completed up to payment (proxy-context, hardened)' });
  } catch (err) {
    if (browser) await browser.close();
    console.error('[TABU-BOT ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Automation Bot running on port ${PORT}`);
});
