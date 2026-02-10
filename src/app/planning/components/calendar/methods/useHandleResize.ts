import { useEffect } from 'react';

export default function useHandleResize({
    ref, setGlobalSlotsHeight
} : {
    ref: React.RefObject<HTMLDivElement | null>,
    setGlobalSlotsHeight: (height: number) => void
}) {
    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setGlobalSlotsHeight(
                    (ref.current.clientHeight) / 24 
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ref, setGlobalSlotsHeight]);
}