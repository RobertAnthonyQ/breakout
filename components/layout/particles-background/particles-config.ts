import type { ISourceOptions } from "@tsparticles/engine";

export const particlesOptions: ISourceOptions = {
  // Stay inside the hero instead of a fixed full-page canvas
  fullScreen: { enable: false },
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 120,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        // Otros modos disponibles son: "grab", "bubble", "repulse", "attract", "push", "remove", "slow", etc.
        // Puedes combinar varios así:
        mode: "attract",
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 200,
      enable: true,
      opacity: 0.35,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        width: 1920,
        height: 1080,
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};
