import React from 'react';

export const LocationPage = () => {
  return (
    <main className="min-h-[calc(100vh-74px)] bg-[#DDE4DA] animate-fade-in">
      <iframe
        title="Ubicación de ReModa Boutique Equipetrol"
        src="https://www.google.com/maps?q=Av.+San+Martin+esquina+Calle+4+Este+250,+Barrio+Equipetrol,+Santa+Cruz+de+la+Sierra,+Bolivia&z=17&output=embed"
        className="h-[calc(100vh-74px)] min-h-[560px] w-full border-0"
        loading="lazy"
        allowFullScreen
      />
    </main>
  );
};
