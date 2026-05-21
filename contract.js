const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer, Header, TabStopType, TabStopPosition,
  VerticalAlign
} = require('docx');
const fs = require('fs');
const path = require('path');

const ROSE = "D4537E";
const DARK = "1A110D";
const GOLD = "C8A96E";
const LIGHT_GREY = "F5F0E8";
const MID_GREY = "E8DDD4";
const TEXT = "2A1A12";
const MUTED = "6B5B4E";

const border = { style: BorderStyle.SINGLE, size: 1, color: "DDCCBB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const today = new Date();
const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

// Helper: section heading
function sectionHeading(text, num) {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROSE, space: 4 } },
    children: [
      new TextRun({ text: `${num}.  ${text}`, bold: true, size: 26, color: DARK, font: "Arial" })
    ]
  });
}

// Helper: body paragraph
function body(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 100 },
    children: [
      new TextRun({ text, size: 21, color: TEXT, font: "Arial", ...options })
    ]
  });
}

// Helper: bullet item
function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 21, color: TEXT, font: "Arial" })]
  });
}

// Helper: sub-bullet
function subBullet(text) {
  return new Paragraph({
    numbering: { reference: "subbullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, color: MUTED, font: "Arial" })]
  });
}

// Helper: label + value row
function labelValue(label, value) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 21, color: DARK, font: "Arial" }),
      new TextRun({ text: value, size: 21, color: TEXT, font: "Arial" })
    ]
  });
}

function spacer(size = 160) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun("")] });
}

