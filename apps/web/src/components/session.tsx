import { Copy, Radio } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog-ui";
import { useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SessionDialog() {
  const router = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError("");
      if (!roomName) {
        setError("Room name cannot be empty");
        return;
      }
      const roomId = nanoid();
      const response = await axios.post("http://localhost:3000/add-room", {
        roomId,
      });

      if (response.data.success) {
        setCurrentSession(roomId);
        router(`/room/${roomId}`);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    if (currentSession) {
      try {
        // Add API call to remove room if needed
        setCurrentSession(null);
        router("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const copyToClipboard = async () => {
    if (currentSession) {
      try {
        const url = `${window.location.origin}/room/${currentSession}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#212121] border border-[#e5e7eb] p-2 rounded-md dark:bg-[#212121] dark:border-gray-700">
          <Radio color="white" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:text-white dark:bg-black">
        <DialogTitle>
          {currentSession ? "Active Session" : "Start Live collaboration..."}
        </DialogTitle>

        {currentSession ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/room/${currentSession}`}
                  className="w-full bg-[#212121] border border-[#e5e7eb] p-2 rounded-md dark:border-[#212121] dark:bg-black text-white"
                />
              </div>
              <button
                onClick={copyToClipboard}
                className="px-3 text-white hover:text-gray-300"
              >
                <span className="sr-only">Copy</span>
                <Copy />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-500">Copied to clipboard!</p>
            )}
            <DialogFooter>
              <button
                className="bg-red-600 text-white p-2 rounded-md w-full"
                onClick={handleStopSession}
              >
                Stop Session
              </button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-2 text-white font-bold">
              You can invite people to your current scene to collaborate with
              you.
            </div>
            <div className="grid flex-1 gap-2">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name"
                className="w-full bg-[#212121] border border-[#e5e7eb] p-2 rounded-md dark:border-[#212121] dark:bg-black text-white"
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <DialogFooter>
              <button
                className="bg-[#212121] text-white border border-gray-700 p-2 rounded-md dark:bg-white dark:border-gray-700 w-full dark:text-black"
                onClick={handleStartSession}
                disabled={loading}
              >
                {loading ? <span>Loading...</span> : <span>Start Session</span>}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
