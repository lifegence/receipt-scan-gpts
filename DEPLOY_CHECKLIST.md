# デプロイ確認チェックリスト

## 🚨 現在の状態

Apps Script が **古いバージョン** のままデプロイされています。
Ultimate版に更新する必要があります。

---

## ✅ 必須手順

### Step 1: Apps Script コード更新

1. [Apps Script エディタ](https://script.google.com/home) を開く
2. プロジェクト「レシートスキャナーAPI」を開く
3. **既存のコードを全て削除**
4. `gas/receipt_processor_ultimate.gs` の内容を **全てコピー＆ペースト**
5. `Ctrl+S` (Mac: `Cmd+S`) で **保存**

### Step 2: バージョン確認

コードに以下が含まれているか確認:
```javascript
version: "2.0.0-ultimate"
```

この行があれば Ultimate 版です。

### Step 3: 新バージョンでデプロイ

**重要**: 既存のデプロイを更新します

1. 「デプロイ」→「デプロイを管理」をクリック
2. 既存のデプロイの **鉛筆アイコン（編集）** をクリック
3. 「バージョン」ドロップダウンを開く
4. **「新バージョン」** を選択（重要！）
5. 設定を確認:
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員** ← 必須
6. 「デプロイ」をクリック

### Step 4: デプロイ確認

ターミナルで以下を実行（このリポジトリで）:

```bash
curl -s "https://script.google.com/macros/s/AKfycbwCJMWjm3uhxSkAphvWPxNVdVj6RjnIjgufEjEeZ_7A8ZqwGGq1PYNWCJcrokHHJW08/exec"
```

**正しい結果**:
```json
{"success":true,"message":"Receipt Scanner API is running","version":"2.0.0-ultimate"}
```

**間違った結果**:
```html
<HTML><TITLE>Moved Temporarily</TITLE>...
```
→ まだ古いバージョンがデプロイされています

---

## 🔍 トラブルシューティング

### Q: 「新バージョン」が選択できない

A: コードを保存していない可能性があります
1. `Ctrl+S` で保存
2. 再度デプロイを試行

### Q: デプロイしたのにまだ HTML エラーが返る

A: キャッシュの問題の可能性
1. 数分待つ（GAS のキャッシュクリアに時間がかかる場合）
2. または **完全に新規デプロイ** を作成:
   - 「デプロイ」→「新しいデプロイ」
   - 種類: ウェブアプリ
   - アクセス: 全員
   - 新しい URL を GPTs Actions に設定

### Q: GPTs でまだエラーが出る

A: 以下を順番に確認
1. ✅ Apps Script が Ultimate 版か
2. ✅ 新バージョンでデプロイしたか
3. ✅ GET テストで `"version":"2.0.0-ultimate"` が返るか
4. ✅ GPTs Actions Schema が `actions_schema_ultimate.json` か
5. ✅ GPTs Actions の URL が正しいか

---

## 📋 完全チェックリスト

- [ ] Apps Script コード → Ultimate 版に更新
- [ ] コードを保存 (`Ctrl+S`)
- [ ] デプロイ管理 → 鉛筆アイコン → 新バージョン
- [ ] アクセス権限 = 「全員」を確認
- [ ] デプロイ実行
- [ ] GET テストで version 確認
- [ ] GPTs Actions Schema → Ultimate 版に更新
- [ ] GPTs で実際にテスト

全て完了したら、もう一度 GPTs でレシート登録を試してください。
