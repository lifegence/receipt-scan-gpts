# Testing Guide

Receipt Scanner GPTs Operation Verification Procedures

## Test Environment Verification

### Prerequisites
- [ ] Google Spreadsheet is created
- [ ] Apps Script is deployed
- [ ] GPTs is created
- [ ] GPTs Actions URL is correctly set

---

## Phase 1: Apps Script Unit Test

### 1-1. Execute Test Function

1. Open Apps Script editor
2. Select `testAddReceipt` from function dropdown
3. Click "Run" button
4. Check execution log:
```
{
  rowNumber: 2,
  timestamp: "2025-10-22T12:34:56.789Z",
  message: "Receipt data has been registered"
}
```

### 1-2. Verify Spreadsheet

1. Open Google Spreadsheet
2. "レシート一覧" (Receipt List) sheet is automatically created
3. Header row + test data row exist

**Expected Result:**
| 登録日時 | 購入日 | 店舗名 | カテゴリ | 合計金額 | 消費税 | 支払方法 | 商品明細 | メモ |
|---------|--------|--------|---------|---------|--------|---------|---------|------|
| 2025-10-22 XX:XX | 2025-10-22 | Seven-Eleven | 食費 | ¥1,234 | ¥91 | 現金 | [{"name":"Rice Ball"...}] | Test data |

---

## Phase 2: API Endpoint Test

### 2-1. Test with curl (Optional)

**GET Request (Health Check):**
```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Receipt Scanner API is running"
}
```

**POST Request (Data Registration):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-22",
    "store": "Lawson",
    "category": "食費",
    "total": 500,
    "tax": 37,
    "paymentMethod": "電子マネー"
  }' \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "rowNumber": 3,
    "timestamp": "2025-10-22T12:34:56.789Z",
    "message": "Receipt data has been registered"
  }
}
```

### 2-2. Check Apps Script Logs

If errors occur:
1. Apps Script editor → "View" → "Logs"
2. Check error messages
3. Debug as needed

---

## Phase 3: GPTs Integration Test

### 3-1. Test Scenario 1: Basic Image Upload

**Steps:**
1. Open GPTs
2. Upload simple text receipt image (handwritten note is OK)
3. GPTs reads the content
4. Enter "Please register"

**Expected Behavior:**
- GPTs extracts and displays receipt content
- After user confirmation, API is called
- "✅ Registration to spreadsheet completed!" message appears
- Row number is displayed

**Checklist:**
- [ ] Image can be uploaded
- [ ] Store name is correctly extracted
- [ ] Amount is correctly extracted
- [ ] Date is correctly extracted
- [ ] API is called successfully
- [ ] Data is recorded to spreadsheet

### 3-2. Test Scenario 2: Item Details Extraction

**Steps:**
1. Upload receipt image with clear item details
2. Instruct "Please also extract item details in detail"
3. Review content and register

**Expected Behavior:**
- items array contains multiple products
- Product name, price, and quantity are correct
- Recorded in JSON format in column H of spreadsheet

**Checklist:**
- [ ] Multiple items are extracted
- [ ] Product names are accurate
- [ ] Price and quantity match
- [ ] Recorded in JSON format

### 3-3. Test Scenario 3: Data Correction

**Steps:**
1. Upload receipt image
2. Review data extracted by GPTs
3. Instruct "Please change category to daily goods"
4. Register with corrected data

**Expected Behavior:**
- GPTs corrects the data
- Displays corrected content again
- Registers with correct data

**Checklist:**
- [ ] Understands user's correction instructions
- [ ] Data is correctly updated
- [ ] Registers with corrected data

### 3-4. Test Scenario 4: Unclear Image

**Steps:**
1. Upload blurry or dark receipt image
2. Check GPTs response

**Expected Behavior:**
- Mentions unreadable items
- Prompts for manual input
- Can register even with partial data

**Checklist:**
- [ ] Indicates unknown items
- [ ] Prompts for manual input
- [ ] Does not stop with error

---

## Phase 4: Error Handling Test

### 4-1. Invalid Data Transmission

**Test Content:**
Send invalid JSON to Apps Script doPost function

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d 'invalid json' \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

**Expected Response:**
```json
{
  "statusCode": 500,
  "message": "Internal Server Error: ..."
}
```

### 4-2. Data Without Required Fields

**Test Content:**
Send data without store name or amount

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"notes": "Test"}' \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid data format"
}
```

