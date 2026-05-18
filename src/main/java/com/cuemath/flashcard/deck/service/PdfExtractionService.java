package com.cuemath.flashcard.deck.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Slf4j
public class PdfExtractionService {

    private static final int MAX_CHARS = 60_000;

    public String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);

            if (text == null || text.isBlank())
                throw new IllegalArgumentException("PDF contains no extractable text. Is it a scanned image?");

            text = sanitizeText(text);

            if (text.length() > MAX_CHARS) {
                log.warn("PDF text truncated from {} to {} chars", text.length(), MAX_CHARS);
                text = text.substring(0, MAX_CHARS);
            }
            return text.strip();
        } catch (IOException e) {
            log.error("Failed to extract text from PDF", e);
            throw new IllegalArgumentException("Could not read PDF file: " + e.getMessage(), e);
        }
    }

    private String sanitizeText(String text) {
        return text
                // Math operators
                .replace("≠", "!=")
                .replace("≤", "<=")
                .replace("≥", ">=")
                .replace("≈", "~=")
                .replace("≡", "===")
                .replace("∝", "proportional to")
                .replace("∞", "infinity")
                // Set notation
                .replace("∈", "in")
                .replace("∉", "not in")
                .replace("⊂", "subset of")
                .replace("⊆", "subset of or equal to")
                .replace("⊃", "superset of")
                .replace("∪", "union")
                .replace("∩", "intersection")
                .replace("∅", "empty set")
                // Calculus / logic
                .replace("∑", "sum")
                .replace("∏", "product")
                .replace("∫", "integral")
                .replace("∂", "d")
                .replace("√", "sqrt")
                .replace("∀", "for all")
                .replace("∃", "there exists")
                .replace("∄", "there does not exist")
                .replace("∇", "nabla")
                // Arrows
                .replace("→", "->")
                .replace("←", "<-")
                .replace("↔", "<->")
                .replace("⇒", "=>")
                .replace("⇐", "<=")
                .replace("⇔", "<=>")
                // Greek letters (commonly extracted from LaTeX PDFs)
                .replace("α", "alpha")
                .replace("β", "beta")
                .replace("γ", "gamma")
                .replace("Γ", "Gamma")
                .replace("δ", "delta")
                .replace("Δ", "Delta")
                .replace("ε", "epsilon")
                .replace("ζ", "zeta")
                .replace("η", "eta")
                .replace("θ", "theta")
                .replace("Θ", "Theta")
                .replace("λ", "lambda")
                .replace("Λ", "Lambda")
                .replace("μ", "mu")
                .replace("ν", "nu")
                .replace("ξ", "xi")
                .replace("π", "pi")
                .replace("Π", "Pi")
                .replace("ρ", "rho")
                .replace("σ", "sigma")
                .replace("Σ", "Sigma")
                .replace("τ", "tau")
                .replace("φ", "phi")
                .replace("Φ", "Phi")
                .replace("χ", "chi")
                .replace("ψ", "psi")
                .replace("Ψ", "Psi")
                .replace("ω", "omega")
                .replace("Ω", "Omega")
                // Typographic punctuation
                .replace("\u201C", "\"").replace("\u201D", "\"")  // curly double quotes
                .replace("\u2018", "'").replace("\u2019", "'")    // curly single quotes
                .replace("\u2014", " - ")                         // em dash
                .replace("\u2013", "-")                           // en dash
                .replace("\u2022", "*")                           // bullet
                .replace("\u00B7", "*")                           // middle dot
                // Strip anything still outside Latin-1 (Helvetica-safe range)
                .replaceAll("[^\\x09\\x0A\\x0D\\x20-\\xFF]", "?");
    }
}