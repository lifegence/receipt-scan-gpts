#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec"

# Test data (convenience store receipt)
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
echo "Google Apps Script Webhook Test"
echo "================================================"
echo ""
echo "Sending to: $WEBHOOK_URL"
echo ""
echo "Sending data:"
echo "$TEST_DATA" | jq '.'
echo ""
echo "Sending..."
echo ""

# Send POST request
RESPONSE=$(curl -s -L -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA")

echo "================================================"
echo "Response:"
echo "================================================"
echo "$RESPONSE" | jq '.'
echo ""

# Check result
if echo "$RESPONSE" | jq -e '.statusCode == 200' > /dev/null 2>&1; then
  echo "✅ Success: Data has been registered to the spreadsheet"
  echo ""
  echo "Please check your spreadsheet:"
  echo "https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit"
else
  echo "❌ Error: Failed to register data"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check if the Webhook URL is correct"
  echo "2. Check if Google Apps Script is properly deployed"
  echo "3. Check if SPREADSHEET_ID is correctly set"
fi

echo ""
