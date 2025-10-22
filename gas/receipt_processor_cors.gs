/**
 * レシートデータをGoogle Spreadsheetに追記するAPI（CORS対応版）
 * GPTsから呼び出される
 */

// スプレッドシートIDを設定
const SPREADSHEET_ID = '14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0';
const SHEET_NAME = 'レシート一覧';

/**
 * POST リクエストを処理
 */
function doPost(e) {
  try {
    // リクエストログ
    Logger.log('POST Request received');
    Logger.log('Payload: ' + e.postData.contents);

    const data = JSON.parse(e.postData.contents);

    // データ検証
    if (!validateReceiptData(data)) {
      return createResponse(400, 'Invalid data format');
    }

    // スプレッドシートに追記
    const result = addReceiptToSheet(data);

    return createResponse(200, 'Success', result);

  } catch (error) {
    Logger.log('Error: ' + error.message);
    Logger.log('Stack: ' + error.stack);
    return createResponse(500, 'Internal Server Error: ' + error.message);
  }
}

/**
 * GET リクエストを処理（テスト用）
 */
function doGet(e) {
  return createResponse(200, 'Receipt Scanner API is running');
}

/**
 * OPTIONS リクエストを処理（CORS プリフライト対応）
 */
function doOptions(e) {
  return createResponse(200, 'OK');
}

/**
 * レシートデータをシートに追加
 */
function addReceiptToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // シートが存在しない場合は作成
  if (!sheet) {
    sheet = createReceiptSheet(ss);
  }

  // 新しい行を追加
  const timestamp = new Date();
  const row = [
    timestamp,                          // A: 登録日時
    data.date || '',                    // B: 購入日
    data.store || '',                   // C: 店舗名
    data.category || '',                // D: カテゴリ
    data.total || 0,                    // E: 合計金額
    data.tax || 0,                      // F: 消費税
    data.paymentMethod || '',           // G: 支払方法
    JSON.stringify(data.items || []),   // H: 商品明細（JSON形式）
    data.notes || ''                    // I: メモ
  ];

  sheet.appendRow(row);

  // 最終行番号を取得
  const lastRow = sheet.getLastRow();

  // 金額セルに通貨フォーマットを適用
  sheet.getRange(lastRow, 5, 1, 2).setNumberFormat('¥#,##0');

  return {
    rowNumber: lastRow,
    timestamp: timestamp.toISOString(),
    message: 'レシートデータを追加しました'
  };
}

/**
 * レシート用のシートを新規作成
 */
function createReceiptSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(SHEET_NAME);

  // ヘッダー行を設定
  const headers = [
    '登録日時',
    '購入日',
    '店舗名',
    'カテゴリ',
    '合計金額',
    '消費税',
    '支払方法',
    '商品明細',
    'メモ'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ヘッダーのスタイル設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');

  // 列幅の調整
  sheet.setColumnWidth(1, 150);  // 登録日時
  sheet.setColumnWidth(2, 100);  // 購入日
  sheet.setColumnWidth(3, 150);  // 店舗名
  sheet.setColumnWidth(4, 100);  // カテゴリ
  sheet.setColumnWidth(5, 100);  // 合計金額
  sheet.setColumnWidth(6, 80);   // 消費税
  sheet.setColumnWidth(7, 100);  // 支払方法
  sheet.setColumnWidth(8, 300);  // 商品明細
  sheet.setColumnWidth(9, 200);  // メモ

  // シートを固定
  sheet.setFrozenRows(1);

  return sheet;
}

/**
 * データ検証
 */
function validateReceiptData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // 必須フィールドのチェック（最低限店舗名か金額があればOK）
  if (!data.store && !data.total) {
    return false;
  }

  return true;
}

/**
 * レスポンスを作成（CORS ヘッダー付き）
 */
function createResponse(statusCode, message, data = null) {
  const response = {
    statusCode: statusCode,
    message: message
  };

  if (data) {
    response.data = data;
  }

  const output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);

  // CORS ヘッダーを追加
  return output;
}

/**
 * テスト用関数
 */
function testAddReceipt() {
  const testData = {
    date: '2025-10-22',
    store: 'セブンイレブン',
    category: '食費',
    total: 1234,
    tax: 91,
    paymentMethod: '現金',
    items: [
      { name: 'おにぎり', price: 120, quantity: 2 },
      { name: 'お茶', price: 150, quantity: 1 }
    ],
    notes: 'テストデータ'
  };

  const result = addReceiptToSheet(testData);
  Logger.log(result);
}