// Info table row
function infoRow(label, valueText, colWidths = [2200, 7160]) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: colWidths[0], type: WidthType.DXA },
        shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: DARK, font: "Arial" })] })]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: colWidths[1], type: WidthType.DXA },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: valueText, size: 20, color: TEXT, font: "Arial" })] })]
      })
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 280 } } }
        }]
      },
      {
        reference: "subbullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u25E6",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1000, hanging: 280 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 280 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: TEXT } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROSE, space: 6 } },
            spacing: { after: 0 },
            children: [
              new TextRun({ text: "THE URBAN CHARM", bold: true, size: 20, color: ROSE, font: "Arial" }),
              new TextRun({ text: "   |   Manufacturing Agreement   |   Confidential", size: 18, color: MUTED, font: "Arial" })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: ROSE, space: 4 } },
            spacing: { before: 0 },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: "theurbancharm.in  |  TheUrbanCharm001@gmail.com  |  +91 935 457 8878", size: 16, color: MUTED, font: "Arial" }),
              new TextRun({ text: "\tPage ", size: 16, color: MUTED, font: "Arial" }),
              PageNumber.CURRENT
            ]
          })
        ]
      })
    },
    children: [

      // ── TITLE BLOCK ──────────────────────────────────────────────────────
      spacer(200),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "MANUFACTURING AGREEMENT", bold: true, size: 44, color: DARK, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Private Label Garment Manufacturing — Terms & Conditions", size: 22, color: MUTED, font: "Arial", italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 320 },
        children: [new TextRun({ text: `Effective Date: ${dateStr}`, size: 20, color: ROSE, font: "Arial" })]
      }),

      // ── PARTIES TABLE ────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "PARTIES TO THIS AGREEMENT", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [4600, 4906],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 4600, type: WidthType.DXA },
                shading: { fill: DARK, type: ShadingType.CLEAR },
                margins: { top: 160, bottom: 160, left: 200, right: 200 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "MANUFACTURER", bold: true, size: 18, color: ROSE, font: "Arial" })] }),
                  spacer(60),
                  new Paragraph({ children: [new TextRun({ text: "The Urban Charm", bold: true, size: 22, color: "FFFFFF", font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "New Ajanta Park, Khoda Colony", size: 19, color: "BBBBBB", font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "Ghaziabad, Uttar Pradesh — 201309", size: 19, color: "BBBBBB", font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "India", size: 19, color: "BBBBBB", font: "Arial" })] }),
                  spacer(60),
                  new Paragraph({ children: [new TextRun({ text: "theurbancharm.in", size: 19, color: ROSE, font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "TheUrbanCharm001@gmail.com", size: 19, color: ROSE, font: "Arial" })] }),
                ]
              }),
              new TableCell({
                borders,
                width: { size: 4906, type: WidthType.DXA },
                shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR },
                margins: { top: 160, bottom: 160, left: 200, right: 200 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "CLIENT", bold: true, size: 18, color: ROSE, font: "Arial" })] }),
                  spacer(60),
                  new Paragraph({ children: [new TextRun({ text: "Name: ___________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Company: ________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Address: ________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "         ________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Country: ________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Email:    ________________________________", size: 20, color: TEXT, font: "Arial" })] }),
                ]
              })
            ]
          })
        ]
      }),

      spacer(240),

      // ── 1. SCOPE ─────────────────────────────────────────────────────────
      sectionHeading("SCOPE OF AGREEMENT", 1),
      body("This Agreement governs all manufacturing engagements between The Urban Charm (Manufacturer) and the Client, including but not limited to sampling, pattern making, bulk production, and associated services. This Agreement applies to all orders regardless of quantity."),
      body("Each confirmed order shall be treated as a separate work order under the terms set out herein. No separate order form is required; confirmation via email or WhatsApp constitutes acceptance of these terms."),

      spacer(80),

      // ── 2. SAMPLING ──────────────────────────────────────────────────────
      sectionHeading("SAMPLING PROCESS & CHARGES", 2),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "2.1  Pattern Making", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [3200, 2400, 3906],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Service", bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Charge", bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3906, type: WidthType.DXA }, shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Adjustable Against", bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Sample pattern — 1 size (Single item)", size: 20, color: TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "\u20B9 1,000", bold: true, size: 20, color: ROSE, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3906, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Adjusted against bulk production", size: 20, color: TEXT, font: "Arial" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Sample pattern — 1 size (Set/Co-ord)", size: 20, color: TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "\u20B9 1,500", bold: true, size: 20, color: ROSE, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3906, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Adjusted against bulk production", size: 20, color: TEXT, font: "Arial" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Full grading — 5 sizes (Single item)", size: 20, color: TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "\u20B9 2,000", bold: true, size: 20, color: ROSE, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3906, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Includes \u20B91,000 sample cost", size: 20, color: TEXT, font: "Arial" })] })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Full grading — 5 sizes (Set/Co-ord)", size: 20, color: TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "\u20B9 3,000", bold: true, size: 20, color: ROSE, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3906, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: "Includes \u20B91,500 sample cost", size: 20, color: TEXT, font: "Arial" })] })] }),
            ]
          }),
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "2.2  Additional Sampling Charges", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("Sampling charges include fabric cost + pattern making as stated above. Trim and accessory costs (buttons, zippers, elastic, etc.) are charged separately as per actuals."),
      bullet("Shipping of the physical sample to the Client is charged at actuals (DHL/FedEx/Speed Post) and is payable by the Client."),
      bullet("If the sample is rejected due to a change in the Client's requirements (not a manufacturing error), a fresh sampling charge will apply."),
      bullet("If the sample is rejected due to a manufacturing error on the Manufacturer's part, a revised sample will be produced at no additional cost."),
      bullet("Sample charges are adjusted against the bulk production invoice. If the Client does not place a bulk order after sample approval, sampling charges are non-refundable."),

      spacer(80),

      // ── 3. PAYMENT TERMS ─────────────────────────────────────────────────
      sectionHeading("PAYMENT TERMS", 3),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "3.1  Sampling Stage", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("50% of fabric cost is payable as advance before fabric is sourced."),
      bullet("Remaining 50% of fabric cost + pattern making charges are payable before sampling commences."),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "3.2  Bulk Production Stage", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("50% of total order value (fabric + CMT + accessories) is payable as advance before production begins."),
      bullet("Balance payment terms vary by shipment mode:"),
      subBullet("International — Sea Freight: 30% payable before dispatch. Remaining 20% payable upon delivery against the Bill of Lading (Bilty)."),
      subBullet("International — Air Freight: 50% balance payable before dispatch."),
      subBullet("Domestic (India): 50% balance payable before dispatch."),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "3.3  Currency", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("Domestic orders: Invoiced and payable in Indian Rupees (INR)."),
      bullet("International orders: Invoiced and payable in United States Dollars (USD) unless otherwise agreed in writing."),
      bullet("Payment via bank wire transfer (T/T). Bank details shared on order confirmation."),

      spacer(80),

      // ── 4. CANCELLATION ──────────────────────────────────────────────────
      sectionHeading("CANCELLATION POLICY", 4),
      body("Cancellations are subject to the following conditions:"),
      bullet("Cancellation before fabric sourcing: Full advance refund, less any administrative charges."),
      bullet("Cancellation after fabric is sourced but before production: Fabric cost is non-refundable as fabric may have been cut or trimmed specifically for the order."),
      bullet("Cancellation after sample approval and bulk production has commenced: No cancellation is permitted. The Client's advance is forfeited. The Manufacturer will make reasonable efforts to minimise further costs but the Client remains liable for work completed to date."),
      bullet("The Manufacturer reserves the right to cancel any order in case of non-payment of advance within 7 working days of order confirmation."),

      spacer(80),

      // ── 5. QUALITY & INSPECTION ──────────────────────────────────────────
      sectionHeading("QUALITY CONTROL & INSPECTION", 5),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "5.1  Production Standard", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("All bulk production is carried out to match the approved sample. The approved sample serves as the quality benchmark for the order."),
      bullet("A tolerance of 1\u20135% on construction, stitching, and finish is accepted as an industry standard in bulk garment production."),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "5.2  Fabric Disputes", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("Fabric quality, texture, weight (GSM), and colour are confirmed at the sampling stage."),
      bullet("Once the sample has been approved by the Client, fabric-related disputes during or after bulk production will not be entertained, as the fabric used in bulk production is the same as approved in sampling."),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "5.3  Client Inspection", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("The Client may request a pre-dispatch inspection at the Manufacturer's facility in Ghaziabad, India, at a mutually agreed date and time."),
      bullet("The Manufacturer will share photographic and/or video evidence of finished goods before dispatch for remote approval."),
      bullet("Once goods leave the Manufacturer's premises, the Manufacturer's quality liability ceases."),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [new TextRun({ text: "5.4  Post-Dispatch Claims", bold: true, size: 22, color: DARK, font: "Arial" })]
      }),
      bullet("Any quality claims must be raised within 7 days of receipt of goods, supported with photographs or video evidence."),
      bullet("Claims will not be entertained for issues attributable to improper storage, washing, handling, or use by the Client or end consumer."),

      spacer(80),

      // ── 6. QUANTITY VARIANCE ─────────────────────────────────────────────
      sectionHeading("QUANTITY VARIANCE", 6),
      body("The Manufacturer sources fabric in rolls rather than loose cuts. Due to the nature of roll-based fabric sourcing:"),
      bullet("Knitted fabrics (T-shirts, hoodies, co-ords, etc.) are sourced in fixed-weight rolls. The number of garments yielded per roll may vary and is not a fixed guaranteed quantity."),
      bullet("Woven fabrics (nightwear, dresses, sets, etc.) can be partially cut from a roll only where the remaining balance represents a significant difference in quantity. Minor differences (e.g. 3\u20135 metres from a 50m roll) may not be feasible due to vendor constraints."),
      bullet("Final delivered quantities may vary by \u00B15\u201310 pieces from the confirmed order quantity. This is standard practice in garment manufacturing and will be communicated to the Client before dispatch."),
      bullet("The Client agrees to accept the delivered quantity within this variance range. Invoicing will be based on actual delivered pieces."),

      spacer(80),

      // ── 7. INTELLECTUAL PROPERTY ─────────────────────────────────────────
      sectionHeading("INTELLECTUAL PROPERTY & CONFIDENTIALITY", 7),
      bullet("All design files, tech packs, patterns, artworks, brand assets, and specifications provided by the Client remain the exclusive intellectual property of the Client."),
      bullet("The Manufacturer agrees not to reproduce, share, sell, or use the Client's designs, patterns, or brand assets for any purpose other than fulfilling the Client's order."),
      bullet("The Manufacturer will not manufacture identical designs for any third party without prior written consent from the Client."),
      bullet("The Client's pricing, order details, and business information will be kept strictly confidential and not disclosed to any third party."),
      bullet("The Manufacturer may use general product photographs (without brand identification) for portfolio or marketing purposes unless the Client expressly requests otherwise in writing."),

      spacer(80),

      // ── 8. LEAD TIMES ────────────────────────────────────────────────────
      sectionHeading("LEAD TIMES", 8),
      bullet("Sample lead time: 1\u20133 weeks from confirmation of design, fabric, and advance payment."),
      bullet("Bulk production lead time: 6\u201330 days after sample approval and receipt of advance payment, depending on order quantity, style complexity, and customisations."),
      bullet("Lead times are estimates and may be affected by factors outside the Manufacturer's control including fabric sourcing delays, public holidays, or force majeure events. The Manufacturer will notify the Client promptly of any delays."),

      spacer(80),

      // ── 9. SHIPPING & EXPORT ─────────────────────────────────────────────
      sectionHeading("SHIPPING, FREIGHT & EXPORT DOCUMENTATION", 9),
      bullet("Shipping charges are borne by the Client and are not included in production pricing unless expressly agreed otherwise."),
      bullet("The Manufacturer will arrange freight on the Client's behalf via trusted freight forwarders. All freight charges will be communicated before booking."),
      bullet("Export documentation including commercial invoice, packing list, Certificate of Origin, and airway bill or bill of lading will be provided by the Manufacturer."),
      bullet("Customs duties, import taxes, and any regulatory charges at the destination country are the sole responsibility of the Client."),
      bullet("The Manufacturer's export hub is IGI Airport, Delhi (air freight) and JNPT Mumbai Port (sea freight)."),

      spacer(80),

      // ── 10. GOVERNING LAW ────────────────────────────────────────────────
      sectionHeading("GOVERNING LAW & DISPUTE RESOLUTION", 10),
      bullet("This Agreement shall be governed by and construed in accordance with the laws of India."),
      bullet("Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts of Ghaziabad, Uttar Pradesh, India."),
      bullet("In the event of a dispute, both parties agree to attempt resolution through good-faith negotiation before initiating formal legal proceedings."),

      spacer(80),

      // ── 11. GENERAL ──────────────────────────────────────────────────────
      sectionHeading("GENERAL PROVISIONS", 11),
      bullet("This Agreement constitutes the entire understanding between the parties and supersedes all prior communications."),
      bullet("Amendments to this Agreement must be made in writing and agreed by both parties."),
      bullet("If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force."),
      bullet("Neither party shall be liable for delays or failures caused by circumstances beyond reasonable control (force majeure) including natural disasters, government actions, or supply chain disruptions."),

      spacer(240),

      // ── SIGNATURE BLOCK ──────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 0, after: 120 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: ROSE, space: 6 } },
        children: [new TextRun({ text: "SIGNATURES", bold: true, size: 24, color: DARK, font: "Arial" })]
      }),
      body("By signing below, both parties agree to the terms and conditions set out in this Agreement."),
      spacer(160),

      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [4600, 4906],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: noBorders,
                width: { size: 4600, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 0, right: 200 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "FOR THE URBAN CHARM", bold: true, size: 20, color: DARK, font: "Arial" })] }),
                  spacer(280),
                  new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 2, color: MUTED } }, children: [new TextRun({ text: "Signature", size: 18, color: MUTED, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Shivam Sharma — Founder", size: 20, color: TEXT, font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "The Urban Charm, Ghaziabad, India", size: 18, color: MUTED, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Date: ___________________", size: 20, color: TEXT, font: "Arial" })] }),
                ]
              }),
              new TableCell({
                borders: noBorders,
                width: { size: 4906, type: WidthType.DXA },
                margins: { top: 100, bottom: 100, left: 200, right: 0 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "FOR THE CLIENT", bold: true, size: 20, color: DARK, font: "Arial" })] }),
                  spacer(280),
                  new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 2, color: MUTED } }, children: [new TextRun({ text: "Signature", size: 18, color: MUTED, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Name: ___________________________", size: 20, color: TEXT, font: "Arial" })] }),
                  new Paragraph({ children: [new TextRun({ text: "Designation: _____________________", size: 18, color: MUTED, font: "Arial" })] }),
                  spacer(80),
                  new Paragraph({ children: [new TextRun({ text: "Date: ___________________", size: 20, color: TEXT, font: "Arial" })] }),
                ]
              })
            ]
          })
        ]
      }),

      spacer(240),

      // ── FOOTER NOTE ──────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        shading: { fill: LIGHT_GREY, type: ShadingType.CLEAR },
        children: [
          new TextRun({ text: "This is a draft document for review. Please contact TheUrbanCharm001@gmail.com for any amendments before signing.", size: 17, color: MUTED, italics: true, font: "Arial" })
        ]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outputPath = path.join(process.cwd(), 'TheUrbanCharm_Manufacturing_Agreement.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Saved to:', outputPath);
});