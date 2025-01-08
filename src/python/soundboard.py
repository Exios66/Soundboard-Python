"""
Modern Soundboard with Timer Application

Supported Audio Formats:
- WAV (*.wav): Recommended format, best compatibility
- MP3 (*.mp3): Common format, requires additional codec support
- FLAC (*.flac): Lossless format, larger file size
- OGG (*.ogg): Free format, good compression
- AIFF (*.aiff, *.aif): Apple's audio format

File Requirements:
- Maximum file size: 10MB
- Sample rates: 44.1kHz, 48kHz (recommended)
- Bit depth: 16-bit, 24-bit
- Channels: Mono or Stereo
"""

import os
import time
import threading
import customtkinter as ctk
from tkinter import filedialog, messagebox
import sounddevice as sd
import soundfile as sf
from playsound import playsound

# Define supported formats
SUPPORTED_FORMATS = {
    "Audio Files": [
        ".wav",   # Waveform Audio File Format
        ".mp3",   # MPEG Layer-3 Audio
        ".flac",  # Free Lossless Audio Codec
        ".ogg",   # Ogg Vorbis Audio
        ".aiff",  # Audio Interchange File Format
        ".aif"    # AIFF alternative extension
    ]
}

class SoundboardApp:
    def __init__(self, root, original_audio, delay_minutes):
        self.root = root
        self.root.title("Modern Soundboard with Timer")
        self.root.geometry("800x500")
        self.root.resizable(False, False)

        self.original_audio = original_audio
        self.delay_seconds = delay_minutes * 60
        self.time_remaining = self.delay_seconds
        self.countdown_running = True

        # Default sounds directory
        self.sounds_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sounds")
        if not os.path.exists(self.sounds_dir):
            os.makedirs(self.sounds_dir)

        # Header
        self.header = ctk.CTkLabel(root, text="Soundboard & Timer", font=("Helvetica", 28, "bold"))
        self.header.pack(pady=20)

        # Timer Label
        self.timer_label = ctk.CTkLabel(root, text="Time Remaining: --:--", font=("Helvetica", 18))
        self.timer_label.pack(pady=10)

        # Soundboard Buttons Frame
        self.buttons_frame = ctk.CTkFrame(root)
        self.buttons_frame.pack(pady=20, padx=10)

        # Add default sound buttons
        self.default_sounds = {
            "Sound 1": os.path.join(self.sounds_dir, "sound1.wav"),
            "Sound 2": os.path.join(self.sounds_dir, "sound2.wav"),
            "Sound 3": os.path.join(self.sounds_dir, "sound3.wav")
        }
        for name, path in self.default_sounds.items():
            btn = ctk.CTkButton(self.buttons_frame, text=name, command=lambda p=path: self.play_sound(p), width=150)
            btn.pack(side="left", padx=10, pady=10)

        # Add custom sound button
        self.add_custom_sound_button = ctk.CTkButton(
            self.root, text="Add Custom Sound", command=self.add_custom_sound, width=200
        )
        self.add_custom_sound_button.pack(pady=10)

        # Start original sound countdown
        threading.Thread(target=self.delayed_sound, daemon=True).start()

        # Start countdown timer
        self.update_timer()

    def play_sound(self, file_path):
        """
        Play a sound file.
        
        Supports multiple formats through soundfile and playsound libraries.
        Falls back to playsound if soundfile fails.
        """
        try:
            if not os.path.exists(file_path):
                messagebox.showerror("Error", f"File not found: {file_path}")
                return

            # Check file size
            if os.path.getsize(file_path) > 10 * 1024 * 1024:  # 10MB limit
                messagebox.showerror("Error", "File size exceeds 10MB limit")
                return

            try:
                # Try soundfile/sounddevice first for better control
                data, samplerate = sf.read(file_path)
                sd.play(data, samplerate)
                sd.wait()
            except Exception as e:
                # Fall back to playsound for other formats
                playsound(file_path)
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to play sound: {e}")

    def add_custom_sound(self):
        """Add a custom sound using file dialog."""
        filetypes = [
            ("All Supported Audio", " ".join(f"*{ext}" for ext in SUPPORTED_FORMATS["Audio Files"])),
            ("WAV Files", "*.wav"),
            ("MP3 Files", "*.mp3"),
            ("FLAC Files", "*.flac"),
            ("OGG Files", "*.ogg"),
            ("AIFF Files", "*.aiff;*.aif"),
            ("All Files", "*.*")
        ]
        
        file_path = filedialog.askopenfilename(
            title="Select a Sound File",
            filetypes=filetypes,
            initialdir=self.sounds_dir
        )
        if file_path:
            name = os.path.basename(file_path)
            btn = ctk.CTkButton(self.buttons_frame, text=name, command=lambda: self.play_sound(file_path), width=150)
            btn.pack(side="left", padx=10, pady=10)

    def delayed_sound(self):
        """Play the original sound after the delay."""
        time.sleep(self.delay_seconds)
        self.play_sound(self.original_audio)

    def update_timer(self):
        """Update the countdown timer."""
        if self.time_remaining > 0 and self.countdown_running:
            mins, secs = divmod(self.time_remaining, 60)
            self.timer_label.configure(text=f"Time Remaining: {mins:02}:{secs:02}")
            self.time_remaining -= 1
            self.root.after(1000, self.update_timer)
        elif self.time_remaining <= 0:
            self.timer_label.configure(text="Time Remaining: 00:00")
            self.countdown_running = False


def main():
    # Original sound settings
    sounds_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sounds")
    original_audio = os.path.join(sounds_dir, "timer-end.wav")
    delay_minutes = 10  # Delay before the original sound plays

    # Initialize GUI
    ctk.set_appearance_mode("dark")  # Options: "light", "dark", or "system"
    ctk.set_default_color_theme("blue")
    root = ctk.CTk()
    app = SoundboardApp(root, original_audio, delay_minutes)
    root.mainloop()


if __name__ == "__main__":
    main()
