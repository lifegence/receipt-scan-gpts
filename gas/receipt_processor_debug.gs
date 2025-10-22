/**
 * レシートデータをGoogle Spreadsheetに追記するAPI（デバッグ版）
 * GPTsから呼び出される
 */

// スプレッドシートIDを設定
const SPREADSHEET_ID = '14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0';
const SHEET_NAME = 'レシート一覧';
const LOG_SHEET_NAME = 'デバッグログ';

/**
 * POST リクエストを処理
 */
function doPost(e) {
  try {
    // リクエスト全体をログに記録
    logRequest('POST', e);

    const data = JSON.parse(e.postData.contents);

    // 受信データをログ
    Logger.log('Received data: ' + JSON.stringify(data));
    logToSheet('受信データ', JSON.stringify(data, null, 2));

    // データ検証
    if (!validateReceiptData(data)) {
      logToSheet('検証エラー', 'Invalid data format');
      return createResponse(400, 'Invalid data format');
    }

    // スプレッドシートに追記
    const result = addReceiptToSheet(data);
    logToSheet('登録成功', JSON.stringify(result));

    return createResponse(200, 'Success', result);

  } catch (error) {
    const errorMsg = 'Error: ' + error.message + '\n' + error.stack;
    Logger.log(errorMsg);
    logToSheet('エラー', errorMsg);
    return createResponse(500, 'Internal Server Error: ' + error.message);
  }
}

/**
 * GET リクエストを処理（テスト用）
 */
function doGet(e) {
  logRequest('GET', e);
  return createResponse(200, 'Receipt Scanner API is running (Debug Mode)');
}

/**
 * リクエスト情報をログシートに記録
 */
function logRequest(method, e) {
  const info = {
    method: method,
    timestamp: new Date().toISOString(),
    parameters: e.parameter || {},
    postData: e.postData ? {
      length: e.postData.length,
      type: e.postData.type,
      contents: e.postData.contents
    } : null
  };

  Logger.log('Request: ' + JSON.stringify(info));
  logToSheet('リクエスト情報', JSON.stringify(info, null, 2));
}

/**
 * ログシートに情報を記録
 */
function logToSheet(category, message) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);

    // ログシートが存在しない場合は作成
    if (!logSheet) {
      logSheet = ss.insertSheet(LOG_SHEET_NAME);
      logSheet.getRange(1, 1, 1, 3).setValues([['タイムスタンプ', 'カテゴリ', 'メッセージ']]);
      logSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      logSheet.setColumnWidth(1, 180);
      logSheet.setColumnWidth(2, 120);
      logSheet.setColumnWidth(3, 600);
    }

    const timestamp = new Date();
    logSheet.appendRow([timestamp, category, message]);

  } catch (error) {
    Logger.log('Log error: ' + error.message);
  }
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
 * レスポンスを作成
 */
function createResponse(statusCode, message, data = null) {
  const response = {
    statusCode: statusCode,
    message: message
  };

  if (data) {
    response.data = data;
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
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
