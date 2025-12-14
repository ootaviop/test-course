/**
 * ROUGH NOTATION CORE - Sistema de anotações
 * 
 * CLASSES DISPONÍVEIS:
 * .cls-underline   → Sublinhado
 * .cls-box         → Caixa ao redor
 * .cls-circle      → Círculo ao redor
 * .cls-highlight   → Marcador (fundo)
 * .cls-strike      → Riscado (linha única no meio)
 * .cls-crossed     → Riscado (X cruzado)
 * .cls-bracket     → Colchetes nas laterais
 *
 * USO BÁSICO:
 * <span class="cls-underline">texto</span>
 * <span class="cls-highlight">texto</span>
 *
 * CUSTOMIZAÇÃO DE COR:
 * <span class="cls-underline" data-color="#FF0000">texto</span>
 * <span class="cls-highlight" data-color="rgba(255, 0, 0, 0.3)">texto</span>
 *
 * REQUISITOS:
 * - Rough Notation library carregada
 */

class RoughNotationCore {
  constructor() {
    this.annotationMap = new Map();
    this.observer = null;
    this.shownElements = new Set();
    this.viewportDelay = 500;
    
    const w = window.innerWidth;
    this.strokeWidth = w >= 1920 ? 3.2 : 2;

    const colors = {
      solidOrange: "var(--rough-notation-solid-orange, #FF6B35)",
      solidGreen: "var(--rough-notation-solid-green, #4CAF50)",
      solidBlue: "var(--rough-notation-solid-blue, #2196F3)",
      solidPurple: "var(--rough-notation-solid-purple, #9C27B0)",
      solidRed: "var(--rough-notation-solid-red, #F44336)",
      solidYellow: "var(--rough-notation-solid-yellow, #FFC107)",
      softOrange: "var(--rough-notation-soft-orange, rgba(255, 107, 53, 0.3))",
      softGreen: "var(--rough-notation-soft-green, rgba(76, 175, 80, 0.3))",
      softBlue: "var(--rough-notation-soft-blue, rgba(33, 150, 243, 0.3))",
      softPurple: "var(--rough-notation-soft-purple, rgba(156, 39, 176, 0.3))",
      softRed: "var(--rough-notation-soft-red, rgba(244, 67, 54, 0.3))",
      softYellow: "var(--rough-notation-soft-yellow, rgba(255, 193, 7, 0.3))",
    };

    this.annotationTypes = {
      "cls-underline": {
        type: "underline",
        multiline: true,
        strokeWidth: this.strokeWidth,
        animationDuration: 800,
        color: colors.solidOrange,
      },
      "cls-box": {
        type: "box",
        multiline: true,
        strokeWidth: this.strokeWidth,
        padding: 6,
        animationDuration: 1000,
        color: colors.solidGreen,
      },
      "cls-circle": {
        type: "circle",
        multiline: true,
        strokeWidth: this.strokeWidth,
        padding: 8,
        animationDuration: 800,
        color: colors.solidBlue,
      },
      "cls-highlight": {
        type: "highlight",
        strokeWidth: this.strokeWidth,
        multiline: true,
        animationDuration: 800,
        color: colors.softYellow,
      },
      "cls-strike": {
        type: "strike-through",
        multiline: true,
        strokeWidth: this.strokeWidth,
        animationDuration: 500,
        color: colors.solidGreen,
      },
      "cls-crossed": {
        type: "crossed-off",
        multiline: true,
        strokeWidth: this.strokeWidth,
        animationDuration: 600,
        color: colors.solidRed,
      },
      "cls-bracket": {
        type: "bracket",
        multiline: true,
        strokeWidth: this.strokeWidth,
        brackets: ["left", "right"],
        animationDuration: 700,
        color: colors.solidOrange,
      },
    };

    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    if (typeof RoughNotation === "undefined") {
      console.error("[RoughNotationCore] Rough Notation library não encontrada.");
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    this.processAllElements();
    console.log(`[RoughNotationCore] Inicializado com ${this.annotationMap.size} anotações`);
  }

  processAllElements() {
    Object.keys(this.annotationTypes).forEach((className) => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach((element) => {
        this.createAnnotation(element, className);
      });
    });
  }

  createAnnotation(element, className) {
    const config = this.annotationTypes[className];

    if (!config) {
      console.warn(`[RoughNotationCore] Classe "${className}" não reconhecida`);
      return;
    }

    const baseColor = this.getBaseColor(element, config);
    const color = config.type === "highlight" 
      ? this.adjustColorForHighlight(baseColor)
      : baseColor;

    const annotation = RoughNotation.annotate(element, {
      ...config,
      color: color,
    });

    this.annotationMap.set(element, {
      annotation,
      duration: config.animationDuration,
    });

    this.observer.observe(element);
  }

  getBaseColor(element, config) {
    if (element.dataset.color) {
      return element.dataset.color.trim();
    }
    return config.color;
  }

  adjustColorForHighlight(color) {
    if (color.startsWith("rgba")) {
      return color;
    }

    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.3)`;
    }

    if (color.startsWith("rgb(")) {
      return color.replace("rgb(", "rgba(").replace(")", ", 0.3)");
    }

    return color;
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.shownElements.has(entry.target)) {
        const element = entry.target;
        const item = this.annotationMap.get(element);

        if (!item) return;

        item.annotation.show();
        this.shownElements.add(element);

        if (this.observer) {
          this.observer.unobserve(element);
        }
      }
    });
  }

  refresh() {
    console.log('[RoughNotationCore] 🔄 Iniciando refresh das annotations...');
    
    const elementsToRefresh = Array.from(this.shownElements);
    
    if (elementsToRefresh.length === 0) {
      console.log('[RoughNotationCore] Nenhuma annotation para refresh');
      return;
    }

    elementsToRefresh.forEach(element => {
      this.destroyAnnotation(element);
    });

    elementsToRefresh.forEach(element => {
      const className = this.findAnnotationClass(element);
      if (className) {
        this.createAnnotation(element, className);
        const item = this.annotationMap.get(element);
        if (item) {
          item.annotation.show();
          this.shownElements.add(element);
        }
      }
    });

    console.log(`[RoughNotationCore] ✅ Refresh concluído para ${elementsToRefresh.length} annotations`);
  }

  destroyAnnotation(element) {
    const item = this.annotationMap.get(element);
    if (item && item.annotation) {
      const svg = element.parentNode?.querySelector('svg[class*="rough-annotation"]');
      if (svg && svg.parentNode) {
        svg.parentNode.removeChild(svg);
      }
    }

    this.annotationMap.delete(element);
    this.shownElements.delete(element);

    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  findAnnotationClass(element) {
    for (const className of Object.keys(this.annotationTypes)) {
      if (element.classList.contains(className)) {
        return className;
      }
    }
    return null;
  }
}

// Auto-inicialização
const roughNotationCore = new RoughNotationCore();
window.roughNotationCore = roughNotationCore;
