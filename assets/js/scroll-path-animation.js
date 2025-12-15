// ============================================
// SCROLL PATH ANIMATION - GSAP DrawSVGPlugin
// Desenha linha elegante nas laterais conforme scroll
// ============================================

(function() {
  'use strict';

  const CONFIG = {
    minWidth: 768,
    edgeMargin: 40, // Reduzido para ficar mais próximo da borda
    numberOfCurves: 4 // Aumentado para ter mais curvas ao longo da página
  };

  let viewportHeight = 0;
  let viewportWidth = 0;
  let documentHeight = 0;

  function init() {
    if (window.innerWidth < CONFIG.minWidth) {
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof DrawSVGPlugin === 'undefined') {
      console.error('GSAP/ScrollTrigger/DrawSVG não carregados');
      setTimeout(init, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    // Calcular dimensões
    updateDimensions();

    // Gerar e animar
    setupAnimation();

    console.log('✅ Scroll Path Animation (DrawSVG) inicializada');
  }

  function updateDimensions() {
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
    documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  function setupAnimation() {
    const drawnPath = document.getElementById('drawn-path');
    const svgElement = document.getElementById('scroll-line-svg');
    const marker = document.getElementById('path-marker');
    
    if (!drawnPath || !svgElement) return;

    // 1. Configurar o ViewBox original do SVG importado para manter a proporção correta das curvas
    svgElement.setAttribute('viewBox', '0 0 1911.83 2863.66');
    svgElement.setAttribute('preserveAspectRatio', 'none meet');
    
    // Ajuste dinâmico do estilo para garantir cobertura total
    svgElement.style.position = 'absolute';
    svgElement.style.height = '100%';
    svgElement.style.width = '100%';
    svgElement.style.top = '50%';
    svgElement.style.left = '0';

    // 2. Definir o path EXATO do arquivo ex-teste.svg
    const exactPathD = `
      M244.92,435.21c2.01,2.65,4.02,5.31,6,8
      M256.76,451.27c10.6,14.87,20.58,30.32,29.31,46.22
      M288.44,501.87c22.07,41.48,35.46,85.96,29.61,131.26-9.13,70.74-83,137.51-158.9,121.36-69.57-14.8-106.2-94.74-82.51-156.31s92.82-101.63,163.42-111.53c70.6-9.89,142.53,5.68,210.14,26.75,100.15,31.21,197.74,76.14,270.33,146.5,74.39,72.1,117.65,165.72,159.39,257.18,41.96,91.92,83.92,183.83,125.77,275.79,22.4,49.21,45.3,99.26,82.65,140.2,81.83,89.69,226.58,120.48,349.23,87.73,122.65-32.76,221.83-121.72,277.26-226.94,55.42-105.22,111.29-246.48,102.72-362.99-6.35-86.41-43.39-189.86-136.53-205.82-87.96-15.07-167.29,68.58-168.88,150.34-1.6,81.77,51.4,155.84,109.98,217.66,160.32,169.2,873.89,701.27,824.87,845.27-133.6,392.44-718.98-392.17-1555.4,57.19-185.22,99.51-323.09,242.34-494.06,345.38-62.94,37.93-135.33,68.03-204.66,51.31-69.33-16.72-127.72-97.38-103.46-171.1,22.24-67.56,105.67-95.34,164.32-65.12,58.66,30.21,91,103.26,93.2,174.52s-21.07,141.08-49.32,206.01c-39.79,91.44-91.66,179.23-163.51,243.14
      M130.34,2682.91c-2.52,2.19-5.06,4.35-7.62,6.47
    `;
    
    drawnPath.setAttribute('d', exactPathD);

    // 3. Configurar a animação com DrawSVG
    gsap.fromTo(drawnPath, 
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      }
    );
    
    // Remover animação de Y do SVG container pois agora ele é absoluto e cobre tudo
    gsap.set('#scroll-line-svg', { y: 0 });
  }

  // Função generatePathD removida pois usamos path estático

  // Inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
        updateDimensions();
        setupAnimation();
      }
    }, 250);
  });

})();
