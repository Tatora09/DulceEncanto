import React from 'react';

/** Marcador temporal: se reemplaza página por página durante la migración. */
const EnConstruccion: React.FC<{ titulo: string }> = ({ titulo }) => (
  <section className="text-center py-5" data-testid="en-construccion">
    <h1 className="h3">{titulo}</h1>
    <p className="text-muted mb-0">🚧 Vista pendiente de migrar a React.</p>
  </section>
);

export default EnConstruccion;
