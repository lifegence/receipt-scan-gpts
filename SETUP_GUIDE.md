# レシートスキャナーGPTs セットアップ手順書

## 概要
スマホで撮影したレシート画像をGPTsで解析し、Google Spreadsheetに自動でデータ化して記録するシステムです。

## システム構成
```
スマホカメラ → GPTs (画像解析) → Google Apps Script API → Google Spreadsheet
```

---

## セットアップ手順

### Phase 1: Google Spreadsheet の準備

#### 1-1. 新しいスプレッドシートを作成
1. [Google Sheets](https://sheets.google.com/)を開く
2. 「空白」から新しいスプレッドシートを作成
3. 名前を「レシート管理」などに変更

#### 1-2. スプレッドシートIDを取得
- URLから取得: `https://docs.google.com/spreadsheets/d/【ここがスプレッドシートID】/edit`
- この **スプレッドシートID** を控えておく（後で使用）

---

### Phase 2: Google Apps Script のデプロイ

#### 2-1. Apps Script エディタを開く
1. スプレッドシート上部メニュー → 「拡張機能」→「Apps Script」
2. 新しいタブでApps Scriptエディタが開く

#### 2-2. コードを貼り付け
1. デフォルトの `function myFunction() {}` を全て削除
2. `gas/receipt_processor.gs` の内容を全てコピー
3. Apps Scriptエディタに貼り付け

#### 2-3. スプレッドシートIDを設定
```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // ← ここを実際のIDに置き換え
```

**例:**
```javascript
const SPREADSHEET_ID = '1a2B3c4D5e6F7g8H9i0JkLmNoPqRsTuVwXyZ';
```

#### 2-4. プロジェクトを保存
- 左上のディスクアイコンをクリック、または `Ctrl+S` (Mac: `Cmd+S`)
- プロジェクト名を「レシートスキャナーAPI」などに変更

#### 2-5. テスト実行（任意）
1. エディタ上部の関数選択で「testAddReceipt」を選択
2. 「実行」ボタンをクリック
3. 初回実行時、権限の承認を求められる:
   - 「権限を確認」→ Googleアカウントを選択
   - 「詳細を表示」→「レシートスキャナーAPI（安全ではないページ）に移動」
   - 「許可」をクリック
4. スプレッドシートに「レシート一覧」シートが作成され、テストデータが追加される

#### 2-6. Webアプリとしてデプロイ
1. 右上の「デプロイ」→「新しいデプロイ」をクリック
2. 種類の選択で「ウェブアプリ」を選択
3. 設定:
   - **説明**: 「レシートスキャナーAPI v1」
   - **次のユーザーとして実行**: 「自分」
   - **アクセスできるユーザー**: 「全員」（※重要）
4. 「デプロイ」をクリック
5. 再度承認を求められた場合は「アクセスを承認」

#### 2-7. デプロイURLを取得
1. デプロイ完了画面で **「ウェブアプリのURL」** が表示される
2. このURLを **コピーして控える**（後で使用）
   - 形式: `https://script.google.com/macros/s/【デプロイID】/exec`

---

### Phase 3: GPTs の作成と設定

#### 3-1. ChatGPT GPTs作成画面を開く
1. [ChatGPT](https://chat.openai.com/)にアクセス
2. 左サイドバーの「Explore GPTs」をクリック
3. 右上の「Create」または「+ Create a GPT」をクリック

#### 3-2. 基本情報を設定
**Configure** タブをクリックして以下を設定:

**Name (名前):**
```
レシートスキャナー
```

**Description (説明):**
```
スマホで撮影したレシート画像を解析し、Google Spreadsheetに自動でデータを記録します
```

**Instructions (指示):**
- `gpts/instructions.md` の内容を全てコピーして貼り付け

**Conversation starters (会話のきっかけ):**
以下を追加:
```
📸 レシート画像をアップロードしてください
💰 最近の支出を確認
📊 カテゴリ別集計
❓ 使い方を教えて
```

**Knowledge (ナレッジ):**
- なし（必要に応じて後で追加）

**Capabilities (機能):**
- ✅ Web Browsing: OFF
- ✅ DALL·E Image Generation: OFF
- ✅ Code Interpreter: OFF

#### 3-3. Actions を設定
1. 「Actions」セクションまでスクロール
2. 「Create new action」をクリック

**Schema の設定:**
1. `gpts/actions_schema.json` の内容を全てコピー
2. Schema入力欄に貼り付け
3. **重要**: `servers` → `url` の部分を **Phase 2-7で取得したデプロイURL** に置き換え

**例:**
```json
"servers": [
  {
    "url": "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXX/exec",
    "description": "Google Apps Script Web App"
  }
]
```

**Authentication (認証):**
- 「None」を選択（Google Apps Scriptは全員アクセス可能で設定済み）

**Privacy policy (プライバシーポリシー):**
- 空欄でOK（個人利用の場合）

#### 3-4. GPTsを保存
1. 右上の「Save」をクリック
2. 公開設定を選択:
   - **Only me**: 自分だけ使用（推奨）
   - **Anyone with a link**: リンクを知っている人全員
   - **Public**: 誰でも使用可能（GPT Storeに公開）
3. 「Confirm」をクリック

---

### Phase 4: 動作テスト

#### 4-1. テスト画像を準備
- 実際のレシート、またはサンプルレシート画像を用意

#### 4-2. GPTsで画像をアップロード
1. 作成した「レシートスキャナー」GPTsを開く
2. 📎アイコンまたはドラッグ&ドロップでレシート画像をアップロード
3. GPTsが画像を解析して内容を表示

#### 4-3. データ確認と登録
1. 抽出されたデータを確認
2. 必要に応じて修正を指示
3. 「登録してください」と入力
4. GPTsがGoogle Spreadsheetに登録

#### 4-4. Spreadsheetで確認
1. Google Spreadsheetを開く
2. 「レシート一覧」シートに新しい行が追加されていることを確認

---

## トラブルシューティング

### エラー: "API呼び出しに失敗しました"

**原因1: デプロイURLが間違っている**
- `gpts/actions_schema.json` の `servers.url` を確認
- Apps Scriptの「デプロイを管理」から正しいURLを再確認

**原因2: Apps Scriptの実行権限がない**
- Apps Scriptエディタで `testAddReceipt` を実行して権限を再承認

**原因3: アクセス権限が「全員」になっていない**
- Apps Script → 「デプロイ」→「デプロイを管理」
- 鉛筆アイコンをクリック → 「アクセスできるユーザー」を「全員」に変更

### エラー: "スプレッドシートが見つかりません"

**原因: SPREADSHEET_IDが間違っている**
- `receipt_processor.gs` の `SPREADSHEET_ID` を確認
- スプレッドシートのURLから正しいIDをコピー

### レシート画像が正しく読み取れない

**対処法:**
- 画像を明るい場所で撮影
- レシート全体がフレーム内に収まるように撮影
- ピンボケしないよう注意
- 影が入らないようにする

### GPTsが「商品明細」を抽出してくれない

**対処法:**
- 「商品の明細も抽出してください」と明示的に指示
- レシート画像が鮮明か確認
- 商品欄が見切れていないか確認

---

## カスタマイズ方法

### カテゴリを追加・変更する

**instructions.md を編集:**
```markdown
- カテゴリは店舗名や商品内容から推測する
  - コンビニ、スーパー → 食費
  - ドラッグストア → 日用品
  - 交通系 → 交通費
  - レジャー施設 → 娯楽
  - 書店 → 書籍費        ← 追加
  - 衣料品店 → 衣服費    ← 追加
```

GPTsの「Configure」→「Instructions」を更新

### スプレッドシートの列を追加する

**receipt_processor.gs を編集:**

1. `addReceiptToSheet` 関数の `row` 配列に項目を追加:
```javascript
const row = [
  timestamp,
  data.date || '',
  data.store || '',
  data.category || '',
  data.total || 0,
  data.tax || 0,
  data.paymentMethod || '',
  data.location || '',              // ← 新規追加: 店舗所在地
  JSON.stringify(data.items || []),
  data.notes || ''
];
```

2. `createReceiptSheet` 関数のヘッダーを更新:
```javascript
const headers = [
  '登録日時',
  '購入日',
  '店舗名',
  'カテゴリ',
  '合計金額',
  '消費税',
  '支払方法',
  '店舗所在地',    // ← 追加
  '商品明細',
  'メモ'
];
```

3. Apps Scriptで「デプロイ」→「新しいデプロイ」でバージョンアップ

4. instructions.md と actions_schema.json にも項目を追加

---

## セキュリティに関する注意事項

### 重要な考慮事項
1. **個人情報**: レシートには個人情報が含まれる可能性があります
2. **アクセス制御**: スプレッドシートの共有設定を適切に管理してください
3. **GPTs公開範囲**: 「Only me」推奨（家族との共有なら「Anyone with a link」）

### 推奨設定
- スプレッドシート: 自分のみアクセス可能
- GPTs: Only me（自分のみ）
- Apps Script: アクセス権限は「全員」必須（APIとして機能させるため）

---

## 運用のコツ

### 定期的なメンテナンス
- 月に1回程度、スプレッドシートのデータをバックアップ
- 不要なレシートデータは定期的にアーカイブシートに移動

### 効率的な利用方法
1. **連続撮影**: 複数のレシートをまとめて撮影してから一気に処理
2. **カテゴリ修正**: 最初に登録後、まとめてカテゴリを修正
3. **月次集計**: スプレッドシートのピボットテーブル機能で月次分析

### データ分析の活用
スプレッドシートで以下の分析が可能:
- カテゴリ別支出グラフ
- 店舗別利用頻度
- 月別支出推移
- 消費税合計

**例: ピボットテーブルの作成**
1. データ範囲を選択
2. 「挿入」→「ピボットテーブル」
3. 行: カテゴリ、値: 合計金額の合計

---

## ファイル構成

```
receipt_scan_gpts/
├── gas/
│   └── receipt_processor.gs          # Google Apps Scriptコード
├── gpts/
│   ├── instructions.md                # GPTsカスタム指示文
│   └── actions_schema.json            # GPTs Actionsスキーマ
├── docs/
│   └── sample_receipt_template.xlsx   # サンプルシートテンプレート
└── SETUP_GUIDE.md                     # このファイル
```

---

## サポート

問題が解決しない場合は、以下を確認:
1. Apps Scriptの実行ログ（「表示」→「ログ」）
2. スプレッドシートのID、デプロイURLが正しいか
3. GPTs Actionsの設定が正しくインポートされているか

---

## 更新履歴

- **v1.0.0** (2025-10-22): 初版リリース
  - レシート画像解析機能
  - Google Spreadsheet自動記録
  - 基本的なカテゴリ分類

---

以上でセットアップ完了です！快適なレシート管理をお楽しみください 📊
