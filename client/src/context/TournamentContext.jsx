import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { socket } from "../lib/socket.js";

const TournamentContext = createContext(null);

export function TournamentProvider({ children }) {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState(null);

  useEffect(() => {
    api.getState().then(setState).catch(() => {});

    function onUpdate(next) {
      setState(next);
    }
    function onAnnounce(match) {
      setLastAnnouncement(match);
    }
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }

    socket.on("state:update", onUpdate);
    socket.on("match:announced", onAnnounce);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("state:update", onUpdate);
      socket.off("match:announced", onAnnounce);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <TournamentContext.Provider value={{ state, connected, lastAnnouncement, setLastAnnouncement }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
}
