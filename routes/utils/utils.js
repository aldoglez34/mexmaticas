const model = require("../../models");

const utils = {
  getNextDifficulty: (diff) => {
    switch (diff) {
      case "Basic":
        return "Basic-Intermediate";
      case "Basic-Intermediate":
        return "Intermediate";
      case "Intermediate":
        return "Intermediate-Advanced";
      case "Intermediate-Advanced":
        return "Advanced";
    }
  },
  generateDefaultExams: (topicName) => {
    const examDifficulties = [
      "Basic",
      "Basic-Intermediate",
      "Intermediate",
      "Intermediate-Advanced",
      "Advanced",
    ];
    const defaultExams = [];
    for (let i = 0; i < examDifficulties.length; i++) {
      const exam = {
        difficulty: examDifficulties[i],
        examOrderNumber: i + 1,
        name: `${topicName} ${i + 1}`,
        description: "Descripción del examen.",
        duration: 10,
        qCounter: 10,
      };
      defaultExams.push(exam);
    }
    return defaultExams;
  },
  getNextTopicOrderNumber: (topics) => {
    const latestTopic = topics.sort(
      (a, b) => b.topicOrderNumber - a.topicOrderNumber
    )[0];

    return latestTopic ? latestTopic.topicOrderNumber + 1 : 0;
  },
};

module.exports = utils;
