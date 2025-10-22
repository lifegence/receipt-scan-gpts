# レシートスキャナーGPTs

スマホで撮影したレシート画像を自動でGoogle Spreadsheetにデータ化するシステム

## 主な機能

- レシート画像の自動読み取り
- 店舗名、日付、金額、商品明細の抽出
- Google Spreadsheetへの自動記録
- カテゴリ自動分類（食費、日用品、交通費など）
- 商品明細の詳細記録

## システム構成

```
📱 スマホカメラ
    ↓
🤖 GPTs (ChatGPT)
    ↓ [Vision API]
    ↓
📊 Google Apps Script API
    ↓
📈 Google Spreadsheet
```

## セットアップ

詳細な手順は [SETUP_GUIDE.md](./SETUP_GUIDE.md) を参照してください。

### クイックスタート

1. Google Spreadsheetを作成
2. Apps Scriptに `gas/receipt_processor.gs` をデプロイ
3. GPTsを作成し、`gpts/instructions.md` と `gpts/actions_schema.json` を設定
4. レシート画像をアップロード！

## 使い方

1. GPTsを開く
2. レシート画像をアップロード
3. 抽出されたデータを確認
4. 「登録してください」と指示
5. Spreadsheetに自動記録

## ファイル構成

```
receipt_scan_gpts/
├── gas/
│   └── receipt_processor.gs          # Google Apps Scriptコード
├── gpts/
│   ├── instructions.md                # GPTsカスタム指示文
│   └── actions_schema.json            # GPTs Actionsスキーマ
├── SETUP_GUIDE.md                     # 詳細セットアップ手順
└── README.md                          # このファイル
```

## 記録されるデータ

| 項目 | 説明 |
|------|------|
| 登録日時 | データ登録時刻（自動） |
| 購入日 | レシートの日付 |
| 店舗名 | 購入店舗 |
| カテゴリ | 食費、日用品、交通費、娯楽、その他 |
| 合計金額 | レシート合計額 |
| 消費税 | 税額 |
| 支払方法 | 現金、クレカ、電子マネーなど |
| 商品明細 | 商品名、価格、数量（JSON形式） |
| メモ | 備考 |

## カスタマイズ

### カテゴリを追加

`gpts/instructions.md` を編集して新しいカテゴリを追加できます。

### 列を追加

`gas/receipt_processor.gs` の `addReceiptToSheet` と `createReceiptSheet` 関数を編集します。

詳細は [SETUP_GUIDE.md](./SETUP_GUIDE.md) のカスタマイズセクションを参照。

## セキュリティ

- レシート画像は処理後保持されません
- スプレッドシートは自分のGoogleアカウントでのみアクセス可能
- GPTsは「Only me」設定を推奨

## トラブルシューティング

問題が発生した場合は [SETUP_GUIDE.md](./SETUP_GUIDE.md) のトラブルシューティングセクションを確認してください。

## ライセンス

MIT License

## 作成日

2025-10-22
# receipt-scan-gpts
