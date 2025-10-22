#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec"

# Check arguments
if [ $# -eq 0 ]; then
  echo "Usage:"
  echo "  $0 <sample number>"
  echo ""
  echo "Available samples:"
  echo "  1: Convenience Store (English - US)"
  echo "  2: Supermarket (Japanese)"
  echo "  3: Pharmacy (Spanish)"
  echo "  4: Coffee Shop (French)"
  echo "  5: Bookstore (German)"
  echo "  6: Restaurant (Chinese)"
  echo "  7: Gas Station (English - UK)"
  echo "  8: Electronics (Korean)"
  echo "  9: Minimal data"
  echo " 10: No items"
  echo ""
  echo "Example: $0 1"
  exit 1
fi

SAMPLE_NUM=$1

# Get sample data
case $SAMPLE_NUM in
  1)
    DATA=$(cat docs/sample_data.json | jq '.samples[0].request')
    NAME="Convenience Store (English - US)"
    ;;
  2)
    DATA=$(cat docs/sample_data.json | jq '.samples[1].request')
    NAME="Supermarket (Japanese)"
    ;;
  3)
    DATA=$(cat docs/sample_data.json | jq '.samples[2].request')
    NAME="Pharmacy (Spanish)"
    ;;
  4)
    DATA=$(cat docs/sample_data.json | jq '.samples[3].request')
    NAME="Coffee Shop (French)"
    ;;
  5)
    DATA=$(cat docs/sample_data.json | jq '.samples[4].request')
    NAME="Bookstore (German)"
    ;;
  6)
    DATA=$(cat docs/sample_data.json | jq '.samples[5].request')
    NAME="Restaurant (Chinese)"
    ;;
  7)
    DATA=$(cat docs/sample_data.json | jq '.samples[6].request')
    NAME="Gas Station (English - UK)"
    ;;
  8)
    DATA=$(cat docs/sample_data.json | jq '.samples[7].request')
    NAME="Electronics (Korean)"
    ;;
  9)
    DATA=$(cat docs/sample_data.json | jq '.samples[8].request')
    NAME="Minimal data"
    ;;
  10)
    DATA=$(cat docs/sample_data.json | jq '.samples[9].request')
    NAME="No items"
    ;;
  *)
    echo "Error: Invalid sample number: $SAMPLE_NUM (1-10)"
    exit 1
    ;;
esac

echo "================================================"
echo "Sending receipt data: $NAME"
echo "================================================"
echo ""
echo "Sending data:"
echo "$DATA" | jq '.'
echo ""
echo "Sending..."

# Send POST request (no redirect)
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$DATA" > /dev/null 2>&1

echo ""
echo "✅ Sent successfully"
echo ""
echo "Check your spreadsheet:"
echo "https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit"
echo ""
