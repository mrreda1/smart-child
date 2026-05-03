const { DailyReportModel } = require('../models/index');

const weights = require('../constants/weights');
const { generateGeneralRecommendation } = require('../utils/recommendation');

const generateReport = async (assessment, assessmentTests) => {
  const testsByCategory = groupedByCategory(assessmentTests);
  const artResults = testsByCategory['Art'][0].results.metrics;

  delete testsByCategory.Art;

  const aggregatedMetrices = aggregateMetrices(testsByCategory);

  aggregatedMetrices.art = { image: artResults.image, emotion: artResults.emotion };

  try {
    await DailyReportModel.create({
      assessment_id: assessment._id,
      system_recommendation: generateGeneralRecommendation(aggregatedMetrices),
      results: aggregatedMetrices,
    });
  } catch (err) {
    process.env.NODE_ENV === 'development' && console.log(err);
  }
};

const groupedByCategory = (assessmentTests) =>
  assessmentTests.reduce((acc, test) => {
    const categoryName = test.test_id.category_id.name;

    if (!acc[categoryName]) acc[categoryName] = [];

    acc[categoryName].push(test);

    return acc;
  }, {});

const aggregateMetrices = (testsByCategory) =>
  Object.keys(testsByCategory).reduce((acc, categoryName) => {
    const testsInCategory = testsByCategory[categoryName];

    let sumWeightedAccuracy = 0;
    let totalAccuracyWeight = 0;

    let sumNormalizedSpeed = 0;

    testsInCategory.forEach((test) => {
      const metrics = test.results.metrics;
      const weight = weights[test.difficulty?.toLowerCase()] || 1.0;

      // --- A. ACCURACY EXTRACTION ---
      const rawAccuracy = parseFloat(metrics.AR || metrics.ISR || metrics.PI || 0);
      sumWeightedAccuracy += rawAccuracy * weight;
      totalAccuracyWeight += weight;

      // --- B. SPEED/LATENCY EXTRACTION ---
      const rawSpeed = parseFloat(metrics.ART || metrics.ARL || metrics.AARL || metrics.MRT || 0);

      sumNormalizedSpeed += rawSpeed / weight;
    });

    const spaceSplitCategory = categoryName.split(' ');

    acc[spaceSplitCategory[0].toLocaleLowerCase() + (spaceSplitCategory[1] || '')] = {
      averageAccuracy: totalAccuracyWeight > 0 ? parseFloat((sumWeightedAccuracy / totalAccuracyWeight).toFixed(2)) : 0,
      averageSpeedMs:
        testsInCategory.length > 0 ? parseFloat((sumNormalizedSpeed / testsInCategory.length).toFixed(2)) : 0,
    };

    return acc;
  }, {});

module.exports = { generateReport };
