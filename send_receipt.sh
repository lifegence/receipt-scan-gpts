#!/bin/bash

# Google Apps Script Webhook URL
WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec"

# Check arguments
if [ $# -eq 0 ]; then
  echo "Usage:"
  echo "  $0 <sample number>"
  echo ""
  echo "Available samples:"
  echo "  1: Convenience store receipt"
  echo "  2: Supermarket"
  echo "  3: Drugstore"
  echo "  4: Transportation"
  echo "  5: Cafe"
  echo "  6: Bookstore"
  echo "  7: Minimal data"
  echo ""
  echo "Example: $0 1"
  exit 1
fi

SAMPLE_NUM=$1

# Get sample data
case $SAMPLE_NUM in
  1)
    DATA=$(cat docs/sample_data.json | jq '.samples[0].request')
    NAME="Convenience store receipt"
    ;;
  2)
    DATA=$(cat docs/sample_data.json | jq '.samples[1].request')
    NAME="Supermarket"
    ;;
  3)
    DATA=$(cat docs/sample_data.json | jq '.samples[2].request')
    NAME="Drugstore"
    ;;
  4)
    DATA=$(cat docs/sample_data.json | jq '.samples[3].request')
    NAME="Transportation"
    ;;
  5)
    DATA=$(cat docs/sample_data.json | jq '.samples[4].request')
    NAME="Cafe"
    ;;
  6)
    DATA=$(cat docs/sample_data.json | jq '.samples[5].request')
    NAME="Bookstore"
    ;;
  7)
    DATA=$(cat docs/sample_data.json | jq '.samples[6].request')
    NAME="Minimal data"
    ;;
  *)
    echo "Error: Invalid sample number: $SAMPLE_NUM"
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
