#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/AKfycbwCJMWjm3uhxSkAphvWPxNVdVj6RjnIjgufEjEeZ_7A8ZqwGGq1PYNWCJcrokHHJW08/exec"

# 引数チェック
if [ $# -eq 0 ]; then
  echo "使い方:"
  echo "  $0 <サンプル番号>"
  echo ""
  echo "利用可能なサンプル:"
  echo "  1: コンビニレシート"
  echo "  2: スーパーマーケット"
  echo "  3: ドラッグストア"
  echo "  4: 交通費"
  echo "  5: カフェ"
  echo "  6: 書店"
  echo "  7: 最小限のデータ"
  echo ""
  echo "例: $0 1"
  exit 1
fi

SAMPLE_NUM=$1

# サンプルデータを取得
case $SAMPLE_NUM in
  1)
    DATA=$(cat docs/sample_data.json | jq '.samples[0].request')
    NAME="コンビニレシート"
    ;;
  2)
    DATA=$(cat docs/sample_data.json | jq '.samples[1].request')
    NAME="スーパーマーケット"
    ;;
  3)
    DATA=$(cat docs/sample_data.json | jq '.samples[2].request')
    NAME="ドラッグストア"
    ;;
  4)
    DATA=$(cat docs/sample_data.json | jq '.samples[3].request')
    NAME="交通費"
    ;;
  5)
    DATA=$(cat docs/sample_data.json | jq '.samples[4].request')
    NAME="カフェ"
    ;;
  6)
    DATA=$(cat docs/sample_data.json | jq '.samples[5].request')
    NAME="書店"
    ;;
  7)
    DATA=$(cat docs/sample_data.json | jq '.samples[6].request')
    NAME="最小限のデータ"
    ;;
  *)
    echo "エラー: 無効なサンプル番号: $SAMPLE_NUM"
    exit 1
    ;;
esac

echo "================================================"
echo "レシートデータ送信: $NAME"
echo "================================================"
echo ""
echo "送信データ:"
echo "$DATA" | jq '.'
echo ""
echo "送信中..."

# POSTリクエストを送信（リダイレクトなし）
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$DATA" > /dev/null 2>&1

echo ""
echo "✅ 送信完了"
echo ""
echo "スプレッドシートで確認:"
echo "https://docs.google.com/spreadsheets/d/14nYsYSAcjsJQG3gSAMq3CwTs8TKYSckysDKzhUrd8v0/edit?gid=0#gid=0"
echo ""
