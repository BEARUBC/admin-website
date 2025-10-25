import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

export default function MarkdownGuide() {
    const [open, setOpen] = useState(false);

    return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-3 bg-[#f5f6fa] hover:bg-[#e9ecf3] transition-colors"
            >
                <div className="flex items-center gap-2 text-[#152248] font-semibold">
                    <Info size={18} />
                    <span>MarkDown Guide</span>
                </div>
                {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {/* Collapsible content */}
            {open && (
                <div className="p-4 text-sm font-sans">
                    {/* Divider */}
                    <div className="border-t border-gray-300 mb-4"></div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        {/* Fonts */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Fonts</h3>
                            <p>*bold*</p>
                            <p>**italics**</p>
                            <p>***bold italics***</p>
                            <p>~~strikethrough~~</p>
                            <p className="mt-2"># Heading 1</p>
                            <p>## Heading 2</p>
                            <p>### Heading 3</p>
                            <p>#### Heading 4</p>
                        </div>

                        {/* Lists */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Lists</h3>
                            <p>Unordered List</p>
                            <p>- Item 1</p>
                            <p>&nbsp;&nbsp;- Item 1.1</p>
                            <p>- Item 2</p>
                            <p className="mt-2">Ordered List</p>
                            <p>1. Item 1</p>
                            <p>2. Item 2</p>
                            <p>3. Item 3</p>
                        </div>

                        {/* Hypertext */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Hypertext</h3>
                            <p>Link</p>
                            <p>[name](https://link)</p>
                            <p className="mt-2">Image</p>
                            <p>![alt text](https://img)</p>
                            <p className="mt-2">Quote</p>
                            <p>&gt; quote</p>
                        </div>

                        {/* Special */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Special</h3>
                            <p>`Inline Code`</p>
                            <p>```Code```</p>
                            <p className="mt-2">Table</p>
                            <pre className="bg-gray-100 p-1 rounded text-xs">
                                | x | x^2 |{"\n"}
                                |---|-----|{"\n"}
                                | 1 |  1  |{"\n"}
                                | 2 |  4  |
                            </pre>
                        </div>

                        {/* Design */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-700">Design</h3>
                            <p>Horizontal Bar</p>
                            <p>---</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
