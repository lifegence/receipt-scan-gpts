# GPTs エラー修正手順

## 問題の原因

Google Apps Script の **302リダイレクト** により、GPTs が POST リクエストを正しく処理できません。

## 解決手順

### 1. Apps Script を更新

1. [Apps Script エディタ](https://script.google.com) を開く
2. **すべてのコードを削除**
3. `gas/receipt_processor_ultimate.gs` の内容を **全てコピー&ペースト**
4. `Ctrl+S` で保存

### 2. 新しいバージョンをデプロイ

1. 「デプロイ」→「デプロイを管理」
2. 鉛筆アイコン（編集）をクリック
3. 「バージョン」→「新バージョン」を選択
4. 「デプロイ」をクリック
5. **重要**: 「アクセスできるユーザー」が **「全員」** であることを確認

### 3. GPTs Actions を更新

1. GPTs 編集画面を開く
2. 「Actions」セクションへ移動
3. 既存の Schema を **全て削除**
4. `gpts/actions_schema_ultimate.json` の内容を **全てコピー&ペースト**
5. **servers.url** が正しいデプロイ URL であることを確認
6. 「Save」をクリック

### 4. 動作確認

GPTs でテスト:
```
店舗: テスト店舗
金額: 1000円
```

成功メッセージが表示されれば完了です。

## トラブルシューティング

### まだエラーが出る場合

1. Apps Script で「実行」→ `testAddReceipt` を実行
2. スプレッドシートにデータが追加されるか確認
3. 追加されない場合 → `SPREADSHEET_ID` を確認
4. 追加される場合 → GPTs の Actions URL を再確認

### URL の確認方法

Apps Script:
- 「デプロイ」→「デプロイを管理」
- ウェブアプリの URL をコピー
- 必ず `/exec` で終わっていること

GPTs Actions:
- `servers.url` に上記 URL を設定
- `paths` は `"/"` のまま

## 重要ポイント

✅ **ultimate 版スクリプトを使用**
✅ **新バージョンでデプロイ**
✅ **アクセス権限「全員」**
✅ **Schema の success フォーマット一致**
