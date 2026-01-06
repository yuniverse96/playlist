// src/components/VinylPlayer.tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface VinylPlayerProps {
  isPlaying: boolean;
  currentImg: string | undefined;
  onTogglePlay: () => void; // 재생/정지를 토글하는 함수
}

const VinylPlayer = ({ isPlaying, currentImg, onTogglePlay }: VinylPlayerProps) => {
  const lpRef = useRef<HTMLDivElement>(null);
  const lpBarRef = useRef<HTMLImageElement>(null);
  const animation = useRef<gsap.core.Tween>();

  useGSAP(() => {
    animation.current = gsap.to(lpRef.current, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
      paused: false,
    }).timeScale(0);
  }, []);

  useGSAP(() => {
    if (!animation.current) return;

    if (isPlaying && currentImg) { // 이미지가 있을 때만 작동하게 안전장치
      animation.current.play();
      gsap.to(animation.current, { timeScale: 1, duration: 1.5, ease: "power1.in" });
      gsap.to(lpBarRef.current, { rotation: -25, duration: 1, ease: "power2.out" });
    } else {
      gsap.to(animation.current, { timeScale: 0, duration: 2, ease: "power1.out" });
      gsap.to(lpBarRef.current, { rotation: 0, duration: 1, ease: "power2.inOut" });
    }
  }, [isPlaying, currentImg]);

  return (
    <>
      {/* 바를 클릭하면 부모가 넘겨준 onTogglePlay를 실행 */}
      <div 
        className="lp_bar" 
        ref={lpBarRef} 
        onClick={onTogglePlay}
        style={{ cursor: 'pointer' }}
      >
        <img src="/images/lp_bar.png" alt="lp_bar" />
      </div>

      <div className="lp_wrap" ref={lpRef}>
        <div className="vinyl">
          <img src="/images/lp.png" alt="lp" />
        </div>
        {/* currentImg를 사용*/}
        <div 
          className="cover_img" 
          style={{ 
            backgroundImage: currentImg ? `url(${currentImg})` : 'none',
          }}
        ></div>
      </div>
    </>
  );
};

export default VinylPlayer;