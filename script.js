const colors = {
  1: "#14733e",
  2: "#1162b5",
  3: "#f05a28",
  4: "#f5ad10",
  5: "#7b2e6f",
  phrase: "#14733e"
};

const zones = [
  {
    id: "1",
    title: "Hoe gaat het met je geld?",
    instruction: "Kies 1 kaart die het beste bij jouw situatie past.",
    max: 1,
    empty: "Leg hier de kaart"
  },
  {
    id: "2",
    title: "Praat je er al over?",
    instruction: "Kies 1 kaart die het beste bij jou past.",
    max: 1,
    empty: "Leg hier de kaart"
  },
  {
    id: "3",
    title: "Wat zou jou helpen om erover te praten?",
    instruction: "Kies 1 kaart die het meest bij jou past.",
    max: 1,
    empty: "Leg hier de kaart"
  },
  {
    id: "4",
    title: "Welke tips passen bij jou?",
    instruction: "Kies maximaal 2 kaarten die jou aanspreken.",
    max: 2,
    empty: "Leg hier max. 2 kaarten"
  },
  {
    id: "5",
    title: "Wat is jouw eerste kleine stap?",
    instruction: "Kies 1 of 2 kaarten en zet een eerste stap die bij jou past.",
    max: 2,
    empty: "Leg hier de kaart"
  }
];

const cards = [
  { id: "c1", group: "1", text: "Het gaat goed, ik maak me weinig zorgen over mijn geld" },
  { id: "c2", group: "1", text: "Ik maak me soms zorgen over mijn geld" },
  { id: "c3", group: "1", text: "Ik maak me vaak zorgen over mijn geld" },
  { id: "c4", group: "1", text: "Ik maak me altijd zorgen over mijn geld" },
  { id: "c5", group: "2", text: "Ik praat met een vriend of met iemand uit de familie" },
  { id: "c6", group: "2", text: "Ik praat met mijn partner" },
  { id: "c7", group: "2", text: "Ik zoek soms informatie op" },
  { id: "c8", group: "2", text: "Ik hou het voor mezelf" },
  { id: "c9", group: "3", text: "Het helpt mij wanneer ik het gevoel heb dat ik me niet hoef te schamen" },
  { id: "c10", group: "3", text: "Het helpt mij wanneer ik het gevoel heb dat de ander mij wil helpen" },
  { id: "c11", group: "3", text: "Het helpt mij wanneer de ander mij vrij laat en mij zelf keuzes laat maken over mijn situatie" },
  { id: "c12", group: "3", text: "Het helpt mij wanneer ik weet dat anderen niet anders over mij gaan denken" },
  { id: "c13", group: "4", text: "Veel mensen vinden het juist fijn om naar je te luisteren en met je mee te denken. Samen nadenken kan rust en overzicht geven." },
  { id: "c14", group: "4", text: "Begin klein. Je hoeft niet alles in 1 keer te delen. Begin met een klein deel bij iemand die je vertrouwt." },
  { id: "c15", group: "4", text: "Hulp of steun vragen is heel normaal. Het laat juist zien dat je open staat voor verandering." },
  { id: "c16", group: "4", text: "Je schamen voor je geldsituatie is niet nodig. Veel mensen maken zich hier wel eens zorgen over." },
  { id: "c17", group: "4", text: "Wees eerlijk over je gevoelens. Leg bijvoorbeeld uit dat je het moeilijk vindt om erover te praten." },
  { id: "c18", group: "4", text: "Een gesprek hoeft niet meteen alles op te lossen, maar is wel een goede eerste stap." },
  { id: "c19", group: "5", text: "Ik plan een rustig moment om met iemand te praten, bijvoorbeeld tijdens een wandeling of een kop koffie." },
  { id: "c20", group: "5", text: "Ik denk na over bij wie ik me veilig voel om mee te praten." },
  { id: "c21", group: "5", text: "Wanneer ik wil praten stuur ik een berichtje naar iemand die ik vertrouw." },
  { id: "c22", group: "5", text: "Ik schrijf voordat ik met iemand ga praten op wat ik wil zeggen." },
  { id: "c23", group: "5", text: "Ik zoek informatie op die mij kan helpen." },
  { id: "c24", group: "5", text: "Ik bedenk een korte zin om het gesprek mee te beginnen." },
  { id: "p1", group: "phrase", text: "\"Ik zit ergens mee en zou dit graag willen delen.\"" },
  { id: "p2", group: "phrase", text: "\"Ik vind het lastig om dit te zeggen, maar ik wil het toch proberen.\"" },
  { id: "p3", group: "phrase", text: "\"Het is moeilijk om erover te praten, maar ik wil het wel.\"" },
  { id: "p4", group: "phrase", text: "\"Ik wil iets bespreken waar ik me zorgen over maak.\"" },
  { id: "p5", group: "phrase", text: "\"Ik weet niet goed waar ik moet beginnen, maar zou je me ergens mee kunnen helpen?\"" }
];

const state = JSON.parse(localStorage.getItem("kaartToolState") || "{}");
let selectedCardId = null;
let activeFilter = "all";