### 4-3. Incorrect Spreadsheet ID

**Test Content:**
Change `SPREADSHEET_ID` in Apps Script to invalid ID and execute

**Expected Behavior:**
- Error log records "Exception: Spreadsheet not found" etc.
- statusCode 500 error response

---

## Phase 5: Performance Test

### 5-1. Continuous Registration Test

**Steps:**
1. Upload 5 receipt images continuously in GPTs
2. Register each one

**Checklist:**
- [ ] All are registered successfully
- [ ] Spreadsheet row numbers are consecutive
- [ ] Response time does not become extremely slow

### 5-2. Large Item Details Test

**Steps:**
1. Upload receipt image with 20+ items
2. Instruct to extract all items

**Checklist:**
- [ ] All items are extracted
- [ ] Not blocked by JSON string length limit
- [ ] Successfully recorded to spreadsheet

---

## Phase 6: Security Test

### 6-1. Access Permission Verification

**Test Content:**
Access API endpoint with a different Google account

**Expected Behavior:**
- Succeeds if "Who has access: Anyone" is set
- Spreadsheet itself is viewable only by original account

### 6-2. SQL Injection-like Input

**Test Content:**
Send data with special characters in store name

```json
{
  "store": "'; DROP TABLE--",
  "total": 1000
}
```

**Expected Behavior:**
- Processed as normal string
- Registered without error (safe because Apps Script doesn't use SQL)

---

## Test Checklist

### Basic Functions
- [ ] Apps Script works standalone
- [ ] API endpoint responds
- [ ] Can upload images from GPTs
- [ ] Data is extracted correctly
- [ ] Recorded to spreadsheet

### Data Quality
- [ ] Store name is accurate
- [ ] Amount is accurate
- [ ] Date is in correct format
- [ ] Category classification is appropriate
- [ ] Item details are detailed

### Error Handling
- [ ] Returns error for invalid data
- [ ] Handles unclear images
- [ ] Appropriate message on API error

### Usability
- [ ] Confirmation process is clear
- [ ] Correction instructions are understood
- [ ] Registration completion is clearly notified

### Security
- [ ] Spreadsheet access permissions are appropriate
- [ ] Personal information is protected
- [ ] No issues with invalid input

---

## Troubleshooting

### GPTs Doesn't Call API

**Possible Causes:**
1. Actions settings are wrong
2. Deployment URL is wrong
3. Actions not saved

**Solution:**
1. Check GPTs "Configure" → "Actions"
2. Verify URL in Schema is correct
3. Click "Save" to re-save

### Not Recorded to Spreadsheet

**Possible Causes:**
1. SPREADSHEET_ID is wrong
2. No sheet creation permission
3. API call succeeded but data not visible

**Solution:**
1. Check SPREADSHEET_ID in Apps Script logs
2. Run testAddReceipt function to verify permissions
3. Reload spreadsheet

### GPTs Cannot Read Image

**Possible Causes:**
1. Image is unclear
2. Vision API limitations
3. Japanese receipt recognition accuracy

**Solution:**
1. Retake photo in bright location
2. Ensure entire receipt fits in frame
3. Prompt for manual data entry

---

## Testing with Sample Data

Sample data for testing is available in `docs/sample_data.json`.

**Test Example with curl:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d @docs/sample_data.json \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

Or in Apps Script:
```javascript
function testWithSampleData() {
  const sampleData = {
    "date": "2025-10-22",
    "store": "Seven-Eleven Tokyo Station",
    "category": "食費",
    "total": 1234,
    "tax": 91,
    "paymentMethod": "電子マネー",
    "items": [
      {"name": "Rice Ball (Plum)", "price": 120, "quantity": 2},
      {"name": "Salad Chicken", "price": 298, "quantity": 1}
    ],
    "notes": "Breakfast and lunch"
  };

  const result = addReceiptToSheet(sampleData);
  Logger.log(result);
}
```

---

Testing complete! Once all checklist items are cleared, you can start production operation!
