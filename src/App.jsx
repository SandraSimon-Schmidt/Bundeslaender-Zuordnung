import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import jsPDF from "jspdf";

const bundeslaender = [
  { name: "Baden-Württemberg", attempts: 0 },
  { name: "Bayern", attempts: 0 },
  { name: "Berlin", attempts: 0 },
  { name: "Brandenburg", attempts: 0 },
  { name: "Bremen", attempts: 0 },
  { name: "Hamburg", attempts: 0 },
  { name: "Hessen", attempts: 0 },
  { name: "Mecklenburg-Vorpommern", attempts: 0 },
  { name: "Niedersachsen", attempts: 0 },
  { name: "Nordrhein-Westfalen", attempts: 0 },
  { name: "Rheinland-Pfalz", attempts: 0 },
  { name: "Saarland", attempts: 0 },
  { name: "Sachsen", attempts: 0 },
  { name: "Sachsen-Anhalt", attempts: 0 },
  { name: "Schleswig-Holstein", attempts: 0 },
  { name: "Thüringen", attempts: 0 },
];

const initialStaedte = [
  "Stuttgart",
  "München",
  "Berlin",
  "Potsdam",
  "Bremen",
  "Hamburg",
  "Wiesbaden",
  "Schwerin",
  "Hannover",
  "Düsseldorf",
  "Mainz",
  "Saarbrücken",
  "Dresden",
  "Magdeburg",
  "Kiel",
  "Erfurt",
];

// 🔹 Draggable Stadt
function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.8 : 1,
    cursor: "grab",
    display: "inline-block",
    width: "100%",
    touchAction: "none", // verhindert ungewolltes Scrollen auf Touchgeräten
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
}

// 🔹 Droppable Land
function DroppableItem({ id, children, isOver }) {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    backgroundColor: isOver ? "#8fdc8f" : "#90ee90",
    border: "2px solid green",
    minHeight: "40px",
    minWidth: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "5px",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center",
    transition: "background-color 0.2s, transform 0.2s",
    transform: isOver ? "scale(1.05)" : "scale(1)",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

// 🔹 Haupt-App
export default function App() {
  const [staedte, setStaedte] = useState(shuffle([...initialStaedte]));
  const [punkte, setPunkte] = useState(0);
  const [versuche, setVersuche] = useState({});
  const [landVersuche, setLandVersuche] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    datum: "",
    zusatz: "",
  });
  const [activeOver, setActiveOver] = useState(null);

  // 👉 PointerSensor aktiviert Drag nach 3 Pixel Bewegung
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleDragStart = () => {
    if (!startTime) setStartTime(new Date());
  };

  const handleDragOver = (event) => {
    const overId = event.over?.id;
    setActiveOver(overId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveOver(null);
    if (!over) return;

    const stadt = active.id;
    const land = over.id;

    const stadtVersuche = versuche[stadt] || 0;
    const landVersucheCount = landVersuche[land] || 0;

    if (stadtVersuche >= 10 || landVersucheCount >= 10) {
      alert("Maximale Versuche erreicht. Spiel wird neu gestartet.");
      window.location.reload();
      return;
    }

    if (
      bundeslaender.find((b) => b.name === land).name === getStadtLand(stadt)
    ) {
      setPunkte((p) => p + 1);
      setStaedte((s) => s.filter((x) => x !== stadt));
    }

    setVersuche((v) => ({ ...v, [stadt]: stadtVersuche + 1 }));
    setLandVersuche((l) => ({ ...l, [land]: landVersucheCount + 1 }));
  };

  function getStadtLand(stadt) {
    const map = {
      Stuttgart: "Baden-Württemberg",
      München: "Bayern",
      Berlin: "Berlin",
      Potsdam: "Brandenburg",
      Bremen: "Bremen",
      Hamburg: "Hamburg",
      Wiesbaden: "Hessen",
      Schwerin: "Mecklenburg-Vorpommern",
      Hannover: "Niedersachsen",
      Düsseldorf: "Nordrhein-Westfalen",
      Mainz: "Rheinland-Pfalz",
      Saarbrücken: "Saarland",
      Dresden: "Sachsen",
      Magdeburg: "Sachsen-Anhalt",
      Kiel: "Schleswig-Holstein",
      Erfurt: "Thüringen",
    };
    return map[stadt];
  }

  const downloadPDF = () => {
  const doc = new jsPDF();
  const endTime = new Date();
  const timeDiff = Math.floor((endTime - startTime) / 1000);
  let y = 10;
    
  const userText = [userInfo.name, userInfo.datum, userInfo.zusatz]
    .filter((x) => x) 
    .join("   "); 

  if (userText) {
    doc.text(userText, 10, y); 
    y = y + 10; 
    }
    y = y + 10;
    doc.text(`Punkte: ${punkte}`, 10, y);
    y = y + 10;
    doc.text(`Gesamtzeit: ${timeDiff} Sekunden`, 10, y);

    y = y + 10;

    Object.keys(versuche).forEach((stadt, i) => {
    doc.text(`${stadt} - Versuche: ${versuche[stadt]}`, 10, 60+i*10);

    });
    doc.save("Ergebnis.pdf");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Hauptstädte zu den Bundesländern ziehen
      </h1>
      <h3 style={{ textAlign: "center", maxWidth: "90%" }}>
        Du kannst eine Stadt maximal 10 Mal in ein Land ziehen und in jedem Land
        nur maximal 10 Mal eine Stadt ziehen.
        <br />
        Bei Überschreitung wird das Spiel neu gestartet.
        <br />
        Sobald du die erste Stadt ziehst, beginnt die Spielzeit und endet,
        sobald alle Städte zugeordnet sind.
      </h3>

      <div
        style={{
          display: "flex",
          width: "70%",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          style={{ width: "25%", padding: "5px", fontSize: "16px", color: "#000"  }}
          placeholder="Name, Datum, Zusatz"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        />

        <div
          style={{ fontSize: "20px", textAlign: "center" }}
          data-testid="punkte"
        >
          Punkte : {punkte}
        </div>
        <button
          onClick={downloadPDF}
          style={{
            padding: "5px 20px",
            fontSize: "16px",
            backgroundColor: "#ffa500",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ergebnis downloaden
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            width: "70%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            {bundeslaender.map((b) => (
              <DroppableItem
                key={b.name}
                id={b.name}
                isOver={activeOver === b.name}
              >
                {b.name}
              </DroppableItem>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "5px",
            }}
          >
            {staedte.map((s) => (
              <DraggableItem key={s} id={s}>
                <div
                  style={{
                    backgroundColor: "#fff176",
                    border: "1px solid #fbc02d",
                    borderRadius: "5px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  {s}
                </div>
              </DraggableItem>
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
