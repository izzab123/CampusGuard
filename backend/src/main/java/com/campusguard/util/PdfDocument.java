package com.campusguard.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Clean, lightweight, dependency-free PDF-1.4 Document Generator.
 * Conforms to ISO 32000-1 specification and produces standard, valid PDF documents
 * that render crisply in Adobe Acrobat Reader, Google Chrome, Mozilla Firefox,
 * Microsoft Edge, Apple Safari, and macOS Preview.
 */
public class PdfDocument {

    public static final float PAGE_WIDTH = 612f;   // US Letter Width
    public static final float PAGE_HEIGHT = 792f;  // US Letter Height
    public static final float MARGIN_LEFT = 36f;
    public static final float MARGIN_RIGHT = 576f;
    public static final float CONTENT_WIDTH = MARGIN_RIGHT - MARGIN_LEFT; // 540 pt

    private final List<StringBuilder> pageStreams = new ArrayList<>();
    private StringBuilder currentStream;

    public PdfDocument() {
        newPage();
    }

    public void newPage() {
        currentStream = new StringBuilder();
        pageStreams.add(currentStream);
    }

    public int getPageCount() {
        return pageStreams.size();
    }

    public void fillRect(float x, float y, float width, float height, float r, float g, float b) {
        currentStream.append(String.format(java.util.Locale.US, "%.3f %.3f %.3f rg\n", r, g, b));
        currentStream.append(String.format(java.util.Locale.US, "%.2f %.2f %.2f %.2f re f\n", x, y, width, height));
    }

    public void strokeRect(float x, float y, float width, float height, float r, float g, float b, float lineWidth) {
        currentStream.append(String.format(java.util.Locale.US, "%.2f w\n", lineWidth));
        currentStream.append(String.format(java.util.Locale.US, "%.3f %.3f %.3f RG\n", r, g, b));
        currentStream.append(String.format(java.util.Locale.US, "%.2f %.2f %.2f %.2f re S\n", x, y, width, height));
    }

    public void drawLine(float x1, float y1, float x2, float y2, float r, float g, float b, float lineWidth) {
        currentStream.append(String.format(java.util.Locale.US, "%.2f w\n", lineWidth));
        currentStream.append(String.format(java.util.Locale.US, "%.3f %.3f %.3f RG\n", r, g, b));
        currentStream.append(String.format(java.util.Locale.US, "%.2f %.2f m %.2f %.2f l S\n", x1, y1, x2, y2));
    }

    public void drawText(String font, float size, float x, float y, String text, float r, float g, float b) {
        if (text == null || text.isEmpty()) return;
        String safeText = escapePdfString(text);

        currentStream.append("BT\n");
        currentStream.append("/").append(font).append(" ").append(String.format(java.util.Locale.US, "%.2f", size)).append(" Tf\n");
        currentStream.append(String.format(java.util.Locale.US, "%.3f %.3f %.3f rg\n", r, g, b));
        currentStream.append(String.format(java.util.Locale.US, "1 0 0 1 %.2f %.2f Tm\n", x, y));
        currentStream.append("(").append(safeText).append(") Tj\n");
        currentStream.append("ET\n");
    }

