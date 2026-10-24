export const calculateFluencyScore = (
  wpm,
  grammaticalMistakesCount,
  fillerWordsCount
) => {
  const TARGET_WPM = 160;
  const C_G = 0.5;
  const C_F = 0.3;
  const MAX_SCORE = 10;
  const MIN_SCORE = 0;

  const baseScore = MAX_SCORE * (wpm / TARGET_WPM);

  const grammarPenalty = grammaticalMistakesCount * C_G;
  const fillerPenalty = fillerWordsCount * C_F;
  const totalPenalty = grammarPenalty + fillerPenalty;

  const rawScore = baseScore - totalPenalty;

  let finalScore = Math.min(MAX_SCORE, Math.max(MIN_SCORE, rawScore));

  return parseFloat(finalScore.toFixed(1));
};
