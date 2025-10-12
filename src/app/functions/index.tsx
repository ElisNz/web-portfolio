const getRandomAsciiChar = () => {
  const asciiStart = 32; // Space character
  const asciiEnd = 126; // Tilde (~) character
  const randomAscii =
    Math.floor(Math.random() * (asciiEnd - asciiStart + 1)) + asciiStart;
  return String.fromCharCode(randomAscii);
};

const flickerText = (setTextLoaded, text, element, delay, maxTime) => {
  const textTemplate = new Array(text.length).fill(" ");

  setTimeout(() => {
    let i = 0;
    const j = setInterval(() => {
      textTemplate[i] = text[i];
      element.innerHTML = textTemplate.join("");
      i++;

      if (textTemplate.join("") === text) {
        setTextLoaded(true);
        clearInterval(j);
      }
    }, 0.01);
  }, maxTime);

  const interval = setInterval(() => {
    if (textTemplate.join("") !== text) {
      setTextLoaded(false);
    }

    const randomElement = Math.floor(Math.random() * text.length);

    if (
      textTemplate[randomElement] === "*" ||
      textTemplate[randomElement] === text[randomElement]
    ) {
      return;
    }

    textTemplate[randomElement] = getRandomAsciiChar();
    element.innerHTML = textTemplate.join("");

    setTimeout(() => {
      textTemplate[randomElement] = text[randomElement];

      if (textTemplate.join("") === text) {
        setTextLoaded(true);
        clearInterval(interval);
      }
    }, 200);
    element.innerHTML = textTemplate.join("");
  }, delay);
};

function insertBlinkingCaret(targetId) {
  const targetElement = document.getElementById(targetId);

  const caret = document.createElement("span");
  caret.classList.add("blinking-caret");

  targetElement.appendChild(caret);
}

function typeAndEraseWords(words: string[], containerId: string) {
  const container = document.getElementById(containerId);
  let wordIndex = 0; // Index of the current word
  let charIndex = 0; // Index of the current character in the word
  let isTyping = true; // Whether we are typing or erasing

  function typeNextLetter() {
    if (isTyping) {
      // Add the next character
      container.textContent += words[wordIndex][charIndex];
      charIndex++;

      // If the word is fully typed, pause and then start erasing
      if (charIndex === words[wordIndex].length) {
        isTyping = false;
        setTimeout(typeNextLetter, 1500); // Pause before erasing
        return;
      }
    } else {
      // Remove the last character
      container.textContent = container.textContent.slice(0, -1);
      charIndex--;

      // If the word is fully erased, move to the next word
      if (charIndex === 0) {
        isTyping = true;
        wordIndex = (wordIndex + 1) % words.length; // Loop through words
        setTimeout(typeNextLetter, 500); // Pause before typing the next word
        return;
      }
    }

    // Set an uneven interval for the next character
    const delay = isTyping
      ? Math.random() * 200 + 50 // Typing delay (50ms to 250ms)
      : 100; // Erasing delay (fixed at 100ms)
    setTimeout(typeNextLetter, delay);
  }

  // Start the typing/erasing loop
  typeNextLetter();
}

export {
  getRandomAsciiChar,
  flickerText,
  insertBlinkingCaret,
  typeAndEraseWords,
};
