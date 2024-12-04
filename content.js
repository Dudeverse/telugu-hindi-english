document.addEventListener("mouseup", async (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;
  
    // Remove any existing tooltip
    const existingTooltip = document.getElementById("word-tooltip");
    if (existingTooltip) existingTooltip.remove();
  
    try {
      // Fetch the meaning using DictionaryAPI
      const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`);
      if (!dictionaryResponse.ok) return;
      const dictionaryData = await dictionaryResponse.json();
      const englishMeaning = dictionaryData[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
  
      // Fetch the Telugu translation
      const teluguResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(selectedText)}`
      );
      const teluguData = teluguResponse.ok ? await teluguResponse.json() : null;
      const teluguMeaning = teluguData?.[0]?.[0]?.[0] || "No Telugu meaning found.";
  
      // Fetch the Hindi translation
      const hindiResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(selectedText)}`
      );
      const hindiData = hindiResponse.ok ? await hindiResponse.json() : null;
      const hindiMeaning = hindiData?.[0]?.[0]?.[0] || "No Hindi meaning found.";
  
      // Create a tooltip
      const tooltip = document.createElement("div");
      tooltip.id = "word-tooltip";
      tooltip.innerHTML = `
        <strong>English:</strong> ${englishMeaning}<br>
        <strong>Telugu:</strong> ${teluguMeaning}<br>
        <strong>Hindi:</strong> ${hindiMeaning}
      `;
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.border = "1px solid black";
      tooltip.style.padding = "5px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.zIndex = "10000";
      tooltip.style.top = `${event.pageY + 10}px`;
      tooltip.style.left = `${event.pageX + 10}px`;
  
      document.body.appendChild(tooltip);
  
      // Remove the tooltip on click or another selection
      tooltip.addEventListener("click", () => tooltip.remove());
    } catch (error) {
      console.error("Error fetching word meaning:", error);
    }
  });
  
  document.addEventListener("mousedown", () => {
    const existingTooltip = document.getElementById("word-tooltip");
    if (existingTooltip) existingTooltip.remove();
  });
  