const dropGrid = document.querySelector("#dropGrid");
const cardsEl = document.querySelector("#cards");
const phraseSlots = document.querySelector("#phraseSlots");
const helperText = document.querySelector("#helperText");

function saveState() {
  localStorage.setItem("kaartToolState", JSON.stringify(state));
}

function getCard(id) {
  return cards.find((card) => card.id === id);
}

function placedIds() {
  return Object.values(state).flat();
}

function cardElement(card, placed = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `card${placed ? " placed" : ""}`;
  button.draggable = true;
  button.dataset.cardId = card.id;
  button.dataset.group = card.group;
  button.style.setProperty("--card-color", colors[card.group]);
  button.innerHTML = `<small>${card.group === "phrase" ? "zin" : card.group}</small><span>${card.text}</span>`;
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", card.id);
    selectedCardId = card.id;
  });
  button.addEventListener("click", () => {
    if (placed) {
      removeFromZones(card.id);
      return;
    }
    selectedCardId = selectedCardId === card.id ? null : card.id;
    render();
  });
  if (selectedCardId === card.id) button.classList.add("selected");
  return button;
}

function renderZones() {
  dropGrid.innerHTML = "";
  zones.forEach((zone) => {
    const column = document.createElement("section");
    column.className = "drop-column";
    column.style.setProperty("--zone-color", colors[zone.id]);
    column.innerHTML = `
      <div class="zone-heading">
        <div class="number" style="background:${colors[zone.id]}">${zone.id}</div>
        <div>
          <h2>${zone.title}</h2>
          <p>${zone.instruction}</p>
        </div>
      </div>
    `;

    const dropZone = document.createElement("div");
    dropZone.className = "drop-zone";
    dropZone.dataset.zone = zone.id;
    dropZone.style.setProperty("--zone-color", colors[zone.id]);
    addDropEvents(dropZone, zone.id);
    fillZone(dropZone, zone.id, zone.empty);
    column.append(dropZone);
    dropGrid.append(column);
  });
}

function fillZone(container, zoneId, emptyText) {
  const ids = state[zoneId] || [];
  container.classList.toggle("has-cards", ids.length > 0);
  container.innerHTML = `<div class="empty-state">${emptyText}</div>`;
  ids.forEach((id) => {
    const card = getCard(id);
    if (card) container.append(cardElement(card, true));
  });
}

function renderPhrases() {
  addDropEvents(phraseSlots, "phrase");
  fillZone(phraseSlots, "phrase", "Leg hier jouw zinnen");
}

function renderCards() {
  const used = new Set(placedIds());
  cardsEl.innerHTML = "";
  cards
    .filter((card) => !used.has(card.id))
    .filter((card) => activeFilter === "all" || card.group === activeFilter)
    .forEach((card) => cardsEl.append(cardElement(card)));
}

function render() {
  renderZones();
  renderPhrases();
  renderCards();
  helperText.textContent = selectedCardId
    ? "Klik nu op een passend vak om de gekozen kaart neer te leggen."
    : "Sleep een kaart naar een vak, of klik eerst op een kaart en daarna op een vak.";
}

function addDropEvents(element, zoneId) {
  element.addEventListener("dragover", (event) => {
    event.preventDefault();
    element.classList.add("over");
  });
  element.addEventListener("dragleave", () => element.classList.remove("over"));
  element.addEventListener("drop", (event) => {
    event.preventDefault();
    element.classList.remove("over");
    placeCard(event.dataTransfer.getData("text/plain"), zoneId);
  });
  element.addEventListener("click", () => {
    if (selectedCardId) placeCard(selectedCardId, zoneId);
  });
}

function removeFromZones(cardId) {
  Object.keys(state).forEach((zoneId) => {
    state[zoneId] = (state[zoneId] || []).filter((id) => id !== cardId);
    if (state[zoneId].length === 0) delete state[zoneId];
  });
  saveState();
  render();
}

function placeCard(cardId, zoneId) {
  const card = getCard(cardId);
  const zone = zones.find((item) => item.id === zoneId);
  const max = zone ? zone.max : 5;
  if (!card) return;
  if (zoneId !== "phrase" && card.group !== zoneId) return showNote(zoneId, "Deze kaart hoort bij een ander vak.");
  if (zoneId === "phrase" && card.group !== "phrase") return showNote(zoneId, "Hier passen alleen zinnen.");

  removeFromZones(cardId);
  const list = state[zoneId] || [];
  if (list.length >= max) {
    state[zoneId] = list.slice(0, max - 1);
  }
  state[zoneId] = [...(state[zoneId] || []), cardId];
  selectedCardId = null;
  saveState();
  render();
}

function showNote(zoneId, message) {
  const target = zoneId === "phrase"
    ? phraseSlots
    : document.querySelector(`[data-zone="${zoneId}"]`);
  if (!target) return;
  const note = document.createElement("div");
  note.className = "limit-note";
  note.textContent = message;
  target.append(note);
  setTimeout(() => note.remove(), 1800);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderCards();
  });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  Object.keys(state).forEach((key) => delete state[key]);
  selectedCardId = null;
  saveState();
  render();
});

document.querySelector("#printBtn").addEventListener("click", () => window.print());

render();
