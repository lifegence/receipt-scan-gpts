# Receipt Scanner GPTs

Automatically extract data from receipt images captured by smartphone and save to Google Spreadsheet

## Key Features

- Automatic receipt image reading
- Extraction of store name, date, amount, and item details
- Automatic recording to Google Spreadsheet
- Automatic category classification (food, daily goods, transportation, etc.)
- Detailed item recording

## System Architecture

```
📱 Smartphone Camera
    ↓
🤖 GPTs (ChatGPT)
    ↓ [Vision API]
    ↓
📊 Google Apps Script API
    ↓
📈 Google Spreadsheet
```

## Setup

For detailed instructions, please refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md).

### Quick Start

1. Create a Google Spreadsheet
2. Deploy `gas/receipt_processor.gs` to Apps Script
3. Create GPTs, configure `gpts/instructions.md` and `gpts/actions_schema.json`
4. Upload receipt images!

## How to Use

1. Open the GPTs
2. Upload a receipt image
3. Review the extracted data
4. Say "Please register"
5. Data is automatically recorded to the spreadsheet

## File Structure

```
receipt_scan_gpts/
├── gas/
│   └── receipt_processor.gs          # Google Apps Script code
├── gpts/
│   ├── instructions.md                # GPTs custom instructions
│   └── actions_schema.json            # GPTs Actions schema
├── SETUP_GUIDE.md                     # Detailed setup guide
└── README.md                          # This file
```

## Recorded Data

| Field | Description |
|------|------|
| Registration Date/Time | Data registration timestamp (automatic) |
| Purchase Date | Date on the receipt |
| Store Name | Store where purchased |
| Category | Food, Daily Goods, Transportation, Entertainment, Other |
| Total Amount | Total receipt amount |
| Tax | Tax amount |
| Payment Method | Cash, credit card, e-money, etc. |
| Item Details | Item name, price, quantity (JSON format) |
| Notes | Remarks |

## Customization

### Add Categories

You can add new categories by editing `gpts/instructions.md`.

### Add Columns

Edit the `addReceiptToSheet` and `createReceiptSheet` functions in `gas/receipt_processor.gs`.

For details, refer to the Customization section in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## Security

- Receipt images are not retained after processing
- Spreadsheet is accessible only by your Google account
- GPTs should be set to "Only me" (recommended)

## Troubleshooting

If you encounter any issues, please check the Troubleshooting section in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## License

MIT License

## Tech Stack

- **GPTs (ChatGPT)**: Image analysis and data extraction
- **Google Apps Script**: API endpoint
- **Google Spreadsheet**: Data storage

## Multilingual Support

The system supports receipt processing in multiple languages:
- **English** (US, UK)
- **Japanese** (日本語)
- **Spanish** (Español)
- **French** (Français)
- **German** (Deutsch)
- **Chinese** (中文)
- **Korean** (한국어)

Sample data for all supported languages is available in `docs/sample_data.json`.

## Contributing

Issues and Pull Requests are welcome.

## Created

2025-10-22
