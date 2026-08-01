import { useLekhana } from "../editor/context";

/** Simple horizontal ruler aligned to the page width. */
export function Ruler() {
  const { doc, zoom } = useLekhana();
  const widths: Record<string, number> = {
    a4: 794, letter: 816, legal: 612, a5: 559,
  };
  const pageW = widths[doc.pageSize] || 794;
  const orientW = doc.orientation === "landscape" ? (doc.pageSize === "legal" ? 1286 : doc.pageSize === "a5" ? 793 : doc.pageSize === "letter" ? 1056 : 1123) : pageW;
  const leftMM = doc.margins.left;
  const rightMM = doc.margins.right;
  const pxPerMm = 96 / 25.4;
  const left = leftMM * pxPerMm;
  const right = rightMM * pxPerMm;
  const ticks = [];
  const usable = orientW - left - right;
  const tickCount = 24;
  for (let i = 0; i <= tickCount; i++) {
    ticks.push((i / tickCount) * usable);
  }

  return (
    <div className="lk-ruler h-6 border-b border-gray-200 bg-white flex items-end overflow-hidden shrink-0 select-none" style={{ paddingLeft: 16 }}>
      <div className="relative h-full" style={{ width: orientW * zoom }}>
        <div className="absolute inset-0 flex" style={{ paddingLeft: left, paddingRight: right }}>
          {ticks.map((_x, i) => (
            <div key={i} className="flex-1 border-l border-gray-300 relative" style={{ height: i % 2 === 0 ? 14 : 8 }}>
              {i % 2 === 0 && (
                <span className="absolute left-1 -top-0.5 text-[9px] text-gray-400">{i * 5}</span>
              )}
            </div>
          ))}
        </div>
        {/* margin markers */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400" style={{ left }} />
        <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400" style={{ left: orientW * zoom - right }} />
      </div>
    </div>
  );
}
