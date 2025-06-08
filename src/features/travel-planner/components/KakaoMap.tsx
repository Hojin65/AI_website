'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface MapMarker {
  lat: number
  lng: number
  name: string
  description: string
  order?: number
  day?: number
}

interface KakaoMapProps {
  center: { lat: number; lng: number }
  markers: MapMarker[]
  zoom?: number
  height?: string
  level?: number
  className?: string
}

// 날짜별 색상 팔레트
const DAY_COLORS = [
  '#2563eb', // 파랑
  '#e11d48', // 핑크
  '#059669', // 초록
  '#f59e42', // 주황
  '#a21caf', // 보라
  '#64748b', // slate
  '#facc15', // 노랑
];

export function KakaoMap({ center, markers, zoom = 13, height = "400px", level, className = "" }: KakaoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (!mapContainerRef.current) {
      setDebugInfo('❌ mapContainerRef.current 없음');
      return;
    }
    setDebugInfo('✅ mapContainerRef.current 있음, 지도 초기화 시도');
    let attempts = 0;
    const maxAttempts = 30;

    const checkSDKAndInit = () => {
      attempts++;
      if (typeof window === 'undefined' || !window.kakao || !window.kakao.maps || !window.kakao.maps.Map) {
        if (attempts < maxAttempts) {
          setTimeout(checkSDKAndInit, 500);
        } else {
          setError('카카오맵 SDK 로드 실패');
          setIsLoading(false);
        }
        return;
      }
      try {
        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level || zoom || 13,
        });
        mapInstanceRef.current = map;
        setIsLoading(false);
        setError('');
        setDebugInfo('✅ 지도 생성 성공');

        const dayGroups: Record<number, MapMarker[]> = {};
        markers.forEach((m) => {
          if (m.day && m.order) {
            if (!dayGroups[m.day]) dayGroups[m.day] = [];
            dayGroups[m.day].push(m);
          }
        });

        const overlays: any[] = [];
        const infoWindows: any[] = [];
        const markerObjs: any[] = [];
        let lastOpenInfo: any = null;
        let lastOpenIdx: string | null = null;

        Object.entries(dayGroups).forEach(([dayStr, dayMarkers]) => {
          const day = Number(dayStr);
          const color = DAY_COLORS[(day - 1) % DAY_COLORS.length];
          const path = dayMarkers
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((m) => new window.kakao.maps.LatLng(m.lat, m.lng));
          if (path.length > 1) {
            const polyline = new window.kakao.maps.Polyline({
              path,
              strokeWeight: 5,
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
              map,
            });
            overlays.push(polyline);
          }
          dayMarkers.forEach((markerData, idx) => {
            const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng);
            const orderNum = markerData.order ?? 0;
            const markerHtml = `
              <div style="position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer;" data-marker-idx="${day}-${orderNum}">
                <div style="background:${color};color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,0.15);border:2px solid #fff;">${orderNum}</div>
              </div>
            `;
            const marker = new window.kakao.maps.Marker({
              position,
              map,
              image: new window.kakao.maps.MarkerImage(
                'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                new window.kakao.maps.Size(0, 0)
              ),
            });
            markerObjs.push(marker);
            const overlay = new window.kakao.maps.CustomOverlay({
              position,
              content: markerHtml,
              yAnchor: 0.5,
              zIndex: 2,
              map,
            });
            overlays.push(overlay);
            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding: 16px 18px; min-width: 260px; max-width: 400px; font-size: 16px; line-height: 1.6; word-break: break-all;">
                  <h4 style="margin: 0 0 10px 0; color: #222; font-size: 18px; font-weight: bold;">${markerData.name}</h4>
                  <p style="margin: 0 0 6px 0; color: #666; font-size: 15px;">${markerData.description}</p>
                  <span style="color: ${color}; font-weight: bold; font-size: 14px;">Day ${markerData.day} - ${markerData.order}번째</span>
                </div>
              `,
              zIndex: 10,
            });
            infoWindows.push(infoWindow);
            // 마커 클릭 이벤트(토글)
            window.kakao.maps.event.addListener(marker, 'click', () => {
              if (lastOpenInfo && lastOpenIdx === `${day}-${orderNum}`) {
                lastOpenInfo.close();
                lastOpenInfo = null;
                lastOpenIdx = null;
              } else {
                infoWindows.forEach((iw) => iw.close());
                infoWindow.open(map, marker);
                lastOpenInfo = infoWindow;
                lastOpenIdx = `${day}-${orderNum}`;
              }
            });
            // 오버레이(숫자 원형) 클릭 이벤트(토글)
            setTimeout(() => {
              const selector = `[data-marker-idx="${day}-${orderNum}"]`;
              const overlayEl = document.querySelector(selector);
              if (overlayEl) {
                overlayEl.addEventListener('click', (e: any) => {
                  e.stopPropagation();
                  if (lastOpenInfo && lastOpenIdx === `${day}-${orderNum}`) {
                    lastOpenInfo.close();
                    lastOpenInfo = null;
                    lastOpenIdx = null;
                  } else {
                    infoWindows.forEach((iw) => iw.close());
                    infoWindow.open(map, marker);
                    lastOpenInfo = infoWindow;
                    lastOpenIdx = `${day}-${orderNum}`;
                  }
                });
              }
            }, 0);
          });
        });
        window.kakao.maps.event.addListener(map, 'click', () => {
          infoWindows.forEach((iw) => iw.close());
          lastOpenInfo = null;
          lastOpenIdx = null;
        });
      } catch (e) {
        setError('지도 생성 실패: ' + e);
        setIsLoading(false);
      }
    };
    checkSDKAndInit();
  }, [center, markers, zoom, level]);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)} style={{ height: height === '100%' ? '100%' : height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {isLoading && <div>카카오맵 로딩 중...</div>}
      {error && <div>{error}</div>}
      <div className="text-xs text-gray-400">{debugInfo}</div>
      <div className="text-xs text-blue-600 px-2 pb-2">숫자 마커(원형)를 클릭하면 상세 정보를 볼 수 있습니다. 지도 아무 곳이나 클릭하면 정보창이 닫힙니다.</div>
    </div>
  );
} 