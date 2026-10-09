// All scroll/motion calibration belongs here or in styles/tokens.css.
export const motion = {
  hero: {
    scrollViewports: 1,
    meWidth: .564,
    startX: .44, endX: .50,
    meOffsetX: .0475,
    startY: .035, endY: .16,
    endScale: .80,
    marqueeTravel: -.4095,
    marqueeBottomOverscan: .04,
    headerSmoothing: 1,
  },
  journey: { resistancePower: 3.5, settledFraction: .06 },
  marquee: { speed: 20, friction: .92, velocityGain: 5, wheelSensitivity: 1, keyboardStep: 96 },
  deck: { duration: 600 },
  player: { pressScale: .96, pressDepth: 4, pressDuration: 130, returnDuration: 310 },
  connect: { entryViewport: .85, travelX: .12, travelY: -.02, reducedTravel: .15, progressResistance: .65 },
};
