#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec"

# Test data (English convenience store receipt)
TEST_DATA='{
  "date": "2025-10-22",
  "store": "7-Eleven Times Square NYC",
  "category": "Food",
  "total": 12.99,
  "tax": 1.14,
  "paymentMethod": "Credit Card",
  "items": [
    {
      "name": "Sandwich - Turkey Club",
      "price": 5.99,
      "quantity": 1
    },
    {
      "name": "Bottled Water 16.9oz",
      "price": 1.99,
      "quantity": 2
    },
    {
      "name": "Chips - BBQ",
      "price": 2.99,
      "quantity": 1
    }
  ],
  "notes": "Lunch break"
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
