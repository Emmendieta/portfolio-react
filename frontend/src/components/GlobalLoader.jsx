import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLoading } from "../context/LoadingContext";
import { useEffect, useRef } from "react";

const MySwal = withReactContent(Swal);
const MIN_VISIBLE_TIME_MS = 1000; // al menos 1 segundo visible

function GlobalLoader() {
    const { isLoading } = useLoading();
    const openTimeRef = useRef(null);
    const timeoutRef = useRef(null);
    const isShownRef = useRef(false); // para saber si está abierto

    useEffect(() => {
        if (isLoading && !isShownRef.current) {
            // Mostrar SweetAlert solo si aún no está mostrado
            isShownRef.current = true;
            openTimeRef.current = Date.now();

            MySwal.fire({
                title: "Cargando...",
                icon: "info",
                theme: 'dark',
                allowOutsideClick: false,
                showConfirmButton: false,
                customClass: {
                    popup: 'custom-swal-popup'
                },
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }

        if (!isLoading && isShownRef.current) {
            const now = Date.now();
            const elapsed = now - (openTimeRef.current || 0);
            const remainingTime = Math.max(MIN_VISIBLE_TIME_MS - elapsed, 0);

            timeoutRef.current = setTimeout(() => {
                Swal.close();
                isShownRef.current = false;
                openTimeRef.current = null;
            }, remainingTime);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [isLoading]);

    return null;
};

export default GlobalLoader;
