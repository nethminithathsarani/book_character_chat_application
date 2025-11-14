import sherlock from "../assets/avatar-sherlock.png";
import anne from "../assets/avatar-anne.png";
import gandalf from "../assets/avatar-gandalf.png";
import odysseus from "../assets/avatar-odysseus.png";

export const CHARACTERS = [
  {
    id: "sherlock",
    name: "Sherlock Holmes",
    book: "The Adventures of Sherlock Holmes",
    avatar: sherlock,
    replyTemplate: (text) =>
      `Elementary. From your words—"${text}"—I deduce a keen mind seeking clarity.`,
  },
  {
    id: "anne",
    name: "Anne Shirley",
    book: "Anne of Green Gables",
    avatar: anne,
    replyTemplate: (text) =>
      `What a splendid thought: "${text}"! It’s simply bursting with imagination.`,
  },
  {
    id: "gandalf",
    name: "Gandalf",
    book: "The Lord of the Rings",
    avatar: gandalf,
    replyTemplate: (text) =>
      `All we have to decide is what to do with "${text}" that is given to us.`,
  },
  {
    id: "odysseus",
    name: "Odysseus",
    book: "The Odyssey",
    avatar: odysseus,
    replyTemplate: (text) =>
      `Your tale "${text}" would challenge even a hero upon the wine-dark sea.`,
  },
];
