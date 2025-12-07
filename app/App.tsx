"use client";

import { useCallback, useEffect } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";

// 1. Helper function to communicate with the React Native app
function createFirestoreDocument(payload: object) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'createDocument',
        payload: payload,
      })
    );
  } else {
    console.log('Not in React Native WebView');
  }
}

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  // 2. useEffect to get user info from URL and create a document
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');

    if (process.env.NODE_ENV !== "production") {
        console.log(`FitAgent Loaded: User ID - ${userId}, Email - ${email}`);
    }

    // If a userId is found, create a document in Firestore
    if (userId) {
      const documentData = {
        message: 'FitAgent session started!',
        email: email,
        timestamp: new Date().toISOString(),
      };
      
      if (process.env.NODE_ENV !== "production") {
        console.log('Sending message to create Firestore document...');
      }
      createFirestoreDocument(documentData);
    }
  }, []); // The empty dependency array ensures this runs only once on mount

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="text-purple-600">✦</span> Fourify Assistant
        </h1>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-4">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={setScheme}
        />
      </div>
    </main>
  );
}
