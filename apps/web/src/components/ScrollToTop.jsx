import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            if (hash) {
                const id = decodeURIComponent(hash.slice(1));
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ block: 'start' });
                    return;
                }
            }

            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;
