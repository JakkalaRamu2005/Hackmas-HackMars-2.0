"use client";

import { motion } from "framer-motion";
import { Send, UploadCloud } from "lucide-react";
import { useState } from "react";

interface SyllabusInputProps {
    onGenerate: (text: string) => void;
    isGenerating: boolean;
    error?: string;
}

export const SyllabusInput = ({ onGenerate, isGenerating, error }: SyllabusInputProps) => {
    const [text, setText] = useState("");
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onGenerate(text);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }

        setUploadedFile(file);
        setIsExtracting(true);

        try {
            // Dynamic import to avoid SSR issues
            const pdfjsLib = await import("pdfjs-dist");

            // Set worker path using unpkg CDN
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let extractedText = "";

            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                extractedText += pageText + "\n\n";
            }

            setText(extractedText.trim());
            setIsExtracting(false);
        } catch (err) {
            console.error("Error reading PDF:", err);
            setIsExtracting(false);

            // Fallback: just show filename and let user paste manually
            setText(`📄 Uploaded: ${file.name}\n\nPlease paste your syllabus content below:`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            {/* Decorative Lights */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 opacity-50" />

            <h3 className="text-2xl text-white font-bold mb-4 font-[family-name:var(--font-christmas)] tracking-wide">
                🎅 Paste your Exam Syllabus
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                        ❌ {error}
                    </div>
                )}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: Physics Final on Jan 10 covering Newton's Laws, Thermodynamics, and Wave Motion..."
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-christmas-gold resize-none transition-all"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="pdf-upload"
                            disabled={isGenerating || isExtracting}
                        />
                        <label
                            htmlFor="pdf-upload"
                            className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${isExtracting
                                ? "text-christmas-gold animate-pulse"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>
                                {isExtracting
                                    ? "Extracting PDF..."
                                    : uploadedFile
                                        ? `📄 ${uploadedFile.name}`
                                        : "Or upload PDF"}
                            </span>
                        </label>
                        {uploadedFile && !isExtracting && (
                            <button
                                type="button"
                                onClick={() => {
                                    setUploadedFile(null);
                                    setText("");
                                }}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!text.trim() || isGenerating}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${text.trim() && !isGenerating
                            ? "bg-christmas-gold text-christmas-green hover:shadow-[0_0_20px_rgba(248,178,41,0.5)] transform hover:-translate-y-1"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <span className="animate-spin">❄️</span> Building Workshop...
                            </>
                        ) : (
                            <>
                                Generate Calendar <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
