import url from 'url';
import { createRunner } from '@puppeteer/replay';

export async function run(extension) {
    const runner = await createRunner(extension);

    await runner.runBeforeAllSteps();

    await runner.runStep({
        type: 'setViewport',
        width: 3374,
        height: 770,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
    });
    await runner.runStep({
        type: 'navigate',
        url: 'https://mekarkein-online.justice.gov.il/voucher/main',
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://mekarkein-online.justice.gov.il/voucher/main',
                title: 'מקרקעין ברשת'
            }
        ]
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'moj-flip-card:nth-of-type(1) i'
            ],
            [
                'xpath///*[@data-cy="flip_card_button"]/i'
            ],
            [
                'pierce/moj-flip-card:nth-of-type(1) i'
            ],
            [
                'aria/נסח מלא',
                'aria/[role="generic"]'
            ]
        ],
        offsetY: 192,
        offsetX: 113,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'aria/שם*'
            ]
        ],
        offsetY: 24.34375,
        offsetX: 313,
    });
    await runner.runStep({
        type: 'keyUp',
        key: 'CapsLock',
        target: 'main'
    });
    await runner.runStep({
        type: 'change',
        value: 'טאבו ישראל',
        selectors: [
            [
                "moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(2) > moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'aria/שם*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'aria/דואר אלקטרוני*'
            ]
        ],
        offsetY: 24.34375,
        offsetX: 153,
    });
    await runner.runStep({
        type: 'change',
        value: 'orders@tabuisrael.co.il',
        selectors: [
            [
                "moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-textbox.ng-invalid [data-cy='textbox_input']"
            ],
            [
                'aria/דואר אלקטרוני*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'aria/אימות דואר אלקטרוני*'
            ]
        ],
        offsetY: 24.34375,
        offsetX: 281,
    });
    await runner.runStep({
        type: 'change',
        value: 'orders@',
        selectors: [
            [
                "moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'aria/אימות דואר אלקטרוני*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'keyUp',
        key: '2',
        target: 'main'
    });
    await runner.runStep({
        type: 'change',
        value: 'orders@tabuisrael.co.il',
        selectors: [
            [
                "moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(3) > moj-textbox.ng-untouched [data-cy='textbox_input']"
            ],
            [
                'aria/אימות דואר אלקטרוני*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "[data-cy='button_wizard_next']"
            ],
            [
                'xpath///*[@data-cy="button_wizard_next"]'
            ],
            [
                "pierce/[data-cy='button_wizard_next']"
            ],
            [
                'aria/הבא '
            ]
        ],
        offsetY: 22.34375,
        offsetX: 42,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#for-searchOption9'
            ],
            [
                'xpath///*[@id="for-searchOption9"]'
            ],
            [
                'pierce/#for-searchOption9'
            ]
        ],
        offsetY: 9.34375,
        offsetX: 87.78125,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#for-searchOption11'
            ],
            [
                'xpath///*[@id="for-searchOption11"]'
            ],
            [
                'pierce/#for-searchOption11'
            ]
        ],
        offsetY: 10.34375,
        offsetX: 80.4375,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']"
            ],
            [
                'aria/רחוב*'
            ]
        ],
        offsetY: 25.34375,
        offsetX: 197.328125,
    });
    await runner.runStep({
        type: 'change',
        value: 'בארי',
        selectors: [
            [
                "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(1) > moj-textbox:nth-of-type(1) [data-cy='textbox_input']"
            ],
            [
                'aria/רחוב*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']"
            ],
            [
                'aria/מספר בית*'
            ]
        ],
        offsetY: 30.34375,
        offsetX: 218.65625,
    });
    await runner.runStep({
        type: 'change',
        value: '20',
        selectors: [
            [
                "moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']"
            ],
            [
                'xpath///*[@data-cy="textbox_input"]'
            ],
            [
                "pierce/moj-line:nth-of-type(1) > moj-textbox:nth-of-type(2) [data-cy='textbox_input']"
            ],
            [
                'aria/מספר בית*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#addressCity28'
            ],
            [
                'xpath///*[@id="addressCity28"]'
            ],
            [
                'pierce/#addressCity28'
            ],
            [
                'aria/יישוב*'
            ]
        ],
        offsetY: 19.34375,
        offsetX: 142.984375,
    });
    await runner.runStep({
        type: 'change',
        value: 'ראשון לציון',
        selectors: [
            [
                '#addressCity28'
            ],
            [
                'xpath///*[@id="addressCity28"]'
            ],
            [
                'pierce/#addressCity28'
            ],
            [
                'aria/יישוב*'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'p-overlay > div > div > div div'
            ],
            [
                'xpath///*[@id="pn_id_39_0"]/div'
            ],
            [
                'pierce/p-overlay > div > div > div div'
            ],
            [
                'aria/ראשון לציון',
                'aria/[role="generic"]'
            ]
        ],
        offsetY: 13.484375,
        offsetX: 141.28125,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'app-address-params > moj-line span'
            ],
            [
                'xpath///*[@data-cy="button_searchByAddress"]/span'
            ],
            [
                'pierce/app-address-params > moj-line span'
            ],
            [
                'aria/איתור',
                'aria/[role="generic"]'
            ]
        ],
        offsetY: 3.34375,
        offsetX: 12.421875,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div > moj-line:nth-of-type(2) span'
            ],
            [
                'xpath///*[@data-cy="button_assetsAddAsset"]/span'
            ],
            [
                'pierce/div > moj-line:nth-of-type(2) span'
            ],
            [
                'aria/הוספה',
                'aria/[role="generic"]'
            ]
        ],
        offsetY: 15.34375,
        offsetX: 46.234375,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "[data-cy='button_wizard_next']"
            ],
            [
                'xpath///*[@data-cy="button_wizard_next"]'
            ],
            [
                "pierce/[data-cy='button_wizard_next']"
            ],
            [
                'aria/הבא '
            ]
        ],
        offsetY: 23.34375,
        offsetX: 35,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#for-statement34'
            ],
            [
                'xpath///*[@id="for-statement34"]'
            ],
            [
                'pierce/#for-statement34'
            ]
        ],
        offsetY: 41.34375,
        offsetX: 978,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                "[data-cy='button_wizard_submit']"
            ],
            [
                'xpath///*[@data-cy="button_wizard_submit"]'
            ],
            [
                "pierce/[data-cy='button_wizard_submit']"
            ],
            [
                'aria/סיום ומעבר לתשלום'
            ]
        ],
        offsetY: 6.34375,
        offsetX: 58,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'moj-buttons-line span'
            ],
            [
                'xpath///*[@data-cy="button_approve_"]/span'
            ],
            [
                'pierce/moj-buttons-line span'
            ],
            [
                'aria/אישור',
                'aria/[role="generic"]'
            ]
        ],
        offsetY: 13.390625,
        offsetX: 23.203125,
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://ecom.gov.il/counterspa/basket2/53/1/JusticePayments_1_Tabu?language=he',
                title: ''
            }
        ]
    });

    await runner.runAfterAllSteps();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    run()
}
 

