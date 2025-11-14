export const INITIAL_MESSAGES = {
  sherlock: [
    {
      id: "m1",
      sender: "character",
      text: "You have a question. The clues are all around us.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "m2",
      sender: "user",
      text: "Help me analyze a puzzling situation.",
      timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    },
  ],
  gandalf: [
    {
      id: "m3",
      sender: "character",
      text: "A wizard is never late, nor early; he arrives precisely when he means to.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
};
