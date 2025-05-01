// קובץ: bot.js

import express from 'express';
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tabuisrael-smtp',
    pass: 'Lxgiwy0123!'
  }
});

async function fillCreditCard(page) {
  await page.fill('input[name="cardnumber"]', process.env.CREDIT_CARD_NUM);
  await page.fill('input[name="expirydate"]', process.env.CREDIT_CARD_DATE_DD_YY);
  await page.fill('input[name="cvc"]', process.env.CREDIT_CARD_DATE_CVV);
}

app.post('/run-order', async (req, res) => {
  const { user_id, email, search_type, city, street, house_number, block, parcel, subparcel, service_type } = req.body;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://mekarkein-online.justice.gov.il/voucher/main', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.click('text=בואו נתחיל');
    await page.click('text=נסח טאבו');

    if (service_type === 'regular') {
      await page.click('text=נסח מלא');
    } else if (service_type === 'historical') {
      await page.click('text=נסח היסטורי');
    } else if (service_type === 'concentrated') {
      await page.click('text=נסח מרוכז');
    }

    if (search_type === 'address') {
      await page.click('text=איתור לפי כתובת נכס');
      await page.selectOption('select[name="יישוב"]', { label: city });
      await page.fill('input[name="רחוב"]', street);
      await page.fill('input[name="מספר בית"]', house_number.toString());
    } else if (search_type === 'block') {
      await page.click('text=איתור לפי גוש חלקה');
      await page.fill('input[name="גוש"]', block);
      await page.fill('input[name="חלקה"]', parcel);
      if (subparcel) {
        await page.fill('input[name="תת חלקה"]', subparcel);
      }
    }

    await page.click('text=איתור');
    await page.waitForTimeout(3000);
    await page.click('text=אישור');
    await page.waitForTimeout(2000);

    await page.fill('input[name="email"]', 'orders@tabuisrael.co.il');
    await page.fill('input[name="confirmEmail"]', 'orders@tabuisrael.co.il');

    await page.click('text=המשך');
    await page.waitForTimeout(3000);

    await fillCreditCard(page);
    await page.click('text=לתשלום');
    await page.waitForTimeout(10000);

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fulfilled-orders')
      .upload(`orders/${user_id}_${Date.now()}.pdf`, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw new Error('Failed to upload document');

    const document_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fulfilled-orders/${uploadData.path}`;

    await supabase.from('orders').insert({
      user_id,
      block,
      parcel,
      subparcel,
      service_type,
      status: 'completed',
      price: 69,
      payment_id: 'auto-order',
      document_url,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    await transporter.sendMail({
      from: 'Tabu Israel - טאבו ישראל <donotreply@tabuisrael.co.il>',
      to: email,
      subject: 'נסח טאבו שלך מוכן',
      html: `<div style="background:#0e0e0e;padding:30px;text-align:center;color:white;"><h1>נסח טאבו מוכן</h1><a href="${document_url}" style="background:#f97316;padding:10px 20px;color:white;text-decoration:none;">הורד את הנסח</a></div>`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    await browser.close();
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Automation Bot running on port ${PORT}`);
});
