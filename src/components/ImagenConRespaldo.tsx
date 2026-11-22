import React, { useEffect, useState } from "react";

const IMAGEN_RESPALDO = "/images/postre-placeholder.svg";

type ImagenConRespaldoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

const ImagenConRespaldo: React.FC<ImagenConRespaldoProps> = ({ src, onError, ...props }) => {
  const fuente = src?.trim() ?? "";
  const [fuenteFallida, setFuenteFallida] = useState("");

  useEffect(() => {
    setFuenteFallida("");
  }, [fuente]);

  return (
    <img
      {...props}
      src={!fuente || fuenteFallida === fuente ? IMAGEN_RESPALDO : fuente}
      onError={(evento) => {
        onError?.(evento);
        setFuenteFallida(fuente);
      }}
    />
  );
};

export default ImagenConRespaldo;
