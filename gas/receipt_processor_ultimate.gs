/**
 * レシートデータをGoogle Spreadsheetに追記するAPI（名刺GPTsパターン）
 */

const SPREADSHEET_ID = '14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0';
const SHEET_NAME = 'レシート一覧';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!validateReceiptData(data)) {
      return createTextResponse("Invalid data: store or total is required");
    }

    const result = addReceiptToSheet(data);
    return createTextResponse(result.message);

  } catch (error) {
    Logger.log('Error: ' + error.message);
    return createTextResponse("Error: " + error.message);
  }
}

function doGet(e) {
  return createTextResponse("Receipt Scanner API is running - v2.0.0-ultimate");
}

function addReceiptToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = createReceiptSheet(ss);
  }

  const timestamp = new Date();
  const row = [
    timestamp,
    data.date || '',
    data.store || '',
    data.category || '',
    data.total || 0,
    data.tax || 0,
    data.paymentMethod || '',
    JSON.stringify(data.items || []),
    data.notes || ''
  ];

  sheet.appendRow(row);
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 5, 1, 2).setNumberFormat('¥#,##0');

  return {
    rowNumber: lastRow,
    timestamp: timestamp.toISOString(),
    message: 'レシートデータを登録しました'
  };
}

function createReceiptSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(SHEET_NAME);

  const headers = [
    '登録日時', '購入日', '店舗名', 'カテゴリ',
    '合計金額', '消費税', '支払方法', '商品明細', 'メモ'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');

  [150, 100, 150, 100, 100, 80, 100, 300, 200].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(1);

  return sheet;
}

function validateReceiptData(data) {
  return data && typeof data === 'object' && (data.store || data.total);
}

function createTextResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({ message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

function testAddReceipt() {
  const testData = {
    date: '2025-10-22',
    store: 'テスト店舗（名刺パターン）',
    category: '食費',
    total: 7777,
    tax: 574,
    paymentMethod: 'クレジットカード',
    items: [
      { name: 'テスト商品', price: 7777, quantity: 1 }
    ],
    notes: '名刺GPTsパターンで実装'
  };

  const result = addReceiptToSheet(testData);
  Logger.log(JSON.stringify(result));
}
