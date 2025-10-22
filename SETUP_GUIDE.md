# Receipt Scanner GPTs Setup Guide

## Overview
This system analyzes receipt images taken with a smartphone using GPTs and automatically records the data to Google Spreadsheet.

## System Architecture
```
Smartphone Camera → GPTs (Image Analysis) → Google Apps Script API → Google Spreadsheet
```

---

## Setup Instructions

### Phase 1: Prepare Google Spreadsheet

#### 1-1. Create a New Spreadsheet
1. Open [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet from "Blank"
3. Rename it to something like "Receipt Manager"

#### 1-2. Get Spreadsheet ID
- Get from URL: `https://docs.google.com/spreadsheets/d/【This is the Spreadsheet ID】/edit`
- Note down this **Spreadsheet ID** (will be used later)

---

### Phase 2: Deploy Google Apps Script

#### 2-1. Open Apps Script Editor
1. In the spreadsheet top menu → "Extensions" → "Apps Script"
2. Apps Script editor opens in a new tab

#### 2-2. Paste the Code
1. Delete the default `function myFunction() {}`
2. Copy all contents of `gas/receipt_processor.gs`
3. Paste into the Apps Script editor

#### 2-3. Set Spreadsheet ID
```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // ← Replace with actual ID
```

**Example:**
```javascript
const SPREADSHEET_ID = '1a2B3c4D5e6F7g8H9i0JkLmNoPqRsTuVwXyZ';
```

#### 2-4. Save the Project
- Click the disk icon in the upper left, or press `Ctrl+S` (Mac: `Cmd+S`)
- Rename the project to something like "Receipt Scanner API"

#### 2-5. Test Run (Optional)
1. Select "testAddReceipt" from the function dropdown at the top of the editor
2. Click the "Run" button
3. On first run, authorization is required:
   - "Review permissions" → Select Google account
   - "Show Advanced" → "Go to Receipt Scanner API (unsafe)"
   - Click "Allow"
4. A "Receipts" sheet is created in the spreadsheet with test data

#### 2-6. Deploy as Web App
1. Click "Deploy" in the upper right → "New deployment"
2. Select "Web app" for type
3. Settings:
   - **Description**: "Receipt Scanner API v1"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone" (※Important)
4. Click "Deploy"
5. Authorize access again if prompted

#### 2-7. Get Deployment URL
1. The deployment completion screen shows the **"Web app URL"**
2. **Copy and save this URL** (will be used later)
   - Format: `https://script.google.com/macros/s/【Deployment ID】/exec`

---

### Phase 3: Create and Configure GPTs

#### 3-1. Open ChatGPT GPTs Creation Screen
1. Access [ChatGPT](https://chat.openai.com/)
2. Click "Explore GPTs" in the left sidebar
3. Click "Create" or "+ Create a GPT" in the upper right

#### 3-2. Configure Basic Information
Click the **Configure** tab and set the following:

**Name:**
```
Receipt Scanner
```

**Description:**
```
Analyzes receipt images taken with a smartphone and automatically records data to Google Spreadsheet
```

**Instructions:**
- Copy all contents of `gpts/instructions.md` and paste

**Conversation starters:**
Add the following:
```
📸 Please upload a receipt image
💰 Check recent expenses
📊 Category breakdown
❓ How to use
```

**Knowledge:**
- None (can be added later if needed)

**Capabilities:**
- ✅ Web Browsing: OFF
- ✅ DALL·E Image Generation: OFF
- ✅ Code Interpreter: OFF

#### 3-3. Configure Actions
1. Scroll to "Actions" section
2. Click "Create new action"

**Schema Configuration:**
1. Copy all contents of `gpts/actions_schema.json`
2. Paste into the Schema input field
3. **Important**: Replace the `servers` → `url` section with the **Deployment URL obtained in Phase 2-7**

**Example:**
```json
"servers": [
  {
    "url": "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXX/exec"
  }
]
```

**Important Notes:**
- Confirm that the URL ends with `/exec`
- Keep `"paths"` as `"/"` (do NOT change to `"/exec"`)

**Authentication:**
- Select "None" (Google Apps Script is already set to accessible by anyone)

**Privacy policy:**
- Leave blank (OK for personal use)

#### 3-4. Save GPTs
1. Click "Save" in the upper right
2. Select publishing settings:
   - **Only me**: Use by yourself only (recommended)
   - **Anyone with a link**: Anyone with the link
   - **Public**: Anyone can use (publish to GPT Store)
3. Click "Confirm"

---

### Phase 4: Test Operation

#### 4-1. Prepare Test Image
- Prepare an actual receipt or sample receipt image

#### 4-2. Upload Image in GPTs
1. Open the created "Receipt Scanner" GPTs
2. Upload receipt image via 📎 icon or drag & drop
3. GPTs analyzes the image and displays the content

#### 4-3. Confirm and Register Data
1. Review the extracted data
2. Request corrections if needed
3. Enter "Please register"
4. GPTs registers to Google Spreadsheet

#### 4-4. Check Spreadsheet
1. Open Google Spreadsheet
2. Confirm that a new row has been added to the "Receipts" sheet

---

## Troubleshooting

### Error: "Error talking to connector" or "Failed Outbound Call"

**This is a GPTs Actions connection error. Check the following in order:**

**Cause 1: Apps Script Version Update**
After updating the script, always deploy with a new version:
1. "Deploy" → "Manage deployments"
2. Pencil icon → "Version" → "New version"
3. Click "Deploy"

**Cause 2: Actions Schema Issue**
- Confirm you're using `gpts/actions_schema.json`
- Check that `operationId` is set to `addReceipt`

**Cause 3: Server URL Setting Error**
- Confirm the URL ends with `/exec`
  - ✅ Correct: `https://script.google.com/macros/s/AKfycbx.../exec`
  - ❌ Wrong: `https://script.google.com/macros/s/AKfycbx...`
- Check that the `"paths"` section is `"/"` (not `"/exec"`)

**Cause 4: Authentication Setting**
- Confirm Authentication is set to "None"
- Check that no API Key is set

**Cause 5: Apps Script Access Permissions**
- Apps Script → "Deploy" → "Manage deployments"
- Confirm "Who has access" is set to **"Anyone"** (this is most important!)

**Debug Method:**
1. Test directly from terminal:
```bash
curl -X POST "https://script.google.com/macros/s/【Your ID】/exec" \
  -H "Content-Type: application/json" \
  -d '{"store":"Test","total":1000}'
```
2. If no error → GAS side is normal → Review GPTs Actions settings
3. If error occurs → Check GAS deployment settings

---

### Error: "API call failed"

**Cause 1: Deployment URL is wrong**
- Check `servers.url` in `gpts/actions_schema.json`
- Re-confirm the correct URL from "Manage deployments" in Apps Script

**Cause 2: No execution permission for Apps Script**
- Run `testAddReceipt` in Apps Script editor to re-authorize

**Cause 3: Access permission is not "Anyone"**
- Apps Script → "Deploy" → "Manage deployments"
- Click pencil icon → Change "Who has access" to "Anyone"

### Error: "Spreadsheet not found"

**Cause: SPREADSHEET_ID is wrong**
- Check `SPREADSHEET_ID` in `receipt_processor.gs`
- Copy correct ID from spreadsheet URL

### Receipt image is not read correctly

**Solution:**
- Take the photo in a bright location
- Ensure entire receipt fits in frame
- Avoid blurry photos
- Avoid shadows

### GPTs doesn't extract "item details"

**Solution:**
- Explicitly instruct "Please also extract item details"
- Confirm receipt image is clear
- Check that item section is not cut off

---

## Customization Methods

### Add or Change Categories

**Edit instructions.md:**
```markdown
- Infer category from store name or item content
  - Convenience stores, supermarkets → Food
  - Drugstores → Daily Goods
  - Transportation-related → Transportation
  - Leisure facilities → Entertainment
  - Bookstores → Books        ← Added
  - Clothing stores → Clothing    ← Added
```

Update GPTs "Configure" → "Instructions"

### Add Columns to Spreadsheet

**Edit receipt_processor.gs:**

1. Add items to the `row` array in `addReceiptToSheet` function:
```javascript
const row = [
  timestamp,
  data.date || '',
  data.store || '',
  data.category || '',
  data.total || 0,
  data.tax || 0,
  data.paymentMethod || '',
  data.location || '',              // ← New: Store location
  JSON.stringify(data.items || []),
  data.notes || ''
];
```

2. Update headers in `createReceiptSheet` function:
```javascript
const headers = [
  'Registration Date',
  'Purchase Date',
  'Store Name',
  'Category',
  'Total Amount',
  'Tax',
  'Payment Method',
  'Store Location',    // ← Added
  'Item Details',
  'Notes'
];
```

3. In Apps Script, "Deploy" → "New deployment" to upgrade version

4. Also add the field to instructions.md and actions_schema.json

---

## Security Considerations

### Important Points
1. **Personal Information**: Receipts may contain personal information
2. **Access Control**: Properly manage spreadsheet sharing settings
3. **GPTs Publishing Scope**: "Only me" recommended (or "Anyone with a link" for family sharing)

### Recommended Settings
- Spreadsheet: Accessible only by yourself
- GPTs: Only me (yourself only)
- Apps Script: Access permission must be "Anyone" (required to function as API)

---

## Operational Tips

### Regular Maintenance
- Back up spreadsheet data about once a month
- Periodically move unnecessary receipt data to archive sheet

### Efficient Usage
1. **Continuous Shooting**: Take multiple receipts at once then process in batch
2. **Category Correction**: Register first, then correct categories in batch
3. **Monthly Summary**: Monthly analysis with spreadsheet pivot table feature

### Data Analysis Utilization
The following analyses are possible in spreadsheet:
- Category-based spending graph
- Store usage frequency
- Monthly spending trend
- Total consumption tax

**Example: Creating a Pivot Table**
1. Select data range
2. "Insert" → "Pivot table"
3. Row: Category, Value: Sum of total amount

---

## File Structure

```
receipt_scan_gpts/
├── gas/
│   └── receipt_processor.gs           # Google Apps Script code
├── gpts/
│   ├── instructions.md                 # GPTs custom instructions
│   └── actions_schema.json             # GPTs Actions schema
├── docs/
│   ├── sample_data.json                # Sample data collection
│   └── TESTING_GUIDE.md                # Testing guide
├── test_webhook.sh                     # Webhook connection test script
├── send_receipt.sh                     # Sample data sending script
├── SETUP_GUIDE.md                      # This file
└── README.md                           # Project overview
```

---

## Support

If the problem is not resolved, check the following:
1. Apps Script execution log ("View" → "Logs")
2. Spreadsheet ID and deployment URL are correct
3. GPTs Actions settings are imported correctly

---

## Update History

- **v1.2.0** (2025-10-22): Complete resolution of GPTs connection errors
  - Added `receipt_processor_gpts.gs` (response format optimized for GPTs)
  - Resolved redirect processing issues
  - Adopted simple success/error response format

- **v1.1.0** (2025-10-22): GPTs Actions compatibility improvement
  - Added `actions_schema_fixed.json` (resolved connection issues with GPTs)
  - Enhanced troubleshooting section
  - Added debug scripts (`test_webhook.sh`, `send_receipt.sh`)
  - Added CORS-compatible GAS script

- **v1.0.0** (2025-10-22): Initial release
  - Receipt image analysis function
  - Google Spreadsheet automatic recording
  - Basic category classification

---

Setup complete! Enjoy convenient receipt management 📊
