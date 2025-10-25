'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'

export default function MarkdownGuide() {
  const [open, setOpen] = useState(false)

  const rowHeading =
    'font-semibold mb-2 text-primary uppercase tracking-wider text-xs'
  const itemHeading =
    'font-semibold text-secondary uppercase tracking-wider text-[0.65rem] mb-1'

  return (
    <div className="border border-primary/60 rounded-md overflow-hidden bg-background mb-4 transition-all">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-ternary/10 hover:bg-ternary/20 transition-colors"
      >
        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-sm">
          <Info size={18} />
          <span>MARKDOWN GUIDE</span>
        </div>
        {open ? (
          <ChevronDown size={18} className="text-primary" />
        ) : (
          <ChevronRight size={18} className="text-primary" />
        )}
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="p-4 text-sm font-sans text-foreground bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
            {/* 1. Text Styles */}
            <div>
              <h3 className={rowHeading}>TEXT STYLES</h3>

              <div>
                <div className={itemHeading}>EMPHASIS</div>
                <p>*italic*</p>
                <p>**bold**</p>
                <p>***bold italic***</p>
                <p>~~strikethrough~~</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>HEADINGS</div>
                <p># Heading 1 (largest)</p>
                <p>## Heading 2</p>
                <p>### Heading 3</p>
                <p>#### Heading 4</p>
                <p>##### Heading 5</p>
                <p>###### Heading 6 (smallest)</p>
              </div>
            </div>

            {/* 2. Lists */}
            <div>
              <h3 className={rowHeading}>LISTS</h3>

              <div>
                <div className={itemHeading}>UNORDERED</div>
                <p>- Item 1</p>
                <p>&nbsp;&nbsp;- Subitem 1.1</p>
                <p>- Item 2</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>ORDERED</div>
                <p>1. Step One</p>
                <p>&nbsp;&nbsp;1. Step 1.1</p>
                <p>2. Step Two</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>TASK LISTS</div>
                <p>- [x] Completed</p>
                <p>- [ ] Incomplete</p>
                <p>- [ ] Another item</p>
              </div>
            </div>

            {/* 3. Links and Quotes */}
            <div>
              <h3 className={rowHeading}>LINKS & EMBEDS</h3>

              <div>
                <div className={itemHeading}>LINK</div>
                <p>
                  [Display Text](https://website.com/)
                </p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>IMAGE</div>
                <p>![Alt Text](https://photo.png/)</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>QUOTE</div>
                <p>&gt; Quoting text.</p>
                <p>&gt;</p>
                <p>&gt; Multiple lines supported.</p>
              </div>
            </div>

            {/* 4. Special */}
            <div>
              <h3 className={rowHeading}>SPECIAL</h3>

              <div>
                <div className={itemHeading}>INLINE CODE</div>
                <p>`int x = 10`</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>CODE BLOCK</div>
                <p>```c++</p>
                <p>for (int i = 0; i &lt; 10; i++) &#123;</p>
                <p>&nbsp;&nbsp;sum += i;</p>
                <p>&#125;</p>
                <p>```</p>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>TABLE</div>
                <pre className="bg-ternary/10 border border-ternary/40 p-1 rounded text-xs">
                  | x     | x^2     | x^3   |{'\n'}
                  |-------|---------|-------|{'\n'}
                  | 1     | 1       |   1   |{'\n'}
                  | 2     | 4       |   8   |
                </pre>
              </div>

              <div className="mt-3">
                <div className={itemHeading}>HORIZONTAL LINE</div>
                <p>---</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
