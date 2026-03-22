import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from models.resume import ResumeAnalysis


# ── Color palette ──────────────────────────────────────────────
PRIMARY    = colors.HexColor("#6366F1")   # Indigo
SUCCESS    = colors.HexColor("#10B981")   # Emerald
WARNING    = colors.HexColor("#F59E0B")   # Amber
DANGER     = colors.HexColor("#EF4444")   # Red
DARK       = colors.HexColor("#1E1B4B")   # Deep indigo
LIGHT_BG   = colors.HexColor("#F8F7FF")
GRAY       = colors.HexColor("#6B7280")
WHITE      = colors.white


def _score_color(score: int) -> colors.Color:
    if score >= 75:
        return SUCCESS
    if score >= 50:
        return WARNING
    return DANGER


def generate_pdf_report(analysis: ResumeAnalysis) -> bytes:
    """Generate a styled PDF report for a resume analysis and return bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # ── Header ──────────────────────────────────────────────────
    header_style = ParagraphStyle(
        "Header",
        parent=styles["Normal"],
        fontSize=28,
        textColor=WHITE,
        fontName="Helvetica-Bold",
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    sub_style = ParagraphStyle(
        "Sub",
        parent=styles["Normal"],
        fontSize=11,
        textColor=colors.HexColor("#C7D2FE"),
        alignment=TA_CENTER,
    )

    header_table = Table(
        [[Paragraph("ResumeBooster", header_style)],
         [Paragraph("Resume Analysis Report", sub_style)],
         [Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", sub_style)]],
        colWidths=[170 * mm],
    )
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), DARK),
        ("ROUNDEDCORNERS", [8]),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 8 * mm))

    # ── Score cards ─────────────────────────────────────────────
    score_label = ParagraphStyle(
        "ScoreLabel", parent=styles["Normal"],
        fontSize=10, textColor=GRAY, alignment=TA_CENTER, fontName="Helvetica"
    )
    score_value = ParagraphStyle(
        "ScoreValue", parent=styles["Normal"],
        fontSize=36, fontName="Helvetica-Bold", alignment=TA_CENTER
    )

    def score_cell(label, value):
        color = _score_color(value)
        val_style = ParagraphStyle(
            f"SV_{label}", parent=score_value, textColor=color
        )
        return [
            Paragraph(label, score_label),
            Paragraph(f"{value}/100", val_style),
        ]

    scores_data = [
        [Table([score_cell("RESUME SCORE", analysis.score)],
               colWidths=[75 * mm]),
         Table([score_cell("ATS SCORE", analysis.ats_score)],
               colWidths=[75 * mm])],
    ]
    scores_table = Table(scores_data, colWidths=[85 * mm, 85 * mm])
    scores_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#EEF2FF")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#ECFDF5")),
        ("ROUNDEDCORNERS", [6]),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("INNERGRID", (0, 0), (-1, -1), 0, colors.white),
    ]))
    elements.append(scores_table)
    elements.append(Spacer(1, 6 * mm))

    # ── Section helper ───────────────────────────────────────────
    section_title_style = ParagraphStyle(
        "SectionTitle", parent=styles["Normal"],
        fontSize=13, fontName="Helvetica-Bold",
        textColor=DARK, spaceAfter=4, spaceBefore=8
    )
    bullet_style = ParagraphStyle(
        "Bullet", parent=styles["Normal"],
        fontSize=10, leftIndent=12, spaceAfter=3,
        textColor=colors.HexColor("#374151")
    )

    def section(title, items, icon="•"):
        group = [
            HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB")),
            Spacer(1, 3 * mm),
            Paragraph(title, section_title_style),
        ]
        for item in items:
            group.append(Paragraph(f"{icon}  {item}", bullet_style))
        return KeepTogether(group)

    # ── Sections ─────────────────────────────────────────────────
    if analysis.missing_keywords:
        # Display as badge-like table
        elements.append(
            HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB"))
        )
        elements.append(Spacer(1, 3 * mm))
        elements.append(Paragraph("🔍  Missing Keywords", section_title_style))
        kw_data = [[
            Paragraph(f"  {kw}  ", ParagraphStyle(
                "KW", parent=styles["Normal"], fontSize=9,
                textColor=PRIMARY, fontName="Helvetica-Bold"
            ))
            for kw in analysis.missing_keywords
        ]]
        # Chunk into rows of 4
        keywords = analysis.missing_keywords
        for i in range(0, len(keywords), 4):
            row_kws = keywords[i:i + 4]
            row = [[
                Paragraph(
                    f"  {kw}  ",
                    ParagraphStyle("KW2", parent=styles["Normal"],
                                   fontSize=9, textColor=PRIMARY,
                                   fontName="Helvetica-Bold", alignment=TA_CENTER)
                )
            ] for kw in row_kws]
            # pad to 4 cols
            while len(row) < 4:
                row.append([Paragraph("", styles["Normal"])])
            kw_table = Table([row], colWidths=[40 * mm] * 4)
            kw_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EEF2FF")),
                ("ROUNDEDCORNERS", [4]),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("INNERGRID", (0, 0), (-1, -1), 2, WHITE),
                ("BOX", (0, 0), (-1, -1), 0, WHITE),
            ]))
            elements.append(kw_table)
            elements.append(Spacer(1, 2 * mm))

    if analysis.suggestions:
        elements.append(section("💡  Improvement Suggestions", analysis.suggestions, "→"))

    if analysis.interview_questions:
        elements.append(section("🎤  Likely Interview Questions", analysis.interview_questions, "Q"))

    # ── Footer ───────────────────────────────────────────────────
    elements.append(Spacer(1, 10 * mm))
    footer_table = Table(
        [[Paragraph(
            "Generated by ResumeBooster  •  resumebooster.ai  •  Confidential",
            ParagraphStyle("Footer", parent=styles["Normal"],
                           fontSize=8, textColor=GRAY, alignment=TA_CENTER)
        )]],
        colWidths=[170 * mm],
    )
    footer_table.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB")))
    elements.append(footer_table)

    doc.build(elements)
    return buffer.getvalue()