    private String escapePdfString(String text) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '\\' || c == '(' || c == ')') {
                sb.append('\\').append(c);
            } else if (c >= 32 && c <= 126) {
                sb.append(c);
            } else if (c == '\n' || c == '\r' || c == '\t') {
                sb.append(' ');
            } else {
                // Approximate or replace non-ASCII characters to keep Type 1 font encoding safe
                switch (c) {
                    case '•' -> sb.append("*");
                    case '–', '—' -> sb.append("-");
                    case '“', '”' -> sb.append("\"");
                    case '‘', '’' -> sb.append("'");
                    default -> sb.append('?');
                }
            }
        }
        return sb.toString();
    }

    public byte[] buildPdf() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        List<Long> offsets = new ArrayList<>();

        // 1. Header
        out.write("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n".getBytes(StandardCharsets.ISO_8859_1));

        int pageCount = pageStreams.size();

        // Object IDs allocation:
        // 1: Catalog
        // 2: Pages
        // 3 .. 3 + pageCount - 1: Page objects
        // (3 + pageCount) .. (3 + pageCount * 2 - 1): Content stream objects
        // Next: Font F1 (Helvetica)
        // Next: Font F2 (Helvetica-Bold)
        // Next: Font F3 (Helvetica-Oblique)

        int catalogObjId = 1;
        int pagesObjId = 2;
        int firstPageObjId = 3;
        int firstStreamObjId = firstPageObjId + pageCount;
        int fontF1ObjId = firstStreamObjId + pageCount;
        int fontF2ObjId = fontF1ObjId + 1;
        int fontF3ObjId = fontF2ObjId + 1;
        int totalObjects = fontF3ObjId;

        // Object 0 offset is always 0
        offsets.add(0L);

        // 1: Catalog
        offsets.add((long) out.size());
        out.write(String.format("%d 0 obj\n<< /Type /Catalog /Pages %d 0 R >>\nendobj\n", catalogObjId, pagesObjId).getBytes(StandardCharsets.ISO_8859_1));

        // 2: Pages
        offsets.add((long) out.size());
        StringBuilder kids = new StringBuilder("[");
        for (int p = 0; p < pageCount; p++) {
            kids.append(firstPageObjId + p).append(" 0 R ");
        }
        kids.append("]");
        out.write(String.format("%d 0 obj\n<< /Type /Pages /Kids %s /Count %d >>\nendobj\n", pagesObjId, kids.toString(), pageCount).getBytes(StandardCharsets.ISO_8859_1));

        // Page objects
        for (int p = 0; p < pageCount; p++) {
            int pageId = firstPageObjId + p;
            int streamId = firstStreamObjId + p;
            offsets.add((long) out.size());
            String pageDef = String.format(
                    "%d 0 obj\n" +
                    "<< /Type /Page /Parent %d 0 R\n" +
                    "   /MediaBox [0 0 %.2f %.2f]\n" +
                    "   /Contents %d 0 R\n" +
                    "   /Resources << /Font << /F1 %d 0 R /F2 %d 0 R /F3 %d 0 R >> >>\n" +
                    ">>\nendobj\n",
                    pageId, pagesObjId, PAGE_WIDTH, PAGE_HEIGHT, streamId, fontF1ObjId, fontF2ObjId, fontF3ObjId
            );
            out.write(pageDef.getBytes(StandardCharsets.ISO_8859_1));
        }

        // Content stream objects
        for (int p = 0; p < pageCount; p++) {
            int streamId = firstStreamObjId + p;
            offsets.add((long) out.size());
            byte[] streamBytes = pageStreams.get(p).toString().getBytes(StandardCharsets.ISO_8859_1);
            String streamHeader = String.format("%d 0 obj\n<< /Length %d >>\nstream\n", streamId, streamBytes.length);
            out.write(streamHeader.getBytes(StandardCharsets.ISO_8859_1));
            out.write(streamBytes);
            out.write("\nendstream\nendobj\n".getBytes(StandardCharsets.ISO_8859_1));
        }

        // Font F1 (Helvetica)
        offsets.add((long) out.size());
        out.write(String.format("%d 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n", fontF1ObjId).getBytes(StandardCharsets.ISO_8859_1));

        // Font F2 (Helvetica-Bold)
        offsets.add((long) out.size());
        out.write(String.format("%d 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n", fontF2ObjId).getBytes(StandardCharsets.ISO_8859_1));

        // Font F3 (Helvetica-Oblique)
        offsets.add((long) out.size());
        out.write(String.format("%d 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n", fontF3ObjId).getBytes(StandardCharsets.ISO_8859_1));

        // Xref table
        long xrefOffset = out.size();
        out.write(String.format("xref\n0 %d\n", totalObjects + 1).getBytes(StandardCharsets.ISO_8859_1));
        out.write("0000000000 65535 f \n".getBytes(StandardCharsets.ISO_8859_1));
        for (int i = 1; i <= totalObjects; i++) {
            long off = offsets.get(i);
            out.write(String.format("%010d 00000 n \n", off).getBytes(StandardCharsets.ISO_8859_1));
        }

        // Trailer
        String trailer = String.format(
                "trailer\n<< /Size %d /Root %d 0 R >>\nstartxref\n%d\n%%%%EOF\n",
                totalObjects + 1, catalogObjId, xrefOffset
        );
        out.write(trailer.getBytes(StandardCharsets.ISO_8859_1));

        return out.toByteArray();
    }
}
