#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/AKfycbwCJMWjm3uhxSkAphvWPxNVdVj6RjnIjgufEjEeZ_7A8ZqwGGq1PYNWCJcrokHHJW08/exec"

# テストデータ（コンビニレシート）
TEST_DATA='{
  "date": "2025-10-22",
  "store": "セブンイレブン 東京駅前店",
  "category": "食費",
  "total": 1234,
  "tax": 91,
  "paymentMethod": "電子マネー",
  "items": [
    {
      "name": "おにぎり 梅",
      "price": 120,
      "quantity": 2
    },
    {
      "name": "サラダチキン",
      "price": 298,
      "quantity": 1
    },
    {
      "name": "お茶 500ml",
      "price": 150,
      "quantity": 1
    },
    {
      "name": "コーヒー",
      "price": 120,
      "quantity": 1
    }
  ],
  "notes": "朝食と昼食分"
}'

echo "================================================"
echo "Google Apps Script Webhook テスト"
echo "================================================"
echo ""
echo "送信先: $WEBHOOK_URL"
echo ""
echo "送信データ:"
echo "$TEST_DATA" | jq '.'
echo ""
echo "送信中..."
echo ""

# POSTリクエストを送信
RESPONSE=$(curl -s -L -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA")

echo "================================================"
echo "レスポンス:"
echo "================================================"
echo "$RESPONSE" | jq '.'
echo ""

# 結果の確認
if echo "$RESPONSE" | jq -e '.statusCode == 200' > /dev/null 2>&1; then
  echo "✅ 成功: データがスプレッドシートに登録されました"
  echo ""
  echo "スプレッドシートを確認してください:"
  echo "https://docs.google.com/spreadsheets/d/14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0/edit?gid=0#gid=0"
else
  echo "❌ エラー: データの登録に失敗しました"
  echo ""
  echo "トラブルシューティング:"
  echo "1. Webhook URL が正しいか確認"
  echo "2. Google Apps Script が正しくデプロイされているか確認"
  echo "3. SPREADSHEET_ID が正しく設定されているか確認"
fi

echo ""
