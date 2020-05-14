import { useRef, useCallback } from "react";

export function useHookWithRefCallback() {
    const ref = useRef(null)
    const setRef = useCallback(node => {
        if (node) {
        node.rotation.x = 0.6;
        node.rotation.y = -0.6;
        }

        ref.current = node;
    }, [])

    return [setRef, ref]
}