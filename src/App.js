import React, { useEffect } from "react";
import "./App.css";
import giphyGif from "./assets/giphy.gif";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const App = () => {
  const speak = (text) => {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
  };

  const wishMe = () => {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
      speak("Good Morning Sir...");
    } else if (hour >= 12 && hour < 18) {
      speak("Good Afternoon Sir...");
    } else if (hour >= 18 && hour < 20) {
      speak("Good Evening Sir...");
    } else {
      speak("Good Night Sir...");
    }
  };

  useEffect(() => {
    speak("Initializing JARVIS..");
    wishMe();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const respond = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    respond("Microphone is offed, Thank You Sir.");
  };

  const getTimeNow = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const period = hours < 12 ? "AM" : "PM";

    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    const timeNow = `${formattedHours} ${
      formattedHours === 1 ? "hour" : "hours"
    } and ${minutes} ${minutes === 1 ? "minute" : "minutes"} and ${seconds} ${
      seconds === 1 ? "second" : "seconds"
    } ${period} `;
    respond(`The current time is ${timeNow}, sir.`);
  };

  const commands = [
    {
      command: "Jarvis reset",
      callback: ({ resetTranscript }) => {
        resetTranscript();
        speak("Reset completed, Sir.");
      },
    },
    {
      command: "Jarvis stop",
      callback: handleStop,
    },
    {
      command: "Jarvis What is the time now",
      callback: getTimeNow,
    },
    {
      command: "Jarvis open *",
      callback: (site) => {
        window.open("http://" + site);
        respond(`Opening ${site} sir`);
      },
    },
    {
      command: "Jarvis change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
        respond(`Changing background colour to ${color} sir`);
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    return wishMe();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="main">
      <div className="image-container">
        <div className="image">
          <img src={giphyGif} alt="image1" />
        </div>
        <h1>J A R V I S</h1>
        <p>I'm a Virtual Assistant JARVIS, How may i help you ?</p>
      </div>
      <div className="control">
        <p className="switch">Microphone: {listening ? "ON" : "OFF"}</p>
        <button className="btn" onClick={startListening}>
          Start
        </button>
        <button className="btn" onClick={SpeechRecognition.stopListening}>
          Stop
        </button>
        <button className="btn" onClick={resetTranscript}>
          Reset
        </button>
      </div>
      <p className="summary">{transcript}</p>
      <br />
      <h3>Created By SHIVUKUMARA@2024</h3>
    </div>
  );
};
export default App;
