import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import katex from "katex";
const App = () => {
  const [latexCode, setLatexCode] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [renderedLatex, setRenderedLatex] = useState("");
  const dropdownRef = useRef(null);
  const clearButtonRef = useRef(null);

  const clearEditor = () => {
    setLatexCode("");
    setRenderedLatex("");
    const res = window.confirm("Are You Sure?");
    if (res === true) {
      if (clearButtonRef.current) {
        clearButtonRef.current.blur();
      }
    }
  };

  const downloadLatex = (format) => {
    const filename = `latex-preview.${format}`;
    const previewContent = document.getElementById("preview-content");

    if (format === "txt") {
      const blob = new Blob([previewContent.innerText], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } else if (format === "pdf") {
      html2pdf().from(previewContent).save(filename);
    }

    setIsDropdownOpen(false);
  };

  const renderLatex = (code) => {
    try {
      const rendered = katex.renderToString(code, {
        throwOnError: false,
      });
      setRenderedLatex(rendered);
    } catch (error) {
      console.error("KaTeX rendering error:", error);
      setRenderedLatex("");
    }
  };

  useEffect(() => {
    renderLatex(latexCode);
  }, [latexCode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="w-full bg-gray-100 flex items-center justify-between shadow p-4">
        <div className="flex-1 flex justify-center">
          <h2 className="text-3xl font-bold">LaTeX Editor</h2>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              ref={clearButtonRef}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={clearEditor}
            >
              Clear
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Download
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-md">
                  <button
                    className="w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100"
                    onClick={() => downloadLatex("txt")}
                  >
                    Download in .txt
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100"
                    onClick={() => downloadLatex("pdf")}
                  >
                    Download as .pdf
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <h2 className="text-3xl font-bold">Preview</h2>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-1/2 h-full p-4 border-r-2 border-gray-300 flex items-center justify-center">
          <textarea
            className="w-11/12 h-5/6 border border-gray-300 p-2 rounded-lg"
            placeholder="Write your LaTeX code here..."
            value={latexCode}
            onChange={(e) => setLatexCode(e.target.value)}
          />
        </div>

        <div className="w-1/2 h-full p-4 bg-gray-50 flex items-center justify-center">
          <div
            className="w-11/12 h-5/6 overflow-auto border border-gray-300 p-4 bg-white"
            id="preview-content"
            dangerouslySetInnerHTML={{ __html: renderedLatex }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
