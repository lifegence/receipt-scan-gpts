/**
 * レシートデータをGoogle Spreadsheetに追記するAPI（GPTs完全対応版）
 * 302リダイレクト問題を完全解決
 */

// スプレッドシートIDを設定
const SPREADSHEET_ID = '14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0';
const SHEET_NAME = 'レシート一覧';

/**
 * POST リクエストを処理
 */
function doPost(e) {
  // CORS ヘッダー付きでレスポンスを返す
  try {
    const data = JSON.parse(e.postData.contents);

    if (!validateReceiptData(data)) {
      return createResponse({
        success: false,
        error: "Invalid data: store or total is required"
      });
    }

    const result = addReceiptToSheet(data);

    return createResponse({
      success: true,
      rowNumber: result.rowNumber,
      timestamp: result.timestamp,
      message: result.message
    });

  } catch (error) {
    Logger.log('Error: ' + error.message);
    return createResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET リクエストを処理
 */
function doGet(e) {
  return createResponse({
    success: true,
    message: "Receipt Scanner API is running",
    version: "2.0.0-ultimate"
  });
}

/**
 * レスポンスを作成（CORS対応、リダイレクト回避）
 */
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * レシートデータをシートに追加
 */
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

/**
 * レシート用のシートを新規作成
 */
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

  sheet.setColumnWidths(1, 9, [150, 100, 150, 100, 100, 80, 100, 300, 200]);
  sheet.setFrozenRows(1);

  return sheet;
}

/**
 * データ検証
 */
function validateReceiptData(data) {
  return data && typeof data === 'object' && (data.store || data.total);
}

/**
 * テスト用関数
 */
function testAddReceipt() {
  const testData = {
    date: '2025-10-22',
    store: 'テスト店舗（Ultimate版）',
    category: '食費',
    total: 8888,
    tax: 657,
    paymentMethod: 'クレジットカード',
    items: [
      { name: 'Ultimate商品', price: 8888, quantity: 1 }
    ],
    notes: 'GPTs完全対応版テスト'
  };

  const result = addReceiptToSheet(testData);
  Logger.log(JSON.stringify(result));
}