export async function run(extension) {
    const runner = await createRunner(extension);

    await runner.runBeforeAllSteps();

    await runner.runStep({
        type: 'setViewport',
        width: 1687,
        height: 495,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
    });
    await runner.runStep({
        type: 'navigate',
        url: 'https://ecom.gov.il/counterspa/payment/53/1/JusticePayments_1_Tabu/card',
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://ecom.gov.il/counterspa/payment/53/1/JusticePayments_1_Tabu/card',
                title: 'שירות התשלומים הממשלתי - משרד המשפטים - שירותי הפנייה - תשלומי משרד המשפטים'
            }
        ]
    });
    await runner.runStep({
        type: 'doubleClick',
        target: 'main',
        selectors: [
            [
                '#client-name'
            ],
            [
                'xpath///*[@id="client-name"]'
            ],
            [
                'pierce/#client-name'
            ],
            [
                'aria/*שם לקוח'
            ],
            [
                'text/tabuisrael'
            ]
        ],
        offsetY: 9.5,
        offsetX: 192.5,
    });
    await runner.runStep({
        type: 'change',
        value: 'tabuisrael',
        selectors: [
            [
                '#client-name'
            ],
            [
                'xpath///*[@id="client-name"]'
            ],
            [
                'pierce/#client-name'
            ],
            [
                'aria/*שם לקוח'
            ],
            [
                'text/tabuisrael'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#client-email'
            ],
            [
                'xpath///*[@id="client-email"]'
            ],
            [
                'pierce/#client-email'
            ],
            [
                'aria/*דוא"ל לקבלת אישור התשלום'
            ]
        ],
        offsetY: 25.5,
        offsetX: 253.5,
    });
    await runner.runStep({
        type: 'change',
        value: 'orders@tabuisrael.co.il',
        selectors: [
            [
                '#client-email'
            ],
            [
                'xpath///*[@id="client-email"]'
            ],
            [
                'pierce/#client-email'
            ],
            [
                'aria/*דוא"ל לקבלת אישור התשלום'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div:nth-of-type(5) div:nth-of-type(2) > label'
            ],
            [
                'xpath///*[@id={}]/div[5]/div/div/div[2]/label'
            ],
            [
                'pierce/div:nth-of-type(5) div:nth-of-type(2) > label'
            ],
            [
                'text/כרטיס אשראי זר'
            ]
        ],
        offsetY: 9.5,
        offsetX: 385.7421875,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#cardNumber'
            ],
            [
                'xpath///*[@id="cardNumber"]'
            ],
            [
                'pierce/#cardNumber'
            ],
            [
                'aria/*מספר כרטיס אשראי'
            ]
        ],
        offsetY: 18.5,
        offsetX: 208.5,
    });
    await runner.runStep({
        type: 'keyDown',
        target: 'main',
        key: 'Meta'
    });
    await runner.runStep({
        type: 'keyUp',
        key: 'Meta',
        target: 'main'
    });
    await runner.runStep({
        type: 'change',
        value: '4462220085860879',
        selectors: [
            [
                '#cardNumber'
            ],
            [
                'xpath///*[@id="cardNumber"]'
            ],
            [
                'pierce/#cardNumber'
            ],
            [
                'aria/*מספר כרטיס אשראי'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#years'
            ],
            [
                'xpath///*[@id="years"]'
            ],
            [
                'pierce/#years'
            ],
            [
                'aria/תוקף הכרטיס:שנה'
            ]
        ],
        offsetY: 13.5,
        offsetX: 62.5,
    });
    await runner.runStep({
        type: 'change',
        value: '2028',
        selectors: [
            [
                '#years'
            ],
            [
                'xpath///*[@id="years"]'
            ],
            [
                'pierce/#years'
            ],
            [
                'aria/תוקף הכרטיס:שנה'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div:nth-of-type(2) > select'
            ],
            [
                'xpath///*[@id="vBody"]/app/article/div/div[3]/section/ng-component/div[2]/ng-component/form/div[8]/div[2]/div/div[2]/select'
            ],
            [
                'pierce/div:nth-of-type(2) > select'
            ]
        ],
        offsetY: 27.5,
        offsetX: 67.5,
    });
    await runner.runStep({
        type: 'change',
        value: '03',
        selectors: [
            [
                'div:nth-of-type(2) > select'
            ],
            [
                'xpath///*[@id="vBody"]/app/article/div/div[3]/section/ng-component/div[2]/ng-component/form/div[8]/div[2]/div/div[2]/select'
            ],
            [
                'pierce/div:nth-of-type(2) > select'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#card_cvvNumber'
            ],
            [
                'xpath///*[@id="card_cvvNumber"]'
            ],
            [
                'pierce/#card_cvvNumber'
            ],
            [
                'aria/*ספרות בגב הכרטיס'
            ]
        ],
        offsetY: 3,
        offsetX: 233.5,
    });
    await runner.runStep({
        type: 'change',
        value: '496',
        selectors: [
            [
                '#card_cvvNumber'
            ],
            [
                'xpath///*[@id="card_cvvNumber"]'
            ],
            [
                'pierce/#card_cvvNumber'
            ],
            [
                'aria/*ספרות בגב הכרטיס'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#eula'
            ],
            [
                'xpath///*[@id="eula"]'
            ],
            [
                'pierce/#eula'
            ],
            [
                'aria/קראתי ואני מאשר את תנאי השימוש באתר.[role="checkbox"]'
            ]
        ],
        offsetY: 6,
        offsetX: 6.5,
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'div.justify-content-start input'
            ],
            [
                'xpath///*[@id="vBody"]/app/article/div/div[3]/section/ng-component/div[2]/ng-component/form/div[12]/div/input'
            ],
            [
                'pierce/div.justify-content-start input'
            ],
            [
                'aria/לתשלום'
            ]
        ],
        offsetY: 25.5,
        offsetX: 171.5,
        assertedEvents: [
            {
                type: 'navigation',
                url: 'https://mekarkein-online.justice.gov.il/voucher/request/landing?paymentDefinitionID=1&enc_string=nG8MPzCBPh2nHo5l3l%2bnyz8QTgpmYMtfMgHPk6uXNgTFQGV08mgy9%2bmJ8B8gRHTkyJu2F5xQO37AveHM0%2ftfTUf828TVZE5nJkiBUDtHnRMvnNAcVDJjvR1yAsn9TRP4kHhODV%2br9dTt9pP%2fIoZT%2b1PEMuJqp88b7Sym7M7xpMK%2fI%2bAi5WsxIjZWI41Rew7q5untxYZoyyZvirZMWQalgvrk7dD8gllA92LXyepGUI0fr3y%2fUuHfKYqfcmy7vvDYSrCvdJdhQDHGcsMxzr%2fFqNDRgfUgv%2fCBXCdiFbqhGuo%3d',
                title: 'מקרקעין ברשת'
            }
        ]
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            'div.main-data > moj-buttons-line moj-button:nth-of-type(1) span',
            'xpath///*[@data-cy="button_toDownloadvouchers"]/span',
            'pierce/div.main-data > moj-buttons-line moj-button:nth-of-type(1) span',
            'aria/להורדת הנסחים[role="generic"]',
            'text/להורדת הנסחים'
        ],
        offsetX: 57.78125,
        offsetY: 8.75
    });

    await runner.runAfterAllSteps();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    run()
}
