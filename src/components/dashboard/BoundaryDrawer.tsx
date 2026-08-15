import { Trash2, Check, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import type { FarmBoundary, GeoJSONPolygon } from '../../services/sentinel2Service';
import { createFarmBoundary } from '../../services/sentinel2Service';

type BoundaryDrawerProps = {
  onBoundarySave: (boundary: FarmBoundary) => void;
  farmId: string;
  centerLat?: number;
  centerLon?: number;
};

type Point = [number, number]; // [longitude, latitude]

/**
 * BoundaryDrawer - Map-based polygon drawing component
 * Allows farmers to draw farm boundaries as polygons
 */
export function BoundaryDrawer({
  onBoundarySave,
  farmId,
  centerLat = 20.5937,
  centerLon = 78.9629,
}: BoundaryDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(12);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Calculate pixel position from lat/lon
  const latLonToPixel = (lat: number, lon: number): [number, number] => {
    const canvas = canvasRef.current;
    if (!canvas) return [0, 0];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Rough conversion based on zoom level
    const pixelsPerDegree = (256 / (360 / Math.pow(2, zoom))) / 256;
    const x = centerX + (lon - centerLon) * pixelsPerDegree * 256;
    const y = centerY + (lat - centerLat) * pixelsPerDegree * 256;

    return [x, y];
  };

  // Calculate lat/lon from pixel position
  const pixelToLatLon = (x: number, y: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return [centerLat, centerLon];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pixelsPerDegree = (256 / (360 / Math.pow(2, zoom))) / 256;
    const lon = centerLon + (x - centerX) / (pixelsPerDegree * 256);
    const lat = centerLat + (y - centerY) / (pixelsPerDegree * 256);

    return [lat, lon];
  };

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw center point
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw polygon
    if (points.length > 0) {
      ctx.strokeStyle = '#34d399';
      ctx.fillStyle = 'rgba(52, 211, 153, 0.1)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      const [firstX, firstY] = latLonToPixel(points[0][0], points[0][1]);
      ctx.moveTo(firstX, firstY);

      for (let i = 1; i < points.length; i++) {
        const [x, y] = latLonToPixel(points[i][0], points[i][1]);
        ctx.lineTo(x, y);
      }

      // Close polygon if we have at least 3 points
      if (points.length >= 3) {
        ctx.lineTo(firstX, firstY);
        ctx.fill();
      }
      ctx.stroke();

      // Draw points
      points.forEach((point, index) => {
        const [x, y] = latLonToPixel(point[0], point[1]);
        ctx.fillStyle = hoveredPoint === index ? '#fbbf24' : '#34d399';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw point label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${index + 1}`, x + 8, y);
      });
    }
  }, [points, hoveredPoint, zoom, centerLat, centerLon, latLonToPixel]);

  const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const [lat, lon] = pixelToLatLon(x, y);
    setPoints((current) => [...current, [lat, lon]]);

    toast.success(`Point ${points.length + 1} added to boundary.`);
  };

  const handleCanvasMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if hovering over any point
    let hoveredIdx = -1;
    for (let i = 0; i < points.length; i++) {
      const [px, py] = latLonToPixel(points[i][0], points[i][1]);
      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (distance < 8) {
        hoveredIdx = i;
        break;
      }
    }

    setHoveredPoint(hoveredIdx >= 0 ? hoveredIdx : null);
  };

  const handleRemovePoint = (index: number) => {
    setPoints((current) => current.filter((_, i) => i !== index));
    toast.success('Point removed.');
  };

  const handleReset = () => {
    setPoints([]);
    toast.success('Boundary cleared.');
  };

  const handleSave = () => {
    if (points.length < 3) {
      toast.error('At least 3 points are required to define a boundary.');
      return;
    }

    // Create polygon (ensure it's closed)
    const coordinates: number[][][] = [
      [...points.map(([lat, lon]) => [lon, lat]), [points[0][1], points[0][0]]],
    ];

    const geometry: GeoJSONPolygon = {
      type: 'Polygon',
      coordinates,
    };

    const boundary = createFarmBoundary(geometry, farmId);
    onBoundarySave(boundary);

    toast.success('Farm boundary saved successfully!');
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((current) => (direction === 'in' ? Math.min(current + 1, 18) : Math.max(current - 1, 1)));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
          className={`h-[400px] w-full cursor-crosshair rounded-[1.2rem] border border-white/10 bg-slate-900 ${isDrawing ? '' : 'opacity-60'}`}
        />

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="rounded-lg border border-white/10 bg-slate-950/70 p-2 text-emerald-300 transition hover:bg-slate-950"
            title="Zoom in"
          >
            <ZoomIn className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="rounded-lg border border-white/10 bg-slate-950/70 p-2 text-emerald-300 transition hover:bg-slate-950"
            title="Zoom out"
          >
            <ZoomOut className="size-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
          {isDrawing ? (
            <>
              <p>
                <span className="text-emerald-300">Click</span> to add boundary points
              </p>
              <p className="text-slate-400">Minimum 3 points required</p>
            </>
          ) : (
            <p className="text-slate-400">Click "Start Drawing" to begin</p>
          )}
        </div>
      </div>

      {/* Points list */}
      {points.length > 0 && (
        <div className="rounded-[1.1rem] border border-white/10 bg-slate-950/60 p-3">
          <p className="mb-2 text-sm font-semibold text-white">Boundary Points ({points.length})</p>
          <div className="max-h-[150px] space-y-1 overflow-y-auto">
            {points.map((point, index) => (
              <div key={index} className="flex items-center justify-between rounded border border-white/5 bg-white/5 px-2 py-1 text-xs text-slate-300">
                <span>
                  Point {index + 1}: {point[0].toFixed(4)}°, {point[1].toFixed(4)}°
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePoint(index)}
                  className="text-red-400 transition hover:text-red-300"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsDrawing(!isDrawing)}
          className={`flex-1 rounded-[1.1rem] border px-4 py-2 text-sm font-medium transition ${
            isDrawing
              ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/15'
              : 'border-emerald-400/20 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20'
          }`}
        >
          {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>

        {points.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <Trash2 className="size-4" />
              Reset
            </button>
          </>
        )}
      </div>

      {points.length >= 3 && (
        <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-500/10 p-3">
          <p className="text-sm text-emerald-200">
            Boundary ready to save: {points.length} points defined. Area information will be calculated when saved.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="mt-3 w-full rounded-[1rem] border border-emerald-400/20 bg-emerald-500/20 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30"
          >
            <Check className="mr-2 inline size-4" />
            Save Boundary
          </button>
        </div>
      )}
    </div>
  );
}
